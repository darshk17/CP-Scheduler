import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const getFirstName = () => {
    if (!user || !user.fullName) return 'User';
    return user.fullName.split(' ')[0];
  };

  return (
    <header style={{ position: 'relative' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', gap: '16px' }}>
        
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none' }} className="logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-bracket">{"{"}</span>
          <span className="logo-text">CP Scheduler</span>
          <span className="logo-bracket">{"}"}</span>
        </NavLink>

        {/* 1. Desktop Nav Links (>1024px) */}
        {user ? (
          <nav className="nav-links nav-desktop-only" style={{ display: 'flex', gap: '4px', flexGrow: 1 }}>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
              Contests
            </NavLink>
            <NavLink to="/hackathons" className={({ isActive }) => isActive ? 'active' : ''}>
              Events
            </NavLink>
          </nav>
        ) : (
          <nav className="nav-links nav-desktop-only" style={{ display: 'flex', gap: '4px', flexGrow: 1 }}>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
              Contests
            </NavLink>
            <NavLink to="/hackathons" className={({ isActive }) => isActive ? 'active' : ''}>
              Events
            </NavLink>
          </nav>
        )}

        {/* 2. Tablet Nav Links (768px - 1024px) */}
        {user ? (
          <nav className="nav-links nav-tablet-only" style={{ display: 'flex', gap: '4px', flexGrow: 1 }}>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              Dashboard
            </NavLink>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
              Contests
            </NavLink>
          </nav>
        ) : (
          <nav className="nav-links nav-tablet-only" style={{ display: 'flex', gap: '4px', flexGrow: 1 }}>
            <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>
              Contests
            </NavLink>
          </nav>
        )}

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* User Profile Dropdown Menu (Desktop-only) */}
          {user ? (
            <div className="nav-desktop-only" style={{ position: 'relative' }}>
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600
                }}
              >
                👤 {getFirstName()} <span style={{ fontSize: '0.6rem' }}>▼</span>
              </button>
              {menuOpen && (
                <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 0', zIndex: 200, display: 'flex', flexDirection: 'column', minWidth: '140px', boxShadow: 'var(--shadow)' }}>
                  <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} style={{ padding: '8px 16px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }} className={({ isActive }) => isActive ? 'active' : ''}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} style={{ padding: '8px 16px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                    Profile
                  </NavLink>
                  <button onClick={handleLogout} style={{ padding: '8px 16px', color: 'var(--text-secondary)', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', width: '100%' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-desktop-only" style={{ display: 'flex', gap: '4px' }}>
              <NavLink to="/login" className="nav-link-btn" style={{ textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid transparent' }}>
                Login
              </NavLink>
              <NavLink to="/register" className="nav-link-btn" style={{ textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid transparent' }}>
                Register
              </NavLink>
            </div>
          )}

          {/* Hamburger Menu (Tablet & Mobile only) */}
          <button 
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              width: '38px',
              height: '38px',
              cursor: 'pointer',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>

          {/* Theme Toggle */}
          <div className="theme-toggle">
            <button id="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark/light mode">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="light-icon">
                <path
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
                </path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark-icon">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>

        </div>

      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="mobile-drawer"
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 150,
            boxShadow: 'var(--shadow)'
          }}
        >
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                Dashboard
              </NavLink>
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }} end>
                Contests
              </NavLink>
              <NavLink to="/hackathons" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                Events
              </NavLink>
              <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                Profile
              </NavLink>
              <button onClick={handleLogout} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', background: 'none', border: 'none', textAlign: 'left', padding: '8px 12px', cursor: 'pointer', width: '100%' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }} end>
                Contests
              </NavLink>
              <NavLink to="/hackathons" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                Events
              </NavLink>
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                Login
              </NavLink>
              <NavLink to="/register" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)', textDecoration: 'none', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
