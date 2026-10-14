import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Real client outcomes, taken from the case studies in src/pages/work/[slug].astro.
// These are results we delivered, not client quotes. Add verbatim quotes only with the client's OK.
const results = [
  {
    slug: '04',
    client: 'The Telecom Shop',
    industry: 'E-commerce',
    country: 'Australia',
    tag: 'E-commerce Migration',
    headline: 'Magento to PrestaShop with zero data loss',
    result: 'Full catalogue, customers, and order history migrated without disrupting sales. The new store is significantly faster, and the team runs it without a developer.',
  },
  {
    slug: '03',
    client: 'CrateOnScene',
    industry: 'Automotive Events',
    country: 'USA',
    tag: 'MVP Platform Build',
    headline: 'From idea to live platform in 5 weeks',
    result: 'An installable web app serving drivers, organisers, businesses, and spectators from day one, with no app store required.',
  },
  {
    slug: '02',
    client: 'Cleen & Green',
    industry: 'Cleaning Services',
    country: 'Philippines',
    tag: 'Brand Identity + Web',
    headline: 'A rebrand that opened a new revenue stream',
    result: "A premium eco brand and a site that converts better, plus a franchise section that unlocked a growth channel they couldn't activate before.",
  },
];

function ResultCard({ r, index }: { r: typeof results[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 50, autoAlpha: 0, duration: 0.85,
      delay: index * 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: cardRef.current, start: 'top 86%', toggleActions: 'play none none none' },
    });
  }, { scope: cardRef });

  return (
    <a
      ref={cardRef}
      href={`/work/${r.slug}`}
      data-cursor="link"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: '1 1 280px',
        padding: '2.25rem',
        border: `1px solid ${hovered ? 'var(--gray-500)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        background: hovered ? 'var(--gray-800)' : 'var(--surface)',
        display: 'flex', flexDirection: 'column', gap: '1.25rem',
        transition: 'border-color 0.3s, background 0.3s',
        position: 'relative', overflow: 'hidden', textDecoration: 'none',
      }}
    >
      {/* Accent top bar on hover */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, var(--accent) 0%, transparent 100%)',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.3s',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          letterSpacing: '0.14em', color: 'var(--accent)', textTransform: 'uppercase',
        }}>{r.tag}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
          letterSpacing: '0.14em', color: 'var(--gray-600)', textTransform: 'uppercase',
        }}>{r.country}</span>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 1.8vw, 1.5rem)',
        fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.01em', color: 'var(--white)',
      }}>
        {r.headline}
      </h3>

      <p style={{
        fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem, 1.2vw, 1rem)',
        color: 'var(--gray-400)', lineHeight: 1.7, flexGrow: 1,
      }}>
        {r.result}
      </p>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)',
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--white)' }}>{r.client}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--gray-500)', textTransform: 'uppercase', marginTop: '0.2rem' }}>
            {r.industry}
          </div>
        </div>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 500, flexShrink: 0,
          color: hovered ? 'var(--accent)' : 'var(--gray-400)', transition: 'color 0.3s',
        }}>
          Case study →
        </span>
      </div>
    </a>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="section" style={{
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
            <div className="label" style={{ marginBottom: '1.25rem' }}>Client Results</div>
            <AnimatedText text="Results speak loudest." as="h2" className="display-md" />
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--gray-500)', maxWidth: '30ch', lineHeight: 1.7,
          }}>
            Trusted by businesses in the Philippines, the United States &amp; Australia
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
          {results.map((r, i) => (
            <ResultCard key={r.slug} r={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
