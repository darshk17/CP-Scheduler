# Phase 25: Login Page Integration Documentation

This phase implements the Login view page inside the React frontend, binding to the global `useAuth` hook and reusing theme-level styles.

---

## 🖥️ Page Component: `Login.jsx`

Created in [src/pages/Login.jsx](file:///d:/CP-Scheduler/src/pages/Login.jsx):

```javascript
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  // UI layout mapping style classes
  ...
}
```

---

## 💡 Code Sections Explained

1. **`const { login } = useAuth();`**: Retrieves the asynchronous login request method declared in our global `AuthContext`.
2. **`const navigate = useNavigate();`**: Imports React Router's navigation function to forward users to the Home dashboard (`/`) after validating credentials.
3. **`className="add-event-form"`**: Reuses the clean card formatting and border layout defined in the theme CSS (`hackathons.css`).
4. **`className="add-event-button"`**: Standardizes submit button visuals (borders, gradients, and hover transitions) with the rest of the application.
5. **`<Link to="/register">`**: Employs React Router declarative navigation link to redirect visitors to register without triggering hard browser reloads.
