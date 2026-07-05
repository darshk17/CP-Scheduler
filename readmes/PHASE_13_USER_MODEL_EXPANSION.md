# Phase 13: Expanded User Model Documentation

This phase implements the expanded User Model Schema with rigorous Mongoose validation, role-based controls, and automated pre-save password hashing.

---

## 📂 Database Model: `User.js`

The updated schema definition in [server/models/User.js](file:///d:/CP-Scheduler/server/models/User.js) supports:
- **Core Info**: Name, validated lowercase email, and minimum length password.
- **Access Roles**: Defaulting to `'user'`, supporting role-based controls.
- **Verification Status**: Defaulting to `false`, supporting registration email flows.
- **Competitive Profiles**: Leetcode, Codeforces, and Codechef profile usernames.
- **Reminder Options**: Encapsulated configuration for notifications.

```javascript
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
        type: String
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
    }
  },
  {
    timestamps: true
  }
);
```

---

## 🔒 Security Middleware Hooks

### Automated Pre-Save Hashing
Before saving any document, if the password field is modified, Mongoose automatically salts and hashes it:
```javascript
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### Password Verification Method
A helper method is attached to check login credentials safely:
```javascript
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```
