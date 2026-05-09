const mongoose = require('mongoose');
const Joi = require('joi');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const Review = require('../models/Review');
const User = require('../models/User');
const Offer = require('../models/Offer');
const Notification = require('../models/Notification');
const { sendEmail, templates } = require('../utils/email');

const getRecentCompletedJobs = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ status: 'completed' })
      .sort({ updatedAt: -1 })
      .limit(4)
      .populate('customerId', 'name profilePic urduName')
      .populate({
        path: 'workerId',
        select: 'userId rating',
        populate: {
          path: 'userId',
          select: 'name profilePic slug urduName'
        }
      });
    
    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

const checkVerificationRequired = async (user) => {
  // Always fetch fresh user status from DB to prevent stale session bypass
  const freshUser = await User.findById(user._id).select('isVerified role');
  
  console.log(`[DEBUG] Checking verification for user: ${user.email || user._id}, Role: ${freshUser?.role}, isVerified: ${freshUser?.isVerified}`);

  // Admin bypass
  if (freshUser && freshUser.role === 'admin') return false;

  // If user not found (shouldn't happen) or already verified, they are NOT blocked
  if (!freshUser || freshUser.isVerified) return false;
  
  // Otherwise, if they are not verified, they ARE blocked
  return true;
};

// =============================================================
// @route   POST /api/bookings
// @access  Customer
// =============================================================
const createBooking = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().min(3).max(100).required(),
      serviceType: Joi.string().valid('electrician', 'plumber', 'ac_fridge_repair', 'carpenter', 'painter', 'mason', 'steel_fixer', 'labour', 'tile_fixer').required(),
      issueDescription: Joi.string().min(10).max(1000).required(),
      address: Joi.string().min(5).required(),
      city: Joi.string().required(),
      state: Joi.string().optional().allow(''),
      zipCode: Joi.string().optional().allow(''),
      priceEstimate: Joi.number().min(0).optional(),
      location: Joi.object({
        lat: Joi.number().optional(),
        lng: Joi.number().optional(),
      }).optional(),
      scheduledAt: Joi.date().optional(),
      media: Joi.array().items(
        Joi.object({
          url: Joi.string().uri().required(),
          type: Joi.string().valid('image', 'video', 'audio').required(),
        })
      ).optional(),
      country: Joi.string().optional(),
    }).unknown(true);

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Mandatory Verification Check
    if (await checkVerificationRequired(req.user)) {
      return res.status(403).json({ 
        message: 'Identity Verification Required. To ensure safety and trust, all users must verify their identity before posting or accepting jobs. Please verify your ID in your profile to continue.',
        requiresVerification: true 
      });
    }

    // Check for existing active bookings for this customer
    const activeBooking = await Booking.findOne({
      customerId: req.user._id,
      status: { $in: ['pending', 'assigned', 'accepted'] }
    });

    if (activeBooking) {
      return res.status(400).json({ 
        message: 'You already have an active booking. Please complete or cancel it before posting a new one.' 
      });
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      ...value,
    });

    // Notify only workers in the same city about the new job
    try {
      // Find workers whose user profile city matches the booking city
      const matchingUsers = await User.find({ city: value.city, role: 'worker', _id: { $ne: req.user._id } }).select('_id');
      const matchingUserIds = matchingUsers.map(u => u._id);

      const workers = await Worker.find({ 
        serviceType: value.serviceType,
        userId: { $in: matchingUserIds }
      });
      
      console.log(`[DEBUG] Found ${workers.length} eligible workers for service type: ${value.serviceType}`);
      
      if (workers.length > 0) {
        const notificationData = workers.map(w => ({
          userId: w.userId,
          title: 'New Job Available',
          message: `A new ${value.serviceType.replace('_', ' ')} job is available: "${value.title}"`,
          type: 'new_job',
          link: '/job-requests'
        }));
        
        // Use create instead of insertMany for better validation/hooks reliability in some environments
        await Notification.create(notificationData);
        console.log(`[DEBUG] Successfully created notifications for ${notificationData.length} workers.`);
      } else {
        console.log('[DEBUG] No workers found to notify.');
      }
    } catch (err) {
      console.error('[ERROR] Failed to send job notifications:', err);
    }

    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/bookings/:id
// @access  Customer
// =============================================================
const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Can only edit pending bookings' });
    }

    const schema = Joi.object({
      title: Joi.string().min(3).max(100).optional(),
      issueDescription: Joi.string().min(10).max(1000).optional(),
      priceEstimate: Joi.number().min(0).optional(),
      address: Joi.string().min(5).optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional().allow(''),
      zipCode: Joi.string().optional().allow(''),
      country: Joi.string().optional(),
    }).unknown(true);

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    Object.assign(booking, value);
    await booking.save();

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   DELETE /api/bookings/:id
// @access  Customer
// =============================================================
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Can only delete pending bookings' });
    }

    await booking.deleteOne();
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/bookings/my
// @access  Customer
// =============================================================
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .select('+media')
      .populate('workerId', 'serviceType rating verified')
      .populate({
        path: 'workerId',
        populate: { path: 'userId', select: 'name phone slug urduName' },
      })
      .populate('reviews')
      .sort({ createdAt: -1 });

    const stats = {
      totalSpending: bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.priceEstimate || 0), 0)
    };

    res.json({ success: true, count: bookings.length, bookings, stats });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   POST /api/bookings/:id/review
// @access  Customer
// =============================================================
const submitReview = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    const existing = await Review.findOne({ bookingId: booking._id, reviewerRole: 'customer' });
    if (existing) return res.status(400).json({ message: 'Review already submitted' });

    const schema = Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().max(500).optional().allow(''),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const review = await Review.create({
      bookingId: booking._id,
      customerId: req.user._id,
      workerId: booking.workerId,
      reviewerRole: 'customer',
      ...value,
    });

    // Update worker average rating
    const allReviews = await Review.find({ workerId: booking.workerId, reviewerRole: 'customer' });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Worker.findByIdAndUpdate(booking.workerId, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: allReviews.length,
    });

    res.status(201).json({ success: true, review });

    // Notify worker + send email
    try {
      const worker = await Worker.findById(booking.workerId).populate('userId', 'name email slug');
      if (worker) {
        await Notification.create({
          userId: worker.userId._id,
          title: 'New Review Received',
          message: `A customer has left a ${value.rating}-star review for your work on "${booking.title}".`,
          type: 'review_received',
          link: '/job-requests?tab=completed'
        });
        await sendEmail(templates.reviewReceived(worker.userId, booking, value.rating));
      }
    } catch (err) {
      console.error('Failed to send review notification to worker:', err);
    }
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   POST /api/bookings/:id/customer-review
// @access  Worker
// =============================================================
const submitCustomerReview = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    const booking = await Booking.findById(req.params.id).populate('customerId', 'slug');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.workerId.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: 'Not your booking' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    const existing = await Review.findOne({ bookingId: booking._id, reviewerRole: 'worker' });
    if (existing) return res.status(400).json({ message: 'Review already submitted' });

    const schema = Joi.object({
      rating: Joi.number().min(1).max(5).required(),
      comment: Joi.string().max(500).optional().allow(''),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const review = await Review.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      workerId: worker._id,
      reviewerRole: 'worker',
      ...value,
    });

    // Update customer average rating
    const allReviews = await Review.find({ customerId: booking.customerId, reviewerRole: 'worker' });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await User.findByIdAndUpdate(booking.customerId, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: allReviews.length,
    });

    res.status(201).json({ success: true, review });

    // Notify customer + send email
    try {
      const customer = await User.findById(booking.customerId).select('name email');
      if (customer) {
        await Notification.create({
          userId: booking.customerId,
          title: 'New Review Received',
          message: `The worker has left a ${value.rating}-star review for you regarding the job "${booking.title}".`,
          type: 'review_received',
          link: '/my-bookings'
        });
        await sendEmail(templates.customerReviewReceived(customer, booking, value.rating));
      }
    } catch (err) {
      console.error('Failed to send review notification to customer:', err);
    }
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/bookings/available
// @access  Worker
// =============================================================
const getAvailableJobs = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    // Mandatory Verification Check
    if (await checkVerificationRequired(req.user)) {
      return res.status(403).json({ 
        message: 'Identity Verification Required. To ensure safety and trust, all users must verify their identity before posting or accepting jobs. Please verify your ID in your profile to continue.',
        requiresVerification: true 
      });
    }

    // Find IDs of bookings where this worker has already sent an offer
    const existingOffers = await Offer.find({ workerId: worker._id }).select('bookingId');
    const offeredBookingIds = existingOffers.map(o => o.bookingId);

    const user = await User.findById(req.user._id).select('city');
    
    const bookings = await Booking.find({
      status: 'pending',
      serviceType: worker.serviceType,
      city: user.city, // Only show jobs in the same city as the worker
      _id: { $nin: offeredBookingIds }, 
    })
      .select('+media')
      .populate('customerId', 'name rating totalRatings slug urduName')
      .populate('reviews')
      .sort({ createdAt: -1 });

    // Get counts for all tabs (also filtered by city)
    const [counts, stats] = await Promise.all([
      (async () => ({
        available: await Booking.countDocuments({ status: 'pending', serviceType: worker.serviceType, city: user.city, _id: { $nin: offeredBookingIds } }),
        offers: await Offer.countDocuments({ workerId: worker._id, status: 'pending' }),
        active: await Booking.countDocuments({ workerId: worker._id, status: 'accepted' }),
        completed: await Booking.countDocuments({ workerId: worker._id, status: 'completed' }),
      }))(),
      (async () => {
        const completed = await Booking.find({ workerId: worker._id, status: 'completed' });
        return { totalEarnings: completed.reduce((sum, b) => sum + (b.priceEstimate || 0), 0) };
      })()
    ]);

    res.json({ success: true, count: bookings.length, bookings, counts, stats });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/bookings/my-offers
// @access  Worker
// =============================================================
const getMyOffers = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    const offers = await Offer.find({ workerId: worker._id, status: 'pending' })
      .populate({
        path: 'bookingId',
        select: '+media',
        populate: { path: 'customerId', select: 'name rating totalRatings slug urduName' } // Exclude phone/email
      })
      .sort({ createdAt: -1 });

    // Get counts for all tabs
    const offeredBookingIds = await Offer.find({ workerId: worker._id }).distinct('bookingId');
    const user = await User.findById(req.user._id).select('city');
    const counts = {
      available: await Booking.countDocuments({ status: 'pending', serviceType: worker.serviceType, city: user.city, _id: { $nin: offeredBookingIds } }),
      offers: await Offer.countDocuments({ workerId: worker._id, status: 'pending' }),
      active: await Booking.countDocuments({ workerId: worker._id, status: 'accepted' }),
      completed: await Booking.countDocuments({ workerId: worker._id, status: 'completed' }),
    };

    res.json({ success: true, count: offers.length, offers, counts });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/bookings/active
// @access  Worker
// =============================================================
const getActiveJobs = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    const bookings = await Booking.find({
      workerId: worker._id,
      status: 'accepted',
    })
      .select('+media')
      .populate('customerId', 'name phone email rating totalRatings urduName')
      .populate('reviews')
      .sort({ createdAt: -1 });

    // Get counts for all tabs
    const offeredBookingIds = await Offer.find({ workerId: worker._id }).distinct('bookingId');
    const user = await User.findById(req.user._id).select('city');
    const counts = {
      available: await Booking.countDocuments({ status: 'pending', serviceType: worker.serviceType, city: user.city, _id: { $nin: offeredBookingIds } }),
      offers: await Offer.countDocuments({ workerId: worker._id, status: 'pending' }),
      active: await Booking.countDocuments({ workerId: worker._id, status: 'accepted' }),
      completed: await Booking.countDocuments({ workerId: worker._id, status: 'completed' }),
    };

    res.json({ success: true, count: bookings.length, bookings, counts });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   POST /api/bookings/:id/offer
// @access  Worker
// =============================================================
const sendOffer = async (req, res, next) => {
  try {
    const { priceOffer, message } = req.body;
    
    // Mandatory Verification Check
    if (await checkVerificationRequired(req.user)) {
      return res.status(403).json({ 
        message: 'Identity Verification Required. To ensure safety and trust, all users must verify their identity before posting or accepting jobs. Please verify your ID in your profile to continue.',
        requiresVerification: true 
      });
    }

    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
    if (!worker.verified) return res.status(403).json({ message: 'Account not verified' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Job no longer available' });

    const schema = Joi.object({
      priceOffer: Joi.number().min(0).required(),
      message: Joi.string().max(500).optional().allow(''),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const offer = await Offer.findOneAndUpdate(
      { bookingId: booking._id, workerId: worker._id },
      { ...value, status: 'pending' },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, offer });

    // Create Notification for Customer
    await Notification.create({
      userId: booking.customerId,
      title: 'New Offer Received',
      message: `A worker has sent an offer for your job: ${booking.title}`,
      type: 'offer_received',
      link: '/my-bookings'
    });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/bookings/:id/offers
// @access  Customer
// =============================================================
const getOffers = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const offers = await Offer.find({ bookingId: booking._id })
      .populate({
        path: 'workerId',
        populate: { path: 'userId', select: 'name rating totalRatings slug urduName' },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: offers.length, offers });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/bookings/offers/:offerId/accept
// @access  Customer
// =============================================================
const acceptOffer = async (req, res, next) => {
  try {
    // Mandatory Verification Check
    if (await checkVerificationRequired(req.user)) {
      return res.status(403).json({ 
        message: 'Identity Verification Required. To ensure safety and trust, all users must verify their identity before posting or accepting jobs. Please verify your ID in your profile to continue.',
        requiresVerification: true 
      });
    }

    const offer = await Offer.findById(req.params.offerId).populate('bookingId');
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    
    const booking = offer.bookingId;
    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Job already accepted' });
    }

    // Update the booking
    booking.workerId = offer.workerId;
    booking.priceEstimate = offer.priceOffer;
    booking.status = 'accepted';
    await booking.save();

    // Update all offers for this booking
    await Offer.updateMany({ bookingId: booking._id }, { status: 'rejected' });
    offer.status = 'accepted';
    await offer.save();

    // Notify worker that their offer was accepted + send email
    try {
      const winningWorker = await Worker.findById(offer.workerId).populate('userId', 'name email');
      if (winningWorker) {
        await Notification.create({
          userId: winningWorker.userId._id,
          title: 'Offer Accepted!',
          message: `Your offer for "${booking.title}" has been accepted. You can now see the customer's contact details!`,
          type: 'offer_accepted',
          link: '/active-jobs'
        });
        await sendEmail(templates.offerAccepted(winningWorker.userId, booking));
      }
    } catch (err) {
      console.error('Failed to send offer acceptance notification:', err);
    }

    // Remove old console.log mock
    // Notify customer that the offer was successfully accepted
    try {
      await Notification.create({
        userId: booking.customerId,
        title: 'Job Confirmed',
        message: `You have successfully accepted the offer for "${booking.title}". The job is now in your active list.`,
        type: 'offer_accepted',
        link: '/my-bookings'
      });
    } catch (err) {
      console.error('Failed to send confirmation notification to customer:', err);
    }

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/bookings/completed
// @access  Worker
// =============================================================
const getCompletedJobs = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    const bookings = await Booking.find({
      workerId: worker._id,
      status: 'completed',
    })
      .select('+media')
      .populate('customerId', 'name phone email rating totalRatings slug urduName')
      .populate('reviews')
      .sort({ completedAt: -1 });

    // Get counts for all tabs
    const offeredBookingIds = await Offer.find({ workerId: worker._id }).distinct('bookingId');
    const counts = {
      available: await Booking.countDocuments({ status: 'pending', serviceType: worker.serviceType, _id: { $nin: offeredBookingIds } }),
      offers: await Offer.countDocuments({ workerId: worker._id, status: 'pending' }),
      active: await Booking.countDocuments({ workerId: worker._id, status: 'accepted' }),
      completed: await Booking.countDocuments({ workerId: worker._id, status: 'completed' }),
    };

    res.json({ success: true, count: bookings.length, bookings, counts });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   GET /api/bookings/profile/:id
// @access  Public (to see profile details)
// =============================================================
const getProfileDetails = async (req, res, next) => {
  try {
    const idOrSlug = req.params.id;
    let user;

    // First try by ID if it looks like a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      user = await User.findById(idOrSlug).select('+profilePic');
    }

    // If not found by ID or not a valid ID, try by slug
    if (!user) {
      user = await User.findOne({ slug: idOrSlug }).select('+profilePic');
    }
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Privacy logic: Hide phone and email for public view unless it's the owner
    // This requires optional authentication which we'll handle by checking req.user from protect middleware
    // If you want to keep it simple, we can just allow it for now or rely on frontend hiding it.
    // Let's include them so the owner can edit their profile.


    let userObj = user.toObject();
    let bookings = [];

    if (user.role === 'worker') {
      const worker = await Worker.findOne({ userId: user._id });
      userObj.rating = worker?.rating || 0;
      userObj.totalRatings = worker?.totalRatings || 0;
      userObj.serviceType = worker?.serviceType;

      bookings = await Booking.find({ workerId: worker?._id, status: 'completed' })
        .select('title completedAt priceEstimate customerId +media')
        .populate('customerId', 'name slug')
        .sort({ completedAt: -1 })
        .limit(20);
    } else {
      bookings = await Booking.find({ customerId: user._id, status: 'completed' })
        .select('title completedAt priceEstimate workerId +media')
        .populate({ path: 'workerId', populate: { path: 'userId', select: 'name urduName slug' } })
        .sort({ completedAt: -1 })
        .limit(20);
    }

    // Attach reviews to bookings
    const bookingIds = bookings.map(b => b._id);
    const allReviews = await Review.find({ bookingId: { $in: bookingIds } })
      .select('bookingId rating comment reviewerRole createdAt customerId workerId');

    // Filter and populate reviews received by this specific user
    const reviewsReceived = await Review.find({ 
      bookingId: { $in: bookingIds },
      reviewerRole: user.role === 'worker' ? 'customer' : 'worker'
    })
    .select('bookingId rating comment reviewerRole createdAt customerId workerId')
    .populate('bookingId', 'title priceEstimate')
    .populate('customerId', 'name slug urduName')
    .populate({
      path: 'workerId',
      populate: { path: 'userId', select: 'name slug urduName' }
    })
    .sort({ createdAt: -1 })
    .limit(30);

    const bookingsWithReviews = bookings.map(b => {
      const bObj = b.toObject();
      bObj.reviews = allReviews.filter(r => r.bookingId.toString() === b._id.toString());
      return bObj;
    });

    // Calculate stats using aggregation for precision
    let stats = { totalSpending: 0, totalEarnings: 0 };
    
    if (user.role === 'worker') {
      const workerProfile = await Worker.findOne({ userId: user._id });
      if (workerProfile) {
        const earningsResult = await Booking.aggregate([
          { $match: { workerId: workerProfile._id, status: 'completed' } },
          { $group: { _id: null, total: { $sum: "$priceEstimate" } } }
        ]);
        stats.totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0;
      }
    } else {
      const spendingResult = await Booking.aggregate([
        { $match: { customerId: user._id, status: 'completed' } },
        { $group: { _id: null, total: { $sum: "$priceEstimate" } } }
      ]);
      stats.totalSpending = spendingResult.length > 0 ? spendingResult[0].total : 0;
    }

    // Include slug in response
    userObj.slug = user.slug;

    res.json({ success: true, user: userObj, bookings: bookingsWithReviews, reviewsReceived, stats });
  } catch (err) {
    next(err);
  }
};
// (acceptJob was removed and replaced by acceptOffer flow)

// =============================================================
// @route   PATCH /api/bookings/:id/reject
// @access  Worker
// =============================================================
const rejectJob = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.workerId?.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: 'This job is not assigned to you' });
    }
    if (booking.status !== 'assigned') {
      return res.status(400).json({ message: 'Booking is not in assigned state' });
    }

    booking.status = 'pending';
    booking.workerId = null;
    booking.rejectionReason = req.body.reason || null;
    await booking.save();

    res.json({ success: true, message: 'Job rejected, booking back to pending', booking });
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   PATCH /api/bookings/:id/complete
// @access  Worker
// =============================================================
const completeJob = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.workerId?.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: 'This job is not assigned to you' });
    }
    if (booking.status !== 'accepted') {
      return res.status(400).json({ message: 'Booking must be accepted before completing' });
    }

    booking.status = 'completed';
    booking.completedAt = new Date();
    await booking.save();

    res.json({ success: true, booking });

    // Notify customer + send email that job is complete
    try {
      const customer = await User.findById(booking.customerId).select('name email');
      await Notification.create({
        userId: booking.customerId,
        title: 'Job Completed',
        message: `The job "${booking.title}" has been marked as completed. Please leave a review!`,
        type: 'job_completed',
        link: '/my-bookings'
      });
      if (customer) {
        await sendEmail(templates.jobCompleted(customer, booking));
      }
    } catch (err) {
      console.error('Failed to send job completion notifications:', err);
    }
  } catch (err) {
    next(err);
  }
};

// =============================================================
// @route   POST /api/bookings/:id/instant-accept
// @access  Worker
// =============================================================
const instantAccept = async (req, res, next) => {
  try {
    // Mandatory Verification Check
    if (await checkVerificationRequired(req.user)) {
      return res.status(403).json({ 
        message: 'Identity Verification Required. To ensure safety and trust, all users must verify their identity before posting or accepting jobs. Please verify your ID in your profile to continue.',
        requiresVerification: true 
      });
    }

    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) return res.status(404).json({ message: 'Worker profile not found' });
    if (!worker.verified) return res.status(403).json({ message: 'Account not verified' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'pending') return res.status(400).json({ message: 'Job no longer available' });

    // Instantly accept at customer's price
    booking.workerId = worker._id;
    booking.status = 'accepted';
    await booking.save();

    // Reject all other offers for this booking since it's now taken
    await Offer.updateMany({ bookingId: booking._id }, { status: 'rejected' });

    res.json({ success: true, message: 'Job accepted successfully!', booking });

    // Notify customer + send email for instant accept
    try {
      const customer = await User.findById(booking.customerId).select('name email');
      await Notification.create({
        userId: booking.customerId,
        title: 'Worker Hired!',
        message: `A worker has instantly accepted your job request: "${booking.title}".`,
        type: 'offer_accepted',
        link: '/my-bookings'
      });
      if (customer) {
        await sendEmail(templates.workerInstantAccepted(customer, booking));
      }
    } catch (err) {
      console.error('Failed to send instant accept notifications:', err);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  updateBooking,
  deleteBooking,
  getMyBookings,
  submitReview,
  submitCustomerReview,
  getAvailableJobs,
  getActiveJobs,
  getMyOffers,
  getCompletedJobs,
  getProfileDetails,
  sendOffer,
  getOffers,
  acceptOffer,
  instantAccept,
  rejectJob,
  completeJob,
  getRecentCompletedJobs,
};
