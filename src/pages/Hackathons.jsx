import React, { useState, useEffect } from 'react';
import HackathonsHero from '../components/HackathonsHero';
import NextEvent from '../components/NextEvent';
import StatsGrid from '../components/StatsGrid';
import AddEventForm from '../components/AddEventForm';
import FilterPanel from '../components/FilterPanel';
import EventGrid from '../components/EventGrid';
import Toast from '../components/Toast';
import { getEvents, saveEvent, deleteEvent } from '../utils/storage';
import '../styles/hackathons.css';

export default function Hackathons() {
  const [events, setEvents] = useState([]);
  const [activeType, setActiveType] = useState('all');
  const [activeTime, setActiveTime] = useState('all');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  const handleAddEvent = (newEvent) => {
    saveEvent(newEvent);
    setEvents(getEvents());
  };

  const handleDeleteEvent = (id) => {
    deleteEvent(id);
    setEvents(getEvents());
    showToast('Event removed.', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast({ message: '', type: 'success' });
  };

  return (
    <main>
      <div className="container">
        <HackathonsHero />
        
        <NextEvent events={events} />

        <StatsGrid events={events} />

        <AddEventForm onAddEvent={handleAddEvent} showToast={showToast} />

        <FilterPanel
          activeType={activeType}
          setActiveType={setActiveType}
          activeTime={activeTime}
          setActiveTime={setActiveTime}
        />

        <EventGrid
          events={events}
          onDeleteEvent={handleDeleteEvent}
          activeType={activeType}
          activeTime={activeTime}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      </div>
    </main>
  );
}
