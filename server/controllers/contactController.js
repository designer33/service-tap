const { sendEmail, templates } = require('../utils/email');

// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email and message' });
    }

    await sendEmail(templates.contactForm(name, email, subject, message));

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

    await sendEmail(templates.newsletter(email));

    res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    next(err);
  }
};
