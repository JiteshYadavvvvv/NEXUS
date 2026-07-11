import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiLinkedin, SiDiscord } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import LogoLoop from './LogoLoop';
import './Footer.css';

gsap.registerPlugin(ScrollTrigger);

const socialLogos = [
    { node: <SiLinkedin />, title: "LinkedIn", href: "https://www.linkedin.com/company/systflow/" },
    { node: <SiDiscord />, title: "Discord", href: "https://discord.gg/zyUwd7Qc" },
    { node: <MdEmail />, title: "Email", href: "mailto:admin@systflow.dev" },
];

export default function Footer() {
    const footerRef = useRef(null);
    const [formState, setFormState] = useState({
        isSubmitting: false,
        isSuccess: false,
        isError: false,
        errorMessage: ''
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormState({ isSubmitting: true, isSuccess: false, isError: false, errorMessage: '' });

        const formData = new FormData(e.target);

        // Collect interests from checkboxes
        const interests = [];
        if (formData.get('mentoring')) interests.push('The Hive Mind - AI that learns from every mistake ever made.');
        if (formData.get('programs')) interests.push('The Factory - The agents building software in parallel.');
        if (formData.get('network')) interests.push('Evolution Engine - AI that upgrades your app automatically.');

        // Prepare Web3Forms submission
        const web3FormData = new FormData();
        web3FormData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
        web3FormData.append("subject", "🚀 New SystFlow Early Access Signup!");
        web3FormData.append("from_name", "SystFlow Early Access");
        web3FormData.append("name", formData.get('user_name'));
        web3FormData.append("email", formData.get('user_email'));
        web3FormData.append("linkedin", formData.get('linkedin') || 'Not provided');
        web3FormData.append("interests", interests.length > 0 ? interests.join(', ') : 'None selected');

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: web3FormData
            });

            const result = await response.json();

            if (result.success) {
                setFormState({ isSubmitting: false, isSuccess: true, isError: false, errorMessage: '' });
                e.target.reset(); // Reset form on success
            } else {
                throw new Error(result.message || 'Failed to submit form');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            setFormState({
                isSubmitting: false,
                isSuccess: false,
                isError: true,
                errorMessage: error.message || 'Something went wrong. Please try again.'
            });
        }
    };

    return (
        <footer ref={footerRef} id="footer" className="c-footer_section">
            <section id="early-access" className="c-footer_contact-section">
                {/* LogoLoop at the start of early access */}
                <div className="c-footer_logoloop-wrapper" data-scroll-animation="0">
                    <LogoLoop
                        logos={socialLogos}
                        speed={35}
                        direction="left"
                        logoHeight={48}
                        gap={60}
                        hoverSpeed={0}
                        scaleOnHover
                        fadeOut
                        fadeOutColor="#fffaeb"
                        ariaLabel="Connect with SystFlow"
                    />
                </div>

                <div className="c-footer_container">
                    <div className="c-footer_form-block u-form">
                        <form
                            id="contact-form"
                            name="contact-form"
                            data-name="contact-form"
                            action="/"
                            method="get"
                            className="c-footer_contact-wrapper"
                            onSubmit={handleSubmit}
                            data-scroll-animation="0"
                        >
                            <div className="c-footer_contact-left">
                                <h3 className="c-footer_heading-large">JOIN THE FACTORY</h3>
                                <div className="c-footer_divider-large"></div>
                                <div className="c-footer_text-wrapper">
                                    <p className="c-footer_description-text">Be among the first humans to deploy AI agents that code, review, and ship production software. Early access launching Mid 2026. Limited spots available.</p>
                                </div>
                            </div>

                            <div className="c-footer_contact-right">
                                <div className="c-footer_form-row">
                                    <input className="c-footer_input-field" maxLength="256" name="user_name" data-name="user_name" placeholder="Full Name" type="text" id="user_name" required />
                                    <input className="c-footer_input-field" maxLength="256" name="user_email" data-name="user_email" placeholder="Email Address" type="email" id="user_email" required />
                                </div>
                                <div className="c-footer_content-wrapper cc-32">
                                    <input className="c-footer_input-field" maxLength="256" name="linkedin" data-name="linkedin" placeholder="LinkedIn URL (Optional)" type="text" id="linkedin-2" />
                                </div>
                                <div className="c-footer_content-wrapper">
                                    <div className="c-footer_subheading">What interests you most?</div>
                                </div>
                                <div className="c-footer_content-wrapper cc-32">
                                    <div className="c-footer_checkbox-group">
                                        <label className="c-footer_checkbox-label">
                                            <input
                                                name="mentoring"
                                                data-name="mentoring"
                                                type="checkbox"
                                                id="mentoring"
                                                className="c-footer_checkbox-hidden"
                                            />
                                            <div link-cursor="true" className="c-footer_checkbox-square"></div>
                                            <span className="c-footer_checkbox-text" htmlFor="mentoring">The Hive Mind - AI that learns from every mistake ever made.</span>
                                        </label>
                                        <label className="c-footer_checkbox-label">
                                            <input
                                                name="programs"
                                                data-name="programs"
                                                type="checkbox"
                                                id="programs"
                                                className="c-footer_checkbox-hidden"
                                            />
                                            <div link-cursor="true" className="c-footer_checkbox-square"></div>
                                            <span className="c-footer_checkbox-text" htmlFor="programs">The Factory - The agents building software in parallel.</span>
                                        </label>
                                        <label className="c-footer_checkbox-label">
                                            <input
                                                name="network"
                                                data-name="network"
                                                type="checkbox"
                                                id="network"
                                                className="c-footer_checkbox-hidden"
                                            />
                                            <div link-cursor="true" className="c-footer_checkbox-square"></div>
                                            <span className="c-footer_checkbox-text" htmlFor="network">Evolution Engine - AI that upgrades your app automatically.</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="c-footer_form-button-wrapper">
                                    <div className="c-footer_checkbox-group">
                                        <label className="c-footer_checkbox-label">
                                            <input
                                                id="terms"
                                                type="checkbox"
                                                name="terms"
                                                data-name="terms"
                                                required
                                                className="c-footer_checkbox-hidden"
                                                disabled={formState.isSubmitting}
                                            />
                                            <div link-cursor="true" className="c-footer_checkbox-square"></div>
                                            <span className="c-footer_checkbox-text" htmlFor="terms">I hereby accept the </span>
                                            <a href="#" className="c-footer_terms-link" title="Privacy Policy">Privacy Policy</a>
                                        </label>
                                    </div>
                                    <button
                                        link-cursor="true"
                                        type="submit"
                                        className="c-footer_submit-button"
                                        disabled={formState.isSubmitting}
                                    >
                                        {formState.isSubmitting ? 'Submitting...' : 'Sign up for Early Access'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {formState.isSuccess && (
                            <div className="c-footer_contact-wrapper cc-success c-footer_form-success">
                                <div className="c-success-icon">🎉</div>
                                <h3>May our Automation reach your Ambition</h3>
                                <p>Thank you for signing up! Check your email for a confirmation message.</p>
                            </div>
                        )}
                        {formState.isError && (
                            <div className="c-footer_form-error">
                                <div className="c-error-icon">⚠️</div>
                                <p>{formState.errorMessage}</p>
                                <button
                                    className="c-footer_retry-button"
                                    onClick={() => setFormState({ isSubmitting: false, isSuccess: false, isError: false, errorMessage: '' })}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="c-footer_bottom-bar">
                <div className="c-footer_container">
                    <div className="c-footer_bottom-links-wrapper">
                        <div className="c-footer_bottom-links">
                            <div className="c-footer_legal-wrapper">
                                <a href="#" className="c-footer_legal-link"></a>
                                <a href="#" className="c-footer_legal-link"></a>
                                <a href="#" className="c-footer_legal-link"></a>
                            </div>
                        </div>


                        <div className="c-footer_social-wrapper">
                            <a href="https://www.linkedin.com/company/systflow/" target="_blank" rel="noopener noreferrer" className="c-footer_social-link" aria-label="LinkedIn">
                                <SiLinkedin />
                            </a>
                            <a href="https://discord.gg/zyUwd7Qc" target="_blank" rel="noopener noreferrer" className="c-footer_social-link" aria-label="Discord">
                                <SiDiscord />
                            </a>
                            <a href="mailto:admin@systflow.dev" className="c-footer_social-link" aria-label="Email">
                                <MdEmail />
                            </a>
                        </div>

                        <div className="c-footer_love-text">Made with 🖤</div>
                    </div>
                </div>
            </div>

            {/* Big SystFlow branding text */}
            <div className="c-footer_branding">
                <h1 className="c-footer_branding-text">SYSTFLOW</h1>
            </div>
        </footer>
    );
}
