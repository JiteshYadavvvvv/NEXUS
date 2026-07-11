import React from 'react';
import { cn } from "@/lib/utils";

export default function ClubCard({ abbr, name, fullForm, img, desc, activities = [], who, keywords = [], events = [], media = [], secretaries = [], insta, onApply, onDetails }) {

  return (
    <article className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 flex flex-col border border-white/5 bg-white/2 h-full w-full">
      <div className="relative z-10 flex flex-col h-full w-full p-5 md:p-6">
        
        <div className="flex items-center gap-4 mb-5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 border border-white/10 shrink-0 p-1.5 opacity-60 group-hover:opacity-100 group-hover:bg-white/10 transition-all duration-300">
            <img src={img} alt={`${name} logo`} className="w-full h-full object-contain filter grayscale brightness-200 transition-all duration-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white leading-tight">{name}</h3>
            {fullForm && <span className="text-xs text-gray-500 uppercase tracking-wider font-medium block mt-0.5">{fullForm}</span>}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-gray-500 group-hover:text-gray-400 transition-colors mb-6">
          {desc}
        </p>

        <div className="mt-auto flex flex-col">
          {keywords && keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {keywords.map((k, idx) => (
                <span key={k + idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/5 text-gray-400 border border-white/5">
                  {k}
                </span>
              ))}
            </div>
          )}

          {activities && activities.length > 0 && (
            <div className="mb-6 pt-5 border-t border-white/5">
              <p className="text-xs leading-relaxed text-gray-400">
                Key activities include <span className="text-gray-300 font-medium">{activities.join(", ")}</span>.
              </p>
            </div>
          )}

          {events && events.length > 0 && (
             <div className="mb-6 pt-5 border-t border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-gray-600 font-bold mb-2">Events Highlights</div>
                <div className="flex flex-wrap gap-2">
                  {events.map((e, i) => (
                    <span key={abbr + '-evt-' + i} className="text-xs text-gray-300">
                      {e}{i < events.length - 1 && <span className="text-gray-600 ml-2">•</span>}
                    </span>
                  ))}
                </div>
              </div>
          )}

          <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
            {who && (
               <div className="text-xs text-gray-500 mb-1">
                  Open to: <span className="text-gray-300 font-medium">{who}</span>
               </div>
            )}
          
          <div className="grid grid-cols-2 gap-3 mt-2">
            <button 
              className="py-2.5 px-4 bg-white hover:bg-gray-200 text-black font-semibold text-sm rounded-lg transition-all duration-300 active:scale-95 flex items-center justify-center tracking-wide"
              onClick={() => onApply(abbr, name)}
            >
              Apply
            </button>
            <button
              className="py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm rounded-lg border border-white/10 transition-all duration-300 active:scale-95 flex items-center justify-center tracking-wide"
              onClick={() => onDetails && onDetails({ name, fullForm, img, desc, insta, secretaries })}
            >
              Details
            </button>
          </div>
        </div>
        </div>
        
      </div>
    </article>
  );
}
