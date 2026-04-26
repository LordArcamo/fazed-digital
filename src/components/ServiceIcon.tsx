import { useRef } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, MotionPathPlugin);

type ServiceId = 'web' | 'brand' | 'seo' | 'product' | 'systems';

interface Props { serviceId: ServiceId }

// ─── Individual animated icons ───────────────────────────────────────────────

function WebAnim({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) {
  useGSAP(() => {
    // Progress bar fills, then tabs light up, loops
    const bar = svgRef.current!.querySelector<SVGRectElement>('#si-web-bar');
    if (!bar) return;

    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
    tl.to(bar, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' })
      .to('#si-web-tab', { fill: 'var(--accent)', duration: 0.3 }, '>')
      .to('#si-web-dot1', { fill: 'var(--accent)', duration: 0.2 }, '<0.1')
      .to('#si-web-dot2', { fill: 'var(--accent)', duration: 0.2 }, '<0.1')
      .to([bar, '#si-web-tab', '#si-web-dot1', '#si-web-dot2'], {
        fill: 'rgba(255,255,255,0.25)', scaleX: 0,
        duration: 0.4, delay: 0.6,
      });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 64 64" fill="none" style={{ width: 56, height: 56 }} aria-hidden>
      <rect x="8" y="14" width="48" height="36" rx="3" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <line x1="8" y1="24" x2="56" y2="24" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <rect id="si-web-tab" x="12" y="27" width="18" height="2.5" rx="1.2" fill="rgba(255,255,255,0.15)" />
      <rect id="si-web-bar" x="12" y="34" width="40" height="2" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="12" y="40" width="28" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
      <circle id="si-web-dot1" cx="18" cy="19" r="2" fill="rgba(255,255,255,0.2)" />
      <circle id="si-web-dot2" cx="24" cy="19" r="2" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

function BrandAnim({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) {
  useGSAP(() => {
    // Diamond facets draw in, then glint sweeps
    const paths = svgRef.current!.querySelectorAll<SVGPathElement>('.si-br-facet');
    paths.forEach(p => {
      const len = p.getTotalLength?.() ?? 60;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    tl.to('.si-br-facet', { strokeDashoffset: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' })
      .to('#si-br-glint', { x: 40, opacity: 0, duration: 0.45, ease: 'power2.in', delay: 0.4 })
      .set(['.si-br-facet', '#si-br-glint'], { strokeDashoffset: '100%', opacity: 0.7, x: 0 });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 64 64" fill="none" style={{ width: 56, height: 56 }} aria-hidden>
      <path className="si-br-facet" d="M32 10 L52 26 L32 54 L12 26 Z"
        stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="rgba(255,255,255,0.04)" />
      <path className="si-br-facet" d="M12 26 L32 26 L52 26"
        stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
      <path className="si-br-facet" d="M32 10 L32 26 L32 54"
        stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <path className="si-br-facet" d="M12 26 L22 18 L32 10 M52 26 L42 18 L32 10"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      {/* Glint */}
      <line id="si-br-glint" x1="14" y1="22" x2="20" y2="16"
        stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function SeoAnim({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) {
  useGSAP(() => {
    // Trend line draws up, magnifier scans it
    const path = svgRef.current!.querySelector<SVGPathElement>('#si-seo-line');
    if (!path) return;
    const len = path.getTotalLength?.() ?? 50;
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    tl.to(path, { strokeDashoffset: 0, duration: 1, ease: 'power2.out' })
      .to('#si-seo-glass', { x: 8, y: -8, duration: 0.8, ease: 'power2.inOut' }, '-=0.3')
      .to('#si-seo-glass', { x: 0, y: 0, duration: 0.5, ease: 'power2.in' })
      .to([path, '#si-seo-bar1', '#si-seo-bar2', '#si-seo-bar3'], {
        opacity: 0, duration: 0.3, delay: 0.5,
      })
      .set([path, '#si-seo-bar1', '#si-seo-bar2', '#si-seo-bar3'], {
        strokeDashoffset: len, opacity: 1,
      });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 64 64" fill="none" style={{ width: 56, height: 56 }} aria-hidden>
      {/* Bar chart */}
      <rect id="si-seo-bar1" x="12" y="42" width="8" height="8"  rx="1" fill="rgba(255,255,255,0.12)" />
      <rect id="si-seo-bar2" x="24" y="36" width="8" height="14" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect id="si-seo-bar3" x="36" y="28" width="8" height="22" rx="1" fill="rgba(255,255,255,0.12)" />
      {/* Trend line */}
      <path id="si-seo-line" d="M12 46 Q24 38 36 30 L52 18"
        stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Magnifier */}
      <g id="si-seo-glass">
        <circle cx="22" cy="22" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <line x1="29" y1="29" x2="36" y2="36" stroke="rgba(255,255,255,0.35)" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function ProductAnim({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) {
  useGSAP(() => {
    // Wireframe lines draw in, cursor clicks a button
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
    tl.from('.si-pd-line', { scaleX: 0, transformOrigin: 'left center', stagger: 0.1, duration: 0.5, ease: 'power2.out' })
      .to('#si-pd-cursor', { x: 8, y: -6, duration: 0.5, ease: 'power2.inOut' }, '-=0.1')
      .to('#si-pd-btn', { fill: 'var(--accent)', duration: 0.2 })
      .to('#si-pd-cursor', { scale: 0.85, transformOrigin: '50% 50%', duration: 0.12 })
      .to('#si-pd-cursor', { scale: 1, duration: 0.12 })
      .to('#si-pd-btn',    { fill: 'rgba(255,255,255,0.18)', duration: 0.3, delay: 0.5 })
      .to('#si-pd-cursor', { x: 0, y: 0, duration: 0.4, ease: 'power2.in' });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 64 64" fill="none" style={{ width: 56, height: 56 }} aria-hidden>
      <rect x="8" y="10" width="48" height="44" rx="3" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <rect className="si-pd-line" x="14" y="20" width="22" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect className="si-pd-line" x="14" y="26" width="15" height="2" rx="1" fill="rgba(255,255,255,0.12)" />
      <rect className="si-pd-line" x="14" y="32" width="18" height="2" rx="1" fill="rgba(255,255,255,0.12)" />
      <rect id="si-pd-btn" x="14" y="40" width="20" height="8" rx="4" fill="rgba(255,255,255,0.18)" />
      {/* Cursor */}
      <g id="si-pd-cursor" transform="translate(30,28)">
        <path d="M0,0 L0,12 L3.5,8.5 L6.5,14 L8,13 L5,7.5 L9,7.5 Z"
          fill="rgba(255,255,255,0.7)" />
      </g>
    </svg>
  );
}

function SystemsAnim({ svgRef }: { svgRef: React.RefObject<SVGSVGElement> }) {
  useGSAP(() => {
    // Nodes connect, data packet travels along edges
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
    tl.from('.si-sy-edge', { strokeDashoffset: 40, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
      .from('.si-sy-node', { scale: 0, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.4, ease: 'back.out(2)' }, '-=0.3')
      .to('#si-sy-packet', { motionPath: { path: '#si-sy-path1', align: '#si-sy-path1', autoRotate: false }, duration: 0.8, ease: 'power1.inOut' }, '+=0.3')
      .to('#si-sy-packet', { opacity: 0, duration: 0.2 })
      .set('#si-sy-packet', { opacity: 1 });
  }, { scope: svgRef });

  return (
    <svg ref={svgRef} viewBox="0 0 64 64" fill="none" style={{ width: 56, height: 56 }} aria-hidden>
      {/* Edges */}
      <path id="si-sy-path1" className="si-sy-edge" d="M16 32 L32 16 L48 32 L32 48 L16 32"
        stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" strokeDasharray="40"
        strokeLinecap="round" fill="none" />
      <line className="si-sy-edge" x1="32" y1="16" x2="32" y2="48"
        stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="40" />
      {/* Nodes */}
      <circle className="si-sy-node" cx="32" cy="16" r="4.5" fill="rgba(201,255,87,0.2)" stroke="var(--accent)" strokeWidth="1" />
      <circle className="si-sy-node" cx="48" cy="32" r="4.5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <circle className="si-sy-node" cx="32" cy="48" r="4.5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <circle className="si-sy-node" cx="16" cy="32" r="4.5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <circle className="si-sy-node" cx="32" cy="32" r="3"   fill="var(--accent)" opacity="0.7" />
      {/* Packet */}
      <circle id="si-sy-packet" cx="16" cy="32" r="3" fill="var(--accent)" opacity="0.9" />
    </svg>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

const ANIMS: Record<ServiceId, (p: { svgRef: React.RefObject<SVGSVGElement> }) => JSX.Element> = {
  web:     WebAnim,
  brand:   BrandAnim,
  seo:     SeoAnim,
  product: ProductAnim,
  systems: SystemsAnim,
};

export default function ServiceIcon({ serviceId }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const Anim = ANIMS[serviceId];
  return <Anim svgRef={svgRef} />;
}
