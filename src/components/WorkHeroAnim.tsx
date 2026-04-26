import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// 8 columns × 5 rows
const COLS = 8, ROWS = 5;
const COL_GAP = 44, ROW_GAP = 46;
const START_X = 22, START_Y = 26;

const dots = Array.from({ length: ROWS * COLS }, (_, i) => ({
  cx: START_X + (i % COLS) * COL_GAP,
  cy: START_Y + Math.floor(i / COLS) * ROW_GAP,
  accent: Math.random() < 0.18, // ~18% get accent treatment
}));

export default function WorkHeroAnim() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    gsap.from(svgRef.current, { autoAlpha: 0, duration: 1, delay: 0.4, ease: 'power2.out' });

    // Staggered appear — grid order, top-left → bottom-right
    gsap.from('.wd-dot', {
      scale: 0, opacity: 0,
      duration: 0.35,
      stagger: { amount: 1.6, from: 'start', grid: [ROWS, COLS] },
      ease: 'back.out(1.6)',
      delay: 0.5,
      transformOrigin: '50% 50%',
    });

    // Accent dots pulse perpetually
    gsap.to('.wd-accent', {
      fill: 'rgba(201,255,87,0.85)',
      scale: 1.5, transformOrigin: '50% 50%',
      duration: 1,
      ease: 'sine.inOut',
      stagger: { each: 0.6, from: 'random', repeat: -1, yoyo: true },
    });

    // Random base dots twinkle subtly
    gsap.to('.wd-base', {
      opacity: 0.08,
      duration: 0.8,
      ease: 'sine.inOut',
      stagger: { each: 0.22, from: 'random', repeat: -1, yoyo: true, repeatDelay: 0.1 },
    });

    // Horizontal scan line sweeps top → bottom
    gsap.fromTo('#wd-scan',
      { y: 0,   opacity: 0.7 },
      { y: 200, opacity: 0, duration: 2.5, ease: 'none', repeat: -1, repeatDelay: 1.5, delay: 2 }
    );
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 352 226" fill="none" aria-hidden
      style={{ width: '100%', height: '100%' }}>

      {dots.map((d, i) => (
        <circle key={i}
          className={d.accent ? 'wd-dot wd-accent' : 'wd-dot wd-base'}
          cx={d.cx} cy={d.cy} r="3"
          fill={d.accent ? 'rgba(201,255,87,0.4)' : 'rgba(255,255,255,0.18)'}
        />
      ))}

      {/* Scan line */}
      <line id="wd-scan" x1="0" y1="26" x2="352" y2="26"
        stroke="rgba(201,255,87,0.25)" strokeWidth="1" />
    </svg>
  );
}
