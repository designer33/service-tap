const Joi = require('joi');
const axios = require('axios');
const ContactSubmission = require('../models/ContactSubmission');
const Newsletter = require('../models/Newsletter');

// ── Google Reviews (Places API, cached 6 hours) ───────────────────────────
let _reviewsCache = null;
let _cacheAt = 0;
const CACHE_TTL = 6 * 60 * 60 * 1000;

// @route   GET /api/contact/google-reviews
// @access  Public
exports.getGoogleReviews = async (req, res, next) => {
  try {
    if (_reviewsCache && Date.now() - _cacheAt < CACHE_TTL) {
      return res.json(_reviewsCache);
    }

    const apiKey  = process.env.GOOGLE_MAPS_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return res.status(503).json({ success: false, message: 'Google Reviews not configured' });
    }

    const { data } = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields:   'reviews,rating,user_ratings_total',
          language: 'en',
          reviews_sort: 'newest',
          key: apiKey,
        },
        timeout: 8000,
      }
    );

    if (data.status !== 'OK') {
      return res.status(502).json({ success: false, message: `Places API: ${data.status}` });
    }

    const reviews = (data.result.reviews || []).map(r => ({
      name:   r.author_name,
      photo:  r.profile_photo_url,
      rating: r.rating,
      date:   r.relative_time_description,
      text:   r.text,
    }));

    _reviewsCache = {
      success: true,
      reviews,
      rating: data.result.rating,
      total:  data.result.user_ratings_total,
    };
    _cacheAt = Date.now();

    res.json(_reviewsCache);
  } catch (err) {
    next(err);
  }
};

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
