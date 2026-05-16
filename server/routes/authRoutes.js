const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, forgotPassword, resetPassword, reportUser, submitVerification } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter, registerLimiter, forgotPasswordLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.post('/verify-identity', protect, submitVerification);
router.post('/:id/report', protect, reportUser);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
