const User = require('../models/User');
const { getCodeforcesProfile } = require('../services/codeforcesService');
const { getLeetCodeProfile } = require('../services/leetcodeService');

// @desc    Get user's Codeforces statistics from the official API and cache in MongoDB
// @route   GET /api/cp/codeforces
// @access  Private
exports.getCodeforcesStats = async (req, res, next) => {
  try {
    const username = req.user.codeforcesUsername;

    if (!username) {
      const error = new Error('No Codeforces username connected to this account');
      error.statusCode = 400;
      return next(error);
    }

    const profile = await getCodeforcesProfile(username);

    if (!profile) {
      const error = new Error(`Codeforces profile not found for handle: ${username}`);
      error.statusCode = 404;
      return next(error);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'cpStats.codeforces': {
            handle: profile.handle,
            rating: profile.rating,
            maxRating: profile.maxRating,
            rank: profile.rank,
            maxRank: profile.maxRank,
            lastUpdated: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: {
        profile: updatedUser.cpStats.codeforces
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Trigger a manual refresh of Codeforces statistics and update database
// @route   POST /api/cp/codeforces/refresh
// @access  Private
exports.refreshCodeforcesStats = async (req, res, next) => {
  try {
    const username = req.user.codeforcesUsername;

    if (!username) {
      const error = new Error('No Codeforces username connected to this account');
      error.statusCode = 400;
      return next(error);
    }

    const profile = await getCodeforcesProfile(username);

    if (!profile) {
      const error = new Error(`Unable to fetch Codeforces profile for handle: ${username}`);
      error.statusCode = 404;
      return next(error);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'cpStats.codeforces': {
            handle: profile.handle,
            rating: profile.rating,
            maxRating: profile.maxRating,
            rank: profile.rank,
            maxRank: profile.maxRank,
            lastUpdated: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      status: 'success',
      data: {
        profile: updatedUser.cpStats.codeforces
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get user's LeetCode statistics and cache in MongoDB
// @route   GET /api/cp/leetcode
// @access  Private
exports.getLeetcodeStats = async (req, res, next) => {
  try {
    // Read the authenticated user's LeetCode handle
    const username = req.user.leetcodeUsername;

    // 1. Validation: Ensure LeetCode handle is connected
    if (!username) {
      const error = new Error('No LeetCode username connected to this account');
      error.statusCode = 400;
      return next(error);
    }

    // 2. Query statistics from LeetCode GraphQL service
    const profile = await getLeetCodeProfile(username);

    // 3. Handle invalid/unfound profiles
    if (!profile) {
      const error = new Error(`LeetCode profile not found for username: ${username}`);
      error.statusCode = 404;
      return next(error);
    }

    // 4. Save statistics in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          'cpStats.leetcode': {
            username: profile.username,
            totalSolved: profile.totalSolved,
            easySolved: profile.easySolved,
            mediumSolved: profile.mediumSolved,
            hardSolved: profile.hardSolved,
            ranking: profile.ranking,
            lastUpdated: new Date()
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // 5. Return the cached profile details
    res.status(200).json({
      status: 'success',
      data: {
        profile: updatedUser.cpStats.leetcode
      }
    });

  } catch (error) {
    next(error);
  }
};