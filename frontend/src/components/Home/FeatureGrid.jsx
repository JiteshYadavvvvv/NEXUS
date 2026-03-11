import React from 'react';
import { Users, Calendar, Bell, ClipboardCheck, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Discover & Join Communities",
    description: "Find your tribe. Explore a diverse range of student-led clubs, from technical boards to cultural societies. Join with a single click and dive into campus life.",
    icon: Users,
    className: "md:col-span-2",
  },
  {
    title: "Centralized Event Hub",
    description: "Never miss out. Keep track of upcoming workshops, hackathons, and cultural fests all in one seamless calendar.",
    icon: Calendar,
    className: "col-span-1",
  },
  {
    title: "Instant Announcements",
    description: "Stay in the loop with real-time updates and important broadcasts directly from your club leads.",
    icon: Bell,
    className: "col-span-1",
  },
  {
    title: "Effortless Recruitment",
    description: "Apply to your favorite clubs through a unified, transparent, and hassle-free application process.",
    icon: ClipboardCheck,
    className: "col-span-1",
  },
  {
    title: "Showcase Projects",
    description: "Highlight your club's achievements, open-source contributions, and stunning portfolios to the whole campus.",
    icon: Sparkles,
    className: "col-span-1",
  }
];

export function FeatureGrid() {
  return (
    <section className="py-14 px-6 sm:px-8 max-w-[1200px] mx-auto w-full relative z-10">
      
      {/* Section Header */}
      <div className="mb-12 md:mb-16 mt-8 md:mt-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Think fast. <br className="hidden sm:block" />
          <span className="text-blue-500">Connect faster.</span>
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
          The ultimate foundation for campus innovation. Discover clubs, manage events, and engage with your student community like never before.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div 
              key={idx}
              className={cn(
                "group relative overflow-hidden rounded-xl p-[1px] transition-all duration-300 hover:-translate-y-1 flex flex-col",
                feature.className
              )}
            >
              {/* Rotating background layer (only visible on hover) */}
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div 
                  className="absolute inset-[-100%] z-0" 
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0 340deg, #3b82f6 360deg)',
                    animation: 'spin-border 3s linear infinite'
                  }} 
                />
              </div>

              {/* The actual card content wrapper (blocks the center of the rotating background) */}
              <div className="relative z-10 flex flex-col h-full w-full bg-black/40 backdrop-blur-md rounded-[11px] p-5 md:p-6">
              {/* Subtle gradient glow effect behind the card content */}
              <div className="absolute top-0 right-0 -m-8 h-32 w-32 rounded-full bg-blue-600/20 blur-2xl transition-all duration-500 group-hover:bg-blue-500/30" />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-950/50 border border-blue-800/50 text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                
                <p className="text-sm leading-relaxed text-gray-400 flex-grow">
                  {feature.description}
                </p>

                {/* Optional visual placeholder for illustrations */}
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-500 group-hover:text-blue-400 transition-colors uppercase tracking-wider">Explore Feature</span>
                    <svg className="h-4 w-4 text-blue-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
              </div>
              </div> {/* Close inner wrapper */}
            </div>
          );
        })}
      </div>

    </section>
  );
}
