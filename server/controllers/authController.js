const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { formatUserResponse } = require('../utils/userFormatter');

// Helper to sign JWTs
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user account
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, leetcodeUsername, codeforcesUsername, codechefUsername } = req.body;

    // 1. Validation: Check that required fields are present
    if (!fullName || !email || !password) {
      const error = new Error('Please fill in all required fields (fullName, email, password)');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Validation: Check password length
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      return next(error);
    }

    // 3. Validation: Check for duplicate email
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error('A user with this email already exists');
      error.statusCode = 409;
      return next(error);
    }

    // 4. Create User: Save user in MongoDB
    const user = await User.create({
      fullName,
      email,
      password,
      leetcodeUsername,
      codeforcesUsername,
      codechefUsername
    });

    // 5. Return success response
    res.status(201).json({
      status: 'success',
      data: {
        user: formatUserResponse(user)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Log in an existing user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Check that credentials are provided
    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Query User: Find user by email in database
    const user = await User.findOne({ email });

    // 3. Match Credentials: Check if user exists and password is correct
    if (!user || !(await user.matchPassword(password))) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401; // 401 Unauthorized
      return next(error);
    }

    // 4. Generate JWT token
    const token = signToken(user._id);

    // 5. Send Response: Return user data and token
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: formatUserResponse(user)
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Log out user session
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Logout endpoint placeholder'
  });
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: formatUserResponse(req.user)
      }
    });
  } catch (error) {
    next(error);
  }
};
