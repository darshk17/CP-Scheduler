# Phase 31: React AuthContext Extension Documentation

This phase extends the global state provider [AuthContext.jsx](file:///d:/CP-Scheduler/src/context/AuthContext.jsx) to manage user bookmarks/saved contests.

---

## 🛠️ Extended Features in `AuthContext`

### 1. Saved Contests State
```javascript
const [savedContests, setSavedContests] = useState([]);
```
Stores the active array of bookmarks containing objects with `contestId` and `savedAt` timestamp fields.

### 2. Auto-Fetch Trigger
```javascript
useEffect(() => {
  if (user && token) {
    getSavedContests();
  } else {
    setSavedContests([]);
  }
}, [user, token]);
```
An effect hook that detects when a user logs in, logs out, or is auto-authenticated, triggering an request to fetch all active bookmarks from MongoDB.

### 3. API Actions Exposed
- `saveContest(contestId)`: `POST /api/contests/save` to save a contest. Updates the local state with the returned fresh array of bookmarks.
- `removeSavedContest(contestId)`: `DELETE /api/contests/save` to unsave a contest. Updates local state.
- `getSavedContests()`: `GET /api/contests/saved` to fetch active bookmarks.
