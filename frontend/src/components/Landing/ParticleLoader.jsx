import React, { useEffect, useRef, useState } from 'react';
import './ParticleLoader.css';

const ParticleLoader = ({ isLoaded, onEnter }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [userClicked, setUserClicked] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const mouse = useRef({ x: -1000, y: -1000 });

  const handleButtonClick = () => {
    setUserClicked(true);
    if (isLoaded) triggerExit();
  };

  const triggerExit = () => {
    setIsExiting(true);
    setTimeout(onEnter, 800);
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isLoaded) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 10);
    } else {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isLoaded]);

  useEffect(() => {
    if (userClicked && isLoaded && !isExiting) triggerExit();
  }, [isLoaded, userClicked]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h, cx, cy;
    let time = 0;
    let exitStartTime = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cx = w / 2;
      cy = h / 2;
    };

    class Particle {
      constructor(i, count) {
        this.baseAngle = (i / count) * Math.PI * 2;
        this.angle = this.baseAngle;
        this.orbitRadius = 170 + Math.random() * 50;
        this.x = cx + Math.cos(this.angle) * this.orbitRadius;
        this.y = cy + Math.sin(this.angle) * this.orbitRadius;
        this.vx = 0;
        this.vy = 0;
        this.mass = 0.01 + Math.random() * 0.02;
        this.size = Math.random() * 1.6 + 0.4;
        this.rotationSpeed = (0.001 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1);
        this.opacity = Math.random() * 0.5 + 0.4;
        this.explosionPower = 4 + Math.random() * 10;
      }

      update(exiting, currentTime) {
        if (exiting) {
          if (exitStartTime === 0) exitStartTime = currentTime;
          const elapsed = currentTime - exitStartTime;
          const angle = Math.atan2(this.y - cy, this.x - cx);

          if (elapsed < 0.4) {
            // CINEMATIC WIND-UP: Tighten before pop
            this.vx -= Math.cos(angle) * 3.5;
            this.vy -= Math.sin(angle) * 3.5;
          } else {
            // RELEASE: Radial Expansion
            this.vx += Math.cos(angle) * this.explosionPower;
            this.vy += Math.sin(angle) * this.explosionPower;
            this.opacity *= 0.96;
            this.size *= 1.01;
          }
        } else {
          const wave = Math.sin(time * 1.5 + this.baseAngle * 12) * 15 +
            Math.sin(time * 3 + this.baseAngle * 25) * 8;

          const targetR = this.orbitRadius + wave;
          this.angle += this.rotationSpeed;
          const tx = cx + Math.cos(this.angle) * targetR;
          const ty = cy + Math.sin(this.angle) * targetR;

          // MEDIUM SIZE MOUSE INTERACTION
          const dx = this.x - mouse.current.x;
          const dy = this.y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 50) {
            const scatter = (50 - dist) / 50;
            this.vx += (dx / dist) * scatter * 5;
            this.vy += (dy / dist) * scatter * 5;
          }

          this.vx += (tx - this.x) * this.mass;
          this.vy += (ty - this.y) * this.mass;
        }

        this.vx *= 0.93;
        this.vy *= 0.93;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        if (speed > 6) {
          // Motion blur for the cinematic wind-up/explosion
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 90000})`;
          ctx.lineWidth = this.size;
          ctx.lineCap = 'round';
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x - this.vx * 0.4, this.y - this.vy * 0.4);
          ctx.stroke();
        } else {
          // Reference-accurate "Energy Dust" with soft glow layer
          ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();

          if (Math.random() > 0.9) {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.4})`;
            ctx.beginPath();
            ctx.arc(this.x + (Math.random() - 0.5) * 2, this.y + (Math.random() - 0.5) * 2, this.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < 900; i++) particles.push(new Particle(i, 900));
    };

    const loop = () => {
      time += 0.01;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.update(isExiting, time);
        p.draw();
      });
      requestRef.current = requestAnimationFrame(loop);
    };

    init();
    loop();
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [isExiting]);

  return (
    <div className={`loader-overlay ${isExiting ? 'is-exiting' : ''}`}>
      <canvas ref={canvasRef} className="loader-canvas" />
      <div className={`loader-content ${isExiting ? 'content-out' : ''}`}>
        <h3 className="loader-title">NEXUS</h3>
        <p className="loader-subtitle">{Math.round(progress)}%</p>
        <button
          className={`loader-button ${userClicked && !isLoaded ? 'waiting' : ''}`}
          onClick={handleButtonClick}
          disabled={userClicked && !isLoaded}
          style={{ pointerEvents: userClicked ? 'none' : 'all' }}
        >
          {userClicked && !isLoaded ? "PREPARING..." : "ENTER"}
        </button>
      </div>
    </div>
  );
};

export default ParticleLoader;