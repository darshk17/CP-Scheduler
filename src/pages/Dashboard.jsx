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
      <div className="section-label" style={{ marginBottom: '32px', fontSize: '1.4rem', textAlign: 'center', fontWeight: 600 }}>📊 User Dashboard</div>

      {/* Grid Layout containing four independent dashboard cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>

        {/* Card 1: User Profile */}
        <div className="add-event-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-bright)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', margin: 0 }}>
            👤 User Profile
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{userData.fullName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Email:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{userData.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Role:</span>
              <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize', fontWeight: 600 }}>{userData.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Connected Platforms:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{connectedPlatformsCount} connected</span>
            </div>
          </div>
        </div>

        {/* Card 2: Competitive Programming Statistics */}
        <div className="add-event-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-bright)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', margin: 0 }}>
            🏆 CP Profiles & Stats
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', flexGrow: 1 }}>

            {/* Codeforces Segment */}
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px', fontSize: '0.88rem' }}>Codeforces</div>
              {!userData.cpStats?.codeforces?.handle ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', paddingLeft: '8px' }}>
                  No Codeforces profile synced.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Handle:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{userData.cpStats.codeforces.handle}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Rating:</span>
                    <span style={{ color: 'var(--accent-bright)', fontWeight: 700 }}>{userData.cpStats.codeforces.rating} (max {userData.cpStats.codeforces.maxRating})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Rank:</span>
                    <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{userData.cpStats.codeforces.rank}</span>
                  </div>
                </div>
              )}
            </div>

            {/* LeetCode Segment */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '6px', fontSize: '0.88rem' }}>LeetCode</div>
              {!userData.cpStats?.leetcode?.username ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic', paddingLeft: '8px' }}>
                  No LeetCode profile synced.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingLeft: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Username:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{userData.cpStats.leetcode.username}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Total Solved:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      <span style={{ color: 'var(--accent-bright)', fontWeight: 700 }}>{userData.cpStats.leetcode.totalSolved}</span> (E: {userData.cpStats.leetcode.easySolved} | M: {userData.cpStats.leetcode.mediumSolved} | H: {userData.cpStats.leetcode.hardSolved})
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Global Rank:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{userData.cpStats.leetcode.ranking.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>



            {/* Sync Status and Button */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-muted)' }}>
                <span>Last Sync:</span>
                <span>{lastSyncDate}</span>
              </div>
              <button
                onClick={handleRefreshStats}
                disabled={refreshing || (!userData.codeforcesUsername && !userData.leetcodeUsername)}
                className="add-event-button"
                style={{ width: '100%', alignSelf: 'stretch' }}
              >
                <span>{refreshing ? 'Refreshing...' : '🔄 Refresh Statistics'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Saved Contests */}
        <div className="add-event-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-bright)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', margin: 0 }}>
            📌 Saved Contests
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Bookmarked:</span>
              <span style={{ color: 'var(--accent-bright)', fontWeight: 700 }}>{userData.savedContests?.length || 0}</span>
            </div>

            <div style={{ marginTop: '4px' }}>
              {!userData.savedContests || userData.savedContests.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
                  No saved contests yet.
                </div>
              ) : (() => {
                const sortedList = [...userData.savedContests].sort(
                  (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
                );
                const latestThree = sortedList.slice(0, 3);
                const moreCount = sortedList.length - 3;

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px' }}>Recent Bookmarks:</div>
                    {latestThree.map((item) => (
                      <div key={item._id || item.contestId} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', border: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{item.contestId}</span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {new Date(item.savedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                    {moreCount > 0 && (
                      <div style={{ color: 'var(--accent-bright)', fontSize: '0.82rem', fontWeight: 600, paddingLeft: '8px', marginTop: '2px' }}>
                        +{moreCount} more
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Card 4: Reminder Settings */}
        <div className="add-event-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-bright)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', margin: 0 }}>
            🔔 Reminder Settings
          </h3>
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', flexGrow: 1 }}>
            {settingsSuccess && (
              <div style={{ color: 'var(--green)', background: 'rgba(62, 207, 142, 0.1)', border: '1px solid var(--green)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                ✅ {settingsSuccess}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Email Alerts:</span>
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
              <span style={{ color: 'var(--text-secondary)' }}>Trigger Time:</span>
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
                  padding: '4px 8px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="add-event-button"
              style={{ width: '100%', marginTop: 'auto', alignSelf: 'stretch' }}
            >
              <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>
        </div>
        {/* Card 5: Profile Settings */}
        <div className="add-event-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--accent-bright)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', margin: 0 }}>
            👤 Profile Settings
          </h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', flexGrow: 1 }}>
            {profileSuccess && (
              <div style={{ color: 'var(--green)', background: 'rgba(62, 207, 142, 0.1)', border: '1px solid var(--green)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                ✅ {profileSuccess}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profileName" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Full Name *</label>
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
                  padding: '6px 10px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profileEmail" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Email Address</label>
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
                  padding: '6px 10px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profileCf" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Codeforces Username</label>
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
                  padding: '6px 10px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="profileLc" style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>LeetCode Username</label>
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
                  padding: '6px 10px',
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
              style={{ width: '100%', marginTop: 'auto', alignSelf: 'stretch' }}
            >
              <span>{savingProfile ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
