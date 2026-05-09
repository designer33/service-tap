const mongoose = require('mongoose');
require('dotenv').config();

const Booking = require('./models/Booking');

const checkFast = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const start = Date.now();
    const booking = await Booking.findOne().select('-media').lean();
    const end = Date.now();
    console.log(`Find without media took ${end - start}ms`);
    
    if (booking) {
      console.log(`Booking ID: ${booking._id}`);
      console.log(`Document size (without media): ${Buffer.byteLength(JSON.stringify(booking))} bytes`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkFast();
