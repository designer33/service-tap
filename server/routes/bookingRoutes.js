const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/bookingController');
const { protect, authorize, optionalProtect } = require('../middleware/authMiddleware');

// Requires login — profiles are not public
router.get('/profile/:id', protect, getProfileDetails);
router.get('/recent-completed', getRecentCompletedJobs);

// Customer routes
router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, authorize('customer'), getMyBookings);
router.patch('/:id', protect, authorize('customer'), updateBooking);
router.delete('/:id', protect, authorize('customer'), deleteBooking);
router.post('/:id/review', protect, authorize('customer'), submitReview);
router.get('/:id/offers', protect, authorize('customer'), getOffers);
router.patch('/offers/:offerId/accept', protect, authorize('customer'), acceptOffer);

// Worker routes
router.get('/available', protect, authorize('worker'), getAvailableJobs);
router.get('/active', protect, authorize('worker'), getActiveJobs);
router.get('/my-offers', protect, authorize('worker'), getMyOffers);
router.get('/completed', protect, authorize('worker'), getCompletedJobs);
router.post('/:id/offer', protect, authorize('worker'), sendOffer);
router.post('/:id/instant-accept', protect, authorize('worker'), instantAccept);
router.patch('/:id/reject', protect, authorize('worker'), rejectJob);
router.patch('/:id/complete', protect, authorize('worker'), completeJob);
router.post('/:id/customer-review', protect, authorize('worker'), submitCustomerReview);

module.exports = router;
