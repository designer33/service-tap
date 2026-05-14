const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means it's a message to the support/bot
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false, // true if the message is from an admin/support
    },
    isBot: {
      type: Boolean,
      default: false, // true if the message is from the automated bot
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    conversationId: {
      type: String,
      required: true, // Use user ID as conversation ID for support chat
    },
  },
  { timestamps: true }
);

// Index for fast retrieval
messageSchema.index({ conversationId: 1, createdAt: 1 });
messageSchema.index({ receiver: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);
