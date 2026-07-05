const express = require('express');
const router = express.Router();

// Import controller functions
const { saveContest, removeSavedContest, getSavedContests } = require('../controllers/contestController');
const { getUpcomingContests } = require('../services/contestService');

// Public route to fetch normalized upcoming contests list from backend services
router.get('/', async (req, res, next) => {
  try {
    const contests = await getUpcomingContests();
    res.status(200).json({
      status: 'success',
      data: {
        contests
      }
    });
  } catch (error) {
    next(error);
  }
});

// Import authentication guard middleware
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware globally to all contest routes defined in this router
router.use(protect);

/**
 * @route   POST /api/contests/save
 * @desc    Bookmark a contest (saves contestId for the user)
 * @access  Private
 */
router.post('/save', saveContest);

/**
 * @route   DELETE /api/contests/save
 * @desc    Remove a bookmarked contest from the user's list
 * @access  Private
 */
router.delete('/save', removeSavedContest);

/**
 * @route   GET /api/contests/saved
 * @desc    Fetch all bookmarked contests for the user
 * @access  Private
 */
router.get('/saved', getSavedContests);

module.exports = router;
