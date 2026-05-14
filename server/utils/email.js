const nodemailer = require('nodemailer');

/**
 * Centralized email sender using Gmail
 * Options: { to, subject, html, text }
 */
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Service Knock <${process.env.EMAIL_USERNAME}>`,
    to: options.to || options.email,
    subject: options.subject,
    text: options.text || options.message,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Sent to ${mailOptions.to}: ${options.subject}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${mailOptions.to}:`, error.message);
    // Do not throw — email failures should never crash the server
  }
};

// ─── HTML Email Templates ─────────────────────────────────────────────────────

const BRAND_COLOR = '#0ea5e9';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'irfanrashidkhan@gmail.com';

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f1f5f9; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: ${BRAND_COLOR}; padding: 24px 32px; }
    .header h1 { color: white; margin: 0; font-size: 22px; }
    .body { padding: 28px 32px; color: #334155; line-height: 1.6; }
    .body h2 { color: #0f172a; margin-top: 0; }
    .info-box { background: #f8fafc; border-left: 4px solid ${BRAND_COLOR}; padding: 14px 18px; border-radius: 6px; margin: 18px 0; }
    .info-box p { margin: 4px 0; font-size: 14px; }
    .btn { display: inline-block; padding: 12px 28px; background: ${BRAND_COLOR}; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px; }
    .footer { background: #f8fafc; padding: 16px 32px; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🔧 Service Knock</h1></div>
    <div class="body">${content}</div>
    <div class="footer">Service Knock — Connecting Trusted Professionals &bull; <a href="https://serviceknock.com.irfanrashid.net">Visit Site</a></div>
  </div>
</body>
</html>
`;

// ─── Pre-built Email Templates ────────────────────────────────────────────────

const templates = {
  // To admin — new worker registered
  workerRegistered: (worker) => ({
    to: ADMIN_EMAIL,
    subject: `New Worker Registered: ${worker.name}`,
    html: baseTemplate(`
      <h2>New Worker Registration</h2>
      <p>A new worker has registered on Service Knock and is awaiting ID verification.</p>
      <div class="info-box">
        <p><strong>Name:</strong> ${worker.name}</p>
        <p><strong>Email:</strong> ${worker.email}</p>
        <p><strong>Phone:</strong> ${worker.phone}</p>
        <p><strong>Service:</strong> ${worker.serviceType}</p>
        <p><strong>City:</strong> ${worker.city}</p>
      </div>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/admin/verifications">Review Now</a>
    `),
  }),

  // To admin — new ID verification submitted
  verificationSubmitted: (user) => ({
    to: ADMIN_EMAIL,
    subject: `ID Verification Request: ${user.name}`,
    html: baseTemplate(`
      <h2>New ID Verification Request</h2>
      <p>A user has submitted their CNIC for identity verification.</p>
      <div class="info-box">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
      </div>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/admin/verifications">Review Submission</a>
    `),
  }),

  // To admin — new customer registered
  customerRegistered: (user) => ({
    to: ADMIN_EMAIL,
    subject: `New Customer Registered: ${user.name}`,
    html: baseTemplate(`
      <h2>New Customer Registration</h2>
      <div class="info-box">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>City:</strong> ${user.city}</p>
      </div>
    `),
  }),

  // To user — verification approved
  verificationApproved: (user) => ({
    to: user.email,
    subject: 'Your Identity Has Been Verified ✓ — Service Knock',
    html: baseTemplate(`
      <h2>Identity Verified! 🎉</h2>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Congratulations! Your CNIC has been successfully verified. A <strong>Verified Badge</strong> now appears on your profile, and you can now post or accept jobs on Service Knock.</p>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net">Go to Dashboard</a>
    `),
  }),

  // To user — verification rejected
  verificationRejected: (user, note) => ({
    to: user.email,
    subject: 'Identity Verification Update — Service Knock',
    html: baseTemplate(`
      <h2>Verification Could Not Be Completed</h2>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>We were unable to verify your submitted identity document.</p>
      <div class="info-box">
        <p><strong>Reason:</strong> ${note || 'Your ID document could not be verified. Please resubmit a clear photo.'}</p>
      </div>
      <p>Please log in and resubmit a clear, readable photo of your CNIC to complete verification.</p>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/profile/${user.slug}">Resubmit ID</a>
    `),
  }),

  // To worker — new offer accepted by customer
  offerAccepted: (worker, booking) => ({
    to: worker.email,
    subject: `Your Offer Was Accepted! — "${booking.title}"`,
    html: baseTemplate(`
      <h2>Offer Accepted! 🎉</h2>
      <p>Dear <strong>${worker.name}</strong>,</p>
      <p>Great news! A customer has accepted your price offer for the following job:</p>
      <div class="info-box">
        <p><strong>Job:</strong> ${booking.title}</p>
        <p><strong>Service:</strong> ${booking.serviceType}</p>
        <p><strong>Price:</strong> Rs. ${booking.priceEstimate}</p>
        <p><strong>Address:</strong> ${booking.address}, ${booking.city}</p>
      </div>
      <p>You can now see the customer's contact details in your Active Jobs.</p>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/active-jobs">View Active Jobs</a>
    `),
  }),

  // To customer — worker accepted job (instant accept)
  workerInstantAccepted: (customer, booking) => ({
    to: customer.email,
    subject: `A Worker Accepted Your Job — "${booking.title}"`,
    html: baseTemplate(`
      <h2>Worker Hired! 🛠️</h2>
      <p>Dear <strong>${customer.name}</strong>,</p>
      <p>A verified worker has accepted your job request:</p>
      <div class="info-box">
        <p><strong>Job:</strong> ${booking.title}</p>
        <p><strong>Service:</strong> ${booking.serviceType}</p>
        <p><strong>Address:</strong> ${booking.address}, ${booking.city}</p>
      </div>
      <p>Please visit your bookings to see the worker's contact details and coordinate the visit.</p>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/my-bookings">View My Bookings</a>
    `),
  }),

  // To customer — job completed
  jobCompleted: (customer, booking) => ({
    to: customer.email,
    subject: `Job Completed — Please Leave a Review`,
    html: baseTemplate(`
      <h2>Your Job Has Been Completed ✅</h2>
      <p>Dear <strong>${customer.name}</strong>,</p>
      <p>The worker has marked your job as completed:</p>
      <div class="info-box">
        <p><strong>Job:</strong> ${booking.title}</p>
        <p><strong>Service:</strong> ${booking.serviceType}</p>
      </div>
      <p>Please take a moment to leave a review for the worker — your feedback helps maintain our quality standards.</p>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/my-bookings">Leave a Review</a>
    `),
  }),

  // To worker — customer left a review
  reviewReceived: (worker, booking, rating) => ({
    to: worker.email,
    subject: `You Received a ${rating}-Star Review — Service Knock`,
    html: baseTemplate(`
      <h2>New Review Received ⭐</h2>
      <p>Dear <strong>${worker.name}</strong>,</p>
      <p>A customer has left a <strong>${rating}-star review</strong> for your work on:</p>
      <div class="info-box">
        <p><strong>Job:</strong> ${booking.title}</p>
      </div>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/worker-profile">View Your Profile</a>
    `),
  }),

  // To customer — worker left a review
  customerReviewReceived: (customer, booking, rating) => ({
    to: customer.email,
    subject: `You Received a Review — Service Knock`,
    html: baseTemplate(`
      <h2>New Review Received ⭐</h2>
      <p>Dear <strong>${customer.name}</strong>,</p>
      <p>The worker has left a <strong>${rating}-star review</strong> for you regarding:</p>
      <div class="info-box">
        <p><strong>Job:</strong> ${booking.title}</p>
      </div>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/my-bookings">View Your Bookings</a>
    `),
  }),

  // To admin — contact form message
  contactForm: (name, email, subject, message) => ({
    to: ADMIN_EMAIL,
    subject: `Contact Form: ${subject || 'New Message'} — from ${name}`,
    html: baseTemplate(`
      <h2>New Contact Form Message</h2>
      <div class="info-box">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
      </div>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `),
  }),

  // To admin — newsletter subscription
  newsletter: (email) => ({
    to: ADMIN_EMAIL,
    subject: `New Newsletter Subscriber: ${email}`,
    html: baseTemplate(`
      <h2>New Newsletter Subscription</h2>
      <div class="info-box">
        <p><strong>Email:</strong> ${email}</p>
      </div>
    `),
  }),

  // To user — account blocked
  accountBlocked: (user) => ({
    to: user.email,
    subject: 'Your Account Has Been Blocked — Service Knock',
    html: baseTemplate(`
      <h2>Account Blocked</h2>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>Your account on Service Knock has been blocked. As a result, you will not be able to post or accept any jobs until this is resolved.</p>
      <p>Please contact our support team to resolve this issue.</p>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/contact">Contact Support</a>
    `),
  }),

  // To user — admin replied to their support message
  supportReplyToUser: (user, content) => ({
    to: user.email,
    subject: 'New Support Reply — Service Knock',
    html: baseTemplate(`
      <h2>You Have a New Support Reply 💬</h2>
      <p>Dear <strong>${user.name}</strong>,</p>
      <p>The Service Knock support team has replied to your message:</p>
      <div class="info-box">
        <p>"${content}"</p>
      </div>
      <p>Log in to continue the conversation.</p>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net">Open Support Chat</a>
    `),
  }),

  // To admin — new support chat message
  supportMessageReceived: (user, content) => ({
    to: ADMIN_EMAIL,
    subject: `New Support Message from ${user.name}`,
    html: baseTemplate(`
      <h2>New Support Chat Message</h2>
      <p>A user has sent a message to the support chat.</p>
      <div class="info-box">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Role:</strong> ${user.role}</p>
      </div>
      <p><strong>Message:</strong></p>
      <p>"${content}"</p>
      <a class="btn" href="https://serviceknock.com.irfanrashid.net/admin/support">Reply to Chat</a>
    `),
  }),
};

module.exports = { sendEmail, templates };
