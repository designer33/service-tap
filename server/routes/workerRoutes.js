const express = require('express');
const router = express.Router();
const {
  toggleAvailability,
  getWorkerProfile,
  updateWorkerProfile,
} = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorize('worker'), getWorkerProfile);
router.patch('/profile', protect, authorize('worker'), updateWorkerProfile);
router.patch('/availability', protect, authorize('worker'), toggleAvailability);

module.exports = router;
