const User = require('../models/User');

// @desc    Get dashboard statistics and user settings
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    // 1. Fetch user document from MongoDB using the ID attached by the protect middleware.
    // We select only the requested fields and explicitly exclude the password.
    const user = await User.findById(req.user._id).select(
      'fullName email profilePicture role leetcodeUsername codeforcesUsername codechefUsername savedContests reminderSettings cpStats'
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // 2. Return the requested user details in the response payload
    res.status(200).json({
      status: 'success',
      data: {
        user: {
          fullName: user.fullName,
          email: user.email,
          profilePicture: user.profilePicture || '',
          role: user.role || 'user',
          leetcodeUsername: user.leetcodeUsername || '',
          codeforcesUsername: user.codeforcesUsername || '',
          codechefUsername: user.codechefUsername || '',
          savedContests: user.savedContests || [],
          reminderSettings: user.reminderSettings || {
            emailEnabled: true,
            minutesBefore: 30
          },
          cpStats: user.cpStats || {}
        }
      }
    });

  } catch (error) {
    next(error);
  }
};
