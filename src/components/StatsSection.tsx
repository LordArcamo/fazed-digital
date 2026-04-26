import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stats = [
  { value: 120, suffix: '+', label: 'Projects Delivered',  sub: 'Across 14 industries' },
  { value: 98,  suffix: '%', label: 'Client Satisfaction', sub: 'Based on project reviews' },
  { value: 6,   suffix: ' yrs', label: 'In Business',      sub: 'Iligan City-based since 2018' },
  { value: 4,   suffix: 'x', label: 'Avg ROI Uplift',      sub: 'On SEO & web projects' },
];

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const numRef  = useRef<HTMLSpanElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const obj = { val: 0 };
    gsap.from(itemRef.current, {
      y: 35, autoAlpha: 0, duration: 0.7, delay: index * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: itemRef.current, start: 'top 86%', toggleActions: 'play none none none' },
    });
    gsap.to(obj, {
      val: stat.value, duration: 1.6, ease: 'power2.out',
      delay: index * 0.08 + 0.2,
      onUpdate() { numRef.current!.textContent = String(Math.round(obj.val)); },
      scrollTrigger: { trigger: itemRef.current, start: 'top 82%', toggleActions: 'play none none none' },
    });
  }, { scope: itemRef });

  return (
    <div ref={itemRef} style={{
      padding: 'clamp(2rem, 4vw, 3rem) 2rem',
      borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: '0.4rem',
    }}>
      <div style={{ lineHeight: 1 }}>
        <span ref={numRef} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem, 5.5vw, 5.5rem)',
          fontWeight: 600, letterSpacing: '-0.02em',
          color: 'var(--white)',
        }}>0</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 300,
          letterSpacing: '-0.01em', color: 'var(--gray-500)',
        }}>{stat.suffix}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.975rem', color: 'var(--white)' }}>
        {stat.label}
      </div>
      <div className="label" style={{ marginTop: '0.1rem' }}>{stat.sub}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section style={{
      background: 'var(--gray-900)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container">
        <div className="stats-inner" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {stats.map((s, i) => <StatItem key={s.label} stat={s} index={i} />)}
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.stats-inner{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:480px){.stats-inner{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}
