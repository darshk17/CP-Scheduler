import React, { useMemo } from 'react';
import ContestCard from './ContestCard';

function platformLabel(p) {
  return { leetcode: 'LeetCode', codeforces: 'Codeforces', codechef: 'CodeChef' }[p] || p;
}

export default function UpcomingContests({ contests, loading, activeFilter, setActiveFilter }) {
  const filtered = useMemo(() => {
    return contests
      .filter(c => {
        const matchPlatform = activeFilter === 'all' || c.platform === activeFilter;
        return matchPlatform;
      })
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, 12);
  }, [contests, activeFilter]);

  return (
    <section className="upcoming-section">
      <div className="section-header">
        <div className="section-label">🗓 Upcoming Contests</div>
        <div className="platform-filter">
          {['all', 'leetcode', 'codeforces', 'codechef'].map(plat => (
            <button
              key={plat}
              className={`pf-btn ${plat} ${activeFilter === plat ? 'active' : ''}`}
              onClick={() => setActiveFilter(plat)}
            >
              {plat === 'all' ? 'All' : platformLabel(plat)}
            </button>
          ))}
        </div>
      </div>
      <div className="upcoming-contests">
        {loading ? (
          <div className="loading">Loading contest data...</div>
        ) : !filtered.length ? (
          <div className="loading">No contests found for this filter.</div>
        ) : (
          filtered.map((c, i) => (
            <ContestCard key={c.id} contest={c} index={i} />
          ))
        )}
      </div>
    </section>
  );
}
