import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiLinkedin, SiInstagram, SiGithub } from 'react-icons/si';
import LogoLoop from './LogoLoop';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const socialLogos = [
    { node: <SiGithub />, title: "GitHub", href: "https://github.com/Jitesh-Yadav01/SYNC-AIT" },
    { node: <SiLinkedin />, title: "LinkedIn", href: "https://in.linkedin.com/company/gdsc-aitpune" },
    { node: <SiInstagram />, title: "Instagram", href: "https://www.instagram.com/gdsc_aitpune/" },
];

export default function Footer() {
    const footerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const elements = footerRef.current.querySelectorAll("[data-scroll-animation]");
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
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} id="footer" className="c-footer_section">
            <section id="early-access" className="c-footer_contact-section">
                <div className="c-footer_logoloop-wrapper" data-scroll-animation="0">
                    <LogoLoop
                        logos={socialLogos}
                        speed={35}
                        direction="left"
                        logoHeight={32}
                        gap={48}
                        hoverSpeed={0}
                        scaleOnHover
                        fadeOut
                        fadeOutColor="#ffffff"
                        ariaLabel="Connect with NEXUS"
                    />
                </div>

                <div className="c-footer_container">
                    <div className="c-footer_form-block u-form">
                        <div className="c-footer_contact-wrapper" data-scroll-animation="0">
                            <div className="c-footer_contact-left">
                                <img src="/clublogos/bwLogos/GDG.svg" alt="GDG On Campus AIT" className="c-footer_join-logo" />
                                <h3 className="c-footer_heading-large">JOIN NEXUS</h3>
                                <div className="c-footer_divider-large"></div>
                                <div className="c-footer_text-wrapper">
                                    <p className="c-footer_description-text">The central club platform for Army Institute of Technology, Pune. Discover clubs, track events, and stay connected — all in one place.</p>
                                </div>
                            </div>

                            <div className="c-footer_contact-right">
                                <h3 className="c-footer_heading-large">MADE BY GDG-AIT</h3>
                                <div className="c-footer_divider-large"></div>
                                <div className="c-footer_text-wrapper">
                                    <p className="c-footer_description-text">Made with ❤️ by GDG On Campus AIT — the student developer community at AIT Pune. Developers, designers, and builders who learn, collaborate, and ship real projects like NEXUS together.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="c-footer_branding">
                <div className="c-footer_branding-lockup">
                    <img src="/nexus.svg" alt="NEXUS" className="c-footer_branding-logo" />
                    <div className="c-footer_branding-separator" aria-hidden="true"></div>
                    <img src="/clublogos/google-developers.svg" alt="GDG On Campus AIT" className="c-footer_branding-gdg" />
                </div>
            </div>
        </footer>
    );
}
