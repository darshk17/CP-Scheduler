# Phase 32: Contest Card Save Button Documentation

This phase implements the interactive Save / Bookmark button on contest cards inside the React frontend.

---

## 🛠️ Card Component: `ContestCard.jsx`

Modified [src/components/ContestCard.jsx](file:///d:/CP-Scheduler/src/components/ContestCard.jsx):

```jsx
import { useAuth } from '../context/AuthContext';

export default function ContestCard({ contest, index }) {
  const { savedContests, saveContest, removeSavedContest, user } = useAuth();

  const isSaved = savedContests ? savedContests.some(item => item.contestId === contest.id) : false;

  const handleToggleSave = async (e) => {
    e.preventDefault();
    if (isSaved) {
      await removeSavedContest(contest.id);
    } else {
      await saveContest(contest.id);
    }
  };

  // Render logic mounts conditional button beside "Register ->" link
}
```

---

## 💡 Modifications Explained

1. **State Injection**: Consumes global context bookmarks (`savedContests`) and trigger hooks (`saveContest`, `removeSavedContest`).
2. **Dynamic Check (`isSaved`)**: Uses `some` array validator to check if `contest.id` exists inside the user's active bookmark list.
3. **Visibility Constraint**: Wraps the Save button in a `{user && ...}` block so anonymous guests never see the bookmark action.
4. **Clean UI Transitions**: Toggle actions call the state handlers directly. The React context state propagates changes, altering button text/emojis (`🤍 Save` vs `❤️ Saved`) instantly without full page reloads.
