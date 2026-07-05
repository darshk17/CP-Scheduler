# Phase 43: Codeforces Manual Refresh Documentation

This phase implements the manual Codeforces stats synchronization feature, allowing users to trigger live rating updates directly from the dashboard card.

---

## 🛠️ Modified Files

### 1. Backend Controller: `cpController.js` (Updated)
Created the `refreshCodeforcesStats` handler in [server/controllers/cpController.js](file:///d:/CP-Scheduler/server/controllers/cpController.js) and mapped it to the `POST /api/cp/codeforces/refresh` endpoint in [server/routes/cpRoutes.js](file:///d:/CP-Scheduler/server/routes/cpRoutes.js).
- Performs the same sync query as the retrieval handler, updating the database record.

### 2. Frontend Page: `Dashboard.jsx` (Updated)
Modified [src/pages/Dashboard.jsx](file:///d:/CP-Scheduler/src/pages/Dashboard.jsx):
- Added `refreshing` boolean state to block double-triggers.
- Implemented `handleRefreshStats()`:
  ```javascript
  const response = await API.post('/cp/codeforces/refresh');
  // Mutates local state to display the updated profile without page reload:
  setUserData((prev) => ({ ...prev, cpStats: { ...prev.cpStats, codeforces: response.data.data.profile } }));
  ```
- Appended the styled `add-event-button` inside the Codeforces statistics card view.
