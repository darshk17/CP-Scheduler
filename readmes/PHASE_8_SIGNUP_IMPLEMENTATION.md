# Phase 8: Signup Implementation Documentation

This phase implements user registration logic, featuring password encryption using **bcryptjs**, session token signing via **jsonwebtoken (JWT)**, and validation for duplicate accounts.

---

## 🔒 Security Middleware in User Model

We have integrated password hashing directly into [server/models/User.js](file:///d:/CP-Scheduler/server/models/User.js) using Mongoose pre-save middleware. This ensures that every time a user is saved or created, their password is automatically hashed before reaching the database.

```javascript
// Pre-save middleware to hash password before writing to DB
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt (10 rounds) and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

---

## 🛠 Controller Implementation: `authController.js`

Here is a detailed breakdown of the `signup` controller function inside [server/controllers/authController.js](file:///d:/CP-Scheduler/server/controllers/authController.js):

### Step 1: Token Helper Function
We create a helper function to sign a JWT containing the user ID:
```javascript
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};
```

### Step 2: The Signup Controller Logic
```javascript
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, leetcodeUsername, codeforcesUsername, codechefUsername } = req.body;

    // 1. Validation: Ensure required fields are present
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email, and password' });
    }

    // 2. Validation: Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // 3. Validation: Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 4. Create User: Save user to MongoDB (password will be hashed by pre-save hook)
    const user = await User.create({
      fullName,
      email,
      password,
      leetcodeUsername,
      codeforcesUsername,
      codechefUsername
    });

    // 5. Generate session token
    const token = signToken(user._id);

    // 6. Send Response: Exclude password from the returned payload
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          leetcodeUsername: user.leetcodeUsername,
          codeforcesUsername: user.codeforcesUsername,
          codechefUsername: user.codechefUsername,
          savedContests: user.savedContests
        }
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};
```

---

## 🧪 Testing Registration

You can test the signup API using a tool like Postman or VS Code's Thunder Client.

*   **HTTP Method**: `POST`
*   **Request URL**: `http://localhost:5000/api/auth/signup`
*   **Body (JSON)**:
    ```json
    {
      "fullName": "Alex Coder",
      "email": "alex@example.com",
      "password": "mySecurePassword"
    }
    ```
*   **Expected Response (201 Created)**:
    ```json
    {
      "status": "success",
      "token": "eyJhbGciOi...",
      "data": {
        "user": {
          "id": "60d5ec...",
          "fullName": "Alex Coder",
          "email": "alex@example.com",
          "leetcodeUsername": "",
          "codeforcesUsername": "",
          "codechefUsername": "",
          "savedContests": []
        }
      }
    }
    ```
