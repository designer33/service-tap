const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail, templates } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

const OFFLINE_THRESHOLD_MS = 3 * 60 * 1000; // 3 minutes

function isOffline(user) {
  if (!user || !user.lastActive) return true;
  return (Date.now() - new Date(user.lastActive).getTime()) > OFFLINE_THRESHOLD_MS;
}

// @desc    Get chat messages for a user
// @route   GET /api/chat/messages
// @access  Protected
exports.getMessages = async (req, res, next) => {
  try {
    const userId = (req.user.role === 'admin' && req.query.userId)
      ? req.query.userId
      : req.user._id.toString();

    const messages = await Message.find({ conversationId: userId })
      .sort({ createdAt: 1 })
      .limit(100);

    if (req.user.role === 'admin' && req.query.userId) {
      await Message.updateMany(
        { conversationId: userId, isAdmin: false, isBot: false, isRead: false },
        { isRead: true }
      );
    } else {
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

    const conversationId = (req.user.role === 'admin' && receiver)
      ? receiver
      : req.user._id.toString();

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiver || null,
      content,
      conversationId,
      isAdmin: req.user.role === 'admin' && isAdmin,
    });

    // ── User → Admin ─────────────────────────────────────────────────────────
    if (req.user.role !== 'admin') {
      try {
        const admins = await User.find({ role: 'admin' }).select('_id phone email lastActive');

        for (const admin of admins) {
          // Always create in-app notification
          await Notification.create({
            userId: admin._id,
            title: 'New Support Message',
            message: `${req.user.name} (${req.user.role}): "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
            type: 'system',
            link: '/admin/support',
          }).catch(err => console.error('[DB] Notification failed:', err.message));

          // Only send email/SMS if admin is offline
          if (isOffline(admin)) {
            sendEmail(templates.supportMessageReceived(req.user, content))
              .catch(err => console.error('[EMAIL] Admin alert failed:', err.message));

            const adminPhone = admin.phone || process.env.ADMIN_PHONE;
            if (adminPhone) {
              sendSMS(adminPhone, `[Service Knock] New support msg from ${req.user.name}: "${content.substring(0, 60)}"`)
                .catch(err => console.error('[SMS] Admin alert failed:', err.message));
            }
          }
        }

        // Fallback if no admins in DB
        if (admins.length === 0) {
          sendEmail(templates.supportMessageReceived(req.user, content)).catch(() => {});
          const fallbackPhone = process.env.ADMIN_PHONE;
          if (fallbackPhone) {
            sendSMS(fallbackPhone, `[Service Knock] Support msg from ${req.user.name}: "${content.substring(0, 60)}"`).catch(() => {});
          }
        }
      } catch (err) {
        console.error('[CHAT] User→Admin notification error:', err.message);
      }

      // Bot auto-reply
      const botResponse = getBotResponse(content);
      if (botResponse) {
        await Message.create({
          sender: null,
          content: botResponse,
          conversationId,
          isBot: true,
          isAdmin: true,
        });
      }
    }

    // ── Admin → User ─────────────────────────────────────────────────────────
    if (req.user.role === 'admin' && receiver) {
      try {
        const targetUser = await User.findById(receiver).select('name email phone lastActive role');

        if (targetUser) {
          // Always create in-app notification
          await Notification.create({
            userId: receiver,
            title: 'New Support Reply',
            message: `Support: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
            type: 'support_reply',
            link: '/',
          }).catch(err => console.error('[DB] User notification failed:', err.message));

          // Only send email/SMS if user is offline
          if (isOffline(targetUser)) {
            sendEmail(templates.supportReplyToUser(targetUser, content))
              .catch(err => console.error('[EMAIL] User reply alert failed:', err.message));

            if (targetUser.phone) {
              sendSMS(targetUser.phone, `[Service Knock] Support replied: "${content.substring(0, 80)}" - Log in to reply`)
                .catch(err => console.error('[SMS] User reply alert failed:', err.message));
            }
          }
        }
      } catch (err) {
        console.error('[CHAT] Admin→User notification error:', err.message);
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

    const populatedConversations = await Promise.all(conversations.map(async (conv) => {
      try {
        const user = await User.findById(conv._id).select('name email role urduName profilePic');
        return { ...conv, user: user || { name: 'Deleted User', role: 'unknown' } };
      } catch {
        return { ...conv, user: { name: 'Invalid User', role: 'unknown' } };
      }
    }));

    res.json({ success: true, conversations: populatedConversations });
  } catch (err) {
    next(err);
  }
};

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
  return null;
}
