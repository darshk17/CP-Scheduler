const User = require('../models/User');

// @desc    Save a contest to user's saved list
// @route   POST /api/contests/save
// @access  Private
exports.saveContest = async (req, res, next) => {
  try {
    const { contestId } = req.body;

    // 1. Validation: Ensure contestId is provided
    if (!contestId) {
      const error = new Error('Please provide a contestId');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Database Update: Use findOneAndUpdate with $ne query to avoid duplicates atomically.
    // Since savedContests stores objects with dynamic savedAt timestamps, $addToSet fails
    // to detect duplicates because the dates vary. Using { "savedContests.contestId": { $ne: contestId } }
    // verifies if an entry with the same contestId already exists in the array.
    let user = await User.findOneAndUpdate(
      { _id: req.user._id, "savedContests.contestId": { $ne: contestId } },
      { $push: { savedContests: { contestId } } },
      { new: true }
    );

    if (!user) {
      // Check if user exists but has already saved the contest
      const userExists = await User.findById(req.user._id);
      if (!userExists) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }
      user = userExists; // Return the existing document
    }

    // 3. Return success response
    res.status(200).json({
      status: 'success',
      message: 'Contest saved successfully',
      data: {
        savedContests: user.savedContests
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Remove a contest from user's saved list
// @route   POST /api/contests/unsave
// @access  Private
exports.removeSavedContest = async (req, res, next) => {
  try {
    const { contestId } = req.body;

    // 1. Validation: Ensure contestId is provided
    if (!contestId) {
      const error = new Error('Please provide a contestId');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Database Update: Use Mongoose/MongoDB $pull operator
    // This removes all occurrences of the contestId from the savedContests array.
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          savedContests: {
            contestId: contestId
          }
        }
      },
      { new: true }
    );

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // 3. Return success response
    res.status(200).json({
      status: 'success',
      message: 'Contest removed successfully',
      data: {
        savedContests: user.savedContests
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's saved contests array
// @route   GET /api/contests/saved
// @access  Private
exports.getSavedContests = async (req, res, next) => {
  try {
    // req.user has already been populated by the protect middleware.
    // We can fetch the fresh user details from the database or read from req.user.
    // Fetching from DB ensures we have the absolute latest sync data.
    const user = await User.findById(req.user._id).select("savedContests");

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: {
        savedContests: user.savedContests
      }
    });

  } catch (error) {
    next(error);
  }
};
