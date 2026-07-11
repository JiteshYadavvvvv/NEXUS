import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const css = `
  .c-video-section {
    height: 600vh;
    min-height: 100vh;
  }

  .c-video-section-wrapper {
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    display: flex;
    position: sticky;
    top: 0;
  }

  .c-video-grid {
    grid-column-gap: .875em;
    grid-row-gap: .875em;
    aspect-ratio: 16 / 9;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-columns: 1fr;
    place-content: center;
    justify-items: center;
    width: 100%;
    height: auto;
    max-height: 38.75em;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    position: relative;
  }

  .c-video-card {
    background-color: #21212500;
    border-radius: 0;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    height: 100%;
    padding: 1em;
    display: flex;
    position: relative;
    overflow: visible;
    transform: perspective(70em);
  }

  .c-video-card.cc-2 {
    z-index: 100;
  }

  .c-card_backface {
    backface-visibility: hidden;
    transform-style: preserve-3d;
    position: absolute;
    inset: 0;
    border-radius: 0;
    background: linear-gradient(180deg,#fff 0%,#fff0 100%);
  }

  .c-card_backface.cc-1{ }
  .c-card_backface.cc-2{ }
  .c-card_backface.cc-3{ }

  .c-card_frontface {
    backface-visibility: hidden;
    transform-style: preserve-3d;
    position: relative;
    z-index: 2;
    transform: rotateY(180deg);
  }

  .c-ball {
    background-color: var(--primary);
    border-radius: 50%;
    width: 1em;
    height: 1em;
  }

  .c-ball.cc-dark { background-color: var(--black); }

  .c-title-40 { font-variation-settings: "wght" 700; letter-spacing: -.01em; font-size: 2.5em; line-height: 1.2em; }

  .c-divider { background-color: #161618; width: 100%; height: 1px; margin-top: 2em; margin-bottom: 2em; }

  .c-text-24 { font-variation-settings: "wght" 500; margin-bottom: 0; font-size: 1.5em; line-height: 1.2em; }

  .c-card-text-wrapper { width: 100%; max-width: 18.75em; }

  .c-card_tags { grid-column-gap: .25em; grid-row-gap: .25em; align-items: center; display: flex; }

  .c-card_tag { border: 1px solid var(--dark); font-variation-settings: "wght" 500; text-transform: uppercase; border-radius: .25rem; padding: .125rem .5rem; font-size: .875em; line-height: 1.4em; }

  .c-title-100 { font-variation-settings: "wght" 700; letter-spacing: -.01em; font-size: 6.25em; line-height: .8em; }

  .c-card-balls { grid-column-gap: .25em; grid-row-gap: .25em; grid-template-rows: auto; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; grid-auto-columns: 1fr; width: 100%; max-width: 13.8125em; margin-bottom: 2.5em; display: grid; }

  .c-card_ball { background-color: #514e53; border-radius: 50%; width: 2.5625em; height: 2.5625em; }

  .c-card-balls_wrapper { max-width: 15.4375em; }

  .c-network { perspective-origin: 100% 0; transform-origin: 100% 0; font-variation-settings: "wght" 700; letter-spacing: -.014em; height: 1em; font-size: 9em; line-height: .8em; position: absolute; inset: 50% 0% 0% auto; transform: translate(-25%, -175%) rotate(-90deg); }

  .c-cards_light { background-image: radial-gradient(circle farthest-corner at 50% 50%, var(--light), #fff0 63%); opacity: .2; filter: blur(20px); pointer-events: none; border-radius: 50%; width: 50em; height: 50em; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

  .c-video-wrapper { z-index: 200; border-radius: 1.5em; display: block; position: absolute; inset: 0%; overflow: hidden; }
  .c-poster { object-fit: cover; width: 100%; height: 100%; display: block; }

  @media screen and (max-width: 767px) {
    .c-video-wrapper {
      display: none !important;
    }
  }
`

export default function VideoSection() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mm = window.matchMedia('(min-width: 768px)')
    let tl
    function setup() {
      if (!mm.matches) return
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.c-video-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
      tl.fromTo('.c-video-grid', { gap: 0 }, { gap: '0.875em', duration: 0.1 }, 0.2)
      tl.fromTo('#hero-video', { opacity: 1, display: 'flex' }, { opacity: 0, display: 'none', duration: 0.1 }, 0.2)
      tl.fromTo('.c-card_backface', { borderRadius: 0 }, { borderRadius: '1.5em', duration: 0.1 }, 0.2)
      tl.fromTo('.c-video-grid', { borderRadius: '1.5em', overflow: 'hidden' }, { borderRadius: '0', overflow: 'visible', duration: 0.3 }, '>')
      tl.to('.c-card_frontface', { rotateY: '0deg', stagger: { amount: 0.1, from: 'edges' } }, '>')
      tl.to('.c-card_backface', { rotateY: '-180deg', stagger: { amount: 0.1, from: 'edges' } }, '<')
      tl.to('.c-video-card:nth-child(1)', { x: '5em', y: '10em', rotateY: '20deg', rotateX: '5deg', rotateZ: '-20deg' })
      tl.to('.c-video-card:nth-child(2)', { zIndex: 10, x: '5em', y: '-10em', rotateY: '-15deg', rotateX: '-3deg', rotateZ: '10deg' }, '<')
      tl.to('.c-video-card:nth-child(3)', { x: '-3em', y: '5em', rotateY: '10deg', rotateX: '-3deg', rotateZ: '15deg' }, '<')
      tl.fromTo('[data-card-light]', { opacity: 0 }, { opacity: 0.2, duration: 1 }, 0)
    }

    setup()
    const handler = (e) => {
      if (e.matches) setup()
      else if (tl) { tl.kill(); tl = null }
    }
    mm.addEventListener ? mm.addEventListener('change', handler) : mm.addListener(handler)

    return () => {
      if (tl) tl.kill()
      try { mm.removeEventListener ? mm.removeEventListener('change', handler) : mm.removeListener(handler) } catch (e) { }
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <section className="c-video-section" aria-label="video-section">
      <style>{css}</style>
      <div className="c-video-section-wrapper">
        <div className="c-container">
          <div className="c-video-grid">
            <div id="w-node-1" className="c-video-card">
              <div className="c-card_frontface cc-1">
                <div>
                  <div className="c-card_header"><div className="c-ball cc-dark"></div><div className="c-text-16">Growth Yourself</div></div>
                  <h4 className="c-title-40">Mentoring for Agency Founders and Leaders</h4>
                  <div className="c-divider"></div>
                  <div className="c-card-text-wrapper"><p className="c-text-24">We understand the unique challenges you face as an agency founder and we are here for you.</p></div>
                </div>
                <div className="c-card_tags"><div className="c-card_tag">Leadership</div><div className="c-card_tag">Culture</div><div className="c-card_tag">Growth</div></div>
              </div>
              <div className="c-card_backface cc-1"></div>
            </div>

            <div id="w-node-2" className="c-video-card cc-2">
              <div className="c-card_frontface cc-2">
                <div>
                  <div className="c-card_header"><div className="c-ball"></div><div className="c-text-16">Growth Your Team</div></div>
                  <div className="c-content-wrapper cc-32"><h4 className="c-title-100">PRO<br />GRAMS</h4></div>
                  <p className="c-text-24">Redefine your role as a leader, foster innovation, and drive team engagement.</p>
                </div>
                <div className="c-programs-card_bottom-content">
                  <div className="c-programs-card_texts"><p className="c-text-18 cc-700">A New Breed of Leader</p></div>
                  <div className="c-programs-card_texts"><p className="c-text-18 cc-700">Grow it like you mean it</p></div>
                  <div className="c-programs-card_texts cc-last"><p className="c-text-18 cc-700">The Human side of Tech</p></div>
                </div>
              </div>
              <div className="c-card_backface cc-2"></div>
            </div>

            <div id="w-node-3" className="c-video-card">
              <div className="c-card_frontface cc-3">
                <div className="c-card-balls_wrapper">
                  <div className="c-card_header cc-balls"><div className="c-ball"></div><div className="c-text-16">Growth Your Vision</div></div>
                  <div className="c-card-balls">
                    {Array.from({ length: 33 }).map((_, i) => (<div key={i} className="c-card_ball"></div>))}
                  </div>
                  <p className="c-text-24">Creativity, innovation, culture, and operations with the best in the industry.</p>
                </div>
                <div className="c-network">network</div>
              </div>
              <div className="c-card_backface cc-3"></div>
            </div>

            <div id="hero-video" className="c-video-wrapper">
              <img src="/assets/images/video-cover.webp" loading="lazy" alt="" id="video-poster" className="c-poster" />
            </div>

            <div data-card-light id="cards-light" className="c-cards_light"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
