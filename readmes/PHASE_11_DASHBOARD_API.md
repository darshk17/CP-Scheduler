# Phase 11: Dashboard API Documentation

This phase implements a secure dashboard endpoint `GET /api/dashboard` to return the user's statistics, usernames, and saved contests context for their personal dashboard view.

---

## 🛠 Controller Implementation: `dashboardController.js`

We created the dashboard controller in [server/controllers/dashboardController.js](file:///d:/CP-Scheduler/server/controllers/dashboardController.js) to compile and return the authenticated user's profile details, competitive programming usernames, saved contests, and reminder preferences:

```javascript
exports.getDashboardData = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePicture: user.profilePicture
        },
        cpUsernames: {
          leetcode: user.leetcodeUsername || '',
          codeforces: user.codeforcesUsername || '',
          codechef: user.codechefUsername || ''
        },
        savedContests: user.savedContests || [],
        reminderPreferences: user.reminderPreferences || {
          emailEnabled: true,
          minutesBefore: 30
        }
      }
    });
  } catch (error) {
    console.error('Dashboard Data Error:', error);
    res.status(500).json({ message: 'Server error retrieving dashboard data' });
  }
};
```

---

## 📍 Route Mapping & Route Protection: `dashboardRoutes.js`

The route is defined in [server/routes/dashboardRoutes.js](file:///d:/CP-Scheduler/server/routes/dashboardRoutes.js) and protected using the `protect` middleware:

```javascript
const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDashboardData);

module.exports = router;
```

It is mounted in [server/server.js](file:///d:/CP-Scheduler/server/server.js):
```javascript
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);
```

---

## 📡 Endpoint Design Explanation

### `GET /api/dashboard`
- **Method**: `GET`
- **Authentication**: Required (`Authorization: Bearer <token>`)
- **Rest Design Principles**:
  - Treats the "dashboard" as a virtual resource representation that aggregates key metadata related to the logged-in user session.
  - Returns a standard envelope structure `{ status: 'success', data: { ... } }`.
  - Excludes sensitive fields (e.g. `password` hash) for security.
