import React, { useState, useEffect, useMemo } from 'react';

function pad(n) {
  return String(n).padStart(2, '0');
}

function platformShort(p) {
  return { leetcode: 'LC', codeforces: 'CF', codechef: 'CC' }[p] || p.slice(0, 2).toUpperCase();
}

function formatTime(ms) {
  return new Date(ms).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
  }) + ' IST';
}

export default function Calendar({ contests, currentMonth }) {
  // Sync the local viewDate state with the currentMonth prop
  const [viewDate, setViewDate] = useState(() => currentMonth || new Date());

  useEffect(() => {
    if (currentMonth) {
      setViewDate(currentMonth);
    }
  }, [currentMonth]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Contest lookup by date key "YYYY-MM-DD" in IST (UTC+5:30)
  const contestMap = useMemo(() => {
    const map = {};
    contests.forEach(c => {
      const ist = new Date(c.startTime + 5.5 * 3600000);
      const key = `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())}`;
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return map;
  }, [contests]);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days calculations
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();
  const today = new Date();

  // Prev month padding cells
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const prevCells = [];
  for (let i = 0; i < startOffset; i++) {
    const dayNum = prevMonthLastDay - startOffset + 1 + i;
    prevCells.push(
      <div key={`prev-${i}`} className="calendar-cell other-month">
        <div className="day-num">{dayNum}</div>
      </div>
    );
  }

  // Current month cells
  const currentCells = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${pad(month + 1)}-${pad(day)}`;
    const cellContests = contestMap[dateKey] || [];
    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const hasEvents = cellContests.length > 0;

    currentCells.push(
      <div key={`curr-${day}`} className={`calendar-cell ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}>
        <div className="day-num">{day}</div>
        <div className="calendar-events">
          {cellContests.slice(0, 3).map((c) => (
            <div
              key={c.id}
              className={`calendar-event ${c.platform}`}
              title={`${c.name} — ${formatTime(c.startTime)}`}
            >
              {platformShort(c.platform)}
            </div>
          ))}
          {cellContests.length > 3 && (
            <div className="calendar-event" style={{ background: 'var(--bg)', color: 'var(--text-muted)' }}>
              +{cellContests.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  }

  // Next month padding cells
  const nextCells = [];
  const totalCells = startOffset + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    nextCells.push(
      <div key={`next-${i}`} className="calendar-cell other-month">
        <div className="day-num">{i}</div>
      </div>
    );
  }

  return (
    <section className="calendar-section">
      <div className="section-label">📆 Contest Calendar</div>
      <div className="calendar-controls">
        <button id="prev-month" className="calendar-nav-btn" onClick={handlePrevMonth}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h3 id="current-month">{monthLabel}</h3>
        <button id="next-month" className="calendar-nav-btn" onClick={handleNextMonth}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
      <div className="calendar">
        <div className="calendar-header">
          {daysOfWeek.map(d => (
            <div key={d} className="calendar-header-cell">{d}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {prevCells}
          {currentCells}
          {nextCells}
        </div>
      </div>

      <div className="calendar-legend">
        <span className="legend-item leetcode"><span className="legend-dot"></span>LeetCode</span>
        <span className="legend-item codeforces"><span className="legend-dot"></span>Codeforces</span>
        <span className="legend-item codechef"><span className="legend-dot"></span>CodeChef</span>
      </div>
    </section>
  );
}
