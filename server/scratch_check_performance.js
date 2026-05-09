const mongoose = require('mongoose');
require('dotenv').config();

const Booking = require('./models/Booking');
const Worker = require('./models/Worker');
const User = require('./models/User');

const checkBookings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    console.log('Starting simple find...');
    let start = Date.now();
    const bookingsRaw = await Booking.find().limit(10);
    let end = Date.now();
    console.log(`Simple find took ${end - start}ms`);

    console.log('Starting find with customer populate...');
    start = Date.now();
    const bookingsWithCustomer = await Booking.find().populate('customerId', 'name phone email').limit(10);
    end = Date.now();
    console.log(`Find with customer populate took ${end - start}ms`);

    console.log('Starting full query...');
    start = Date.now();
    const bookings = await Booking.find()
      .populate('customerId', 'name phone email')
      .populate({
        path: 'workerId',
        populate: { path: 'userId', select: 'name phone' },
      })
      .limit(10);
    end = Date.now();
    console.log(`Full query took ${end - start}ms`);
    console.log(`Found ${bookings.length} bookings`);

    bookings.forEach((b, i) => {
      const size = Buffer.byteLength(JSON.stringify(b));
      console.log(`Booking ${i} size: ${size} bytes`);
      if (b.media && b.media.length > 0) {
        console.log(`  Media count: ${b.media.length}`);
        b.media.forEach((m, j) => {
           console.log(`    Media ${j} url length: ${m.url ? m.url.length : 0}`);
           if (m.url && m.url.startsWith('data:')) {
             console.log(`    Media ${j} is BASE64!`);
           }
        });
      }
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkBookings();
