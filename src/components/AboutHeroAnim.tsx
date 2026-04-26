import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function AboutHeroAnim() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    gsap.from(svgRef.current, { autoAlpha: 0, duration: 1.4, delay: 0.7, ease: 'power2.out' });

    // Three orbits at different speeds + directions
    gsap.to('#ab-o1', { rotation: 360,  svgOrigin: '200 200', duration: 16, ease: 'none', repeat: -1 });
    gsap.to('#ab-o2', { rotation: -360, svgOrigin: '200 200', duration: 28, ease: 'none', repeat: -1 });
    gsap.to('#ab-o3', { rotation: 360,  svgOrigin: '200 200', duration: 44, ease: 'none', repeat: -1 });

    // Center pulse ring expands + fades
    gsap.to('#ab-pulse', {
      scale: 2.4, opacity: 0, svgOrigin: '200 200',
      duration: 2.4, ease: 'power2.out', repeat: -1,
    });

    // Dots individually twinkle
    gsap.to('.ab-dot', {
      opacity: 0.18,
      duration: 0.7,
      ease: 'sine.inOut',
      stagger: { each: 0.28, from: 'random', repeat: -1, yoyo: true, repeatDelay: 0.2 },
    });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 400 400" fill="none" aria-hidden
      style={{ width: '100%', height: '100%' }}>

      {/* Dashed orbit paths */}
      <circle cx="200" cy="200" r="52"  stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="200" cy="200" r="92"  stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 8" />
      <circle cx="200" cy="200" r="138" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2 10" />

      {/* Inner orbit — 2 accent dots */}
      <g id="ab-o1">
        <circle className="ab-dot" cx="252" cy="200" r="5.5" fill="var(--accent)" opacity="0.95" />
        <circle className="ab-dot" cx="148" cy="200" r="5.5" fill="var(--accent)" opacity="0.95" />
      </g>

      {/* Mid orbit — 3 white dots (equilateral) */}
      <g id="ab-o2">
        <circle className="ab-dot" cx="292" cy="200" r="4"   fill="rgba(255,255,255,0.65)" />
        <circle className="ab-dot" cx="154" cy="280" r="4"   fill="rgba(255,255,255,0.65)" />
        <circle className="ab-dot" cx="154" cy="120" r="4"   fill="rgba(255,255,255,0.65)" />
      </g>

      {/* Outer orbit — 4 faint lime dots (square) */}
      <g id="ab-o3">
        <circle className="ab-dot" cx="338" cy="200" r="3" fill="rgba(201,255,87,0.55)" />
        <circle className="ab-dot" cx="200" cy="338" r="3" fill="rgba(201,255,87,0.55)" />
        <circle className="ab-dot" cx="62"  cy="200" r="3" fill="rgba(201,255,87,0.55)" />
        <circle className="ab-dot" cx="200" cy="62"  r="3" fill="rgba(201,255,87,0.55)" />
      </g>

      {/* Expanding pulse ring */}
      <circle id="ab-pulse" cx="200" cy="200" r="20" stroke="rgba(201,255,87,0.38)" strokeWidth="1.5" fill="none" />

      {/* Center glow + dot */}
      <circle cx="200" cy="200" r="16" fill="rgba(201,255,87,0.07)" />
      <circle cx="200" cy="200" r="5"  fill="var(--accent)" />
    </svg>
  );
}
