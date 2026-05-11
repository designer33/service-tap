const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, getConversations } = require('../controllers/chatController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/messages', getMessages);
router.post('/messages', sendMessage);

// Admin only routes
router.get('/conversations', authorize('admin'), getConversations);

module.exports = router;
