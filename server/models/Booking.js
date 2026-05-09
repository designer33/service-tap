const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      default: null,
    },
    serviceType: {
      type: String,
      enum: ['electrician', 'plumber', 'ac_fridge_repair', 'carpenter', 'painter', 'mason', 'steel_fixer', 'labour', 'tile_fixer'],
      required: [true, 'Service type is required'],
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    issueDescription: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: 'Pakistan',
    },
    location: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'accepted', 'completed', 'cancelled'],
      default: 'pending',
    },
    priceEstimate: {
      type: Number,
      default: null,
    },
    leadFee: {
      type: Number,
      default: null,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    media: [
      {
        url: String,
        type: { type: String, enum: ['image', 'video', 'audio'] },
      }
    ],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

bookingSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookingId'
});

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ workerId: 1, status: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ serviceType: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
