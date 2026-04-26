import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

/* Large animated orbital sphere — positioned on the right half of the hero */
export default function HeroGraphic() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current!;
    gsap.set(el, { transformPerspective: 900, autoAlpha: 0 });
    gsap.to(el, { autoAlpha: 1, duration: 1.6, delay: 2.4, ease: 'power2.out' });

    const xTo = gsap.quickTo(el, 'rotateY', { duration: 2, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'rotateX', { duration: 2, ease: 'power2.out' });
    const move = (e: MouseEvent) => {
      xTo((e.clientX / window.innerWidth  - 0.5) *  14);
      yTo((e.clientY / window.innerHeight - 0.5) * -10);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="hero-graphic" style={{
      position: 'absolute',
      right: 'clamp(-80px, 2vw, 60px)',
      top: '50%', transform: 'translateY(-48%)',
      width: 'clamp(280px, 42vw, 560px)',
      aspectRatio: '1',
      pointerEvents: 'none', zIndex: 0,
      willChange: 'transform',
    }}>
      <svg viewBox="0 0 500 500" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id="hgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(201,255,87,0.07)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="hgBlur">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          {/* Orbit paths — referenced by animateMotion */}
          <ellipse id="orbit-a" cx="250" cy="250" rx="188" ry="52"
            transform="rotate(-12 250 250)" />
          <ellipse id="orbit-b" cx="250" cy="250" rx="175" ry="68"
            transform="rotate(42 250 250)" />
          <ellipse id="orbit-c" cx="250" cy="250" rx="52" ry="188" />
        </defs>

        {/* Ambient glow */}
        <circle cx="250" cy="250" r="230" fill="url(#hgGlow)" />

        {/* Outer dashed ring — spins slowly via CSS */}
        <circle cx="250" cy="250" r="228"
          stroke="rgba(201,255,87,0.12)" strokeWidth="1"
          strokeDasharray="3 14"
          style={{ animation: 'hgSpin 60s linear infinite', transformOrigin: '250px 250px' }} />

        {/* Main sphere outline */}
        <circle cx="250" cy="250" r="200"
          stroke="white" strokeOpacity="0.08" strokeWidth="1" />
        <circle cx="250" cy="250" r="130"
          stroke="white" strokeOpacity="0.05" strokeWidth="1" />

        {/* Three orbital ellipses */}
        <ellipse cx="250" cy="250" rx="188" ry="52"
          transform="rotate(-12 250 250)"
          stroke="white" strokeOpacity="0.13" strokeWidth="1" />
        <ellipse cx="250" cy="250" rx="175" ry="68"
          transform="rotate(42 250 250)"
          stroke="white" strokeOpacity="0.08" strokeWidth="1" />
        <ellipse cx="250" cy="250" rx="52" ry="188"
          stroke="rgba(201,255,87,0.14)" strokeWidth="1" />

        {/* Cross-hair axes — very subtle */}
        <line x1="50" y1="250" x2="450" y2="250"
          stroke="white" strokeOpacity="0.04" strokeWidth="1" />
        <line x1="250" y1="50" x2="250" y2="450"
          stroke="white" strokeOpacity="0.04" strokeWidth="1" />

        {/* Static nodes at axis tips */}
        {[[250,62],[250,438],[62,250],[438,250]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="3"
            fill="white" fillOpacity="0.25" />
        ))}

        {/* Lime orbiting dot — track A */}
        <circle r="5" fill="rgba(201,255,87,0.9)" filter="url(#hgBlur)">
          <animateMotion dur="7s" repeatCount="indefinite">
            <mpath href="#orbit-a" />
          </animateMotion>
        </circle>
        <circle r="3.5" fill="rgba(201,255,87,1)">
          <animateMotion dur="7s" repeatCount="indefinite">
            <mpath href="#orbit-a" />
          </animateMotion>
        </circle>

        {/* White orbiting dot — track B (opposite start, longer) */}
        <circle r="3" fill="rgba(255,255,255,0.55)">
          <animateMotion dur="11s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
            <mpath href="#orbit-b" />
          </animateMotion>
        </circle>

        {/* Small white dot — track C (vertical orbit) */}
        <circle r="2" fill="rgba(255,255,255,0.4)">
          <animateMotion dur="14s" repeatCount="indefinite">
            <mpath href="#orbit-c" />
          </animateMotion>
        </circle>

        {/* Center */}
        <circle cx="250" cy="250" r="16"
          fill="rgba(201,255,87,0.05)" stroke="rgba(201,255,87,0.2)" strokeWidth="1" />
        <circle cx="250" cy="250" r="4" fill="rgba(201,255,87,0.7)" />
      </svg>

      <style>{`
        @keyframes hgSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 860px) { .hero-graphic { display: none !important; } }
      `}</style>
    </div>
  );
}
