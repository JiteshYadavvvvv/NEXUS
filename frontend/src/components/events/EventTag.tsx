import React from 'react'

interface EventTagProps {
  title: string
  status: 'upcoming' | 'ended'
  color: string
  onClick?: () => void
}

const EventTag: React.FC<EventTagProps> = ({ title, status, color, onClick }) => {
  const statusColor = status === 'upcoming' ? 'bg-emerald-500' : 'bg-zinc-600'
  const statusText = status === 'upcoming' ? 'UPCOMING' : 'ENDED'

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className={`text-xs font-medium px-2 py-1 rounded-full ${color} bg-opacity-20 text-white truncate relative group cursor-pointer hover:bg-opacity-40 transition-all`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="truncate">{title}</span>
        <span className={`${statusColor} px-1.5 py-0.5 rounded text-xs font-bold text-white flex-shrink-0`}>
          {statusText[0]}
        </span>
      </div>
    </div>
  )
}

export default EventTag