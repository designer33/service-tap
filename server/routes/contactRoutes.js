const express = require('express');
const router = express.Router();
const { sendContactMessage, subscribeNewsletter } = require('../controllers/contactController');

router.post('/contact', sendContactMessage);
router.post('/newsletter', subscribeNewsletter);

module.exports = router;
