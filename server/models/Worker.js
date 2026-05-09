const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    serviceType: {
      type: String,
      enum: ['electrician', 'plumber', 'ac_fridge_repair', 'carpenter', 'painter', 'mason', 'steel_fixer', 'labour', 'tile_fixer'],
      required: [true, 'Service type is required'],
    },
    experience: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [0, 0],
      },
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

workerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Worker', workerSchema);
