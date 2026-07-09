import React, { useEffect, useRef } from 'react';

const CustomScrollbar = () => {
  const thumbRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimeout = useRef(null);
  const thumbHeight = 48;

  useEffect(() => {
    let ticking = false;
    let trackHeight = 0;

    const computeTrack = () => {
      if (!containerRef.current) return
      trackHeight = containerRef.current.getBoundingClientRect().height
    }

    const handleScroll = () => {
      if (!thumbRef.current || !containerRef.current) return;

      containerRef.current.style.opacity = '1';

      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
          if (scrollHeight <= clientHeight) {
            // hide if no scroll
            if (hideTimeout.current) clearTimeout(hideTimeout.current);
            hideTimeout.current = setTimeout(() => { if (containerRef.current) containerRef.current.style.opacity = '0' }, 800);
            ticking = false
            return
          }

          const scrollRatio = scrollTop / (scrollHeight - clientHeight);
          if (!trackHeight) computeTrack()
          const maxTranslate = Math.max(0, trackHeight - thumbHeight);
          const translateY = scrollRatio * maxTranslate;

          thumbRef.current.style.transform = `translateY(${translateY}px)`;

          if (hideTimeout.current) clearTimeout(hideTimeout.current);
          hideTimeout.current = setTimeout(() => {
            if (containerRef.current) containerRef.current.style.opacity = '0';
          }, 800);

          ticking = false
        })
      }
    }

    // Initialize
    computeTrack()
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => { computeTrack(); handleScroll(); }, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', computeTrack);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hidden md:block fixed right-2 top-1/2 -translate-y-1/2 h-[30vh] w-2 z-9999 opacity-0 transition-opacity duration-500 ease-out pointer-events-none mix-blend-difference"
    >
      <div className="absolute inset-0 bg-white rounded-full opacity-20" />
      <div
        ref={thumbRef}
        className="w-full bg-white rounded-full shadow-sm"
        style={{
          height: `${thumbHeight}px`,
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export default CustomScrollbar;