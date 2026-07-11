import React, { useEffect, useRef } from 'react';
import { SplitText } from './SplitText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Launching.css';

gsap.registerPlugin(ScrollTrigger);

export default function Launching() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const elements = sectionRef.current.querySelectorAll("[data-scroll-animation]");
            elements.forEach(u => {
                gsap.set(u, { opacity: 0, y: 50 });

                gsap.to(u, {
                    opacity: 1,
                    y: 0,
                    delay: parseFloat(u.dataset.scrollAnimation) || 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: u,
                        start: "top 80%",
                        toggleActions: "play pause resume reverse"
                    }
                });
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="services" ref={sectionRef} className="c-launching">
            <div className="c-launching_container">
                <div className="c-launching_button" data-scroll-animation="0">
                    <div className="c-launching_button-text">Built for AIT Pune</div>
                </div>
                <div className="c-launching_title-wrapper">
                    <SplitText tag="h2" className="c-launching_heading">
                    One platform for every club on campus. Discover events, join communities, and manage it all from a single place.
                    </SplitText>
                </div>
            </div>
        </section>
    );
}
