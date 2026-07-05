# Phase 40: Codeforces MongoDB Sync Documentation

This phase implements database caching for Codeforces profile queries, reducing external API hits and enabling fast local queries.

---

## 🛠️ Modified Files

### 1. User Model: `User.js`
Modified [server/models/User.js](file:///d:/CP-Scheduler/server/models/User.js) to define the `cpStats` sub-document:
```javascript
cpStats: {
  codeforces: {
    handle: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    maxRating: { type: Number, default: 0 },
    rank: { type: String, default: 'unrated' },
    maxRank: { type: String, default: 'unrated' },
    lastUpdated: { type: Date }
  }
}
```

### 2. Controller: `cpController.js`
Modified [server/controllers/cpController.js](file:///d:/CP-Scheduler/server/controllers/cpController.js):
- Fires request to `getCodeforcesProfile(username)`.
- On successful fetch, runs a MongoDB update query:
  ```javascript
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { 'cpStats.codeforces': { ...profile, lastUpdated: new Date() } } },
    { new: true }
  );
  ```
- Returns the updated Codeforces profile containing `lastUpdated` timestamp.
