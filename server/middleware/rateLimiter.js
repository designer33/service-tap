const rateLimit = require('express-rate-limit');

const make = (max, windowMinutes, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });

// Auth endpoints
exports.loginLimiter        = make(10,  15, 'Too many login attempts. Please try again in 15 minutes.');
exports.registerLimiter     = make(5,   60, 'Too many registration attempts. Please try again in 1 hour.');
exports.forgotPasswordLimiter = make(5, 60, 'Too many password reset requests. Please try again in 1 hour.');

// Public submission endpoints
exports.contactLimiter      = make(5,   60, 'Too many messages sent. Please try again in 1 hour.');
exports.newsletterLimiter   = make(3,  1440, 'Too many subscription attempts. Please try again later.');

// Chat — authenticated but still rate-limited to prevent spam
exports.chatLimiter         = make(30,   1, 'Too many messages. Please slow down.');
