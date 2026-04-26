import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    num: '01',
    title: 'Discover',
    body: 'We dig deep into your business, market, and audience. No assumptions — just the right questions that unlock real insight.',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
        <circle cx="27" cy="27" r="13" />
        <line x1="36.5" y1="36.5" x2="52" y2="52" />
        <line x1="27" y1="20" x2="27" y2="34" />
        <line x1="20" y1="27" x2="34" y2="27" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Strategy',
    body: 'Insights become a clear roadmap. Positioning, messaging, and a creative brief that every decision anchors back to.',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ width: 48, height: 48 }}>
        <circle cx="32" cy="32" r="20" />
        <circle cx="32" cy="32" r="12" />
        <circle cx="32" cy="32" r="4" fill="currentColor" stroke="none" />
        <line x1="32" y1="12" x2="32" y2="8" />
        <line x1="32" y1="56" x2="32" y2="52" />
        <line x1="12" y1="32" x2="8" y2="32" />
        <line x1="56" y1="32" x2="52" y2="32" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Design',
    body: 'We craft every visual and written touchpoint — from logo to layout — with obsessive attention to craft and detail.',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
        <path d="M14 50 L32 12 L50 50 Z" />
        <line x1="22" y1="36" x2="42" y2="36" />
        <circle cx="32" cy="20" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Launch',
    body: 'We ship, measure, and optimise. Launch is the beginning, not the end — we stay invested in your growth.',
    svg: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 48, height: 48 }}>
        <path d="M32 52 L32 18" />
        <path d="M20 30 L32 18 L44 30" />
        <path d="M22 52 C22 44 14 42 14 34 C14 26 20 22 20 22" strokeOpacity="0.4" />
        <path d="M42 52 C42 44 50 42 50 34 C50 26 44 22 44 22" strokeOpacity="0.4" />
        <circle cx="32" cy="56" r="3" fill="none" />
      </svg>
    ),
  },
];

function StepCard({ step, index, connectorRef }: { step: typeof steps[0]; index: number; connectorRef?: React.RefObject<SVGLineElement> }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 50, autoAlpha: 0, duration: 0.75,
      delay: index * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cardRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });

    const el = cardRef.current!;
    const icon = iconRef.current!;
    const enter = () => {
      gsap.to(icon, { y: -6, rotation: 8, scale: 1.1, duration: 0.4, ease: 'back.out(2)' });
      gsap.to(el, { borderColor: 'var(--accent)', duration: 0.3 });
    };
    const leave = () => {
      gsap.to(icon, { y: 0, rotation: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      gsap.to(el, { borderColor: 'var(--border)', duration: 0.3 });
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); };
  }, { scope: cardRef });

  return (
    <div ref={cardRef} style={{
      flex: 1,
      padding: 'clamp(1.5rem, 3vw, 2.5rem)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', gap: '1.25rem',
      transition: 'border-color 0.3s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
          letterSpacing: '0.14em', color: 'var(--accent)',
        }}>{step.num}</span>
        <div ref={iconRef} style={{ color: 'var(--gray-400)' }}>{step.svg}</div>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '-0.02em',
        color: 'var(--white)',
      }}>{step.title}</h3>
      <p className="body" style={{ color: 'var(--gray-500)', lineHeight: 1.7 }}>{step.body}</p>
    </div>
  );
}

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef    = useRef<SVGLineElement>(null);
  const svgRef     = useRef<SVGSVGElement>(null);
  const pulseRef   = useRef<SVGCircleElement>(null);
  const pulseGlow  = useRef<SVGCircleElement>(null);

  useGSAP(() => {
    if (!lineRef.current) return;
    const len = (lineRef.current as SVGLineElement).getTotalLength?.() ?? 1000;
    gsap.set(lineRef.current, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set([pulseRef.current, pulseGlow.current], { opacity: 0 });

    gsap.to(lineRef.current, {
      strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut',
      scrollTrigger: {
        trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none',
        onEnter: () => {
          const w = svgRef.current?.clientWidth ?? 1000;
          gsap.set([pulseRef.current, pulseGlow.current], { x: 0, opacity: 1 });
          gsap.to([pulseRef.current, pulseGlow.current], {
            x: w, duration: 2.4, ease: 'none',
            repeat: -1, delay: 1.8, repeatDelay: 0.6,
          });
        },
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="section" style={{ background: 'var(--black)', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
      {/* Background grid — CSS only, zero DOM nodes */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: 'clamp(3rem, 5vw, 5rem)' }}>
          <div className="label" style={{ marginBottom: '1.25rem' }}>How We Work</div>
          <AnimatedText text="From brief to brilliant." as="h2" className="display-md" />
        </div>

        {/* Connector line (desktop only) */}
        <div style={{ position: 'relative', marginBottom: '2rem', display: 'flex', alignItems: 'center' }}
          aria-hidden>
          <svg ref={svgRef} style={{ position: 'absolute', top: '50%', left: 0, right: 0, width: '100%', height: 2, overflow: 'visible', pointerEvents: 'none' }}>
            <line
              ref={lineRef}
              x1="0" y1="1" x2="100%" y2="1"
              stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.35"
              strokeDasharray="4 8"
            />
            <circle ref={pulseGlow} cx="0" cy="1" r="7"
              fill="rgba(201,255,87,0.28)" style={{ filter: 'blur(4px)' }} />
            <circle ref={pulseRef} cx="0" cy="1" r="3"
              fill="rgba(201,255,87,0.9)" />
          </svg>
        </div>

        <div className="process-steps" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {steps.map((s, i) => <StepCard key={s.num} step={s} index={i} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .process-steps > * { flex: 1 1 calc(50% - 0.625rem) !important; }
        }
        @media (max-width: 560px) {
          .process-steps > * { flex: 1 1 100% !important; }
        }
      `}</style>
    </section>
  );
}
