import React, { useState } from 'react';

export default function AddEventForm({ onAddEvent, showToast }) {
  const [form, setForm] = useState({
    name: '',
    organizer: '',
    startDate: '',
    endDate: '',
    type: 'hackathon',
    location: '',
    url: '',
    prize: '',
    description: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'event-name': 'name',
      'event-organizer': 'organizer',
      'event-start': 'startDate',
      'event-end': 'endDate',
      'event-type': 'type',
      'event-location': 'location',
      'event-url': 'url',
      'event-prize': 'prize',
      'event-description': 'description'
    };
    const key = fieldMap[id] || id;
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      showToast('Please fill in Name, Start & End date.', 'error');
      return;
    }

    onAddEvent({
      name: form.name.trim(),
      organizer: form.organizer.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      url: form.url.trim(),
      type: form.type,
      location: form.location.trim(),
      prize: form.prize.trim(),
      description: form.description.trim()
    });

    // Clear form
    setForm({
      name: '',
      organizer: '',
      startDate: '',
      endDate: '',
      type: 'hackathon',
      location: '',
      url: '',
      prize: '',
      description: ''
    });

    showToast(`"${form.name.trim()}" added!`, 'success');
  };

  return (
    <section className="add-event-section">
      <div className="section-label">➕ Add New Event</div>
      <form className="add-event-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="event-name">Event Name *</label>
            <input
              type="text"
              id="event-name"
              placeholder="e.g. Smart India Hackathon 2026"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-organizer">Organizer</label>
            <input
              type="text"
              id="event-organizer"
              placeholder="e.g. MLH, Devfolio"
              value={form.organizer}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="event-start">Start Date & Time *</label>
            <input
              type="datetime-local"
              id="event-start"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-end">End Date & Time *</label>
            <input
              type="datetime-local"
              id="event-end"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="event-type">Event Type</label>
            <select id="event-type" value={form.type} onChange={handleChange}>
              <option value="hackathon">🚀 Hackathon</option>
              <option value="workshop">🛠 Workshop</option>
              <option value="conference">🎤 Conference</option>
              <option value="meetup">🤝 Meetup</option>
              <option value="other">📌 Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="event-location">Location</label>
            <input
              type="text"
              id="event-location"
              placeholder="Online / City, Country"
              value={form.location}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="event-url">Event URL</label>
            <input
              type="url"
              id="event-url"
              placeholder="https://..."
              value={form.url}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="event-prize">Prize Pool</label>
            <input
              type="text"
              id="event-prize"
              placeholder="e.g. $10,000"
              value={form.prize}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group full-width">
          <label htmlFor="event-description">Description</label>
          <textarea
            id="event-description"
            placeholder="Brief description of the event..."
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" id="add-event-btn" className="add-event-button">
          <span>Add Event</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </form>
    </section>
  );
}
