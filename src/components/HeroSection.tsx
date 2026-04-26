import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import MagneticButton from './MagneticButton';
import ParticleCanvas from './ParticleCanvas';
import HeroGraphic from './HeroGraphic';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ∆◆◇◈';
function scramble(el: HTMLElement, final: string) {
  let i = 0;
  const total = final.length * 7;
  const id = setInterval(() => {
    el.textContent = final.split('').map((c, idx) =>
      idx < Math.floor(i / 7) ? c : c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]
    ).join('');
    if (++i > total) { clearInterval(id); el.textContent = final; }
  }, 28);
}

/* Glow orb — uses quickTo so no new tween on every mousemove */
function GlowOrb() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const xTo = gsap.quickTo(el, 'x', { duration: 2, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 2, ease: 'power2.out' });
    const move = (e: MouseEvent) => { xTo(e.clientX - 300); yTo(e.clientY - 300); };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div ref={ref} aria-hidden style={{
      position: 'absolute', width: 600, height: 600, borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(201,255,87,0.045) 0%, transparent 65%)',
      pointerEvents: 'none', zIndex: 0, willChange: 'transform',
    }} />
  );
}

/* Corner service tags */
const TAGS = ['WEB', 'BRAND', 'SEO', 'SYSTEMS'];

export default function HeroSection() {
  const heroRef   = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const line1Ref  = useRef<HTMLDivElement>(null);
  const line2Ref  = useRef<HTMLDivElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const ctaRef    = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const craftRef  = useRef<HTMLSpanElement>(null);
  const boldRef   = useRef<HTMLSpanElement>(null);
  const badgeRef  = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 1.9 });
    tl.from(heroRef.current, { autoAlpha: 0, duration: 0.4 })
      .add(() => {
        if (craftRef.current) scramble(craftRef.current, 'We craft');
        if (boldRef.current)  scramble(boldRef.current, 'bold');
      })
      .from(badgeRef.current, { autoAlpha: 0, y: 10, duration: 0.6, ease: 'power2.out' }, '+=0.1')
      .from([line1Ref.current, line2Ref.current], {
        y: 60, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'power3.out',
      }, '-=0.2')
      .from([subRef.current, ctaRef.current], {
        y: 25, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out',
      }, '-=0.5')
      .from(scrollRef.current, { autoAlpha: 0, y: -8, duration: 0.6 }, '-=0.3');

    gsap.to(bgTextRef.current, {
      y: 200, ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.4 },
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} style={{
      position: 'relative', minHeight: '100svh',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      padding: 'clamp(2rem, 5vw, 5rem)',
      paddingTop: '7rem', overflow: 'hidden',
      background: 'var(--black)',
    }}>

      {/* Accent diagonal */}
      <div aria-hidden style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none',
        background: 'linear-gradient(135deg, rgba(201,255,87,0.025) 0%, transparent 50%)',
      }} />

      {/* Particle network */}
      <ParticleCanvas />

      {/* Mouse glow orb */}
      <GlowOrb />

      {/* Orbital sphere graphic */}
      <HeroGraphic />

      {/* Side tags */}
      <div aria-hidden className="hero-tags" style={{
        position: 'absolute', top: '5rem', right: 'clamp(1.5rem,4vw,3rem)',
        zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem',
      }}>
        {TAGS.map(tag => (
          <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.16em', color: 'var(--gray-700)' }}>{tag}</span>
        ))}
      </div>

      {/* BG text watermark */}
      <div ref={bgTextRef} aria-hidden style={{
        position: 'absolute', bottom: '-3rem', left: 0, right: 0,
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(9rem, 22vw, 26rem)', fontWeight: 700,
        color: 'transparent',
        WebkitTextStroke: '1px rgba(255,255,255,0.03)',
        whiteSpace: 'nowrap', lineHeight: 0.85, letterSpacing: '-0.02em',
        pointerEvents: 'none', userSelect: 'none', zIndex: 0,
        willChange: 'transform',
      }}>
        Fazed Digital
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div ref={badgeRef} className="label" style={{
          marginBottom: '1.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
          background: 'rgba(201,255,87,0.07)', border: '1px solid rgba(201,255,87,0.2)',
          borderRadius: '100px', padding: '0.35rem 0.85rem',
        }}>
          <span style={{
            display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
            background: 'var(--accent)', flexShrink: 0,
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          <span style={{ color: 'var(--accent)' }}>Creative Digital Agency — Iligan City, PH</span>
        </div>

        <h1>
          <div ref={line1Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 10vw, 12rem)', fontWeight: 700,
            lineHeight: 0.92, letterSpacing: '-0.02em', marginBottom: '0.05em',
          }}>
            <span ref={craftRef}>We craft</span>
          </div>
          <div ref={line2Ref} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 10vw, 12rem)', fontWeight: 700,
            lineHeight: 0.92, letterSpacing: '-0.02em',
            color: 'var(--gray-400)',
          }}>
            <span ref={boldRef}>bold</span> identities.
          </div>
        </h1>

        <div className="hero-bottom-row" style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '2rem', marginTop: '3rem',
        }}>
          <p ref={subRef} className="body-lg" style={{ maxWidth: '40ch', color: 'var(--gray-400)' }}>
            Strategy-led design that speaks your story visually and verbally —
            from logo to launch and beyond.
          </p>
          <div ref={ctaRef} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <MagneticButton href="/work"    variant="primary" size="lg">View Our Work</MagneticButton>
            <MagneticButton href="/contact" variant="outline" size="lg">Let's Talk</MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={scrollRef} className="hero-scroll-hint" style={{
        position: 'absolute', right: 'clamp(1.5rem, 4vw, 3rem)', bottom: '2.5rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        zIndex: 1,
      }}>
        <span className="label" style={{ writingMode: 'vertical-rl', letterSpacing: '0.2em' }}>Scroll</span>
        <div style={{ width: '1px', height: 56, background: 'var(--gray-800)', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, width: '100%', height: '50%',
            background: 'var(--accent)', animation: 'scrollLine 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollLine { 0%{transform:translateY(-100%)} 60%{transform:translateY(100%)} 100%{transform:translateY(300%)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }
        @media (max-width: 700px) {
          .hero-tags { display: none !important; }
          .hero-scroll-hint { display: none !important; }
          .hero-bottom-row { flex-direction: column; align-items: flex-start !important; }
        }
      `}</style>
    </section>
  );
}
