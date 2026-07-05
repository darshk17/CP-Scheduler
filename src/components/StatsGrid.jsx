import React from 'react';
import { getStats } from '../utils/storage';

export default function StatsGrid({ events }) {
  const { total, upcoming, thisMonth, totalPrize } = getStats(events);

  return (
    <section className="stats-section">
      <div className="section-label">📊 Event Statistics</div>
      <div className="stats-grid">
        <div className="stat-card total-events">
          <div className="stat-icon">🗂</div>
          <h3>Total Events</h3>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card upcoming-events">
          <div className="stat-icon">🔜</div>
          <h3>Upcoming</h3>
          <div className="stat-value">{upcoming}</div>
        </div>
        <div className="stat-card this-month">
          <div className="stat-icon">📅</div>
          <h3>This Month</h3>
          <div className="stat-value">{thisMonth}</div>
        </div>
        <div className="stat-card prize-pool">
          <div className="stat-icon">💰</div>
          <h3>Total Prize Pool</h3>
          <div className="stat-value">{totalPrize > 0 ? `$${totalPrize.toLocaleString()}` : '$0'}</div>
        </div>
      </div>
    </section>
  );
}
