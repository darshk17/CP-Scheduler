import React from 'react';
import PlatformBadge from './PlatformBadge';
import { useAuth } from '../context/AuthContext';

function formatDate(ms) {
  return new Date(ms).toLocaleString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
  }) + ' IST';
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export default function ContestCard({ contest, index }) {
  const now = Date.now();
  const isLive = now >= contest.startTime && now <= contest.startTime + contest.duration * 1000;
  const isSoon = contest.startTime - now < 3600000 && contest.startTime > now;
  const status = isLive ? 'live' : isSoon ? 'soon' : 'upcoming';

  // Consume authentication context variables and methods
  const { savedContests, saveContest, removeSavedContest, user } = useAuth();

  // Determine if this contest has already been bookmarked by the user
  const isSaved = savedContests ? savedContests.some(item => item.contestId === contest.id) : false;

  const handleToggleSave = async (e) => {
    e.preventDefault(); // Prevent any accidental outer container link triggers
    const result = isSaved
      ? await removeSavedContest(contest.id)
      : await saveContest(contest.id);

    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <div
      className={`contest-card ${contest.platform}`}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="card-top">
        <PlatformBadge platform={contest.platform} />
        <span className={`status-dot ${status}`} title={status}></span>
      </div>
      <div className="contest-name">{contest.name}</div>
      <div className="contest-info">
        <div className="contest-info-row">🕐 {formatDate(contest.startTime)}</div>
        <div className="contest-info-row">⏱ {formatDuration(contest.duration)}</div>
        {isLive && <div className="contest-info-row" style={{ color: 'var(--green)' }}>🟢 Live now!</div>}
      </div>
      <div className="contest-card-footer">
        <span className="card-duration">{formatDuration(contest.duration)}</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Only render the Save button if the user is authenticated */}
          {user && (
            <button
              onClick={handleToggleSave}
              style={{
                background: 'none',
                border: 'none',
                color: isSaved ? 'var(--red)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0',
                outline: 'none',
                fontWeight: 600
              }}
            >
              <span>{isSaved ? '❤️ Saved' : '🤍 Save'}</span>
            </button>
          )}
          {contest.url && (
            <a href={contest.url} target="_blank" rel="noopener noreferrer" className="card-link">
              Register →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
