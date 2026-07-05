# Phase 23: React Authentication Context Documentation

This phase implements the global authentication state manager using React Context API.

---

## 🏗️ State Provider: `AuthContext.jsx`

Created in [src/context/AuthContext.jsx](file:///d:/CP-Scheduler/src/context/AuthContext.jsx):

- **State Hooks**:
  - `user`: Stores the current authenticated user's profile details.
  - `token`: Stores the active session JWT.
  - `loading`: Tracks user profile load status on page refresh.
- **Operations**:
  - `login(email, password)`: Queries `/api/auth/login` to fetch credentials, saving the returned JWT to `localStorage`.
  - `logout()`: Clears token storage and resets the state.
  - `registerUser(...)`: Sends sign-up parameters to `/api/auth/register`.
  - **Auto-Login Check**: Runs on mount inside `useEffect` to fetch user profile details via `/api/auth/me` if a token is present in local storage.

---

## 💡 Important Lines Explained

1. **`const AuthContext = createContext();`**: Initializes a React Context object to share states across nested elements without manual prop-drilling.
2. **`const [token, setToken] = useState(localStorage.getItem('token') || null);`**: Initializes the state with the token saved in `localStorage` to keep the user signed in across page reloads.
3. **`useEffect(() => { ... }, [token]);`**: An effect hook that automatically verifies the token signature on startup by calling the `/api/auth/me` endpoint.
4. **`headers: { 'Authorization': `Bearer ${token}` }`**: Standard Bearer authorization header sent to let the backend middleware verify the session.
5. **`export const useAuth = () => useContext(AuthContext);`**: Exposes a custom hooks utility to easily consume the context states inside other components (e.g. `const { user, login } = useAuth()`).
