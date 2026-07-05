# Phase 28: Header Authentication Integration Documentation

This phase integrates dynamic session indicators (Welcome message, Dashboard, and Logout options) in the navbar header.

---

## 🛠️ Nav Component: `Header.jsx`

Modified [src/components/Header.jsx](file:///d:/CP-Scheduler/src/components/Header.jsx):

```jsx
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Rendering logic:
  // - Keeps bracket logo and theme switches intact.
  // - Maps conditional nav links depending on `user` state.
}
```

---

## 💡 Modifications Explained

1. **Consumer Setup**:
   - `const { user, logout } = useAuth();` fetches active user profiles and the session logout action.
   - `useNavigate` allows executing page forwards programmatically.
2. **Conditional Branches**:
   - **Anonymous View**: If `user` is null, displays `Login` and `Register` links.
   - **Authenticated View**: If `user` contains values, displays a link to the `Dashboard`, prints `"Welcome, {fullName}"` for customization, and mounts a `Logout` button.
3. **Session Cleared**: Pressing the Logout button fires `logout()` (which removes the local token) and runs `navigate('/')` to cleanly reset the page context.
