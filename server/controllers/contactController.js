const ContactSubmission = require('../models/ContactSubmission');
const Newsletter = require('../models/Newsletter');

// @route   POST /api/contact/contact
// @access  Public
exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email and message' });
    }

    await ContactSubmission.create({ name, email, subject, message });

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/contact/newsletter
// @access  Public
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    try {
      await Newsletter.create({ email });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(200).json({ success: true, message: 'Already subscribed!' });
      }
      throw err;
    }

    res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    next(err);
  }
};
