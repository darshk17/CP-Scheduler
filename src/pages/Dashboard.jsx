import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [minutesBefore, setMinutesBefore] = useState(30);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [profileName, setProfileName] = useState('');
  const [cfUsername, setCfUsername] = useState('');
  const [lcUsername, setLcUsername] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  // Sync profile details local states when userData is loaded
  useEffect(() => {
    if (userData) {
      setProfileName(userData.fullName || '');
      setCfUsername(userData.codeforcesUsername || '');
      setLcUsername(userData.leetcodeUsername || '');
    }
  }, [userData]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileSuccess('');
      const response = await API.put('/users/profile', {
        fullName: profileName,
        codeforcesUsername: cfUsername,
        leetcodeUsername: lcUsername
      });
      if (response.data && response.data.status === 'success') {
        const updatedUser = response.data.data.user;

        // Automatically trigger refreshes for Codeforces & LeetCode if usernames exist
        let cfProfile = updatedUser.cpStats?.codeforces || null;
        let lcProfile = updatedUser.cpStats?.leetcode || null;

        if (updatedUser.codeforcesUsername) {
          try {
            const cfResponse = await API.post('/cp/codeforces/refresh');
            if (cfResponse.data && cfResponse.data.status === 'success') {
              cfProfile = cfResponse.data.data.profile;
            }
          } catch (cfErr) {
            console.error('Failed to auto-refresh Codeforces stats:', cfErr);
          }
        }

        if (updatedUser.leetcodeUsername) {
          try {
            const lcResponse = await API.get('/cp/leetcode');
            if (lcResponse.data && lcResponse.data.status === 'success') {
              lcProfile = lcResponse.data.data.profile;
            }
          } catch (lcErr) {
            console.error('Failed to auto-refresh LeetCode stats:', lcErr);
          }
        }

        setProfileSuccess('Profile updated successfully');

        setUserData({
          ...updatedUser,
          cpStats: {
            ...updatedUser.cpStats,
            codeforces: cfProfile,
            leetcode: lcProfile
          }
        });
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // Sync reminder preferences local state when userData is loaded
  useEffect(() => {
    if (userData && userData.reminderSettings) {
      setEmailEnabled(userData.reminderSettings.emailEnabled);
      setMinutesBefore(userData.reminderSettings.minutesBefore);
    }
  }, [userData]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      setSettingsSuccess('');
      const response = await API.put('/users/reminders', {
        emailEnabled,
        minutesBefore
      });
      if (response.data && response.data.status === 'success') {
        setSettingsSuccess('Settings saved successfully!');
        setUserData((prev) => ({
          ...prev,
          reminderSettings: response.data.data.reminderSettings
        }));
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/dashboard');
      if (response.data && response.data.status === 'success') {
        setUserData(response.data.data.user);
      } else {
        setError('Unable to load dashboard.');
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefreshStats = async () => {
    try {
      setRefreshing(true);
      let cfProfile = userData.cpStats?.codeforces || null;
      let lcProfile = userData.cpStats?.leetcode || null;

      // 1. Refresh Codeforces stats if username is set
      if (userData.codeforcesUsername) {
        const cfResponse = await API.post('/cp/codeforces/refresh');
        if (cfResponse.data && cfResponse.data.status === 'success') {
          cfProfile = cfResponse.data.data.profile;
        }
      }

      // 2. Refresh LeetCode stats if username is set (GET acts as refresh + retrieve)
      if (userData.leetcodeUsername) {
        const lcResponse = await API.get('/cp/leetcode');
        if (lcResponse.data && lcResponse.data.status === 'success') {
          lcProfile = lcResponse.data.data.profile;
        }
      }

      // 3. Update the state with the fresh statistics
      setUserData((prev) => ({
        ...prev,
        cpStats: {
          ...prev.cpStats,
          codeforces: cfProfile,
          leetcode: lcProfile
        }
      }));
    } catch (err) {
      console.error('Failed to refresh stats:', err);
      alert(err.response?.data?.message || 'Failed to refresh statistics');
    } finally {
      setRefreshing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="container" style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>Loading Dashboard...</div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="container" style={{ minHeight: 'calc(100vh - 128px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ color: 'var(--red)', background: 'rgba(246, 104, 94, 0.1)', border: '1px solid var(--red)', padding: '16px', borderRadius: 'var(--radius)' }}>
          ⚠️ {error}
        </div>
        <button 
          onClick={fetchDashboard}
          className="add-event-button"
          style={{ padding: '8px 24px' }}
        >
          Try Again
        </button>
      </main>
    );
  }

  // Calculate connected platforms count
  const connectedPlatformsCount = [
    userData.leetcodeUsername,
    userData.codeforcesUsername,
    userData.codechefUsername
  ].filter(Boolean).length;

  // Calculate last sync date from the most recent of either CF or LeetCode updates
  const lastSyncDate = (() => {
    const dates = [
      userData.cpStats?.codeforces?.lastUpdated,
      userData.cpStats?.leetcode?.lastUpdated
    ].filter(Boolean).map(d => new Date(d));
    if (dates.length === 0) return 'Never';
    return new Date(Math.max(...dates)).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  })();

  return (
    <main className="container" style={{ padding: '40px 24px', minHeight: 'calc(100vh - 128px)' }}>
      
      {/* SaaS Welcome Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Welcome back, {userData.fullName.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0 0', fontSize: '0.92rem' }}>
          Here is an overview of your competitive programming statistics and schedule alerts.
        </p>
      </div>

      {/* Row 1: Top Dashboard Cards (Profile, LeetCode, Codeforces) */}
      <div className="dashboard-grid-top">
        
        {/* Card 1: User Profile Summary (Compact) */}
        <div className="add-event-form dashboard-card-profile" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-bright)', borderBottom: '1px solid var(--border)', paddingBottom: '10px', margin: 0, fontWeight: 700 }}>
            👤 Profile Summary
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Full Name</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{userData.fullName}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Email Address</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{userData.email}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Account Role</span>
              <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize', fontWeight: 600 }}>{userData.role}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>Integrations</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{connectedPlatformsCount} Platform{connectedPlatformsCount !== 1 ? 's' : ''} Linked</span>
            </div>
          </div>
        </div>

        {/* Card 2: LeetCode Statistics (Largest Card) */}
        <div className="add-event-form dashboard-card-leetcode" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--lc)', margin: 0, fontWeight: 700 }}>
              ⚡ LeetCode Profile
            </h3>
            {userData.cpStats?.leetcode?.username && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                @{userData.cpStats.leetcode.username}
              </span>
            )}
          </div>

          {!userData.cpStats?.leetcode?.username ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '16px 0', textAlign: 'center' }}>
              Connect your LeetCode account to view statistics.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              
              {/* Primary Highlight */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-bright)', lineHeight: 1 }}>
                  {userData.cpStats.leetcode.totalSolved}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Problems Solved
                </span>
              </div>

              {/* Badges/Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ background: 'rgba(62, 207, 142, 0.12)', color: 'var(--green)', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Easy: {userData.cpStats.leetcode.easySolved}
                </span>
                <span style={{ background: 'rgba(245, 197, 66, 0.12)', color: 'var(--yellow)', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Medium: {userData.cpStats.leetcode.mediumSolved}
                </span>
                <span style={{ background: 'rgba(246, 104, 94, 0.12)', color: 'var(--red)', padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Hard: {userData.cpStats.leetcode.hardSolved}
                </span>
              </div>

              {/* Global Rank */}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                Global Rank: <strong style={{ color: 'var(--text-primary)' }}>#{userData.cpStats.leetcode.ranking.toLocaleString()}</strong>
              </div>

              {/* Sync controls */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated: {lastSyncDate}</span>
                <button
                  onClick={handleRefreshStats}
                  disabled={refreshing}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition)'
                  }}
                >
                  {refreshing ? 'Syncing...' : 'Sync'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Codeforces Statistics */}
        <div className="add-event-form dashboard-card-codeforces" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--cf)', margin: 0, fontWeight: 700 }}>
              🔴 Codeforces Profile
            </h3>
            {userData.cpStats?.codeforces?.handle && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                @{userData.cpStats.codeforces.handle}
              </span>
            )}
          </div>

          {!userData.cpStats?.codeforces?.handle ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '16px 0', textAlign: 'center' }}>
              Connect your Codeforces account to view statistics.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
              
              {/* Primary Highlight */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-bright)', lineHeight: 1 }}>
                  {userData.cpStats.codeforces.rating}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  Rating
                </span>
              </div>

              {/* Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '4px 10px', borderRadius: '16px', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize' }}>
                  {userData.cpStats.codeforces.rank}
                </span>
                <span style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '16px', fontSize: '0.72rem', fontWeight: 600 }}>
                  Max: {userData.cpStats.codeforces.maxRating}
                </span>
              </div>

              {/* Rank visual bar placeholder or subtle label */}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                Rank Status: <strong style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{userData.cpStats.codeforces.rank}</strong>
              </div>

              {/* Sync controls */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated: {lastSyncDate}</span>
                <button
                  onClick={handleRefreshStats}
                  disabled={refreshing}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition)'
                  }}
                >
                  {refreshing ? 'Syncing...' : 'Sync'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Row 2: Saved Contests (Full Width Section) */}
      <div className="add-event-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-bright)', margin: 0, fontWeight: 700 }}>
            📌 Bookmarked Contests
          </h3>
          <span style={{ background: 'var(--accent-glow)', color: 'var(--accent-bright)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.78rem', fontWeight: 600 }}>
            {userData.savedContests?.length || 0} Saved
          </span>
        </div>

        {!userData.savedContests || userData.savedContests.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
            No saved contests yet. Bookmark contests on the home page to track them here.
          </div>
        ) : (() => {
          const sortedList = [...userData.savedContests].sort(
            (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
          );

          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {sortedList.map((item) => (
                <div key={item._id || item.contestId} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{item.contestId}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {new Date(item.savedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Row 3: Settings Grid */}
      <div className="dashboard-grid-settings">
        
        {/* Card 4: Reminder Settings */}
        <div className="add-event-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-bright)', borderBottom: '1px solid var(--border)', paddingBottom: '10px', margin: 0, fontWeight: 700 }}>
            🔔 Reminder Settings
          </h3>
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.9rem', flexGrow: 1 }}>
            {settingsSuccess && (
              <div style={{ color: 'var(--green)', background: 'rgba(62, 207, 142, 0.1)', border: '1px solid var(--green)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                ✅ {settingsSuccess}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Email Alerts:</span>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => {
                    setEmailEnabled(e.target.checked);
                    setSettingsSuccess('');
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ color: emailEnabled ? 'var(--green)' : 'var(--text-muted)', fontWeight: 600 }}>
                  {emailEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Trigger Time:</span>
              <select
                value={minutesBefore}
                onChange={(e) => {
                  setMinutesBefore(Number(e.target.value));
                  setSettingsSuccess('');
                }}
                style={{
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '6px 12px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={45}>45 minutes before</option>
                <option value={60}>60 minutes before</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="add-event-button"
              style={{ width: '100%', padding: '10px 16px', fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}
            >
              <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>

        {/* Card 5: Profile Settings */}
        <div className="add-event-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-bright)', borderBottom: '1px solid var(--border)', paddingBottom: '10px', margin: 0, fontWeight: 700 }}>
            👤 Profile Settings
          </h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', flexGrow: 1 }}>
            {profileSuccess && (
              <div style={{ color: 'var(--green)', background: 'rgba(62, 207, 142, 0.1)', border: '1px solid var(--green)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                ✅ {profileSuccess}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profileName" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}>Full Name *</label>
              <input
                type="text"
                id="profileName"
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value);
                  setProfileSuccess('');
                }}
                style={{
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profileEmail" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}>Email Address</label>
              <input
                type="email"
                id="profileEmail"
                value={userData.email}
                disabled
                style={{
                  background: 'var(--bg-card-hover)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profileCf" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}>Codeforces Username</label>
              <input
                type="text"
                id="profileCf"
                placeholder="Optional"
                value={cfUsername}
                onChange={(e) => {
                  setCfUsername(e.target.value);
                  setProfileSuccess('');
                }}
                style={{
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profileLc" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}>LeetCode Username</label>
              <input
                type="text"
                id="profileLc"
                placeholder="Optional"
                value={lcUsername}
                onChange={(e) => {
                  setLcUsername(e.target.value);
                  setProfileSuccess('');
                }}
                style={{
                  background: 'var(--bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 12px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="add-event-button"
              style={{ width: '100%', padding: '10px 16px', fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}
            >
              <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
