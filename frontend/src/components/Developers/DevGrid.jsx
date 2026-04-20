import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DevCard from "./DevCard";
import LaserFlow from "./LaserFlow";

gsap.registerPlugin(ScrollTrigger);

const allDevelopers = [
  {
    name: "Aryan Singh",
    role: "WEB DEV Facilitator",
    image: "/clubprofiles/ns.png",
    username: "@johndoe",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Nishant Singh",
    role: "GDG Secretary",
    image: "/clubprofiles/ns.png",
    username: "@nishant",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  
  {
    name: "Jitesh Yadav",
    role: "Dev X UI/UX",
    image: "/clubprofiles/ns.png",
    username: "londa sakht",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Sajal Rawat",
    role: "Web Developer",
    image: "/clubprofiles/ns.png",
    username: "@alicej",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "Vishal Goswami",
    role: "Web Developer",
    image: "/clubprofiles/ns.png",
    username: "@bobbrown",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  {
    name: "xxxxx",
    role: "xxxxx",
    image: "/clubprofiles/ns.png",
    username: "@xxxxx",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  }
];

const DevGrid = () => {
  const gridRef = useRef(null);
  const containerRef = useRef(null);
  const revealImgRef = useRef(null);

  useEffect(() => {
    ScrollTrigger.getAll().forEach(t => {
      if (t.vars.trigger === gridRef.current) {
        t.kill();
      }
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dev-card-element",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || !revealImgRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update variables for the reveal image effect overlay that covers the section
    revealImgRef.current.style.setProperty('--mx', `${x}px`);
    revealImgRef.current.style.setProperty('--my', `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!revealImgRef.current) return;
    revealImgRef.current.style.setProperty('--mx', '-9999px');
    revealImgRef.current.style.setProperty('--my', '-9999px');
  };

  if (allDevelopers.length === 0) {
    return (
      <div className="w-full text-center py-20 text-zinc-500">
        <p>No developers found.</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full bg-transparent mt-0 pb-24"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
     
      <div className="absolute -top-[320px] left-0 right-0 h-[800px] z-[0] pointer-events-none">
        <LaserFlow 
          color="#f4f4f5" 
          wispDensity={1.2}
          wispIntensity={8}
          wispSpeed={15}
          flowStrength={0.4} 
        />
      </div>

     
      <div
        ref={revealImgRef}
        className="absolute inset-0 -top-[320px] z-[5] mix-blend-lighten pointer-events-none opacity-40"
        style={{
          '--mx': '-9999px',
          '--my': '-9999px',
          backgroundImage: 'radial-gradient(circle at 10px 10px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '30px 30px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.8) 100px, transparent 350px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.8) 100px, transparent 350px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        }}
      />

      
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mt-[80px] flex justify-center">
 
        <div className="w-fit mx-auto bg-zinc-900 rounded-[24px] border border-white/5 shadow-[0_-10px_60px_rgba(255,255,255,0.02)] relative overflow-hidden px-3 py-4 sm:px-4 sm:py-5 lg:px-5 lg:py-6">
           
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-gradient-to-r from-transparent via-zinc-400 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.4)] z-[2]" />

           {/* Cards Grid */}
           <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 relative z-10">
             {allDevelopers.map((dev, index) => {
               return <DevCard key={`${dev.username}-${index}`} dev={dev} />;
             })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default DevGrid;
