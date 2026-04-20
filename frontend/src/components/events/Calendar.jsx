'use client'

import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import EventTag from './EventTag'
import { Loader2, AlertCircle, X, CalendarDays, Clock, MapPin, User, Tag } from 'lucide-react'
import ElectricBorder from '/home/nishant/LOCAL_DISK_D/4/NEXUS/frontend/src/components/Clubs/ElectricBorder.jsx'

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const colorPalette = ['bg-emerald-500', 'bg-zinc-400', 'bg-stone-400', 'bg-neutral-400', 'bg-gray-400']

// ─── Event Detail Modal ───────────────────────────────────────────────────────
const EventModal = ({ event, onClose }) => {
  const { raw, status, color } = event

  const displayDate = new Date(raw.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const statusBg  = status === 'upcoming' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-700/40 text-zinc-400 border-zinc-600/30'
  const statusLabel = status === 'upcoming' ? 'Upcoming' : 'Ended'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#141414' }}
      >
        {/* Coloured top accent strip */}
        <div className={`h-1 w-full ${color}`} />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Title + status */}
          <div className="pr-8 mb-4">
            <h2 className="text-xl font-bold text-white leading-snug mb-2">
              {event.title}
            </h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'upcoming' ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
              {statusLabel}
            </span>
          </div>

          {/* Detail rows */}
          <div className="space-y-3">
            <DetailRow icon={<CalendarDays className="w-4 h-4" />} label="Date" value={displayDate} />
            {(raw.time) && (
              <DetailRow icon={<Clock className="w-4 h-4" />} label="Time" value={raw.time} />
            )}
            {(raw.venue || raw.location) && (
              <DetailRow icon={<MapPin className="w-4 h-4" />} label="Venue" value={raw.venue || raw.location} />
            )}
            {raw.organizer && (
              <DetailRow icon={<User className="w-4 h-4" />} label="Organizer" value={raw.organizer} />
            )}
            {raw.category && (
              <DetailRow icon={<Tag className="w-4 h-4" />} label="Category" value={raw.category} />
            )}
          </div>

          {/* Description */}
          {raw.description && (
            <div className="mt-5 pt-4 border-t border-zinc-800 whitespace-pre-wrap">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">About</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{raw.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 text-zinc-500 flex-shrink-0">{icon}</span>
    <div>
      <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest leading-none mb-0.5">{label}</p>
      <p className="text-sm text-zinc-200">{value}</p>
    </div>
  </div>
)

// ─── Main Calendar ────────────────────────────────────────────────────────────
const Calendar1 = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [rawEvents, setRawEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API}/api/events/all`)
        if (response.data.success) {
          setRawEvents(response.data.events)
        } else {
          setError(response.data.message || 'Failed to fetch events')
        }
      } catch {
        setError('Connection error while loading calendar.')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const formattedEvents = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0)
    return rawEvents.map((event, index) => {
      const eventDate = new Date(event.date)
      const dateKey = `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`
      return {
        id: event._id || index.toString(),
        title: event.eventName || event.name || event.title || 'Unnamed Event', 
        date: dateKey,
        status: eventDate.getTime() < today ? 'ended' : 'upcoming',
        color: colorPalette[index % colorPalette.length],
        raw: event,
      }
    })
  }, [rawEvents])

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const formatDateKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const getEventsForDate = (dateKey) =>
    formattedEvents.filter(e => e.date === dateKey)

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const goToNextMonth     = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToPreviousYear  = () => {
    const ny = year - 1
    if (ny >= new Date().getFullYear() - 10) setCurrentDate(new Date(ny, month, 1))
  }
  const goToNextYear = () => {
    const ny = year + 1
    if (ny <= new Date().getFullYear() + 10) setCurrentDate(new Date(ny, month, 1))
  }
  const goToToday = () => setCurrentDate(new Date())

  const calendarDays = []
  for (let i = firstDay - 1; i >= 0; i--) calendarDays.push(null)
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i)
  for (let i = 1; i <= 42 - calendarDays.length; i++) calendarDays.push(null)

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const weekDays   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  const isCurrentMonth = (day) => day !== null
  const isToday = (day) => {
    if (!isCurrentMonth(day)) return false
    const t = new Date()
    return day === t.getDate() && month === t.getMonth() && year === t.getFullYear()
  }

  const canGoBack    = year > new Date().getFullYear() - 10
  const canGoForward = year < new Date().getFullYear() + 10

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[500px] p-6 rounded-xl border border-zinc-800" style={{ backgroundColor: '#0f0f0f' }}>
        <Loader2 className="w-10 h-10 text-zinc-600 animate-spin mb-4" />
        <p className="text-zinc-400 font-medium">Loading calendar...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[500px] p-6 rounded-xl border border-zinc-800" style={{ backgroundColor: '#0f0f0f' }}>
        <AlertCircle className="w-10 h-10 text-zinc-500 mb-4" />
        <p className="text-zinc-400 font-medium">{error}</p>
      </div>
    )
  }

  return (
    <>
      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {/* Changed color from #ffffff to #52525b to reduce the white light intensity */}
      <ElectricBorder color="#52525b" speed={0.6} chaos={0.08} borderRadius={16} className="w-full">
        <div className="w-full mx-auto p-6 rounded-xl border border-zinc-800" style={{ backgroundColor: '#0f0f0f' }}>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button onClick={goToPreviousYear} disabled={!canGoBack} className="p-2 hover:bg-zinc-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={goToPreviousMonth} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7 7l-7-7 7-7" /></svg>
                </button>
              </div>

              <div className="text-center flex-1">
                <h2 className="text-3xl font-bold text-white">{monthNames[month]} {year}</h2>
                <p className="text-zinc-500 text-sm mt-1">{formattedEvents.length} total events tracked</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={goToNextMonth} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" /></svg>
                </button>
                <button onClick={goToNextYear} disabled={!canGoForward} className="p-2 hover:bg-zinc-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <button onClick={goToToday} className="px-4 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-sm font-medium transition-colors">
                Today
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="rounded-lg overflow-hidden border border-zinc-800" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="grid grid-cols-7 bg-zinc-900 border-b border-zinc-800">
              {weekDays.map(day => (
                <div key={day} className="p-4 text-center font-semibold text-zinc-400 text-sm hidden sm:block">{day}</div>
              ))}
              {weekDays.map(day => (
                <div key={`${day}-m`} className="p-2 text-center font-semibold text-zinc-400 text-xs sm:hidden">{day.charAt(0)}</div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dateKey   = isCurrentMonth(day) ? formatDateKey(year, month, day) : null
                const dayEvents = dateKey ? getEventsForDate(dateKey) : []
                const todayCell = isToday(day)

                return (
                  <div
                    key={index}
                    className="min-h-[80px] sm:min-h-[120px] p-1 sm:p-3 border-r border-b border-zinc-800 transition-colors overflow-hidden"
                    style={{
                      backgroundColor: todayCell
                        ? 'rgba(255,255,255,0.07)'
                        : isCurrentMonth(day) ? '#1a1a1a' : '#0f0f0f'
                    }}
                  >
                    {isCurrentMonth(day) && (
                      <>
                        <div className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">
                          {todayCell ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-white text-white text-sm">
                              {day}
                            </span>
                          ) : (
                            <span className="text-zinc-400">{day}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div key={event.id} className="truncate">
                              <EventTag
                                title={event.title}
                                status={event.status}
                                color={event.color}
                                onClick={() => setSelectedEvent(event)}
                              />
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-[10px] sm:text-xs text-zinc-500 px-1 sm:px-2 py-1">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-400 mb-3">Status Legend</h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-zinc-500">Upcoming</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-zinc-600" />
                <span className="text-sm text-zinc-500">Ended</span>
              </div>
            </div>
          </div>

        </div>
      </ElectricBorder>
    </>
  )
}

export default Calendar1