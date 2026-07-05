import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the Context object
const AuthContext = createContext();

// Define API base URL
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  
  // New state to manage the user's bookmarked saved contests list
  const [savedContests, setSavedContests] = useState([]);

  // Fetch all bookmarked contests from the backend
  const getSavedContests = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/contests/saved`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSavedContests(data.data.savedContests);
      }
    } catch (error) {
      console.error('Failed to fetch saved contests:', error);
    }
  };

  // Automatically fetch saved contests on login/startup
  useEffect(() => {
    if (user && token) {
      getSavedContests();
    } else {
      setSavedContests([]);
    }
  }, [user, token]);

  // Load user profile on startup if token exists in localStorage
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          setUser(data.data.user);
        } else {
          // Token is invalid/expired, clear it
          logout();
        }
      } catch (error) {
        console.error('Auto-login verification failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Log in user
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and user details on successful login
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Log out user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setSavedContests([]);
  };

  // Register a new user
  const registerUser = async (fullName, email, password, leetcodeUsername, codeforcesUsername, codechefUsername) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          leetcodeUsername,
          codeforcesUsername,
          codechefUsername
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Save a contest bookmark
  const saveContest = async (contestId) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/contests/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contestId })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setSavedContests(data.data.savedContests);
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to save contest');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Remove a contest bookmark
  const removeSavedContest = async (contestId) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const response = await fetch(`${API_URL}/contests/save`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ contestId })
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setSavedContests(data.data.savedContests);
        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to remove contest');
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Provide state values and control functions globally
  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      savedContests, 
      login, 
      logout, 
      registerUser, 
      saveContest, 
      removeSavedContest, 
      getSavedContests 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to consume Auth Context values cleanly
export const useAuth = () => {
  return useContext(AuthContext);
};
