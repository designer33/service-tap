const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const existing = await User.findOne({ email: 'admin@serviceknock.com' });
    if (existing) {
      console.log('⚠️  Admin already exists. Skipping seed.');
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Service Knock Admin',
      phone: '03000000000',
      cnic: '0000000000000',
      email: 'admin@serviceknock.com',
      password: 'Admin@1234',
      role: 'admin',
    });

    console.log('🌱 Admin user seeded successfully!');
    console.log('   Email   : admin@serviceknock.com');
    console.log('   Password: Admin@1234');
    console.log('   ID      :', admin._id.toString());
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();
