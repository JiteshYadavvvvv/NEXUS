import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ImageSection.css';

gsap.registerPlugin(ScrollTrigger);

// Card images - reused local assets
const cardImages = {
    communities: "/assets/images/evolution_engine.png",
    events: "/assets/images/What's Different_ Control Over Convenience - visual selection.png",
    announcements: "/assets/images/the_factory.png",
    recruitment: "/assets/images/ai_for_everyone.png",
    dashboards: "/assets/images/adaptive learning.png"
};

// NEXUS feature content mapped into the flip cards.
const cards = [
    {
        title: "Communities",
        subtitle: "Discover & Join Communities.",
        description: "Explore student-led clubs • Technical boards to cultural societies • Join with a single click",
        tags: ["COMMUNITY-FIRST"],
        frontClass: "cc-3",
        backClass: "cc-3",
        bgPos: "0% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.communities} alt="Communities" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">COMMUNITY-FIRST</div>
                    <h2 className="c-expanded-title">Discover & Join Communities</h2>
                    <p className="c-expanded-subtitle">Find your tribe on campus</p>
                    <div className="c-expanded-body">
                        <p>Explore a diverse range of student-led clubs, from technical boards to cultural societies. Join with a single click and dive straight into campus life.</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Browse every AIT club in one place</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Join instantly with one click</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Dive into campus life</span></div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>18+</span> Clubs</div>
                        <div className="c-stat"><span>1</span> Click to Join</div>
                        <div className="c-stat"><span>All</span> AIT Pune</div>
                    </div>
                </div>
            </div>
        ),
        anim: { x: "0em", y: "0em", rotateY: "0deg", rotateX: "0deg", rotateZ: "0deg" }
    },
    {
        title: "Events",
        subtitle: "Centralized Event Hub.",
        description: "Workshops • Hackathons • Cultural fests — all in one seamless calendar",
        tags: ["ONE CALENDAR"],
        frontClass: "cc-2",
        backClass: "cc-2",
        wrapperClass: "cc-2",
        bgPos: "25% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.events} alt="Events" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">ONE CALENDAR</div>
                    <h2 className="c-expanded-title">Centralized Event Hub</h2>
                    <p className="c-expanded-subtitle">Never miss out again</p>
                    <div className="c-expanded-body">
                        <p>Keep track of upcoming workshops, hackathons, and cultural fests all in one seamless calendar built for the whole campus.</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Unified events calendar</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Workshops & hackathons</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Cultural fests & meetups</span></div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>Live</span> Calendar</div>
                        <div className="c-stat"><span>Zero</span> Missed Events</div>
                        <div className="c-stat"><span>All</span> in One Place</div>
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
                    <img src={cardImages.announcements} alt="Announcements" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">REAL-TIME</div>
                    <h2 className="c-expanded-title">Instant Announcements</h2>
                    <p className="c-expanded-subtitle">Stay in the loop.</p>
                    <div className="c-expanded-body">
                        <p>Real-time updates and important broadcasts land directly from your club leads. The flow is simple: Post → Notify → Engage</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Real-time broadcasts</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Straight from club leads</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Never miss a beat</span></div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>Post</span> First</div>
                        <div className="c-stat"><span>Notify</span> Instantly</div>
                        <div className="c-stat"><span>Engage</span> Faster</div>
                    </div>
                </div>
            </div>
        ),
        anim: { x: "0em", y: "0em", rotateY: "0deg", rotateX: "0deg", rotateZ: "0deg" }
    },
    {
        title: "Recruitment",
        subtitle: "Effortless Recruitment.",
        description: "Unified applications • Transparent process • Hassle-free interviews",
        tags: ["HASSLE-FREE"],
        frontClass: "cc-2",
        backClass: "cc-2",
        bgPos: "75% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.recruitment} alt="Recruitment" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">HASSLE-FREE</div>
                    <h2 className="c-expanded-title">Effortless Recruitment</h2>
                    <p className="c-expanded-subtitle">Apply in minutes</p>
                    <div className="c-expanded-body">
                        <p>Apply to your favourite clubs through a unified, transparent, and hassle-free application process — and let club leads manage interviews with ease.</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Unified application forms</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Transparent, trackable status</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Easy interview management</span></div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>One</span> Form</div>
                        <div className="c-stat"><span>Clear</span> Status</div>
                        <div className="c-stat"><span>Zero</span> Chaos</div>
                    </div>
                </div>
            </div>
        ),
        anim: { x: "0em", y: "0em", rotateY: "0deg", rotateX: "0deg", rotateZ: "0deg" }
    },
    {
        title: "Dashboards",
        subtitle: "Run Your Club.",
        description: "Manage members & roles • Review applications • One control panel for club leads",
        tags: ["FOR CLUB LEADS"],
        frontClass: "cc-3",
        backClass: "cc-3",
        bgPos: "100% 50%",
        expandedContent: (
            <div className="c-expanded-content c-expanded-with-image">
                <div className="c-expanded-image-container">
                    <img src={cardImages.dashboards} alt="Dashboards" className="c-expanded-image" />
                    <div className="c-expanded-image-overlay"></div>
                </div>
                <div className="c-expanded-text-content">
                    <div className="c-expanded-badge">FOR CLUB LEADS</div>
                    <h2 className="c-expanded-title">Club Management Dashboard</h2>
                    <p className="c-expanded-subtitle">Everything in one control panel</p>
                    <div className="c-expanded-body">
                        <p>Club leads manage members, assign roles, review recruitment applications, and post events — all from a single powerful dashboard.</p>
                    </div>
                    <div className="c-expanded-features">
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Manage members & roles</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Review applications in one place</span></div>
                        <div className="c-expanded-feature"><span className="c-feature-icon">•</span><span>Post events & announcements</span></div>
                    </div>
                    <div className="c-expanded-stats">
                        <div className="c-stat"><span>One</span> Dashboard</div>
                        <div className="c-stat"><span>Full</span> Control</div>
                        <div className="c-stat"><span>Zero</span> Spreadsheets</div>
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
                            <div className="c-image-card_heading-text">Announcements</div>
                        </div>
                        <h4 className="c-image-card_title">Stay in the loop.</h4>
                        <div className="c-image-card_divider"></div>
                        <p className="c-image-card_body-text">Real-time broadcasts • Straight from club leads • Never miss a beat</p>
                        <p className="c-image-card_flow-text">Post → Notify → Engage</p>
                        <div className="c-image-card_tags" style={{ marginTop: 'auto' }}>
                            <div className="c-image-card_tag">REAL-TIME</div>
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
