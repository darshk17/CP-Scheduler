# Phase 55: MongoDB Query Indexing Optimization Documentation

This phase implements indexing paths inside the User schema to optimize search query performance on MERN database levels.

---

## 🛠️ Modified Files

### 1. Database Model: `User.js` (Updated)
Modified [server/models/User.js](file:///d:/CP-Scheduler/server/models/User.js):
- **Single Path Indexing**: Defines a unique search index on `'savedContests.contestId'` to speed up contest toggle checks and bookmark validation queries.
  ```javascript
  userSchema.index({ 'savedContests.contestId': 1 });
  ```
- **Compound Path Indexing**: Defines a compound index on `{ 'reminderSettings.emailEnabled': 1, 'savedContests.contestId': 1 }` to optimize candidate scanner queries inside the background matching engine.
  ```javascript
  userSchema.index({
    'reminderSettings.emailEnabled': 1,
    'savedContests.contestId': 1
  });
  ```
