import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Consume auth context actions
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Call login from AuthContext
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Navigate to Home on success
      navigate('/dashboard');
    } else {
      // Display error message from backend
      setError(result.error || 'Invalid credentials');
    }
  };

  return (
    <main className="container" style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section className="login-section" style={{ width: '100%', maxWidth: '400px', margin: '40px 0' }}>
        {/* Page header displaying label styling */}
        <div className="section-label" style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>🔒 Login to CP Scheduler</div>

        {/* Reuses existing add-event-form style layouts */}
        <form className="add-event-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: 'var(--red)', background: 'rgba(246, 104, 94, 0.1)', border: '1px solid var(--red)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form control input groups */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login submission button reusing add-event-button styles */}
          <button type="submit" className="add-event-button" disabled={loading} style={{ width: '100%', alignSelf: 'stretch', marginTop: '8px' }}>
            <span>{loading ? 'Logging in...' : 'Login'}</span>
          </button>

          {/* Route redirect link footer */}
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
