import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, MapPin, Clock, ExternalLink, Sparkles, X } from 'lucide-react';
import { cn } from "@/lib/utils";

// overlay
const DescriptionModal = ({ isOpen, onClose, eventName, club, description }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.cursor = 'none';
    }
    return () => { 
      document.body.style.overflow = 'unset'; 
      document.body.style.cursor = 'none';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // portal
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/95 animate-in fade-in duration-300 cursor-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-black border border-white/20 shadow-[0_0_50px_rgba(0,0,0,1)] flex flex-col animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black">
          <div>
            <h3 className="text-xl font-bold text-white leading-tight">{eventName}</h3>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mt-1 block">
              {club || 'Campus Event'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-black text-white">
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-700 mb-2">Full Description</span>
               <p className="text-base leading-relaxed text-zinc-200 whitespace-pre-wrap font-mono">
                 {description || "No detailed description available for this event."}
               </p>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="p-6 border-t border-white/10 bg-black flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white text-black font-extrabold text-sm rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// card
export default function EventCard({ event }) {
  const { eventName, date, time, venue, postUrl, club, description } = event;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const eventDate = new Date(date);
  const isUpcoming = eventDate >= new Date().setHours(0, 0, 0, 0);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <article className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-white/5 bg-white/2 h-full w-full">
        <div className="relative z-10 flex flex-col h-full w-full p-5 md:p-6">
          
          {/* stats */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 shrink-0 p-2.5 opacity-60 group-hover:opacity-100 group-hover:bg-white/10 transition-all duration-300">
              <Sparkles className="w-full h-full text-zinc-400" />
            </div>
            <span className={cn(
              "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
              isUpcoming 
                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                : "bg-gray-500/10 text-gray-500 border-gray-500/20"
            )}>
              {isUpcoming ? 'Upcoming' : 'Ended'}
            </span>
          </div>

          {/* info */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white leading-tight">
              {eventName}
            </h3>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium block mt-1">
              {club || 'Campus Event'}
            </span>
          </div>

          {/* desc */}
          <div className="mb-6">
            <p className="text-sm leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors transition-all duration-300">
              {!description || description.length <= 150
                ? description || "No description available for this event. Check out the original post for more details."
                : `${description.slice(0, 150)}... `}
              
              {description && description.length > 150 && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-zinc-400 hover:text-white font-medium ml-1 transition-colors underline-offset-4 hover:underline focus:outline-none"
                >
                  Read More
                </button>
              )}
            </p>
          </div>

          {/* meta */}
          <div className="mt-auto flex flex-col gap-3 pt-5 border-t border-white/5">
            <div className="flex items-center gap-2.5 text-[13px] text-gray-400">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span>{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-gray-400">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>{time || 'TBD'}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-gray-400">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="leading-tight">{venue || 'AIT Pune'}</span>
            </div>

            {/* link */}
            <div className="pt-4 mt-2">
              <a 
                href={postUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-200 text-black font-bold text-sm rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 tracking-wide"
              >
                Learn More <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          
        </div>
      </article>

      {/* portal-trigger */}
      <DescriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        eventName={eventName}
        club={club}
        description={description}
      />
    </>
  );
}
