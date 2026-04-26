import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function NotFoundAnim() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    gsap.from(svgRef.current, { autoAlpha: 0, duration: 1, ease: 'power2.out' });

    // Radar sweep rotation
    gsap.to('#nf-sweep', {
      rotation: 360, svgOrigin: '200 200',
      duration: 3.5, ease: 'none', repeat: -1,
    });

    // Sweep glow trail (sector opacity pulse keyed to rotation)
    gsap.to('#nf-sector', {
      rotation: 360, svgOrigin: '200 200',
      duration: 3.5, ease: 'none', repeat: -1,
    });

    // Center pulse
    gsap.to('#nf-center-pulse', {
      scale: 2.2, opacity: 0, svgOrigin: '200 200',
      duration: 1.8, ease: 'power2.out', repeat: -1, repeatDelay: 1.7,
    });

    // Noise dots blink randomly — simulating no-signal interference
    gsap.to('.nf-noise', {
      opacity: 1,
      duration: 0.08,
      ease: 'none',
      stagger: { each: 0.04, from: 'random', repeat: -1, yoyo: true, repeatDelay: 0.15 },
    });

    // "Searching…" dots sequence
    const dots = ['.nf-s1', '.nf-s2', '.nf-s3'];
    dots.forEach((d, i) => {
      gsap.to(d, {
        opacity: 1, duration: 0.25, ease: 'power2.out',
        repeat: -1, repeatDelay: 0.75, delay: i * 0.28,
        yoyo: true,
      });
    });
  }, { scope: svgRef });

  // Noise dot positions (random scatter within the radar circle)
  const noiseDots = [
    { cx: 155, cy: 145 }, { cx: 225, cy: 170 }, { cx: 180, cy: 230 },
    { cx: 240, cy: 215 }, { cx: 145, cy: 200 }, { cx: 215, cy: 155 },
    { cx: 170, cy: 175 }, { cx: 245, cy: 185 }, { cx: 160, cy: 220 },
  ];

  return (
    <svg ref={svgRef} viewBox="0 0 400 400" fill="none" aria-hidden
      style={{ width: '100%', maxWidth: 420, height: 'auto' }}>

      {/* Radar rings */}
      <circle cx="200" cy="200" r="40"  stroke="rgba(201,255,87,0.08)" strokeWidth="1" fill="none" />
      <circle cx="200" cy="200" r="80"  stroke="rgba(201,255,87,0.06)" strokeWidth="1" fill="none" strokeDasharray="3 5" />
      <circle cx="200" cy="200" r="120" stroke="rgba(201,255,87,0.1)"  strokeWidth="1" fill="none" strokeDasharray="4 6" />

      {/* Crosshair */}
      <line x1="170" y1="200" x2="230" y2="200" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <line x1="200" y1="170" x2="200" y2="230" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* Sweep sector (pie slice, rotates) */}
      <path id="nf-sector"
        d="M200,200 L200,80 A120,120 0 0,1 237.6,91.6 Z"
        fill="rgba(201,255,87,0.05)" />

      {/* Sweep arm */}
      <g id="nf-sweep">
        <line x1="200" y1="200" x2="200" y2="80"
          stroke="rgba(201,255,87,0.55)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="200" cy="80" r="3.5" fill="var(--accent)" opacity="0.8" />
      </g>

      {/* Center */}
      <circle id="nf-center-pulse" cx="200" cy="200" r="8" stroke="rgba(201,255,87,0.4)" strokeWidth="1.5" fill="none" />
      <circle cx="200" cy="200" r="4" fill="var(--accent)" opacity="0.7" />

      {/* Interference noise dots */}
      {noiseDots.map((d, i) => (
        <circle key={i} className="nf-noise"
          cx={d.cx} cy={d.cy} r="2"
          fill="rgba(201,255,87,0.5)" opacity="0"
        />
      ))}

      {/* No target label */}
      <text x="200" y="348" textAnchor="middle"
        fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2"
        fill="rgba(255,255,255,0.2)">
        NO TARGET FOUND
      </text>

      {/* Searching dots */}
      <circle className="nf-s1" cx="190" cy="364" r="2.5" fill="rgba(201,255,87,0.6)" opacity="0.2" />
      <circle className="nf-s2" cx="200" cy="364" r="2.5" fill="rgba(201,255,87,0.6)" opacity="0.2" />
      <circle className="nf-s3" cx="210" cy="364" r="2.5" fill="rgba(201,255,87,0.6)" opacity="0.2" />
    </svg>
  );
}
