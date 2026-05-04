import { useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const panels = [
  {
    src: 'https://images.unsplash.com/photo-1587428599384-f67a2092769a?auto=format&fit=crop&w=1400&q=80',
    label: 'Creative Direction',
    pos: 'center center',
  },
  {
    src: 'https://images.unsplash.com/photo-1497091071254-cc9b2ba7c48a?auto=format&fit=crop&w=1400&q=80',
    label: 'Design & Identity',
    pos: 'center 30%',
  },
  {
    src: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=1400&q=80',
    label: 'Digital Strategy',
    pos: 'center center',
  },
];

const Panel = memo(function Panel({
  panel, index,
}: {
  panel: typeof panels[0];
  index: number;
}) {
  const ref     = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(ref.current, {
      autoAlpha: 0, y: 40, duration: 0.9,
      delay: index * 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 88%', toggleActions: 'play none none none' },
    });

    const el = ref.current!;
    const enter = () => {
      gsap.to(imgRef.current,   { scale: 1.06, duration: 0.8, ease: 'power2.out' });
      gsap.to(overlayRef.current, { opacity: 0.25, duration: 0.5 });
      gsap.to(labelRef.current, { y: -6, duration: 0.4, ease: 'power2.out' });
    };
    const leave = () => {
      gsap.to(imgRef.current,   { scale: 1, duration: 0.7, ease: 'power2.out' });
      gsap.to(overlayRef.current, { opacity: 0.55, duration: 0.4 });
      gsap.to(labelRef.current, { y: 0, duration: 0.4, ease: 'power2.out' });
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); };
  }, { scope: ref });

  return (
    <div ref={ref} style={{
      flex: index === 1 ? '1.35' : '1',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'crosshair',
      borderRight: index < panels.length - 1 ? '1px solid var(--border)' : 'none',
    }}>
      {/* Image */}
      <div ref={imgRef} style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${panel.src})`,
        backgroundSize: 'cover',
        backgroundPosition: panel.pos,
        willChange: 'transform',
      }} />

      {/* Dark overlay */}
      <div ref={overlayRef} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(9,9,9,0.55)',
      }} />

      {/* Lime top accent — revealed on hover via CSS */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2, background: 'var(--accent)', opacity: 0,
        transition: 'opacity 0.3s',
      }} className="strip-accent" />

      {/* Label */}
      <div ref={labelRef} style={{
        position: 'absolute', bottom: '2rem', left: '2rem',
        display: 'flex', flexDirection: 'column', gap: '0.35rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--accent)',
        }}>0{index + 1}</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2vw, 1.6rem)',
          fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--white)',
        }}>{panel.label}</span>
      </div>
    </div>
  );
});

export default function ImageStrip() {
  return (
    <div style={{
      display: 'flex',
      height: 'clamp(320px, 40vw, 580px)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {panels.map((p, i) => <Panel key={i} panel={p} index={i} />)}

      <style>{`
        div:hover > .strip-accent { opacity: 1 !important; }
        @media (max-width: 640px) {
          .image-strip-inner { flex-direction: column !important; height: auto !important; }
          .image-strip-inner > div { min-height: 260px; border-right: none !important; border-bottom: 1px solid var(--border); }
        }
      `}</style>
    </div>
  );
}
