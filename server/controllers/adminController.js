const Joi = require('joi');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail, templates } = require('../utils/email');

// =============================================================
// @route   GET /api/admin/stats
// @access  Admin
// =============================================================
const getStats = async (req, res, next) => {
  try {
    const [
      totalBookings,
      pendingBookings,
      completedBookings,
      totalWorkers,
      verifiedWorkers,
      totalCustomers,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Worker.countDocuments(),
      Worker.countDocuments({ verified: true }),
      User.countDocuments({ role: 'customer' }),
    ]);

    res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        completedBookings,
        totalWorkers,
        verifiedWorkers,
        totalCustomers,
      },
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/admin/bookings
// @access  Admin
// =============================================================
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};

    const bookings = await Booking.find(filter)
      .select('-media')
      .populate('customerId', 'name phone email')
      .populate({
        path: 'workerId',
        populate: { path: 'userId', select: 'name phone' },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.json({ success: true, total, page: Number(page), bookings });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/admin/bookings/:id/assign
// @access  Admin
// =============================================================
const assignWorker = async (req, res, next) => {
  try {
    const { workerId } = req.body;
    if (!workerId) return res.status(400).json({ message: 'workerId is required' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!['pending', 'assigned'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot assign worker to this booking' });
    }

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    booking.workerId = workerId;
    booking.status = 'assigned';
    await booking.save();

    res.json({ success: true, booking });

    // Notify worker about the assignment
    try {
      await Notification.create({
        userId: worker.userId,
        title: 'New Job Assigned',
        message: `Admin has assigned you a new job: "${booking.title}". Please review and respond.`,
        type: 'new_job',
        link: '/job-requests'
      });
    } catch (err) {
      console.error('Failed to send assignment notification:', err);
    }
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/admin/bookings/:id/price
// @access  Admin
// =============================================================
const setPrice = async (req, res, next) => {
  try {
    const schema = Joi.object({
      priceEstimate: Joi.number().min(0).required(),
      leadFee: Joi.number().min(0).optional(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const booking = await Booking.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/admin/bookings/:id/cancel
// @access  Admin
// =============================================================
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled', booking });

    // Notify parties about cancellation
    try {
      const notifications = [
        {
          userId: booking.customerId,
          title: 'Job Cancelled',
          message: `The job "${booking.title}" has been cancelled by the admin.`,
          type: 'job_cancelled',
          link: '/my-bookings'
        }
      ];

      if (booking.workerId) {
        const worker = await Worker.findById(booking.workerId);
        if (worker) {
          notifications.push({
            userId: worker.userId,
            title: 'Job Cancelled',
            message: `The assigned job "${booking.title}" has been cancelled by the admin.`,
            type: 'job_cancelled',
            link: '/active-jobs'
          });
        }
      }

      await Notification.insertMany(notifications);
    } catch (err) {
      console.error('Failed to send cancellation notifications:', err);
    }
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/admin/workers
// @access  Admin
// =============================================================
const getAllWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find()
      .populate('userId', 'name phone email createdAt slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: workers.length, workers });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/admin/workers/available
// @access  Admin
// =============================================================
const getAvailableWorkers = async (req, res, next) => {
  try {
    const { serviceType } = req.query;
    const filter = { isAvailable: true, verified: true };
    if (serviceType) filter.serviceTypes = serviceType;

    const workers = await Worker.find(filter).populate('userId', 'name phone email');
    res.json({ success: true, count: workers.length, workers });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/admin/users
// @access  Admin
// =============================================================
const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : { role: { $ne: 'admin' } };

    const users = await User.find(filter)
      .select('-cnicImage -profilePic')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/admin/users/:id/block
// @access  Admin
// =============================================================
const toggleUserBlock = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot block admin' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    // Send email if blocked
    if (user.isBlocked) {
      try {
        await sendEmail(templates.accountBlocked(user));
      } catch (err) {
        console.error('Failed to send block email:', err);
      }
    }

    res.json({
      success: true,
      isBlocked: user.isBlocked,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   DELETE /api/admin/users/:id
// @access  Admin
// =============================================================
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete admin' });

    // If worker, delete worker profile too
    if (user.role === 'worker') {
      await Worker.findOneAndDelete({ userId: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getAllBookings,
  assignWorker,
  setPrice,
  cancelBooking,
  getAllWorkers,
  getAvailableWorkers,
  getUsers,
  toggleUserBlock,
  deleteUser,
  getVerifications,
  approveVerification,
  rejectVerification,
};

// =============================================================
// @route   GET /api/admin/verifications
// @access  Admin
// =============================================================
async function getVerifications(req, res, next) {
  try {
    const users = await User.find({ verificationStatus: { $in: ['pending', 'approved', 'rejected'] } })
      .select('name email phone role cnic cnicImage profilePic verificationStatus verificationNote isVerified createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { next(err); }
}

// =============================================================
// @route   PATCH /api/admin/verifications/:id/approve
// @access  Admin
// =============================================================
async function approveVerification(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isVerified = true;
    user.verificationStatus = 'approved';
    user.verificationNote = null;
    user.cnicImage = null; // Remove image after verification for privacy
    await user.save();

    // If user is a worker, also update worker profile verified status
    if (user.role === 'worker') {
      await Worker.findOneAndUpdate({ userId: user._id }, { verified: true });
    }

    // Send verification approved email
    try {
      await sendEmail(templates.verificationApproved(user));
    } catch (e) { console.error('Verification email failed:', e); }

    res.json({ success: true, message: 'User verified successfully', user });
  } catch (err) { next(err); }
}

// =============================================================
// @route   PATCH /api/admin/verifications/:id/reject
// @access  Admin
// =============================================================
async function rejectVerification(req, res, next) {
  try {
    const { note } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isVerified = false;
    user.verificationStatus = 'rejected';
    user.verificationNote = note || 'Your ID document could not be verified. Please resubmit a clear photo.';
    user.cnicImage = null;
    await user.save();

    // If user is a worker, also update worker profile verified status
    if (user.role === 'worker') {
      await Worker.findOneAndUpdate({ userId: user._id }, { verified: false });
    }

    // Send verification rejected email
    try {
      await sendEmail(templates.verificationRejected(user, user.verificationNote));
    } catch (e) { console.error('Rejection email failed:', e); }

    res.json({ success: true, message: 'Verification rejected', user });
  } catch (err) { next(err); }
}
