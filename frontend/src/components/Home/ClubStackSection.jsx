import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const clubLogos = [
  { src: '/clublogos/bwLogos/CEAR.svg', name: 'CEAR' },
  { src: '/clublogos/bwLogos/CP.svg', name: 'CP Club' },
  { src: '/clublogos/bwLogos/Cycling Club.svg', name: 'Cycling Club' },
  { src: '/clublogos/bwLogos/DDQ.svg', name: 'DDQ' },
  { src: '/clublogos/bwLogos/E Cell.svg', name: 'E Cell' },
  { src: '/clublogos/bwLogos/EV .svg', name: 'EV Club' },
  { src: '/clublogos/bwLogos/GDG.svg', name: 'GDG AIT' },
  { src: '/clublogos/bwLogos/GDXR.svg', name: 'GDXR' },
  { src: '/clublogos/bwLogos/ISDF.svg', name: 'ISDF' },
  { src: '/clublogos/bwLogos/MagBoard.svg', name: 'MagBoard' },
  { src: '/clublogos/bwLogos/OSS.svg', name: 'OSS Club' },
  { src: '/clublogos/bwLogos/PR Cell.svg', name: 'PR Cell' },
  { src: '/clublogos/bwLogos/Radio Raga.svg', name: 'Radio Raga' },
  { src: '/clublogos/bwLogos/Rotaract.svg', name: 'Rotaract' },
  { src: '/clublogos/bwLogos/Spiritual Club.svg', name: 'Spiritual Club' },
  { src: '/clublogos/bwLogos/Technical Board.svg', name: 'Technical Board' },
];

export function ClubStackSection() {
  const [hoveredClub, setHoveredClub] = useState(null);

  /*
   * Tasks:
   * - [x] Verify matte aesthetic
   * - [x] Create walkthrough
   * - [x] Implement `ClubStackSection.jsx`
   * - [x] Integrate `ClubStackSection` into `Home.tsx`
   * - [x] Verify hover interactions and responsiveness
   * - [x] Correct club names in `ClubStackSection.jsx` based on new filenames
   * - [x] Verify hover text matches logos
   */
  return (
    <section className="my-20 md:my-32 pt-12 pb-4 px-6 sm:px-8 max-w-[1200px] mx-auto w-full relative z-10 font-mono">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Dynamic Heading */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center min-h-[120px]">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tight text-white leading-tight">
            Works with <br />
            <span className="relative inline-block min-h-[1.2em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={hoveredClub || 'Nexus clubs'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="text-gray-400 block"
                >
                  {hoveredClub || 'all AIT Clubs'}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
        </div>

        {/* Right Side: Logo Grid */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-10">
            {clubLogos.map((club, idx) => (
              <div
                key={idx}
                className="group relative flex items-center justify-center p-4 transition-all duration-300"
                onMouseEnter={() => setHoveredClub(club.name)}
                onMouseLeave={() => setHoveredClub(null)}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/10" />
                
                <img
                  src={club.src}
                  alt={club.name}
                  className="w-full max-h-12 object-contain opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 relative z-10 grayscale brightness-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent blur-3xl" />
      </div>
    </section>
  );
}
