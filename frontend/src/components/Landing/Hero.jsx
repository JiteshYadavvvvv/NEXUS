import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LineWaves from "../LineWaves/LineWaves";

const SPLINE_OVERLAY_1 =
  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)";
const SPLINE_OVERLAY_2 =
  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, rgba(0,0,0,0.05) 100%)";
const BOTTOM_VIGNETTE =
  "linear-gradient(to top, #000 0%, #000 2%, rgba(0,0,0,0.738) 5%, rgba(0,0,0,0.541) 6%, rgba(0,0,0,0.382) 8%, rgba(0,0,0,0.278) 9%, rgba(0,0,0,0.194) 10.5%, rgba(0,0,0,0.126) 12%, rgba(0,0,0,0.075) 13%, rgba(0,0,0,0.042) 13.8%, rgba(0,0,0,0.021) 14.4%, rgba(0,0,0,0.008) 14.8%, transparent 15%)";
const CONTAINER_MARGIN = "20px";
const CONTAINER_WIDTH_CALC = () => `calc(100% - 40px)`;

function Number({ mv, number, height }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });
  const style = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return <motion.span style={{ ...style, y }}>{number}</motion.span>;
}

function Digit({ place, value, height, digitStyle }) {
  let valueRoundedToPlace = Math.floor(value / place);
  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 100,
    damping: 20,
  });
  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);
  const defaultStyle = {
    height,
    position: "relative",
    width: "1ch",
    fontVariantNumeric: "tabular-nums",
  };
  return (
    <div style={{ ...defaultStyle, ...digitStyle }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

function Counter({
  value,
  fontSize = 100,
  padding = 0,
  places = [100, 10, 1],
  gap = 8,
  borderRadius = 4,
  horizontalPadding = 8,
  textColor = "white",
  fontWeight = "bold",
  containerStyle,
  counterStyle,
  digitStyle,
}) {
  const height = fontSize + padding;
  const defaultContainerStyle = {
    position: "relative",
    display: "inline-block",
  };
  const defaultCounterStyle = {
    fontSize,
    display: "flex",
    gap: gap,
    overflow: "hidden",
    borderRadius: borderRadius,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    lineHeight: 1,
    color: textColor,
    fontWeight: fontWeight,
  };
  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <div style={{ ...defaultCounterStyle, ...counterStyle }}>
        {places.map((place) => (
          <Digit
            key={place}
            place={place}
            value={value}
            height={height}
            digitStyle={digitStyle}
          />
        ))}
      </div>
    </div>
  );
}

function TimeDisplay({ hour, minute, seconds, fontSize }) {
  const renderCounter = (value) => (
    <Counter
      value={value}
      fontSize={fontSize}
      padding={0}
      places={[10, 1]}
      gap={0}
      borderRadius={0}
      horizontalPadding={0}
      textColor="#b3b3b3"
      fontWeight={400}
      containerStyle={{ marginRight: 0 }}
      counterStyle={{ marginRight: 0 }}
      digitStyle={{ marginRight: 0 }}
    />
  );
  return (
    <div className="flex items-center gap-0" style={{ lineHeight: 1 }}>
      {renderCounter(hour)}
      <span>:</span>
      {renderCounter(minute)}
      <span>:</span>
      {renderCounter(seconds)}
    </div>
  );
}

export default function Hero({ entered }) {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [location, setLocation] = useState("");

  const splineContainerRef = useRef(null);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const heroParallaxRef = useRef(null);
  const ghostRef = useRef(null);
  const fixedBgRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHour(now.getHours());
      setMinute(now.getMinutes());
      setSeconds(now.getSeconds());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("https://ipwho.is/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.city && data.country)
          setLocation(`${data.city}, ${data.country}`);
        else if (data && data.country) setLocation(data.country);
        else setLocation("");
      })
      .catch(() => setLocation(""));
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!entered || !heroParallaxRef.current || !ghostRef.current || !fixedBgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroParallaxRef.current,
        { scale: 1, rotateX: 0, y: 0, filter: "brightness(1) saturate(1)" },
        {
          scale: 0.9,
          rotateX: 7,
          y: 10,
          filter: "brightness(0.5) saturate(1)",
          ease: "power1.out",
          scrollTrigger: {
            trigger: ghostRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      gsap.to(fixedBgRef.current, {
        backgroundColor: "#000000",
        ease: "none",
        scrollTrigger: {
          trigger: ghostRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

    }, ghostRef);
    return () => ctx.revert();
  }, [entered]);

  // No external 3D scene / image anymore — mark the hero "loaded" right away so
  // it reveals immediately and the ParticleLoader lets the user in without delay.
  useEffect(() => {
    setSplineLoaded(true);
    window.dispatchEvent(new CustomEvent("splineLoaded"));
  }, []);

  useEffect(() => {
    if (!entered || !splineLoaded || !splineContainerRef.current) return;
    gsap.set(splineContainerRef.current, {
      opacity: 0,
      scale: 0.9,
      transformOrigin: "50% 50%",
      force3D: true,
      willChange: "transform, opacity",
    });
    gsap.to(splineContainerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1.6,
      ease: "power3.out",
      delay: 0.06,
      force3D: true,
      overwrite: true,
    });
  }, [splineLoaded, entered]);

  return (
    <div ref={ghostRef} className="relative w-full h-screen">
      <div
        ref={fixedBgRef}
        className="fixed top-0 left-0 h-screen w-full -z-10 overflow-hidden bg-[#212125]"
        style={{ perspective: "1200px" }}
      >
        <div className="absolute inset-0 w-full h-full bg-grid-pattern animate-grid-scroll pointer-events-none opacity-100"></div>
        <div
          ref={heroParallaxRef}
          className="relative w-full h-full flex items-center justify-center transition-opacity duration-700"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="relative z-30 w-full h-full flex items-center justify-center">
            <div
              ref={splineContainerRef}
              className="relative w-full h-full md:w-[calc(100%-40px)] md:h-[calc(100%-40px)] md:m-[20px] md:max-h-[calc(100vh-40px)] md:rounded-[24px]"
              style={{
                overflow: "hidden",
                willChange: "transform, opacity",
                transformOrigin: "center center",
                transform: "translateZ(0)",
                opacity: 0,
              }}
            >
              {/* Animated wave field — the hero background canvas. Sits below all
                  gradient overlays (z 10/20/30) and the NEXUS tagline (z 40). */}
              <div
                className="absolute inset-0 bg-black md:rounded-[24px] overflow-hidden"
                style={{ zIndex: 0 }}
              >
                <LineWaves
                  speed={0.3}
                  innerLineCount={32}
                  outerLineCount={36}
                  warpIntensity={1.0}
                  rotation={-45}
                  brightness={0.2}
                  colorCycleSpeed={1.0}
                  color1="#ffffff"
                  color2="#ffffff"
                  color3="#ffffff"
                  enableMouseInteraction={true}
                  mouseInfluence={2.0}
                />
              </div>

              <div
                className="absolute inset-0 pointer-events-none rounded-[15px] md:rounded-[24px] box-border"
                style={{
                  background: SPLINE_OVERLAY_1,
                  zIndex: 10,
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none md:rounded-[24px]"
                style={{
                  background: SPLINE_OVERLAY_2,
                  zIndex: 20,
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none md:rounded-[24px]"
                style={{
                  background: BOTTOM_VIGNETTE,
                  zIndex: 30,
                }}
              />

              {/* Hero tagline — replaces the "Coming Soon / Ambition meets
                  Automation" copy baked into the Spline scene / fallback image. */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none select-none"
                style={{ zIndex: 40, fontFamily: '"Chakra Petch", sans-serif' }}
              >
                <h1
                  className="uppercase leading-none"
                  style={{
                    fontSize: "clamp(3rem, 12vw, 8rem)",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#ffffff",
                    textShadow: "0 2px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  NEXUS
                </h1>
                <p
                  className="mt-4 text-sm sm:text-base md:text-lg"
                  style={{ letterSpacing: "0.02em", maxWidth: "40ch" }}
                >
                  <span style={{ color: "#ffffff" }}>The project that syncs </span>
                  <span style={{ color: "#9ca3af" }}>all the clubs of AIT</span>
                </p>
              </div>

              <div
                className="absolute left-0 bottom-0 pl-8 pb-6 text-xs text-white/70 select-none"
                style={{
                  zIndex: 50,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 0,
                }}
              >
                <TimeDisplay
                  hour={hour}
                  minute={minute}
                  seconds={seconds}
                  fontSize={12}
                />
              </div>
              <div
                className="absolute right-0 bottom-0 pr-8 pb-6 text-xs text-white/70 select-none"
                style={{ zIndex: 50 }}
              >
                {location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}