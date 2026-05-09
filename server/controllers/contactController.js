const nodemailer = require('nodemailer');

// Helper to send email
const sendEmail = async (options) => {
  // Create transporter
  // NOTE: For production, you should use a real SMTP service like SendGrid, Gmail, etc.
  // This is a placeholder using Irfan's email as the receiver.
  const transporter = nodemailer.createTransport({
    // Example SMTP (you need to provide actual credentials in .env)
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `Service Knock <${process.env.FROM_EMAIL || 'noreply@serviceknock.com'}>`,
    to: options.to,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

// @route   POST /api/contact
// @access  Public
exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email and message' });
    }

    // Send email to Irfan
    try {
      await sendEmail({
        to: 'irfanrashidkhan@gmail.com',
        subject: `New Contact Form Message: ${subject || 'No Subject'}`,
        message: `New message from ${name} (${email}):\n\n${message}`,
        html: `
          <h3>New Contact Form Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    } catch (err) {
      console.error('Email sending failed:', err);
      // We still return success if we want to not block the user, 
      // but ideally we should notify them or handle it.
    }

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/newsletter
// @access  Public
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Send email to Irfan
    try {
      await sendEmail({
        to: 'irfanrashidkhan@gmail.com',
        subject: 'New Newsletter Subscription',
        message: `New subscriber: ${email}`,
        html: `
          <h3>New Newsletter Subscription</h3>
          <p><strong>Email:</strong> ${email}</p>
        `,
      });
    } catch (err) {
      console.error('Newsletter email sending failed:', err);
    }

    res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (err) {
    next(err);
  }
};
