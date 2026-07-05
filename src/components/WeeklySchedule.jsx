import React from 'react';

export default function WeeklySchedule() {
  return (
    <section className="weekly-schedule-section">
      <div className="section-label">📅 Weekly Schedule</div>
      <div className="weekly-schedule">
        <div className="schedule-day">
          <div className="day-header">
            <span className="day-name">Sunday</span>
            <span className="day-badge">1 contest</span>
          </div>
          <div className="schedule-events">
            <div className="schedule-event leetcode">
              <span className="event-dot"></span>
              <div className="event-info">
                <span className="time">8:00 AM IST</span>
                <span className="name">LeetCode Weekly Contest</span>
              </div>
            </div>
          </div>
        </div>
        <div className="schedule-day">
          <div className="day-header">
            <span className="day-name">Wednesday</span>
            <span className="day-badge">1 contest</span>
          </div>
          <div className="schedule-events">
            <div className="schedule-event codechef">
              <span className="event-dot"></span>
              <div className="event-info">
                <span className="time">8:00 – 10:00 PM IST</span>
                <span className="name">CodeChef Starters / Long Challenge</span>
              </div>
            </div>
          </div>
        </div>
        <div className="schedule-day">
          <div className="day-header">
            <span className="day-name">Saturday</span>
            <span className="day-badge">1 contest</span>
          </div>
          <div className="schedule-events">
            <div className="schedule-event leetcode">
              <span className="event-dot"></span>
              <div className="event-info">
                <span className="time">8:00 PM IST</span>
                <span className="name">LeetCode Biweekly (Alternate Saturdays)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="schedule-day">
          <div className="day-header">
            <span className="day-name">Varies</span>
            <span className="day-badge">dynamic</span>
          </div>
          <div className="schedule-events">
            <div className="schedule-event codeforces">
              <span className="event-dot"></span>
              <div className="event-info">
                <span className="time">Varies (check calendar)</span>
                <span className="name">Codeforces Round (Div. 1/2/3/4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
