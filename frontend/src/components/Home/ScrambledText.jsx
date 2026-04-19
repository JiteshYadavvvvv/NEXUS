import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    let split;
    let handleMove;
    const el = rootRef.current;

    const init = () => {
      const targetP = el.querySelector('p');
      if (!targetP) return;

      split = SplitText.create(targetP, {
        type: 'chars',
        charsClass: 'inline-block will-change-transform'
      });

      split.chars.forEach(ch => {
        gsap.set(ch, { attr: { 'data-content': ch.innerHTML } });
      });

      handleMove = e => {
        split.chars.forEach(ch => {
          const { left, top, width, height } = ch.getBoundingClientRect();
          const dx = e.clientX - (left + width / 2);
          const dy = e.clientY - (top + height / 2);
          const dist = Math.hypot(dx, dy);

          if (dist < radius) {
            gsap.to(ch, {
              overwrite: true,
              duration: duration * (1 - dist / radius),
              scrambleText: {
                text: ch.dataset.content || '',
                chars: scrambleChars,
                speed
              },
              ease: 'none'
            });
          }
        });
      };

      el.addEventListener('pointermove', handleMove);
    };

    if ('fonts' in document) {
      document.fonts.ready.then(init).catch(init);
    } else {
      init();
    }

    return () => {
      if (handleMove) el.removeEventListener('pointermove', handleMove);
      if (split) split.revert();
    };
  }, [radius, duration, speed, scrambleChars]);

  return (
    <div ref={rootRef} className={className} style={{...style, margin: 0, padding: 0}}>
      <p style={{ margin: 0, padding: 0 }}>{children}</p>
    </div>
  );
};

export default ScrambledText;
