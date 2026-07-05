# Phase 30: Contest Routes Documentation

This phase implements private Express routes for saving, removing, and retrieving bookmarked competitive programming contests.

---

## 📍 Route Definitions: `contestRoutes.js`

Created in [server/routes/contestRoutes.js](file:///d:/CP-Scheduler/server/routes/contestRoutes.js):

```javascript
const express = require('express');
const router = express.Router();
const { saveContest, removeSavedContest, getSavedContests } = require('../controllers/contestController');
const { protect } = require('../middleware/authMiddleware');

// Apply protect middleware globally to all contest routes defined in this router
router.use(protect);

router.post('/save', saveContest);
router.delete('/save', removeSavedContest);
router.get('/saved', getSavedContests);

module.exports = router;
```

---

## 💡 Code Lines Explained

1. **`const router = express.Router();`**: Initializes a mini-Express application router dedicated entirely to contest bookmarking routes.
2. **`router.use(protect);`**: Injects the `protect` authentication middleware globally into this router scope. Every request reaching this file must contain a valid Bearer JWT token, shielding all endpoints without repeating `protect` on each definition.
3. **`router.delete('/save', removeSavedContest);`**: Maps the `DELETE` HTTP action to `/save` to represent the removal of a resource representation (unsaving the contest ID).
4. **`module.exports = router;`**: Exports the router to be registered inside the unified API routing layer.
