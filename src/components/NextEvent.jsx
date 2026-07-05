import React from 'react';
import Countdown from './Countdown';

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

export default function NextEvent({ events }) {
  const now = Date.now();
  const upcoming = events
    .filter(e => new Date(e.startDate).getTime() > now)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  if (!upcoming.length) {
    return (
      <section className="next-event-section">
        <div className="section-label">⚡ Next Event</div>
        <div className="next-event">
          <div style={{ padding: '24px 32px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No upcoming events yet — add one below!
          </div>
        </div>
      </section>
    );
  }

  const e = upcoming[0];
  const endTime = new Date(e.startDate).getTime();

  return (
    <section className="next-event-section">
      <div className="section-label">⚡ Next Event</div>
      <div className="next-event">
        <div className="next-event-inner">
          <div>
            <div className="event-type-badge" data-type={e.type}>
              {typeEmoji(e.type)} {capitalize(e.type)}
            </div>
            <div className="next-contest-name" style={{ marginTop: '10px' }}>{e.name}</div>
            <div className="next-contest-meta" style={{ marginTop: '8px' }}>
              {e.organizer && <span className="next-meta-item">🏢 {e.organizer}</span>}
              <span className="next-meta-item">🕐 {formatDate(e.startDate)}</span>
              {e.location && <span className="next-meta-item">📍 {e.location}</span>}
            </div>
            {e.url && (
              <a href={e.url} target="_blank" rel="noopener noreferrer" className="next-contest-link" style={{ marginTop: '14px' }}>
                Open Event →
              </a>
            )}
          </div>
          <div className="countdown-block">
            <div className="countdown-label">Starts in</div>
            <div className="countdown-display">
              <Countdown endTime={endTime} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
