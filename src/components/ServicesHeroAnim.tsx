import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// Pentagon positions (cx=200, cy=200, r=115)
const NODES = [
  { x: 200, y: 85,  label: 'Web',     color: 'rgba(201,255,87,0.85)' },
  { x: 309, y: 162, label: 'Brand',   color: 'rgba(255,255,255,0.7)' },
  { x: 270, y: 291, label: 'SEO',     color: 'rgba(201,255,87,0.7)'  },
  { x: 130, y: 291, label: 'Product', color: 'rgba(255,255,255,0.7)' },
  { x: 91,  y: 162, label: 'Systems', color: 'rgba(201,255,87,0.7)'  },
];

function WebIcon() {
  return (
    <g stroke="currentColor" strokeWidth="1.3" fill="none">
      <rect x="-14" y="-10" width="28" height="21" rx="2.5" />
      <line x1="-14" y1="-3.5" x2="14" y2="-3.5" />
      <circle cx="-9" cy="-6.8" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="-5" cy="-6.8" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="-1" cy="-6.8" r="1.4" fill="currentColor" stroke="none" />
    </g>
  );
}

function BrandIcon() {
  return (
    <g stroke="currentColor" strokeWidth="1.3" fill="none">
      <path d="M0,-13 L12,-3 L0,13 L-12,-3 Z" />
      <line x1="-12" y1="-3" x2="12" y2="-3" opacity="0.5" />
      <line x1="-6" y1="-8" x2="6" y2="8" opacity="0.3" />
    </g>
  );
}

function SeoIcon() {
  return (
    <g stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round">
      <circle cx="-3" cy="-3" r="9.5" />
      <line x1="4.5" y1="4.5" x2="11" y2="11" strokeWidth="2.2" />
      <polyline points="-7,2 -3,-2 1,1 5,-4" opacity="0.7" />
    </g>
  );
}

function ProductIcon() {
  return (
    <g stroke="currentColor" strokeWidth="1.3" fill="none">
      <rect x="-13" y="-10" width="26" height="20" rx="2" />
      <line x1="-6" y1="-10" x2="-6" y2="-14" />
      <line x1="6"  y1="-10" x2="6"  y2="-14" />
      <line x1="-8" y1="-3" x2="2" y2="-3" opacity="0.5" />
      <line x1="-8" y1="1" x2="4" y2="1" opacity="0.5" />
      <line x1="-8" y1="5" x2="0" y2="5" opacity="0.5" />
    </g>
  );
}

function SystemsIcon() {
  return (
    <g stroke="currentColor" strokeWidth="1.3" fill="none">
      <polygon points="0,-13 11.3,-6.5 11.3,6.5 0,13 -11.3,6.5 -11.3,-6.5" />
      <circle cx="0" cy="0" r="4.5" />
      <circle cx="0" cy="0" r="1.8" fill="currentColor" stroke="none" />
    </g>
  );
}

const ICONS = [WebIcon, BrandIcon, SeoIcon, ProductIcon, SystemsIcon];

export default function ServicesHeroAnim() {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    // Draw connection lines from center
    const lines = Array.from(svgRef.current!.querySelectorAll<SVGLineElement>('.sv-line'));
    lines.forEach(ln => {
      const len = ln.getTotalLength?.() ?? 130;
      gsap.set(ln, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.to('.sv-line', {
      strokeDashoffset: 0, duration: 0.9,
      stagger: 0.08, ease: 'power2.inOut', delay: 0.6,
    });

    // Icons scale in after lines
    gsap.from('.sv-node', {
      scale: 0, opacity: 0, svgOrigin: 'node',
      duration: 0.55, stagger: 0.1,
      ease: 'back.out(1.8)', delay: 1.2,
      transformOrigin: '50% 50%',
    });

    // Center pulse
    gsap.to('#sv-pulse', {
      scale: 2.8, opacity: 0, svgOrigin: '200 200',
      duration: 2.2, ease: 'power2.out', repeat: -1,
    });

    // Each node floats at a unique phase
    NODES.forEach((_, i) => {
      gsap.to(`.sv-node-${i}`, {
        y: -7, duration: 1.8 + i * 0.28,
        ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.38,
      });
    });

    // Slow overall drift
    gsap.from(svgRef.current, { autoAlpha: 0, duration: 1, ease: 'power2.out' });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 400 400" fill="none" aria-hidden
      style={{ width: '100%', height: '100%' }}>

      {/* Connection lines */}
      {NODES.map((n, i) => (
        <line key={i} className="sv-line"
          x1="200" y1="200" x2={n.x} y2={n.y}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1"
        />
      ))}

      {/* Outer pentagon ring */}
      <polygon
        points={NODES.map(n => `${n.x},${n.y}`).join(' ')}
        stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none"
        strokeDasharray="4 6"
      />

      {/* Center pulse + dot */}
      <circle id="sv-pulse" cx="200" cy="200" r="16" stroke="rgba(201,255,87,0.3)" strokeWidth="1.5" fill="none" />
      <circle cx="200" cy="200" r="12" fill="rgba(201,255,87,0.08)" />
      <circle cx="200" cy="200" r="4.5" fill="var(--accent)" />

      {/* Service nodes */}
      {NODES.map((n, i) => {
        const Icon = ICONS[i];
        return (
          <g key={i} className={`sv-node sv-node-${i}`} transform={`translate(${n.x},${n.y})`}
            style={{ color: n.color }}>
            <circle r="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <Icon />
            <text y="35" textAnchor="middle"
              fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1.2"
              fill="rgba(255,255,255,0.35)" style={{ textTransform: 'uppercase' }}>
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
