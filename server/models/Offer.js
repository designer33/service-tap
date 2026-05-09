const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    priceOffer: {
      type: Number,
      required: true,
      min: 0,
    },
    message: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Ensure a worker can only send one offer per booking
offerSchema.index({ bookingId: 1, workerId: 1 }, { unique: true });

module.exports = mongoose.model('Offer', offerSchema);
