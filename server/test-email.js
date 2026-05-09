require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('--- Email Configuration Test ---');
  console.log('User:', process.env.EMAIL_USERNAME);
  console.log('Pass:', process.env.EMAIL_PASSWORD ? '********' : 'MISSING');
  
  if (!process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === 'YOUR_GMAIL_APP_PASSWORD_HERE') {
    console.error('ERROR: You have not set a valid Gmail App Password in your .env file.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    console.log('Sending test email...');
    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: 'irfanrashidkhan@gmail.com',
      subject: 'Service Knock - Email System Test',
      text: 'If you are reading this, your email system is working perfectly!',
    });
    console.log('SUCCESS: Email sent successfully to irfanrashidkhan@gmail.com');
  } catch (error) {
    console.error('FAILED: Email could not be sent.');
    console.error('Reason:', error.message);
    if (error.message.includes('Invalid login')) {
      console.error('\nTIP: This usually means your Gmail App Password is wrong or you need to enable 2FA on your Google account.');
    }
  }
}

testEmail();
