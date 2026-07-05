import React from 'react';

function formatShortDate(ms) {
  return new Date(ms).toLocaleDateString('en-IN', {
    month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata'
  });
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n) + '…' : str;
}

export default function PlatformCards({ contests }) {
  const now = Date.now();
  const platforms = [
    {
      key: 'leetcode',
      name: 'LeetCode',
      badge: 'LC',
      scheduleText: (
        <>
          <p>Weekly: Every Sunday at 8:00 AM IST</p>
          <p>Biweekly: Alternate Saturdays at 8:00 PM IST</p>
        </>
      ),
      link: 'https://leetcode.com/contest/'
    },
    {
      key: 'codechef',
      name: 'CodeChef',
      badge: 'CC',
      scheduleText: (
        <>
          <p>Starters: Every Wednesday 8:00 – 10:00 PM IST</p>
        </>
      ),
      link: 'https://www.codechef.com/contests'
    },
    {
      key: 'codeforces',
      name: 'Codeforces',
      badge: 'CF',
      scheduleText: (
        <>
          <p>Schedule varies — Div. 1, 2, 3, 4 &amp; Educational rounds</p>
        </>
      ),
      link: 'https://codeforces.com/contests'
    }
  ];

  return (
    <section className="platforms-section">
      <div className="section-label">🏆 Platform Breakdown</div>
      <div className="platforms">
        {platforms.map(p => {
          const platformContests = contests
            .filter(c => c.platform === p.key && c.startTime > now - 86400000)
            .sort((a, b) => a.startTime - b.startTime)
            .slice(0, 3);

          return (
            <div key={p.key} className={`platform-card ${p.key}`}>
              <div className="platform-header">
                <div className={`platform-icon ${p.key === 'leetcode' ? 'lc' : p.key === 'codechef' ? 'cc' : 'cf'}-icon`}>
                  {p.badge}
                </div>
                <h3>{p.name}</h3>
              </div>
              {p.scheduleText}
              <div className="platform-contests">
                {platformContests.length ? (
                  platformContests.map(c => (
                    <div key={c.id} className="mini-contest-item" title={c.name}>
                      {formatShortDate(c.startTime)} — {truncate(c.name, 30)}
                    </div>
                  ))
                ) : (
                  <div className="mini-contest-item">No upcoming contests</div>
                )}
              </div>
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="platform-link">
                View all →
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
