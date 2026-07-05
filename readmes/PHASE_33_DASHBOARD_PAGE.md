# Phase 33: Dashboard Page Implementation Documentation

This phase implements the User Dashboard view in the React frontend, fetching profile parameters, bookmarks, and preferences from `/api/dashboard`.

---

## 🖥️ Page Component: `Dashboard.jsx`

Created in [src/pages/Dashboard.jsx](file:///d:/CP-Scheduler/src/pages/Dashboard.jsx):

- **API Request**: Performs `API.get('/dashboard')` using the configured Axios client with request interceptors that automatically supply Bearer headers.
- **States**:
  - `loading`: Displays `Loading Dashboard...` while waiting for the MERN server.
  - `error`: Displays `Unable to load dashboard.` if auth fails, the token is invalid, or a network exception occurs.
- **Structured Rendering**:
  - Prints personal welcome message (`fullName`).
  - Displays linked CP handles (LeetCode, Codeforces, CodeChef).
  - Displays bookmarks statistic count (`savedContests.length`).
  - Shows Nodemailer configuration variables (`emailEnabled` and `minutesBefore`).

---

## 💡 Code Sections Explained

1. **`import API from '../services/api';`**: Imports our configured Axios client which transparently handles token injection.
2. **`useEffect(() => { ... }, []);`**: Fetches the dashboard payload immediately upon mounting.
3. **`userData.savedContests.length`**: Dynamically calculates and displays the count of saved bookmarks.
4. **`userData.reminderSettings.emailEnabled`**: Conditionally renders visual statuses (`🟢 Enabled` vs `🔴 Disabled`) to declare the email alerts preference.
