const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const checkAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admins = await User.find({ role: 'admin' });
    console.log('Admins found:', admins.length);
    admins.forEach(a => {
      console.log(`- ${a.email} (${a.name})`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkAdmins();
