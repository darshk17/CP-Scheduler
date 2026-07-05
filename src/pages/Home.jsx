import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import NextContest from '../components/NextContest';
import UpcomingContests from '../components/UpcomingContests';
import WeeklySchedule from '../components/WeeklySchedule';
import Calendar from '../components/Calendar';
import PlatformCards from '../components/PlatformCards';
import { fetchContests } from '../utils/api';

export default function Home() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    let active = true;
    const loadContests = async () => {
      try {
        setLoading(true);
        const data = await fetchContests();
        if (active) {
          setContests(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load contests:', err);
        if (active) {
          setLoading(false);
        }
      }
    };
    loadContests();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main>
      <div className="container">
        <HeroSection />
        
        <NextContest contests={contests} loading={loading} />

        <UpcomingContests
          contests={contests}
          loading={loading}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <WeeklySchedule />

        <Calendar contests={contests} currentMonth={new Date()} />

        <PlatformCards contests={contests} />
      </div>
    </main>
  );
}
