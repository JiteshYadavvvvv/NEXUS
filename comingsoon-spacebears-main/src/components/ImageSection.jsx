import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ImageSection.css';

gsap.registerPlugin(ScrollTrigger);

// Card images - Using local assets
const cardImages = {
    evolutionEngine: "/assets/images/evolution_engine.png",
    creativityInjection: "/assets/images/What's Different_ Control Over Convenience - visual selection.png",
    theFactory: "/assets/images/the_factory.png",
    hardwareGuidance: "/assets/images/ai_for_everyone.png",
    feedbackIntelligence: "/assets/images/adaptive learning.png"
};

const cards = [
    {
        title: "Evolution Engine",
        subtitle: "Adapts as Your System Evolves.",
        description: "Tracks architectural changes • Monitors usage patterns • Flags outdated logic",
        tags: ["EVOLUTION-READY"],
        frontClass: "cc-3",
        backClass: "cc-3",
        bgPos: "0% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.evolutionEngine} alt="Evolution Engine" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">EVOLUTION-READY</div>
                    <h2 className="c-expanded-title">Evolution Engine</h2>
                    <p className="c-expanded-subtitle">Adapts as Your System Evolves</p>
                    <div className="c-expanded-body">
                        <p>Systflow doesn't stay static. It observes how your project grows and adjusts its suggestions accordingly. No forced updates - you decide when evolution becomes action.</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">🏗️</span>
                            <span>Tracks architectural changes</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">📊</span>
                            <span>Monitors usage patterns</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">⚠️</span>
                            <span>Flags outdated logic or flows</span>
                        </div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>Zero</span> Forced Updates</div>
                        <div className="c-stat"><span>You</span> Decide</div>
                        <div className="c-stat"><span>100%</span> Adaptive</div>
                    </div>
                </div>
            </div>
        ),
        anim: { x: "0em", y: "0em", rotateY: "0deg", rotateX: "0deg", rotateZ: "0deg" }
    },
    {
        title: "What's Different",
        subtitle: "Control Over Convenience.",
        description: "No black-box decisions • No silent changes • No hallucinated outputs",
        tags: ["HUMAN-FIRST AI"],
        frontClass: "cc-2",
        backClass: "cc-2",
        wrapperClass: "cc-2",
        bgPos: "25% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.creativityInjection} alt="What's Different" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">HUMAN-FIRST AI</div>
                    <h2 className="c-expanded-title">What's Different</h2>
                    <p className="c-expanded-subtitle">Control Over Convenience</p>
                    <div className="c-expanded-body">
                        <p>Most tools automate first and explain later. Systflow does the opposite. Everything is visible, explainable, and human-approved. You stay in control - always.</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">🔍</span>
                            <span>No black-box decisions</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">🔔</span>
                            <span>No silent changes</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">✅</span>
                            <span>No hallucinated outputs</span>
                        </div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>100%</span> Visible</div>
                        <div className="c-stat"><span>100%</span> Explainable</div>
                        <div className="c-stat"><span>You</span> Approve</div>
                    </div>
                </div>
            </div>
        ),
        anim: { x: "0em", y: "0em", rotateY: "0deg", rotateX: "0deg", rotateZ: "0deg" }
    },
    {
        isVision: true,
        wrapperClass: "cc-vision",
        frontClass: "cc-3",
        backClass: "cc-3",
        bgPos: "50% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.theFactory} alt="The Factory" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">STRUCTURED BUILD</div>
                    <h2 className="c-expanded-title">The Factory</h2>
                    <p className="c-expanded-subtitle">Ideas In. Execution Out.</p>
                    <div className="c-expanded-body">
                        <p>The Factory converts thoughts into structured build plans. Nothing runs on its own. The flow is simple: Think → Plan → Build</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">💭</span>
                            <span>Breaks ideas into clear steps</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">📋</span>
                            <span>Organizes tasks logically</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">🛤️</span>
                            <span>Prepares execution paths</span>
                        </div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>Think</span> First</div>
                        <div className="c-stat"><span>Plan</span> Clear</div>
                        <div className="c-stat"><span>Build</span> Right</div>
                    </div>
                </div>
            </div>
        ),
        anim: { x: "0em", y: "0em", rotateY: "0deg", rotateX: "0deg", rotateZ: "0deg" }
    },
    {
        title: "AI for Everyone",
        subtitle: "Built for Everyone Who Wants to Build.",
        description: "Developers get structure • Non-tech students get guidance • Complex ideas simplified",
        tags: ["FOR EVERY CREATOR"],
        frontClass: "cc-2",
        backClass: "cc-2",
        bgPos: "75% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.hardwareGuidance} alt="AI for Everyone" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">FOR EVERY CREATOR</div>
                    <h2 className="c-expanded-title">AI for Developers & Non-Tech Students</h2>
                    <p className="c-expanded-subtitle">Built for Everyone Who Wants to Build</p>
                    <div className="c-expanded-body">
                        <p>You don't need to know frameworks, jargon, or system design. If you can explain your idea, Systflow can help shape it.</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">👨‍💻</span>
                            <span>Developers get structure & clarity</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">🎓</span>
                            <span>Non-tech students get guided understanding</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">💡</span>
                            <span>Complex ideas explained in simple terms</span>
                        </div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>No</span> Jargon Needed</div>
                        <div className="c-stat"><span>All</span> Skill Levels</div>
                        <div className="c-stat"><span>Your</span> Ideas Matter</div>
                    </div>
                </div>
            </div>
        ),
        anim: { x: "0em", y: "0em", rotateY: "0deg", rotateX: "0deg", rotateZ: "0deg" }
    },
    {
        title: "Learns & Adapts",
        subtitle: "Improves Through Real Use.",
        description: "Learns preferred workflows • Adapts to skill level • Improves from feedback",
        tags: ["ADAPTIVE INTELLIGENCE"],
        frontClass: "cc-3",
        backClass: "cc-3",
        bgPos: "100% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.feedbackIntelligence} alt="Learns & Adapts" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">ADAPTIVE INTELLIGENCE</div>
                    <h2 className="c-expanded-title">Learns & Adapts From Users</h2>
                    <p className="c-expanded-subtitle">Improves Through Real Use</p>
                    <div className="c-expanded-body">
                        <p>Systflow learns from how people actually work - not assumptions. The more you use it, the more it aligns with your way of thinking.</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">🔄</span>
                            <span>Learns preferred workflows</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">📈</span>
                            <span>Adapts explanations to skill level</span>
                        </div>
                        <div className="c-expanded-feature">
                            <span className="c-feature-icon">💬</span>
                            <span>Improves suggestions based on feedback</span>
                        </div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>Real</span> Usage Data</div>
                        <div className="c-stat"><span>Your</span> Workflow</div>
                        <div className="c-stat"><span>Always</span> Improving</div>
                    </div>
                </div>
            </div>
        ),
        anim: { x: "0em", y: "0em", rotateY: "0deg", rotateX: "0deg", rotateZ: "0deg" }
    }
];

const ImageCard = ({ title, subtitle, description, tags, bottomContent, frontClass, backClass, wrapperClass = "", bgPos, isVision, expandedContent }) => (
    <div className={`c-image-card ${wrapperClass}`}>
        <div className={`c-card_frontface ${frontClass}`}>
            {isVision ? (
                <>
                    <div className="c-card-balls_wrapper">
                        <div className="c-card_header cc-balls">
                            <div className="c-image-card_header-ball"></div>
                            <div className="c-image-card_heading-text">The Factory</div>
                        </div>
                        <h4 className="c-image-card_title">Ideas In. Execution Out.</h4>
                        <div className="c-image-card_divider"></div>
                        <p className="c-image-card_body-text">Breaks ideas into clear steps • Organizes tasks logically • Prepares execution paths</p>
                        <p className="c-image-card_flow-text">Suggest → Approve → Ship</p>
                        <div className="c-image-card_tags" style={{ marginTop: 'auto' }}>
                            <div className="c-image-card_tag">STRUCTURED BUILD</div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <div className="c-card_header">
                            <div className="c-image-card_header-ball"></div>
                            <div className="c-image-card_heading-text">{title}</div>
                        </div>
                        <h4 className="c-image-card_title">{subtitle}</h4>
                        <div className="c-image-card_divider"></div>
                        <p className="c-image-card_body-text">{description}</p>
                    </div>
                    {tags && (
                        <div className="c-image-card_tags">
                            {tags.map(t => <div key={t} className="c-image-card_tag">{t}</div>)}
                        </div>
                    )}
                    {bottomContent}
                </>
            )}
        </div>
        <div
            className={`c-card_backface ${backClass}`}
            style={{
                backgroundImage: 'url(/assets/images/banner.png)',
                backgroundSize: '500% auto',
                backgroundPosition: bgPos,
                backgroundRepeat: 'no-repeat'
            }}
        >
            {expandedContent && <div className="c-card_expanded-wrapper">{expandedContent}</div>}
        </div>
    </div>
);

export default function ImageSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            mm.add("(min-width: 768px)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=1000%",
                        markers: false,
                        scrub: true,
                        pin: true
                    }
                });

                tl.fromTo(".c-image-grid",
                    { height: "90vh", maxHeight: "90vh", boxShadow: "0 0 30px rgba(255, 250, 235, 0.6), 0 0 60px rgba(255, 250, 235, 0.4)", borderRadius: "1.5em" },
                    { height: "25em", maxHeight: "25em", duration: 0.7 },
                    0
                )

                    .set(".c-image-grid", { overflow: "visible", boxShadow: "none" }, 0.7)
                    .to(".c-image-grid", { gap: "0.5em", duration: 0.1 }, 0.7)
                    .to("#hero-image", { opacity: 0, display: "none", duration: 0.1 }, 0.7)

                    .to(".c-card_backface", { borderRadius: "1.5em", duration: 0.1 }, 0.7)

                    .to([".c-card_frontface", ".c-card_backface"], { boxShadow: "0 0 30px rgba(255, 250, 235, 0.6), 0 0 60px rgba(255, 250, 235, 0.4)", duration: 0.1 }, 0.7)

                    .to(".c-image-card", { borderRadius: "1.5em", boxShadow: "none", duration: 0.1 }, 0.7)

                    .to(".c-image-grid", { borderRadius: "0", duration: 0.3 }, 0.7)

                    .to(".c-card_frontface", { rotateY: "0deg", stagger: { amount: 0.1, from: "center" } }, ">")
                    .to(".c-card_backface", { rotateY: "-180deg", stagger: { amount: 0.1, from: "center" } }, "<");

                cards.forEach((card, index) => {
                    tl.to(`.c-image-card:nth-child(${index + 1})`, card.anim, index === 0 ? ">" : "<");
                });

                tl.to(".c-image-card:not(:first-child)", {
                    y: "-150vh",
                    opacity: 0,
                    ease: "power2.in",
                    duration: 1
                }, ">");

                tl.to(".c-image-card:first-child", {
                    rotateY: -180,
                    scale: 1,
                    zIndex: 1000,
                    duration: 1,
                    ease: "power2.inOut"
                }, "<");

                tl.fromTo(".c-card_expanded-wrapper",
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, ease: "power2.out" },
                    "-=0.5"
                );


                tl.to(".c-image-card:first-child", {
                    width: "80vw",
                    height: "80vh",
                    top: "50%",
                    left: "50%",
                    xPercent: -50,
                    yPercent: -50,
                    x: 0,
                    y: 0,
                    margin: 0,
                    borderRadius: "1.5em",
                    position: "absolute",
                    duration: 0.7,
                    ease: "power2.out"
                }, ">");

                for (let i = 1; i < cards.length; i++) {
                    const selector = `.c-image-card:nth-child(${i + 1})`;

                    tl.set(selector, { rotateY: -180, zIndex: 5000 + i }, ">");

                    tl.to(selector, {
                        y: "0vh",
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    }, ">");

                    tl.to(selector, {
                        width: "80vw",
                        height: "80vh",
                        top: "50%",
                        left: "50%",
                        xPercent: -50,
                        yPercent: -50,
                        x: 0,
                        y: 0,
                        margin: 0,
                        borderRadius: "1.5em",
                        position: "absolute",
                        opacity: 1,
                        duration: 0.7,
                        ease: "power2.out"
                    }, ">");

                    tl.set(`${selector} .c-card_expanded-wrapper`,
                        { opacity: 1 },
                        ">"
                    );
                }
            });

            mm.add("(max-width: 767px)", () => {
                const mobileCards = gsap.utils.toArray(".c-image-card");
                mobileCards.forEach((card) => {
                    gsap.fromTo(card,
                        { opacity: 0, y: -50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%"
                            }
                        }
                    );
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="reviews" ref={sectionRef} className="c-image-section">
            <div className="c-image-section-wrapper">
                <div className="c-image-section_container">
                    <div className="c-image-grid">
                        {cards.map((card, i) => (
                            <ImageCard key={i} {...card} />
                        ))}
                        <div id="hero-image" className="c-image-wrapper">
                            <img
                                src="/assets/images/banner.png"
                                className="c-image-section_banner-image"
                                alt="Banner"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
