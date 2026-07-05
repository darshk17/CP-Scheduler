# Phase 50: Reminder Settings Management Documentation

This phase implements user preference management for automated contest alerts on the MERN backend and React dashboard client.

---

## 🛠️ Modified and Added Files

### 1. Backend Controller: `userController.js` (New)
Created in [server/controllers/userController.js](file:///d:/CP-Scheduler/server/controllers/userController.js):
- Validates the incoming body properties (ensures `minutesBefore` is one of `10, 15, 30, 45, 60`).
- Updates `reminderSettings` inside MongoDB using `$set`.
- Returns the updated settings object.

### 2. Routes: `userRoutes.js` (New)
Created in [server/routes/userRoutes.js](file:///d:/CP-Scheduler/server/routes/userRoutes.js):
- Configures `PUT /reminders` mapped to the new update controller, protected globally by auth middleware.

### 3. API Entrypoint Router: `routes/index.js` (Updated)
Modified [server/routes/index.js](file:///d:/CP-Scheduler/server/routes/index.js) to import and register the user settings routes under the `/users` prefix:
```javascript
const userRoutes = require('./userRoutes');
router.use('/users', userRoutes);
```

### 4. React Frontend Dashboard: `Dashboard.jsx` (Updated)
Modified [src/pages/Dashboard.jsx](file:///d:/CP-Scheduler/src/pages/Dashboard.jsx):
- Introduces `emailEnabled`, `minutesBefore`, `savingSettings`, and `settingsSuccess` states.
- Instantiates a synchronization `useEffect` that updates local states when `userData` is fetched.
- Implements `handleSaveSettings(e)` which executes a `PUT /api/users/reminders` request on form submit, showing success messages and mutably updating user details on success.
- Card 4 renders checkbox toggles and selection dropdown lists mapping to permitted thresholds.
