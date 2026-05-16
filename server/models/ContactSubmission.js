const mongoose = require('mongoose');

const contactSubmissionSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true, maxlength: 100 },
  email:   { type: String, required: true, trim: true, lowercase: true, maxlength: 254,
             match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'] },
  subject: { type: String, default: '', trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
