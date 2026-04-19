import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import { Loader2, CalendarX, AlertCircle, ArrowLeft } from 'lucide-react';
import ElectricBorder from '../Clubs/ElectricBorder';

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/api/events/all`);
        
        if (response.data.success) {
          const now = new Date().setHours(0, 0, 0, 0);
          const sortedEvents = response.data.events.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const isUpA = dateA >= now;
            const isUpB = dateB >= now;
            if (isUpA && !isUpB) return -1;
            if (!isUpA && isUpB) return 1;
            return dateA - dateB;
          });
          setEvents(sortedEvents);
        } else {
          setError(response.data.message || 'Failed to fetch events');
        }
      } catch (err) {
        setError('Connection error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Fetching college events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[60vh]">
        <AlertCircle className="w-12 h-12 text-red-500/50 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-500 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg border border-white/5 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main className="relative flex w-full min-h-screen pt-5 pb-12 font-mono flex-col items-center">
      <section className="w-full flex justify-center flex-col items-center" id="events" aria-label="Events list">
        {/* Back Button Section */}
        <div className="w-full max-w-[1200px] flex items-center justify-start mt-6 mb-4 px-6 sm:px-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all hover:-translate-y-0.5 active:scale-95 duration-300 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-10 w-full max-w-[1200px] px-6 sm:px-8 uppercase">
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4'>
            Explore <span className="text-gray-400">Events.</span>
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed capitalize">
            Discover upcoming activities, workshops, and competitions from student-led organizations.
          </p>
        </div>

        {/* Grid Section */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/2 border border-dashed border-white/10 rounded-2xl w-full max-w-[1200px] mx-6">
            <CalendarX className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Events Found</h3>
            <p className="text-gray-500">Check back later for upcoming club activities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 w-full max-w-[1200px] px-6 sm:px-8">
            {events.map((event) => (
              <ElectricBorder key={event._id} color="#555555" speed={0.3} chaos={0.08} borderRadius={12} className="h-full">
                <EventCard event={event} />
              </ElectricBorder>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
