import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const items = [
  'Web Design',
  'Brand Identity',
  'SEO Marketing',
  'Product Design',
  'Custom Systems',
  'UI/UX Design',
  'Digital Strategy',
  'Creative Direction',
];

export default function MarqueeSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const w = trackRef.current!.scrollWidth / 2;
    gsap.to(trackRef.current, { x: -w, duration: 32, ease: 'none', repeat: -1 });
  }, { scope: trackRef });

  const doubled = [...items, ...items];

  return (
    <section style={{
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '1.25rem 0',
      overflow: 'hidden',
      background: 'var(--gray-900)',
    }}>
      <div ref={trackRef} style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.75rem' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--gray-400)',
              padding: '0 0.25rem',
            }}>
              {item}
            </span>
            <span style={{
              display: 'inline-block',
              width: 5, height: 5,
              borderRadius: '50%',
              background: 'var(--accent)',
              flexShrink: 0,
            }} />
          </span>
        ))}
      </div>
    </section>
  );
}
