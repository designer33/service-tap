const express = require('express');
const router = express.Router();
const { sendContactMessage, subscribeNewsletter, getGoogleReviews } = require('../controllers/contactController');
const { contactLimiter, newsletterLimiter } = require('../middleware/rateLimiter');

router.get('/google-reviews', getGoogleReviews);
router.post('/contact', contactLimiter, sendContactMessage);
router.post('/newsletter', newsletterLimiter, subscribeNewsletter);

module.exports = router;
