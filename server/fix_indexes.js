require('dotenv').config();
const mongoose = require('mongoose');

async function fixIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('reviews');
    const indexes = await collection.indexes();
    console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

    // Look for a unique index on bookingId only
    const bookingIdIndex = indexes.find(idx => 
      idx.key.bookingId === 1 && Object.keys(idx.key).length === 1 && idx.unique
    );

    if (bookingIdIndex) {
      console.log('Found old unique bookingId index:', bookingIdIndex.name);
      await collection.dropIndex(bookingIdIndex.name);
      console.log('Dropped old unique bookingId index');
    } else {
      console.log('No old unique bookingId index found');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixIndexes();
