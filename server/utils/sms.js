const axios = require('axios');

/**
 * Universal SMS Sender
 * Currently configured with a placeholder. You can easily switch to any 
 * Pakistani SMS gateway (like SMS.com.pk, VeerSMS, etc.) or Twilio.
 */
const sendSMS = async (to, message) => {
  try {
    // Clean up the phone number (ensure it's in 92... format)
    let formattedPhone = to;
    if (to.startsWith('0')) {
      formattedPhone = '92' + to.substring(1);
    } else if (!to.startsWith('92')) {
      formattedPhone = '92' + to;
    }

    console.log(`[SMS ATTEMPT] To: ${formattedPhone} | Msg: ${message}`);

    // --- OPTION 1: Using a placeholder for Pakistani SMS Gateway ---
    // Most Pakistani gateways use a simple GET request like this:
    /*
    const api_key = process.env.SMS_API_KEY;
    const sender = process.env.SMS_SENDER_ID;
    const url = `https://portal.bulksms.com.pk/api/send?key=${api_key}&to=${formattedPhone}&message=${encodeURIComponent(message)}&sender=${sender}`;
    const response = await axios.get(url);
    console.log('[SMS SUCCESS]', response.data);
    */

    // --- OPTION 2: Using Textbelt (1 free message per day per IP) ---
    // Good for initial testing without keys
    const response = await axios.post('https://textbelt.com/text', {
      phone: formattedPhone,
      message: message,
      key: 'textbelt', // Using 'textbelt' for free tier
    });

    if (response.data.success) {
      console.log(`[SMS SENT] Successfully sent to ${formattedPhone}`);
    } else {
      console.warn(`[SMS INFO] ${response.data.error || 'Free limit reached or quota exceeded'}`);
    }

    return true;
  } catch (error) {
    console.error('[SMS ERROR]', error.message);
    return false;
  }
};

module.exports = { sendSMS };
