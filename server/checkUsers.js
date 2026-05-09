const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const checkSlugs = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined in .env');
    
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'name slug urduName role');
    console.log('Users found:', users.length);
    
    users.forEach(u => {
      console.log(`Name: ${u.name} | Slug: ${u.slug} | UrduName: ${u.urduName} | Role: ${u.role}`);
    });

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error(err);
  }
};

checkSlugs();
