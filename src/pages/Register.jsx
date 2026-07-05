import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [codeforcesUsername, setCodeforcesUsername] = useState('');
  const [codechefUsername, setCodechefUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await registerUser(
      fullName,
      email,
      password,
      leetcodeUsername,
      codeforcesUsername,
      codechefUsername
    );

    setLoading(false);

    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      // Wait 1.5 seconds and redirect
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <main className="container" style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section className="register-section" style={{ width: '100%', maxWidth: '500px', margin: '40px 0' }}>
        {/* Section title matches login page formatting */}
        <div className="section-label" style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 600 }}>📝 Register Account</div>

        {/* Reuses add-event-form layout */}
        <form className="add-event-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: 'var(--red)', background: 'rgba(246, 104, 94, 0.1)', border: '1px solid var(--red)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div style={{ color: 'var(--green)', background: 'rgba(62, 207, 142, 0.1)', border: '1px solid var(--green)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              ✅ {success}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password * (Min 6 characters)</label>
            <input
              type="password"
              id="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Optional Username Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="leetcode">LeetCode Username</label>
              <input
                type="text"
                id="leetcode"
                placeholder="Optional"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="codeforces">Codeforces Username</label>
              <input
                type="text"
                id="codeforces"
                placeholder="Optional"
                value={codeforcesUsername}
                onChange={(e) => setCodeforcesUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="codechef">CodeChef Username</label>
            <input
              type="text"
              id="codechef"
              placeholder="Optional"
              value={codechefUsername}
              onChange={(e) => setCodechefUsername(e.target.value)}
            />
          </div>

          <button type="submit" className="add-event-button" disabled={loading} style={{ width: '100%', alignSelf: 'stretch', marginTop: '8px' }}>
            <span>{loading ? 'Registering...' : 'Register'}</span>
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
