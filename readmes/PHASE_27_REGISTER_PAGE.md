# Phase 27: Register Page Documentation

This phase implements the user registration form page in the React frontend, allowing new users to sign up and configure optional CP platform usernames.

---

## 🖥️ Page Component: `Register.jsx`

Created in [src/pages/Register.jsx](file:///d:/CP-Scheduler/src/pages/Register.jsx):

- **State Hooks**:
  - `fullName`, `email`, `password`: Core details.
  - `leetcodeUsername`, `codeforcesUsername`, `codechefUsername`: Optional profile fields.
  - `error`, `success`, `loading`: Form state feedbacks.
- **Operations**:
  - `handleSubmit(e)`: Calls `registerUser(...)` from the auth context. On success, displays a green success confirmation, blocks submissions, and redirects the user to `/login` after `1.5` seconds.

---

## 💡 Code Sections Explained

1. **`const { registerUser } = useAuth();`**: Retrieves the backend API submission wrapper from the global `AuthContext`.
2. **`setTimeout(() => { navigate('/login'); }, 1500);`**: Generates a standard UX pause. Shows the user the successful registration state before moving them to the login screen.
3. **`className="form-row"`**: Uses CSS grid rows to place LeetCode and Codeforces fields side-by-side on desktop views while stacking on mobile.
4. **`className="add-event-form"`**: Reuses the core card layouts, inputs, and borders established in `hackathons.css` to preserve the visual design system.
