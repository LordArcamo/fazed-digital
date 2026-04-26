import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function ContactHeroAnim() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    gsap.from(svgRef.current, { autoAlpha: 0, duration: 1.2, delay: 0.6, ease: 'power2.out' });

    // Pin drop entrance
    gsap.from('#ch-pin', {
      y: -30, scale: 0, svgOrigin: '160 80',
      duration: 0.85, delay: 0.9, ease: 'back.out(1.5)',
    });

    // 3 signal rings expand outward with stagger
    [0, 1, 2].forEach(i => {
      gsap.fromTo(`#ch-ring-${i}`,
        { scale: 0.1, opacity: 0.8, svgOrigin: '160 175' },
        {
          scale: 1, opacity: 0,
          duration: 2.2,
          ease: 'power2.out',
          repeat: -1,
          delay: i * 0.65 + 1.2,
          svgOrigin: '160 175',
        }
      );
    });

    // Inner dot blinks
    gsap.to('#ch-inner', {
      opacity: 0.3, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true,
    });

    // Coordinates text fade in
    gsap.from('#ch-coords', { autoAlpha: 0, y: 8, duration: 1, delay: 1.8, ease: 'power2.out' });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 320 300" fill="none" aria-hidden
      style={{ width: '100%', height: '100%' }}>

      {/* Grid lines (faint background) */}
      {[80, 160, 240].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="280"
          stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}
      {[70, 140, 210].map(y => (
        <line key={y} x1="0" y1={y} x2="320" y2={y}
          stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      ))}

      {/* Signal rings (centered on pin tip at 160,175) */}
      <circle id="ch-ring-0" cx="160" cy="175" r="60"
        stroke="rgba(201,255,87,0.35)" strokeWidth="1.2" fill="none" />
      <circle id="ch-ring-1" cx="160" cy="175" r="60"
        stroke="rgba(201,255,87,0.25)" strokeWidth="1" fill="none" />
      <circle id="ch-ring-2" cx="160" cy="175" r="60"
        stroke="rgba(201,255,87,0.15)" strokeWidth="0.8" fill="none" />

      {/* Location pin */}
      <g id="ch-pin">
        {/* Pin body */}
        <path d="M160 60 C135 60 115 80 115 106 C115 142 160 185 160 185 C160 185 205 142 205 106 C205 80 185 60 160 60 Z"
          fill="rgba(201,255,87,0.08)" stroke="rgba(201,255,87,0.55)" strokeWidth="1.5" />
        {/* Inner circle */}
        <circle cx="160" cy="106" r="18" fill="rgba(201,255,87,0.12)" stroke="rgba(201,255,87,0.4)" strokeWidth="1" />
        <circle id="ch-inner" cx="160" cy="106" r="7" fill="var(--accent)" />
      </g>

      {/* Coordinates */}
      <text id="ch-coords" x="160" y="260" textAnchor="middle"
        fontFamily="var(--font-mono)" fontSize="9" letterSpacing="1.5"
        fill="rgba(255,255,255,0.22)">
        8.2280° N  ·  124.2452° E
      </text>

      {/* Location label */}
      <text x="160" y="272" textAnchor="middle"
        fontFamily="var(--font-mono)" fontSize="7.5" letterSpacing="1.2"
        fill="rgba(201,255,87,0.3)">
        ILIGAN CITY, PH
      </text>
    </svg>
  );
}
