const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllBookings,
  assignWorker,
  setPrice,
  cancelBooking,
  getAllWorkers,
  toggleWorkerVerification,
  getAvailableWorkers,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/stats', getStats);

router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/assign', assignWorker);
router.patch('/bookings/:id/price', setPrice);
router.patch('/bookings/:id/cancel', cancelBooking);

router.get('/workers', getAllWorkers);
router.get('/workers/available', getAvailableWorkers);

// User Management
const { getUsers, toggleUserBlock, deleteUser, getVerifications, approveVerification, rejectVerification, restartServer, getContactSubmissions, markContactRead, deleteContactSubmission, getNewsletterSubscribers, deleteNewsletterSubscriber } = require('../controllers/adminController');
router.get('/users', getUsers);
router.patch('/users/:id/block', toggleUserBlock);
router.delete('/users/:id', deleteUser);
router.post('/restart', restartServer);

// ID Verifications
router.get('/verifications', getVerifications);
router.patch('/verifications/:id/approve', approveVerification);
router.patch('/verifications/:id/reject', rejectVerification);

// Contact & Newsletter Inbox
router.get('/contact-submissions', getContactSubmissions);
router.patch('/contact-submissions/:id/read', markContactRead);
router.delete('/contact-submissions/:id', deleteContactSubmission);
router.get('/newsletter', getNewsletterSubscribers);
router.delete('/newsletter/:id', deleteNewsletterSubscriber);

module.exports = router;
