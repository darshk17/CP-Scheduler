import React, { useMemo } from 'react';

function typeEmoji(t) {
  return { hackathon: '🚀', workshop: '🛠', conference: '🎤', meetup: '🤝', other: '📌' }[t] || '📌';
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function formatDate(str) {
  return new Date(str).toLocaleString('en-IN', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function EventGrid({ events, onDeleteEvent, activeType, activeTime }) {
  const now = Date.now();

  const filtered = useMemo(() => {
    const referenceTime = Date.now();
    return events.filter(e => {
      const t = new Date(e.startDate).getTime();
      if (activeType !== 'all' && e.type !== activeType) return false;
      
      if (activeTime === 'today') {
        const today = new Date(referenceTime); 
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); 
        tomorrow.setDate(tomorrow.getDate() + 1);
        return t >= today.getTime() && t < tomorrow.getTime();
      }
      if (activeTime === 'week') {
        const weekEnd = referenceTime + 7 * 86400000;
        return t >= referenceTime && t <= weekEnd;
      }
      if (activeTime === 'month') {
        const monthEnd = referenceTime + 30 * 86400000;
        return t >= referenceTime && t <= monthEnd;
      }
      return true;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [events, activeType, activeTime]);

  if (!filtered.length) {
    return (
      <section className="events-section">
        <div className="section-label">📋 All Events</div>
        <div className="events-grid">
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <p>No events match your current filters.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="events-section">
      <div className="section-label">📋 All Events</div>
      <div className="events-grid">
        {filtered.map((e, i) => {
          const isPast = new Date(e.endDate || e.startDate).getTime() < now;
          return (
            <div
              key={e.id}
              className="event-card"
              style={{
                animationDelay: `${i * 0.04}s`,
                opacity: isPast ? 0.6 : 1
              }}
            >
              <div className="event-type-badge" data-type={e.type}>
                {typeEmoji(e.type)} {capitalize(e.type)}
              </div>
              <div className="event-name">{e.name}</div>
              <div className="event-meta">
                {e.organizer && <div className="event-meta-row">🏢 {e.organizer}</div>}
                <div className="event-meta-row">🕐 {formatDate(e.startDate)}</div>
                {e.endDate && <div className="event-meta-row">🔚 {formatDate(e.endDate)}</div>}
                {e.location && <div className="event-meta-row">📍 {e.location}</div>}
              </div>
              {e.description && <div className="event-description">{e.description}</div>}
              <div className="event-card-footer">
                <div>
                  {e.prize && <span className="prize-tag">🏆 {e.prize}</span>}
                  {isPast && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      Ended
                    </span>
                  )}
                </div>
                <div className="event-actions">
                  {e.url && (
                    <a href={e.url} target="_blank" rel="noopener noreferrer" className="event-link-btn">
                      Open →
                    </a>
                  )}
                  <button
                    className="event-delete-btn"
                    onClick={() => onDeleteEvent(e.id)}
                    title="Remove event"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
