import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "../assets/SystFlowLogo.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function NavBar({ entered }) {
  const navRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  });

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleScrollToTop = () => {
    gsap.to(window, { duration: 2, scrollTo: { y: 0 }, ease: "power2.inOut" });
  };






  const handleEarlyAccessClick = () => {
    gsap.to(window, {
      duration: 2.5,
      scrollTo: { y: "#early-access", offsetY: 50 },
      ease: "power2.inOut"
    });
    setIsMobileMenuOpen(false);
  };
  useGSAP(() => {
    if (!entered) return;
    const startPoint = window.innerHeight * 0.4;
    const endPoint = window.innerHeight * 0.55;

    gsap.to(navRef.current, {
      maxWidth: "600px",
      ease: "power2.out",
      scrollTrigger: {
        trigger: document.body,
        start: `${startPoint}px top`,
        end: `${endPoint}px top`,
        scrub: 1,
      },
    });
  }, [entered]);

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

      <div className={`fixed top-0 left-0 right-0 z-50 pt-13 px-6 flex justify-center ${entered ? "nav-entry" : "opacity-0"}`}>
        <div
          ref={navRef}
          className="relative w-full max-w-337.5 flex items-center justify-between px-6 transition-colors duration-300"
          style={{
            height: "50px",
            backgroundColor: "rgba(38, 38, 38, 0.8)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: "14px",
            boxShadow: "inset 0px 1px 1px 1px rgba(255, 255, 255, 0.1)",
            fontFamily: '"Chakra Petch", sans-serif',
          }}
        >
          <div
            link-cursor="true"
            className="relative z-20 flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleScrollToTop}
          >
            <img
              src={logo}
              alt="SystFlow"
              className="h-6 w-auto object-contain"
            />
            <span
              className="font-semibold text-[16px] tracking-tight"
              style={{ color: "rgb(234, 231, 224)" }}
            >
              SystFlow
            </span>
          </div>



          <div className="relative z-20 flex items-center">
            <button
              className="md:hidden text-[#EAE7E0] opacity-80 hover:opacity-100 transition-opacity p-1"
              aria-label="Menu"
              onClick={toggleMenu}
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              )}
            </button>

            <button link-cursor="true"
              className="hidden md:inline-flex items-center justify-center px-4 py-1.5 transition-transform active:scale-95"
              style={{
                backgroundColor: "rgb(234, 231, 224)",
                color: "#000",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                boxShadow: "inset 0px 2px 1px 1px rgb(255, 255, 255)",
              }}
              onClick={handleEarlyAccessClick}
            >
              Early Access
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-full left-6 right-6 mt-2 md:hidden overflow-hidden"
              style={{
                backgroundColor: "rgba(38, 38, 38, 0.9)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                zIndex: 49,
                fontFamily: '"Chakra Petch", sans-serif',
              }}
            >
              <div className="flex flex-col p-4 gap-4">
                <button
                  className="w-full py-2.5 rounded-lg text-sm font-semibold transition-transform active:scale-95"
                  style={{
                    backgroundColor: "rgb(234, 231, 224)",
                    color: "#000",
                  }}
                  onClick={handleEarlyAccessClick}
                >
                  Early Access
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
