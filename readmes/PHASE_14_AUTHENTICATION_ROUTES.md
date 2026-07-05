# Phase 14: Authentication Routes Documentation

This phase implements clean Express routes for the user authentication lifecycle, establishing entrypoints for registration, login, profile retrieval, and session termination.

---

## 📍 Route Definitions: `authRoutes.js`

Defined in [server/routes/authRoutes.js](file:///d:/CP-Scheduler/server/routes/authRoutes.js):

```javascript
const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', register);
router.post('/login', login);

// Private/Protected endpoints
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
```

---

## 📡 REST API Naming Conventions Explanation

REST (Representational State Transfer) structures communications based on clean, resource-centric conventions:

1. **Use Nouns, Not Verbs for Resources**: Endpoints should represent resources (e.g. `/users`, `/contests`) rather than actions (e.g. `/getUsers`, `/createContest`).
2. **Represent Actions via HTTP Methods**:
   - `GET` to retrieve resources.
   - `POST` to create resources (or submit actions).
   - `PUT`/`PATCH` to modify resources.
   - `DELETE` to remove resources.
3. **Pluralize Resource Names**: `/api/users` is preferred over `/api/user` to maintain database-collection alignment.
4. **Special Non-Resource Actions (like Auth)**: Authentication endpoints like `/login` or `/logout` are exceptions. Because they represent operations rather than persistent resources, we map them as POST requests (as they modify authentication state and send sensitive credentials safely in the request body).
5. **Use Sub-Resources for Relationships**: If fetching contests belonging to a specific user, use `/api/users/:userId/contests`.
