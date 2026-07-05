import React from 'react';

export default function FilterPanel({
  activeType,
  setActiveType,
  activeTime,
  setActiveTime
}) {
  const types = [
    { key: 'all', label: 'All' },
    { key: 'hackathon', label: 'Hackathons' },
    { key: 'workshop', label: 'Workshops' },
    { key: 'conference', label: 'Conferences' },
    { key: 'meetup', label: 'Meetups' }
  ];

  const timeRanges = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' }
  ];

  return (
    <section className="filters-section">
      <div className="section-label">🔍 Filter Events</div>
      <div className="filters">
        <div className="filter-group">
          <label>Event Type</label>
          <div className="filter-options">
            {types.map(t => (
              <button
                key={t.key}
                className={`filter-btn ${activeType === t.key ? 'active' : ''}`}
                onClick={() => setActiveType(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <label>Time Range</label>
          <div className="filter-options">
            {timeRanges.map(tr => (
              <button
                key={tr.key}
                className={`filter-btn ${activeTime === tr.key ? 'active' : ''}`}
                onClick={() => setActiveTime(tr.key)}
              >
                {tr.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
