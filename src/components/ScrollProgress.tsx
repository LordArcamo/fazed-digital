import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'left' });
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 'top top', end: 'bottom bottom', scrub: 0 },
    });
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 2, zIndex: 99997, pointerEvents: 'none',
      background: 'rgba(201,255,87,0.12)',
    }}>
      <div ref={barRef} style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(to right, var(--accent), var(--accent-dark))',
        transformOrigin: 'left',
        boxShadow: '0 0 8px var(--accent)',
      }} />
    </div>
  );
}
