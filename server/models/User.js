const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    urduName: {
      type: String,
      trim: true,
      maxlength: [100, 'Urdu name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^0\d{10}$/, 'Please enter a valid 11-digit phone number (e.g., 03001234567)'],
    },
    cnic: {
      type: String,
      required: [true, 'CNIC is required'],
      unique: true,
      trim: true,
      match: [/^\d{13}$/, 'CNIC must be exactly 13 digits'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'worker', 'admin'],
      default: 'customer',
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    profilePic: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
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
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', null],
      default: null,
    },
    cnicImage: {
      type: String,
      default: null,
      select: false,
    },
    verificationNote: {
      type: String,
      default: null,
    },
    reportedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') && !this.isModified('name')) return next();
  
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
    
    // Handle duplicate slugs by appending random string if needed
    // Simple approach: append short id
    const existing = await mongoose.models.User.findOne({ slug: this.slug, _id: { $ne: this._id } });
    if (existing) {
      this.slug = `${this.slug}-${Math.random().toString(36).substring(2, 7)}`;
    }
  }
  
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
