const User = require('../models/User');

// @desc    Update user's reminder preferences
// @route   PUT /api/users/reminders
// @access  Private
exports.updateReminderSettings = async (req, res, next) => {
  try {
    const { emailEnabled, minutesBefore } = req.body;

    const allowedWindows = [10, 15, 30, 45, 60];
    if (minutesBefore !== undefined && !allowedWindows.includes(Number(minutesBefore))) {
      const error = new Error('Alert window minutesBefore must be one of: 10, 15, 30, 45, 60');
      error.statusCode = 400;
      return next(error);
    }

    const updateFields = {};
    if (emailEnabled !== undefined) {
      updateFields['reminderSettings.emailEnabled'] = emailEnabled;
    }
    if (minutesBefore !== undefined) {
      updateFields['reminderSettings.minutesBefore'] = Number(minutesBefore);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      message: 'Reminder settings updated successfully',
      data: {
        reminderSettings: updatedUser.reminderSettings
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update user's basic profile details (Name, platform handles)
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, codeforcesUsername, leetcodeUsername } = req.body;

    // 1. Validation: Ensure fullName is not empty
    if (fullName !== undefined && (!fullName || fullName.trim() === '')) {
      const error = new Error('Full Name cannot be empty');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Prepare trimmed parameters
    const updateFields = {};
    if (fullName !== undefined) {
      updateFields.fullName = fullName.trim();
    }
    if (codeforcesUsername !== undefined) {
      updateFields.codeforcesUsername = codeforcesUsername.trim();
    }
    if (leetcodeUsername !== undefined) {
      updateFields.leetcodeUsername = leetcodeUsername.trim();
    }

    // 3. Perform update in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // 4. Return updated user object
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: {
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture || '',
          role: updatedUser.role || 'user',
          leetcodeUsername: updatedUser.leetcodeUsername || '',
          codeforcesUsername: updatedUser.codeforcesUsername || '',
          codechefUsername: updatedUser.codechefUsername || '',
          savedContests: updatedUser.savedContests || [],
          reminderSettings: updatedUser.reminderSettings || {
            emailEnabled: true,
            minutesBefore: 30
          },
          cpStats: updatedUser.cpStats || {}
        }
      }
    });

  } catch (error) {
    next(error);
  }
};
