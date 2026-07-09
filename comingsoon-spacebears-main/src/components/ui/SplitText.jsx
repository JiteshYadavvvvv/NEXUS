import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SplitText({ children, className = "", tag = "div" }) {
    const containerRef = useRef(null);
    const Tag = tag;

    const words = typeof children === 'string' ? children.split(' ') : [];

    useEffect(() => {
        if (!containerRef.current || words.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.from(containerRef.current.querySelectorAll('.word'), {
                opacity: 0,
                y: 20,
                duration: 1,
                ease: "power3.out",
                stagger: 0.05,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    toggleActions: "play pause resume reverse",
                    markers: false
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [children, words.length]);

    if (words.length === 0) {
        return <Tag className={className}>{children}</Tag>;
    }

    return (
        <Tag ref={containerRef} className={className}>
            {words.map((word, i) => (
                <React.Fragment key={i}>
                    <span className="word" style={{ display: 'inline-block' }}>{word}</span>
                    {i < words.length - 1 && ' '}
                </React.Fragment>
            ))}
        </Tag>
    );
}
