const Message = require('../models/Message');
const User = require('../models/User');
const { sendEmail, templates } = require('./email');

const CHECK_INTERVAL_MS = 10 * 1000;  // run every 10 seconds
const UNREAD_THRESHOLD_MS = 15 * 1000; // email if still unread after 15 seconds

async function checkUnreadMessages() {
  try {
    const cutoff = new Date(Date.now() - UNREAD_THRESHOLD_MS);

    const messages = await Message.find({
      emailSent: false,
      isRead: false,
      isBot: false,
      createdAt: { $lte: cutoff },
    }).limit(20);

    for (const msg of messages) {
      // Atomically claim the message to prevent double-send on concurrent runs
      const claimed = await Message.findOneAndUpdate(
        { _id: msg._id, emailSent: false },
        { emailSent: true }
      );
      if (!claimed) continue;

      try {
        if (!msg.isAdmin) {
          // User → Admin: email the admin
          const sender = await User.findById(msg.sender).select('name role phone');
          if (sender) {
            await sendEmail(templates.supportMessageReceived(sender, msg.content));
            console.log(`[SCHEDULER] Admin notified of message from ${sender.name}`);
          }
        } else {
          // Admin → User: conversationId is the user's _id
          const recipient = await User.findById(msg.conversationId).select('name email');
          if (recipient && recipient.email) {
            await sendEmail(templates.supportReplyToUser(recipient, msg.content));
            console.log(`[SCHEDULER] User notified at ${recipient.email}`);
          }
        }
      } catch (err) {
        console.error(`[SCHEDULER] Email failed for msg ${msg._id}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[SCHEDULER] Poll error:', err.message);
  }
}

function startChatEmailScheduler() {
  setInterval(checkUnreadMessages, CHECK_INTERVAL_MS);
  console.log('[SCHEDULER] Chat email scheduler running — 15s threshold, 10s poll');
}

module.exports = { startChatEmailScheduler };
