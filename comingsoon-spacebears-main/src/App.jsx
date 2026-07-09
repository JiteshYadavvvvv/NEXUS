import React, { useState, useEffect } from "react";
import { Contact } from "lucide-react";
import Hero from "./components/Hero.jsx";
import NavBar from "./components/NavBar.jsx";
import Section from "./components/Section.jsx";
import CustomCursor from "./components/ui/components/CustomCursor.jsx";
import CustomScrollbar from "./components/ui/components/CustomScrollbar.jsx";
import ParticleLoader from "./components/ParticleLoader.jsx";

function App() {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const handleSplineLoaded = () => setIsSplineLoaded(true);
    window.addEventListener("splineLoaded", handleSplineLoaded);
    return () => {
      window.removeEventListener("splineLoaded", handleSplineLoaded);
    };
  }, []);

  useEffect(() => {
    if (entered) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [entered]);

  return (
    <>
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
    </>
  );
}

export default App;
