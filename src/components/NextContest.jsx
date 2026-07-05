import React from 'react';
import Countdown from './Countdown';

function platformLabel(p) {
  return { leetcode: 'LeetCode', codeforces: 'Codeforces', codechef: 'CodeChef' }[p] || p;
}

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
  if (h)      return `${h}h`;
  return `${m}m`;
}

export default function NextContest({ contests, loading }) {
  if (loading) {
    return (
      <section className="next-contest-section">
        <div className="section-label">⚡ Up Next</div>
        <div className="next-contest">
          <div className="loading">Finding next contest...</div>
        </div>
      </section>
    );
  }

  const now = Date.now();
  const upcoming = contests
    .filter(c => c.startTime > now)
    .sort((a, b) => a.startTime - b.startTime);

  if (!upcoming.length) {
    return (
      <section className="next-contest-section">
        <div className="section-label">⚡ Up Next</div>
        <div className="next-contest">
          <div className="next-contest-inner">
            <div className="loading">No upcoming contests found. Check back soon!</div>
          </div>
        </div>
      </section>
    );
  }

  const c = upcoming[0];

  return (
    <section className="next-contest-section">
      <div className="section-label">⚡ Up Next</div>
      <div className="next-contest">
        <div className="next-contest-inner">
          <div>
            <div className={`next-platform-badge platform-pill ${c.platform}`}>{platformLabel(c.platform)}</div>
            <div className="next-contest-name">{c.name}</div>
            <div className="next-contest-meta">
              <span className="next-meta-item">🕐 {formatDate(c.startTime)}</span>
              <span className="next-meta-item">⏱ {formatDuration(c.duration)}</span>
            </div>
            {c.url && (
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="next-contest-link">
                Open Contest →
              </a>
            )}
          </div>
          <div className="countdown-block">
            <div className="countdown-label">Starts in</div>
            <div className="countdown-display">
              <Countdown endTime={c.startTime} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
