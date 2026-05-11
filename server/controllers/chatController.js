const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get chat messages for a user
// @route   GET /api/chat/messages
// @access  Protected
exports.getMessages = async (req, res, next) => {
  try {
    // If admin and userId provided, get that user's chat
    const userId = (req.user.role === 'admin' && req.query.userId) 
      ? req.query.userId 
      : req.user._id.toString();
    
    const messages = await Message.find({ conversationId: userId })
      .sort({ createdAt: 1 })
      .limit(100);

    // If admin is viewing, mark non-admin messages as read
    if (req.user.role === 'admin' && req.query.userId) {
      await Message.updateMany(
        { conversationId: userId, isAdmin: false, isBot: false, isRead: false },
        { isRead: true }
      );
    } else {
      // If user is viewing, mark admin/bot messages as read
      await Message.updateMany(
        { conversationId: userId, $or: [{ isAdmin: true }, { isBot: true }], isRead: false },
        { isRead: true }
      );
    }

    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Protected
exports.sendMessage = async (req, res, next) => {
  try {
    const { content, receiver, isAdmin } = req.body;
    
    // If admin is sending, conversationId is the receiver's ID
    const conversationId = (req.user.role === 'admin' && receiver) 
      ? receiver 
      : req.user._id.toString();

    // Create message
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiver || null,
      content,
      conversationId,
      isAdmin: req.user.role === 'admin' && isAdmin,
    });

    // Check for bot trigger (only if user is sending)
    if (!isAdmin && req.user.role !== 'admin') {
      const botResponse = getBotResponse(content);
      if (botResponse) {
        await Message.create({
          sender: req.user._id, 
          content: botResponse,
          conversationId,
          isBot: true,
        });
      }
    }

    res.status(201).json({ success: true, message });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all conversations (Admin only)
// @route   GET /api/chat/conversations
// @access  Admin
exports.getConversations = async (req, res, next) => {
  try {
    // Group by conversationId and get last message
    const conversations = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$content' },
          lastMessageAt: { $first: '$createdAt' },
          unreadCount: {
            $sum: { $cond: [{ $and: [{ $eq: ['$isRead', false] }, { $eq: ['$isAdmin', false] }] }, 1, 0] }
          }
        }
      },
      { $sort: { lastMessageAt: -1 } }
    ]);

    // Populate user info (conversationId is userId)
    const populatedConversations = await Promise.all(conversations.map(async (conv) => {
      try {
        const user = await User.findById(conv._id).select('name email role urduName profilePic');
        return { ...conv, user: user || { name: 'Deleted User', role: 'unknown' } };
      } catch (err) {
        return { ...conv, user: { name: 'Invalid User', role: 'unknown' } };
      }
    }));

    res.json({ success: true, conversations: populatedConversations });
  } catch (err) {
    next(err);
  }
};

// Simple bot logic
function getBotResponse(content) {
  const text = content.toLowerCase();
  
  if (text.includes('hello') || text.includes('hi')) {
    return "Hello! How can Service Knock help you today?";
  }
  if (text.includes('booking') || text.includes('book')) {
    return "You can book a service from the 'Book Service' section. If you're having trouble, let me know!";
  }
  if (text.includes('worker') || text.includes('become a worker')) {
    return "To become a worker, you need to register as a worker and complete your CNIC verification.";
  }
  if (text.includes('payment') || text.includes('price')) {
    return "Payments are usually handled directly with the worker. We are working on integrated payments soon!";
  }
  if (text.includes('agent') || text.includes('human') || text.includes('support')) {
    return "I've flagged your request. A support agent will get back to you shortly.";
  }
  
  return null; // No bot response, wait for admin
}
