const jwt = require('jsonwebtoken');
const Joi = require('joi');
const crypto = require('crypto');
const { sendEmail, templates } = require('../utils/email');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// =============================================================
// @route   POST /api/auth/register
// @access  Public
// =============================================================
const register = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(2).max(100).required(),
      phone: Joi.string().length(11).pattern(/^0\d{10}$/).required().messages({
        'string.length': 'Phone number must be exactly 11 digits',
        'string.pattern.base': 'Phone number must start with 0 and contain only numbers'
      }),
      cnic: Joi.string().length(13).pattern(/^\d+$/).required().messages({
        'string.length': 'CNIC must be exactly 13 digits',
        'string.pattern.base': 'CNIC must contain only numbers'
      }),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      role: Joi.string().valid('customer', 'worker').default('customer'),
      profilePic: Joi.string().optional(),
      // Worker-specific fields (optional)
      serviceTypes: Joi.array().items(Joi.string().valid(
        'electrician', 'plumber', 'ac_fridge_repair',
        'carpenter', 'painter', 'mason',
        'steel_fixer', 'labour', 'tile_fixer'
      )).min(1).max(2).when('role', {
        is: 'worker',
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      experience: Joi.number().min(0).optional(),
      urduName: Joi.string().max(100).optional().allow(''),
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().optional().allow(''),
      country: Joi.string().optional(),
    }).unknown(true);

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existingUser = await User.findOne({
      $or: [{ email: value.email }, { cnic: value.cnic }]
    });

    if (existingUser) {
      const message = existingUser.email === value.email
        ? 'Email already registered'
        : 'An account with this CNIC already exists';
      return res.status(400).json({ message });
    }

    const user = await User.create({
      name: value.name,
      phone: value.phone,
      cnic: value.cnic,
      email: value.email,
      password: value.password,
      role: value.role,
      urduName: value.urduName || '',
      profilePic: value.profilePic,
      address: value.address,
      city: value.city,
      state: value.state,
      zipCode: value.zipCode,
      isVerified: false, // Force false on registration
    });

    // Create worker profile if role is worker
    if (value.role === 'worker') {
      await Worker.create({
        userId: user._id,
        serviceTypes: value.serviceTypes,
        experience: value.experience || 0,
      });
    }

    const token = generateToken(user._id);

    // Send email notifications (non-blocking)
    try {
      if (value.role === 'worker') {
        await sendEmail(templates.workerRegistered({ ...value, serviceType: value.serviceTypes.join(', ') }));
      } else {
        await sendEmail(templates.customerRegistered(value));
      }
    } catch (e) { console.error('Registration email failed:', e.message); }

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        urduName: user.urduName,
        slug: user.slug,
        serviceType: value.role === 'worker' ? value.serviceTypes[0] : null,
        serviceTypes: value.role === 'worker' ? value.serviceTypes : [],
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        requiresProfilePic: !user.profilePic,
        requiresVerification: user.verificationStatus !== 'pending' && !user.isVerified && !!user.profilePic,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   POST /api/auth/login
// @access  Public
// =============================================================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email/Phone and password are required' });
    }

    const users = await User.find({ 
      $or: [
        { email: email.toLowerCase() },
        { phone: email }
      ]
    }).select('+password +profilePic');

    let user = null;
    if (users.length > 0) {
      // Check each user's password until we find a match
      for (const candidate of users) {
        if (await candidate.matchPassword(password)) {
          user = candidate;
          break;
        }
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/phone or password' });
    }

    let serviceTypes = [];
    let serviceType = null;
    if (user.role === 'worker') {
      const profile = await Worker.findOne({ userId: user._id });
      serviceTypes = profile?.serviceTypes || [];
      serviceType = serviceTypes[0] || null;
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        urduName: user.urduName,
        slug: user.slug,
        serviceType,
        serviceTypes,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        requiresProfilePic: !user.profilePic,
        requiresVerification: user.verificationStatus !== 'pending' && !user.isVerified && !!user.profilePic,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/auth/me
// @access  Protected
// =============================================================
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+profilePic +isVerified +verificationStatus +verificationNote +cnicImage');
    let workerProfile = null;

    if (user.role === 'worker') {
      workerProfile = await Worker.findOne({ userId: user._id });
      user.serviceTypes = workerProfile?.serviceTypes || [];
      user.serviceType = user.serviceTypes[0] || null;
    }

    // Logic for mandatory verification - Block all until verified
    const requiresVerification = !user.isVerified;

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        urduName: user.urduName,
        slug: user.slug,
        serviceType: user.serviceType,
        serviceTypes: user.serviceTypes,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        verificationNote: user.verificationNote,
        requiresProfilePic: !user.profilePic,
        requiresVerification: user.verificationStatus !== 'pending' && !user.isVerified && !!user.profilePic,
      },
      workerProfile
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/auth/profile
// @access  Protected
// =============================================================
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+profilePic');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const schema = Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      phone: Joi.string().length(11).pattern(/^0\d{10}$/).optional().messages({
        'string.length': 'Phone number must be exactly 11 digits',
        'string.pattern.base': 'Phone number must start with 0 and contain only numbers'
      }),
      profilePic: Joi.string().optional().allow(null, ''),
      urduName: Joi.string().max(100).optional().allow(''),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional(),
      country: Joi.string().optional(),
    }).unknown(true);

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    if (value.name) user.name = value.name;
    if (value.phone) user.phone = value.phone;
    if (value.profilePic !== undefined) user.profilePic = value.profilePic;
    if (value.urduName !== undefined) user.urduName = value.urduName;
    if (value.address) user.address = value.address;
    if (value.city) user.city = value.city;
    if (value.state) user.state = value.state;
    if (value.zipCode) user.zipCode = value.zipCode;

    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        urduName: user.urduName,
        slug: user.slug,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        requiresProfilePic: !user.profilePic,
        requiresVerification: user.verificationStatus !== 'pending' && !user.isVerified && !!user.profilePic
      }
    });
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = Joi.object({
      email: Joi.string().trim().email().max(254).required(),
    }).validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: value.email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `Forgot your password? Reset it here: ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message
      });
      res.status(200).json({ success: true, message: 'Token sent to email!' });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Error sending email' });
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = Joi.object({
      password: Joi.string().min(6).max(128).required().messages({
        'string.min': 'Password must be at least 6 characters',
      }),
    }).validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });

    user.password = value.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

const reportUser = async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const reporterId = req.user._id;

    if (targetId === reporterId.toString()) {
      return res.status(400).json({ message: 'You cannot report yourself' });
    }

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.reportedBy.includes(reporterId)) {
      return res.status(400).json({ message: 'You have already reported this profile' });
    }

    user.reportedBy.push(reporterId);
    
    if (user.reportedBy.length >= 3) {
      user.isBlocked = true;
      try {
        await sendEmail(templates.accountBlocked(user));
      } catch (err) {
        console.error('Failed to send auto-block email:', err);
      }
    }

    await user.save();

    res.json({ 
      success: true, 
      message: 'Profile reported successfully. Our team will review it.',
      isBlocked: user.isBlocked 
    });
  } catch (err) {
    next(err);
  }
};

const submitVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'You are already verified' });

    const { cnicImage } = req.body;
    if (!cnicImage) return res.status(400).json({ message: 'CNIC image is required' });

    user.cnicImage = cnicImage;
    user.verificationStatus = 'pending';
    user.verificationNote = null;
    await user.save();

    // Notify admin of new verification request
    try {
      await sendEmail(templates.verificationSubmitted(user));
    } catch (err) {
      console.error('Failed to notify admin of verification:', err);
    }

    res.json({ success: true, message: 'Thank you for submitting your ID. Our team will review it within 24 to 48 hours for approval.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile, forgotPassword, resetPassword, reportUser, submitVerification };
