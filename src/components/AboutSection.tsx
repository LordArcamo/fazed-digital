import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(imgRef.current, {
      x: 50, autoAlpha: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: imgRef.current, start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.from(lineRef.current, {
      scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: lineRef.current, start: 'top 86%', toggleActions: 'play none none none' },
    });
    gsap.to(imgRef.current, {
      y: -50, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section" id="about" style={{ background: 'var(--black)' }}>
      <div className="container">
        <div className="about-grid" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(3rem, 6vw, 8rem)', alignItems: 'center',
        }}>
          {/* Left */}
          <div>
            <div className="label" style={{ marginBottom: '1.5rem' }}>Who We Are</div>
            <AnimatedText text="A creative studio obsessed with your success." as="h2" className="display-md" style={{ marginBottom: '2rem' }} />
            <div ref={lineRef} style={{ width: '2.5rem', height: '1px', background: 'var(--white)', marginBottom: '2rem' }} />
            <p className="body-lg" style={{ color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
              Fazed Digital is an Iligan City-based creative agency combining design excellence,
              digital strategy, and technical expertise to help ambitious brands stand out.
            </p>
            <p className="body" style={{ color: 'var(--gray-500)', marginBottom: '2.5rem' }}>
              Every project starts with the right questions: who are you, who are you talking to,
              and what do you want them to feel? The answers shape everything that follows.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {[
                ['Bold by default', 'No safe choices. Every decision made with conviction.'],
                ['Strategy first', 'Beautiful design without purpose is decoration.'],
                ['Craft matters', 'Pixel-level detail. Always. No half-measures.'],
                ['Results-driven', 'Success is measured by your growth, not awards.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem' }}>{t}</div>
                  <div className="small" style={{ color: 'var(--gray-500)' }}>{d}</div>
                </div>
              ))}
            </div>
            <MagneticButton href="/about" variant="ghost" size="md">Our Story →</MagneticButton>
          </div>

          {/* Right — real photo */}
          <div ref={imgRef} style={{
            position: 'relative', aspectRatio: '3/4',
            borderRadius: 'var(--radius)', overflow: 'hidden',
            background: 'var(--gray-900)', border: '1px solid var(--border)',
          }}>
            <img
              src="https://fazeddigital.com/wp-content/uploads/2025/12/ambre-esteve-gdCwuKCuJWY-unsplash-scaled.jpg"
              alt="Fazed Digital creative studio"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
              }}
            />
            {/* Dark tint to match site palette */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,9,9,0.38)' }} />
            {/* Subtle lime gradient at top */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(201,255,87,0.04) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
              <div className="label" style={{ marginBottom: '0.4rem' }}>Est. 2018 — Iligan City, PH</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>
                Fazed Digital
              </div>
            </div>
            <div aria-hidden style={{
              position: 'absolute', top: '2rem', right: '2rem',
              width: 44, height: 44,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.25) 1.5px, transparent 1.5px)',
              backgroundSize: '8px 8px',
            }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-grid > div:last-child { max-height: 420px; }
        }
      `}</style>
    </section>
  );
}
