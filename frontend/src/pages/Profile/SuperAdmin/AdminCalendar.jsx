import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Loader2, AlertCircle, X, CalendarDays, Clock, MapPin, Tag } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const colorPalette = ['bg-blue-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600', 'bg-rose-600'];

const EventModal = ({ event, onClose }) => {
    const { raw, status, color } = event;

    const displayDate = new Date(raw.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const statusBg = status === 'upcoming' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200';
    const statusLabel = status === 'upcoming' ? 'Upcoming' : 'Ended';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(17,24,39,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={handleBackdrop}
        >
            <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto sleek-scrollbar rounded-2xl border border-gray-200 bg-white shadow-2xl">
                <div className="sticky top-0 z-10">
                    <div className={`h-1.5 w-full ${color}`} />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/90 hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-6 pt-2">
                    <div className="pr-8 mb-4">
                        <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2">{event.title}</h2>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status === 'upcoming' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                            {statusLabel}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <DetailRow icon={<CalendarDays className="w-4 h-4" />} label="Date" value={displayDate} />
                        {raw.time && <DetailRow icon={<Clock className="w-4 h-4" />} label="Time" value={raw.time} />}
                        {(raw.venue || raw.location) && (
                            <DetailRow icon={<MapPin className="w-4 h-4" />} label="Venue" value={raw.venue || raw.location} />
                        )}
                        {raw.club && <DetailRow icon={<Tag className="w-4 h-4" />} label="Club" value={raw.club} />}
                    </div>

                    {raw.description && (
                        <div className="mt-5 pt-4 border-t border-gray-100 whitespace-pre-wrap">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">About</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{raw.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <span className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</span>
        <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">{label}</p>
            <p className="text-sm text-gray-800">{value}</p>
        </div>
    </div>
);

export default function AdminCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rawEvents, setRawEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API}/api/events/all`);
                if (response.data.success) {
                    setRawEvents(response.data.events);
                } else {
                    setError(response.data.message || 'Failed to fetch events');
                }
            } catch {
                setError('Connection error while loading calendar.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const formattedEvents = useMemo(() => {
        const today = new Date().setHours(0, 0, 0, 0);
        return rawEvents.map((event, index) => {
            const eventDate = new Date(event.date);
            const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`;
            return {
                id: event._id || index.toString(),
                title: event.eventName || event.name || event.title || 'Unnamed Event',
                date: dateKey,
                status: eventDate.getTime() < today ? 'ended' : 'upcoming',
                color: colorPalette[index % colorPalette.length],
                raw: event,
            };
        });
    }, [rawEvents]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const formatDateKey = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const getEventsForDate = (dateKey) => formattedEvents.filter((e) => e.date === dateKey);

    const eventsThisMonth = formattedEvents.filter((e) => {
        const [ey, em] = e.date.split('-').map(Number);
        return ey === year && em === month + 1;
    });

    const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const goToPreviousYear = () => {
        const ny = year - 1;
        if (ny >= new Date().getFullYear() - 10) setCurrentDate(new Date(ny, month, 1));
    };
    const goToNextYear = () => {
        const ny = year + 1;
        if (ny <= new Date().getFullYear() + 10) setCurrentDate(new Date(ny, month, 1));
    };
    const goToToday = () => setCurrentDate(new Date());

    const calendarDays = [];
    for (let i = firstDay - 1; i >= 0; i--) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
    for (let i = 1; i <= 42 - calendarDays.length; i++) calendarDays.push(null);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const isCurrentMonth = (day) => day !== null;
    const isToday = (day) => {
        if (!isCurrentMonth(day)) return false;
        const t = new Date();
        return day === t.getDate() && month === t.getMonth() && year === t.getFullYear();
    };

    const canGoBack = year > new Date().getFullYear() - 10;
    const canGoForward = year < new Date().getFullYear() + 10;

    if (loading) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[400px] p-6 rounded-2xl border border-gray-200 bg-white">
                <Loader2 className="w-8 h-8 text-gray-300 animate-spin mb-4" />
                <p className="text-gray-400 font-medium text-sm">Loading calendar...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-[400px] p-6 rounded-2xl border border-gray-200 bg-white">
                <AlertCircle className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-400 font-medium text-sm">{error}</p>
            </div>
        );
    }

    return (
        <>
            {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

            <div className="w-full mx-auto p-6 rounded-2xl border border-gray-200 bg-white">
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-1">
                            <button onClick={goToPreviousYear} disabled={!canGoBack} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button onClick={goToPreviousMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7 7l-7-7 7-7" /></svg>
                            </button>
                        </div>

                        <div className="text-center flex-1">
                            <h2 className="text-xl font-bold text-gray-900">{monthNames[month]} {year}</h2>
                            <p className="text-gray-500 text-xs mt-0.5">{formattedEvents.length} total events tracked</p>
                        </div>

                        <div className="flex items-center gap-1">
                            <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" /></svg>
                            </button>
                            <button onClick={goToNextYear} disabled={!canGoForward} className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button onClick={goToToday} className="px-4 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-colors">
                            Today
                        </button>
                    </div>
                </div>

                <div className="rounded-lg overflow-hidden border border-gray-200">
                    <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                        {weekDays.map((day) => (
                            <div key={day} className="p-3 text-center font-semibold text-gray-500 text-xs hidden sm:block">{day}</div>
                        ))}
                        {weekDays.map((day) => (
                            <div key={`${day}-m`} className="p-2 text-center font-semibold text-gray-500 text-xs sm:hidden">{day.charAt(0)}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, index) => {
                            const dateKey = isCurrentMonth(day) ? formatDateKey(year, month, day) : null;
                            const dayEvents = dateKey ? getEventsForDate(dateKey) : [];
                            const todayCell = isToday(day);

                            return (
                                <div
                                    key={index}
                                    className="min-h-[70px] sm:min-h-[100px] p-1 sm:p-2 border-r border-b border-gray-200 transition-colors overflow-hidden"
                                    style={{ backgroundColor: todayCell ? '#eff6ff' : isCurrentMonth(day) ? '#ffffff' : '#f9fafb' }}
                                >
                                    {isCurrentMonth(day) && (
                                        <>
                                            <div className="text-sm sm:text-base font-bold mb-1">
                                                {todayCell ? (
                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">
                                                        {day}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">{day}</span>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                {dayEvents.slice(0, 2).map((event) => (
                                                    <div
                                                        key={event.id}
                                                        onClick={() => setSelectedEvent(event)}
                                                        className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded truncate cursor-pointer text-white hover:opacity-80 transition-opacity ${event.color}`}
                                                        title={event.title}
                                                    >
                                                        {event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-[10px] text-gray-400 px-1">+{dayEvents.length - 2} more</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {eventsThisMonth.length === 0 && (
                    <p className="text-center text-gray-400 text-sm mt-5">No events this month</p>
                )}

                <div className="mt-5 pt-5 border-t border-gray-200 flex gap-6">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs text-gray-500">Upcoming</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-400" />
                        <span className="text-xs text-gray-500">Ended</span>
                    </div>
                </div>
            </div>
        </>
    );
}
