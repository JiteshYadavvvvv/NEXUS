import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import NavBar from "./NavBar.jsx";
import Hero from "./Hero.jsx";
import Section from "./Section.jsx";
import ParticleLoader from "./ParticleLoader.jsx";
import CustomScrollbar from "./CustomScrollbar.jsx";
import CustomCursor from "./CustomCursor.jsx";
import "./landing.css";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const lenisRef = useRef(null);

  // Listen for the Spline scene (or mobile fallback image) reporting ready.
  useEffect(() => {
    const handleSplineLoaded = () => setIsSplineLoaded(true);
    window.addEventListener("splineLoaded", handleSplineLoaded);
    // No external 3D scene to wait on anymore — mark ready almost immediately
    // so the loader just plays its brief entrance animation instead of stalling.
    const fallback = setTimeout(() => setIsSplineLoaded(true), 600);
    return () => {
      window.removeEventListener("splineLoaded", handleSplineLoaded);
      clearTimeout(fallback);
    };
  }, []);

  // Lock scroll until the user enters, then release it — and snap to the very
  // top on enter so the page always starts at the hero after the loader.
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    if (entered) {
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, { immediate: true });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  // While the landing is mounted: hide the OS cursor (it has its own
  // CustomCursor) and the native scrollbar (it has its own CustomScrollbar),
  // and don't let the browser restore a previous scroll position.
  useEffect(() => {
    const previousCursor = document.body.style.cursor;
    const hadRestoration = "scrollRestoration" in window.history;
    const previousRestoration = hadRestoration ? window.history.scrollRestoration : null;

    document.body.style.cursor = "none";
    document.documentElement.classList.add("landing-active");
    if (hadRestoration) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      document.body.style.cursor = previousCursor;
      document.documentElement.classList.remove("landing-active");
      if (hadRestoration) window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  // Smooth scrolling (Lenis) wired to GSAP ScrollTrigger — scoped to this page.
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.5, smoothWheel: true });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Refresh triggers once content is revealed so pinned sections measure correctly.
  useEffect(() => {
    if (entered) {
      const t = setTimeout(() => ScrollTrigger.refresh(), 200);
      return () => clearTimeout(t);
    }
  }, [entered]);

  return (
    <div className="spacebears-landing">
      {!entered && (
        <ParticleLoader
          isLoaded={isSplineLoaded}
          onEnter={() => setEntered(true)}
        />
      )}
      <CustomCursor />
      <CustomScrollbar />
      <NavBar entered={entered} />
      <Hero entered={entered} />
      <Section />
    </div>
  );
}
