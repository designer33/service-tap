require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const slugify = require('slugify');

const seedSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const users = await User.find({ slug: { $exists: false } });
    console.log(`Found ${users.length} users without slugs`);

    for (const user of users) {
      let slug = slugify(user.name, { lower: true, strict: true });
      const existing = await User.findOne({ slug, _id: { $ne: user._id } });
      if (existing) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }
      await User.updateOne({ _id: user._id }, { slug });
      console.log(`Updated slug for ${user.name}: ${slug}`);
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSlugs();
