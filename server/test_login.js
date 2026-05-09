const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const verifyLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'irfanrashidkhan@gmail.com';
    const password = '123456';

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found');
    } else {
      console.log('User found:', user.email);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      console.log('User role:', user.role);
      console.log('isVerified:', user.isVerified);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

verifyLogin();
