const Joi = require('joi');
const ContactSubmission = require('../models/ContactSubmission');
const Newsletter = require('../models/Newsletter');

// @route   POST /api/contact/contact
// @access  Public
exports.sendContactMessage = async (req, res, next) => {
  try {
    const schema = Joi.object({
      name:    Joi.string().trim().min(2).max(100).required(),
      email:   Joi.string().trim().email().max(254).required(),
      subject: Joi.string().trim().max(200).allow('', null).optional(),
      message: Joi.string().trim().min(10).max(2000).required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details[0].message });

    await ContactSubmission.create(value);

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/contact/newsletter
// @access  Public
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().trim().email().max(254).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      await Newsletter.create({ email: value.email.toLowerCase() });
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
