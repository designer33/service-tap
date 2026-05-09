const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'irfanrashidkhan@gmail.com' });
    if (user) {
      console.log('User found:');
      console.log({
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        role: user.role
      });

      const Booking = require('./models/Booking');
      const bookings = await Booking.find({ customerId: user._id });
      console.log(`Number of bookings: ${bookings.length}`);
      if (bookings.length > 0) {
        console.log('Last booking status:', bookings[bookings.length - 1].status);
      }
    } else {
      console.log('User not found');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkUser();
