import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// NEXUS navigation routes kept in the cloned pill navbar.
const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Clubs", to: "/clubs" },
  { label: "Developers", to: "/developers" },
];

const GITHUB_URL = "https://github.com/JiteshYadavvvvv/NEXUS";

export default function NavBar({ entered }) {
  const navRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen((v) => !v);

  const handleScrollToTop = () => {
    gsap.to(window, { duration: 1.4, scrollTo: { y: 0 }, ease: "power2.inOut" });
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .nav-entry {
          animation: slideDown 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>

      <div
        className={`fixed top-0 left-0 right-0 z-50 pt-6 px-6 flex justify-center ${
          entered ? "nav-entry" : "opacity-0"
        }`}
      >
        <div
          ref={navRef}
          className="relative w-full max-w-[1080px] flex items-center justify-between gap-4 px-4 sm:px-6 transition-colors duration-300"
          style={{
            height: "56px",
            backgroundColor: "rgba(24, 24, 27, 0.72)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "14px",
            boxShadow: "inset 0px 1px 1px 1px rgba(255, 255, 255, 0.08)",
            fontFamily: '"Chakra Petch", sans-serif',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            link-cursor="true"
            className="relative z-20 flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={handleScrollToTop}
          >
            <img
              src="/nexus.svg"
              alt="NEXUS"
              className="w-auto object-contain"
              style={{ height: "30px" }}
            />
          </Link>

          {/* Desktop nav routes (centered) */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-7 lg:gap-9">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                link-cursor="true"
                className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                style={{ fontFamily: '"Chakra Petch", sans-serif' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="relative z-20 flex items-center gap-2 flex-shrink-0">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              link-cursor="true"
              aria-label="GitHub repository"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all hover:-translate-y-0.5 active:scale-95 duration-300"
            >
              <Github size={16} strokeWidth={2} />
            </a>

            <Link
              to="/get-started"
              link-cursor="true"
              className="hidden md:inline-flex items-center justify-center px-4 py-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "#ffffff",
                color: "#000",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                boxShadow: "inset 0px 2px 1px 1px rgb(255, 255, 255)",
              }}
            >
              Login
            </Link>

            <button
              className="md:hidden text-white opacity-80 hover:opacity-100 transition-opacity p-1"
              aria-label="Menu"
              onClick={toggleMenu}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-6 right-6 mt-2 md:hidden overflow-hidden"
              style={{
                backgroundColor: "rgba(24, 24, 27, 0.95)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                zIndex: 49,
                fontFamily: '"Chakra Petch", sans-serif',
              }}
            >
              <div className="flex flex-col p-4 gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="w-full py-2.5 px-2 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/10 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/get-started"
                  className="w-full mt-2 py-2.5 rounded-lg text-sm font-semibold text-center transition-transform active:scale-95"
                  style={{ backgroundColor: "#ffffff", color: "#000" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
