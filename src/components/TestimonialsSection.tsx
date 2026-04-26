import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const testimonials = [
  {
    quote: "Fazed didn't just redesign our website — they repositioned our entire brand. Three months after launch, inbound leads were up 2×. The strategy-first process was unlike any agency we'd worked with.",
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'Arcadia Studio',
    stars: 5,
    tag: 'Brand Identity + Web',
    initials: 'SC',
    accent: 'var(--accent)',
  },
  {
    quote: "The questions they asked in discovery unlocked things we hadn't been able to articulate ourselves. The brand system they delivered is something we're still proud of two years later.",
    name: 'Marcus Webb',
    role: 'Founder',
    company: 'Meridian Finance',
    stars: 5,
    tag: 'Web Design + SEO',
    initials: 'MW',
    accent: 'rgba(255,255,255,0.85)',
  },
  {
    quote: "Working with Fazed felt like having an in-house creative director who genuinely cared. The attention to craft — every spacing decision, every animation — was obsessive in the best way.",
    name: 'Priya Nair',
    role: 'Head of Marketing',
    company: 'Bloom Organics',
    stars: 5,
    tag: 'E-commerce + Brand',
    initials: 'PN',
    accent: 'var(--accent)',
  },
];

/* Animated quotation mark SVG — draws in on mount */
function QuoteMark() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const path = ref.current?.querySelector('path');
    if (!path) return;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, { scope: ref });

  return (
    <svg ref={ref} viewBox="0 0 80 60" fill="none" style={{ width: 64, height: 48 }}>
      <path
        d="M8 38 C8 28 14 18 26 14 L30 20 C22 24 18 30 18 38 L18 52 L8 52 Z
           M42 38 C42 28 48 18 60 14 L64 20 C56 24 52 30 52 38 L52 52 L42 52 Z"
        stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        fill="rgba(201,255,87,0.06)"
      />
    </svg>
  );
}

/* Star rating */
function Stars({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 14 14" width="14" height="14" fill="var(--accent)">
          <path d="M7 1l1.5 3.1L12 4.6l-2.5 2.4.6 3.4L7 8.8l-3.1 1.6.6-3.4L2 4.6l3.5-.5z"/>
        </svg>
      ))}
    </div>
  );
}

/* Avatar circle */
function Avatar({ initials, accent }: { initials: string; accent: string }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: '50%',
      background: 'var(--gray-800)', border: `1.5px solid ${accent}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700,
      fontSize: '0.85rem', color: accent, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function TestimonialCard({ t, index }: { t: typeof testimonials[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 50, autoAlpha: 0, duration: 0.85,
      delay: index * 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: cardRef.current, start: 'top 86%', toggleActions: 'play none none none' },
    });
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 280px',
        padding: '2.25rem',
        border: `1px solid ${hovered ? 'var(--gray-500)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        background: hovered ? 'var(--gray-800)' : 'var(--surface)',
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        transition: 'border-color 0.3s, background 0.3s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle accent top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${t.accent} 0%, transparent 100%)`,
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stars count={t.stars} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          letterSpacing: '0.14em', color: 'var(--gray-600)',
          textTransform: 'uppercase',
        }}>{t.tag}</span>
      </div>

      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
        color: 'var(--gray-300)', lineHeight: 1.75, fontStyle: 'italic',
        flexGrow: 1,
      }}>
        "{t.quote}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <Avatar initials={t.initials} accent={t.accent} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--white)' }}>{t.name}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--gray-500)', textTransform: 'uppercase', marginTop: '0.2rem' }}>
            {t.role} · {t.company}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="section" style={{
      background: 'var(--gray-900)',
      borderTop: '1px solid var(--border)',
    }}>
      <div className="container">
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem',
          marginBottom: 'clamp(3rem, 5vw, 5rem)',
        }}>
          <div>
            <div className="label" style={{ marginBottom: '1.25rem' }}>Client Stories</div>
            <AnimatedText text="Results speak loudest." as="h2" className="display-md" />
          </div>
          <QuoteMark />
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>

        {/* Trust bar */}
        <div style={{
          marginTop: 'clamp(3rem, 5vw, 5rem)',
          paddingTop: '2.5rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem',
        }}>
          {[
            { val: '120+', label: 'Projects delivered' },
            { val: '98%',  label: 'Client satisfaction' },
            { val: '6 yrs', label: 'Industry experience' },
            { val: '4×',   label: 'Avg ROI uplift' },
          ].map(({ val, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--white)',
                letterSpacing: '-0.02em',
              }}>{val}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--gray-500)', textTransform: 'uppercase', maxWidth: '8ch' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
