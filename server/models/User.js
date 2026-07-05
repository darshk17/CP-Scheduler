const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    profilePicture: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    leetcodeUsername: {
      type: String,
      trim: true,
      default: ''
    },
    codeforcesUsername: {
      type: String,
      trim: true,
      default: ''
    },
    codechefUsername: {
      type: String,
      trim: true,
      default: ''
    },
    savedContests: [
      {
        contestId: {
          type: String,
          required: true
        },
        savedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    remindersSent: [
      {
        contestId: {
          type: String,
          required: true
        },
        sentAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    reminderSettings: {
      emailEnabled: {
        type: Boolean,
        default: true
      },
      minutesBefore: {
        type: Number,
        default: 30
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    cpStats: {
      codeforces: {
        handle: { type: String, default: '' },
        rating: { type: Number, default: 0 },
        maxRating: { type: Number, default: 0 },
        rank: { type: String, default: 'unrated' },
        maxRank: { type: String, default: 'unrated' },
        lastUpdated: { type: Date }
      },
      leetcode: {
        username: { type: String, default: '' },
        totalSolved: { type: Number, default: 0 },
        easySolved: { type: Number, default: 0 },
        mediumSolved: { type: Number, default: 0 },
        hardSolved: { type: Number, default: 0 },
        ranking: { type: Number, default: 0 },
        lastUpdated: { type: Date }
      }
    }
  },
  {
    timestamps: true
  }
);

// Optimize database queries for user saved contest verification and toggle checks
userSchema.index({ 'savedContests.contestId': 1 });

// Optimize background reminder engine execution queries querying candidate users
userSchema.index({
  'reminderSettings.emailEnabled': 1,
  'savedContests.contestId': 1
});

// Pre-save hook to hash user passwords automatically before writing to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to verify password match on login attempts
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
