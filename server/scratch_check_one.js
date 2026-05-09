const mongoose = require('mongoose');
require('dotenv').config();

const Booking = require('./models/Booking');

const checkOne = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const booking = await Booking.findOne().lean();
    if (!booking) {
      console.log('No booking found');
      process.exit(0);
    }

    const str = JSON.stringify(booking);
    console.log(`Booking ID: ${booking._id}`);
    console.log(`Document size: ${Buffer.byteLength(str)} bytes`);
    
    if (booking.media) {
       console.log(`Media count: ${booking.media.length}`);
       booking.media.forEach((m, i) => {
         console.log(`Media ${i} URL length: ${m.url ? m.url.length : 0}`);
         if (m.url && m.url.length > 1000) {
            console.log(`Media ${i} starts with: ${m.url.substring(0, 100)}...`);
         }
       });
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkOne();
