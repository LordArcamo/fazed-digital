import { useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ── Animated service icons ── */
const WebIcon = memo(() => (
  <svg viewBox="0 0 48 48" fill="none" style={{ width: 44, height: 44 }}>
    <rect x="4" y="8" width="40" height="32" rx="4"
      stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
    <line x1="4" y1="17" x2="44" y2="17"
      stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
    <circle cx="10" cy="12.5" r="1.8" fill="rgba(255,255,255,0.35)"/>
    <circle cx="16" cy="12.5" r="1.8" fill="rgba(255,255,255,0.22)"/>
    <circle cx="22" cy="12.5" r="1.8" fill="rgba(255,255,255,0.15)"/>
    {/* Lime "active" code line — draws in */}
    <line x1="10" y1="24" x2="34" y2="24"
      stroke="rgba(201,255,87,0.75)" strokeWidth="2" strokeLinecap="round"
      style={{ strokeDasharray: 26, strokeDashoffset: 26, animation: 'svcDraw 1.8s ease-in-out infinite' }}/>
    <line x1="10" y1="30" x2="24" y2="30"
      stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="10" y1="36" x2="30" y2="36"
      stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round"/>
    {/* Blinking cursor */}
    <line x1="36" y1="21" x2="36" y2="27"
      stroke="rgba(201,255,87,0.9)" strokeWidth="2" strokeLinecap="round"
      style={{ animation: 'svcBlink 1s step-end infinite' }}/>
  </svg>
));

const BrandIcon = memo(() => (
  <svg viewBox="0 0 48 48" fill="none" style={{ width: 44, height: 44 }}>
    {/* Spinning outer diamond */}
    <rect x="13" y="13" width="22" height="22" rx="3"
      stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"
      style={{ animation: 'svcSpin 10s linear infinite', transformOrigin: '24px 24px' }}/>
    {/* Static inner circle */}
    <circle cx="24" cy="24" r="7"
      stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
    {/* Pulsing lime center */}
    <circle cx="24" cy="24" r="3.5"
      fill="rgba(201,255,87,0.85)"
      style={{ animation: 'svcPulse 2.5s ease-in-out infinite' }}/>
    {/* Corner accent dots */}
    {[[8,8],[40,8],[8,40],[40,40]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="2" fill="rgba(255,255,255,0.18)"/>
    ))}
  </svg>
));

const SeoIcon = memo(() => (
  <svg viewBox="0 0 48 48" fill="none" style={{ width: 44, height: 44 }}>
    {/* Rising trend line — draws in */}
    <polyline points="6,40 14,32 22,24 32,16 42,8"
      stroke="rgba(201,255,87,0.8)" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ strokeDasharray: 60, strokeDashoffset: 60, animation: 'svcDraw 2s ease-in-out infinite' }}/>
    {/* Data dots */}
    {[[6,40],[14,32],[22,24],[32,16],[42,8]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i===4?4:2.5}
        fill={i===4?'rgba(201,255,87,0.9)':'rgba(255,255,255,0.3)'}
        style={{ animation: `svcFade 2s ease-in-out ${i*0.3}s infinite` }}/>
    ))}
    {/* Baseline */}
    <line x1="4" y1="42" x2="44" y2="42"
      stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
  </svg>
));

const ProductIcon = memo(() => (
  <svg viewBox="0 0 48 48" fill="none" style={{ width: 44, height: 44 }}>
    {/* Cursor arrow */}
    <path d="M8 6 L8 34 L16 26 L22 40 L27 38 L21 24 L34 24 Z"
      stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"
      strokeLinejoin="round" fill="rgba(255,255,255,0.06)"/>
    {/* Click target + ripple */}
    <circle cx="36" cy="36" r="3" fill="rgba(201,255,87,0.9)"/>
    <circle cx="36" cy="36" r="7"
      stroke="rgba(201,255,87,0.55)" strokeWidth="1.5" fill="none"
      style={{ animation: 'svcRipple 2s ease-out infinite' }}/>
    <circle cx="36" cy="36" r="12"
      stroke="rgba(201,255,87,0.2)" strokeWidth="1" fill="none"
      style={{ animation: 'svcRipple 2s ease-out infinite 0.5s' }}/>
  </svg>
));

const SystemsIcon = memo(() => (
  <svg viewBox="0 0 48 48" fill="none" style={{ width: 44, height: 44 }}>
    {/* Triangle network */}
    <line x1="24" y1="5" x2="43" y2="38"
      stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <line x1="24" y1="5" x2="5" y2="38"
      stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <line x1="5" y1="38" x2="43" y2="38"
      stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    {/* Nodes */}
    <circle cx="24" cy="5" r="4.5" fill="rgba(201,255,87,0.85)"/>
    <circle cx="43" cy="38" r="4" fill="rgba(255,255,255,0.4)"/>
    <circle cx="5" cy="38" r="4" fill="rgba(255,255,255,0.28)"/>
    {/* Traveling data packet */}
    <path id="svc-tri" d="M24 5 L43 38 L5 38 Z"/>
    <circle r="2.5" fill="rgba(201,255,87,1)">
      <animateMotion dur="3s" repeatCount="indefinite">
        <mpath href="#svc-tri"/>
      </animateMotion>
    </circle>
  </svg>
));

const serviceIcons = [WebIcon, BrandIcon, SeoIcon, ProductIcon, SystemsIcon];

const services = [
  {
    num: '01',
    title: 'Web Design & Development',
    desc: 'Pixel-perfect, performant websites that convert visitors. We blend aesthetic excellence with technical precision — Astro, React, Next.js, Webflow.',
    tags: ['Astro', 'React', 'Next.js', 'Webflow'],
    href: '/services#web',
  },
  {
    num: '02',
    title: 'Brand Identity',
    desc: 'Logos, type systems, colour palettes, and brand guidelines built to scale. We make brands that are impossible to ignore.',
    tags: ['Logo Design', 'Brand System', 'Guidelines'],
    href: '/services#brand',
  },
  {
    num: '03',
    title: 'SEO Marketing',
    desc: 'Full-funnel organic growth — technical audits, content strategy, link acquisition, and reporting that actually makes sense.',
    tags: ['Technical SEO', 'Content', 'Analytics'],
    href: '/services#seo',
  },
  {
    num: '04',
    title: 'Product Design',
    desc: 'User research, wireframes, prototypes, and high-fidelity UI your users love and your business grows on.',
    tags: ['UX Research', 'Figma', 'Prototyping'],
    href: '/services#product',
  },
  {
    num: '05',
    title: 'Custom System Development',
    desc: 'Bespoke software solutions — internal tools, automation pipelines, custom APIs, and full-stack applications built precisely to your workflow.',
    tags: ['Node.js', 'Python', 'APIs', 'Automation'],
    href: '/services#systems',
  },
];

function ServiceCard({ s, index }: { s: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current!;
    const line = lineRef.current!;

    gsap.from(card, {
      y: 50, autoAlpha: 0, duration: 0.75,
      delay: index * 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
    });

    gsap.set(line, { scaleX: 0, transformOrigin: 'left' });

    const onEnter = () => {
      gsap.to(line,            { scaleX: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(iconRef.current, { scale: 1.18, rotation: 12, duration: 0.4, ease: 'back.out(2)' });
      gsap.to(card,            { y: -5, duration: 0.32, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(line,            { scaleX: 0, duration: 0.3, ease: 'power2.inOut', transformOrigin: 'right' });
      gsap.to(iconRef.current, { scale: 1, rotation: 0, duration: 0.35, ease: 'power2.out' });
      gsap.to(card,            { y: 0, duration: 0.38, ease: 'power2.out' });
    };
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mouseenter', onEnter); card.removeEventListener('mouseleave', onLeave); };
  }, { scope: cardRef });

  return (
    <a ref={cardRef} href={s.href} style={{
      padding: '2.25rem', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', gap: '1.25rem',
      textDecoration: 'none', position: 'relative', overflow: 'hidden',
      willChange: 'transform',
    }} data-cursor="link">
      <div ref={lineRef} style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'var(--accent)',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="label">{s.num}</span>
        <div ref={iconRef} style={{ color: 'var(--gray-500)', display: 'flex' }}>
          {(() => { const Icon = serviceIcons[index]; return <Icon />; })()}
        </div>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', lineHeight: 1.1, letterSpacing: '-0.02em',
        color: 'var(--white)',
      }}>
        {s.title}
      </h3>
      <p style={{ color: 'var(--gray-400)', lineHeight: 1.65, fontSize: '0.9rem', flexGrow: 1 }}>
        {s.desc}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: 'auto' }}>
        {s.tags.map(t => (
          <span key={t} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.08em',
            color: 'var(--gray-400)', background: 'var(--gray-800)',
            padding: '0.25rem 0.65rem', borderRadius: '4px',
            border: '1px solid var(--border)',
          }}>{t}</span>
        ))}
      </div>
    </a>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="section" id="services" style={{ background: 'var(--black)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem' }}>
          <div>
            <div className="label" style={{ marginBottom: '1.25rem' }}>What We Do</div>
            <AnimatedText text="Services built for bold ambition." as="h2" className="display-md" />
          </div>
          <MagneticButton href="/services" variant="outline" size="md">All Services →</MagneticButton>
        </div>
        <div className="grid-2" style={{ gap: '1.25rem' }}>
          {services.map((s, i) => <ServiceCard key={s.num} s={s} index={i} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .grid-2 { grid-template-columns: 1fr !important; }
        }
        @keyframes svcDraw  { 0%{stroke-dashoffset:60} 60%{stroke-dashoffset:0} 100%{stroke-dashoffset:0} }
        @keyframes svcBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes svcSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes svcPulse { 0%,100%{transform:scale(1);opacity:0.85} 50%{transform:scale(1.3);opacity:1} }
        @keyframes svcFade  { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes svcRipple{ 0%{transform:scale(0.6);opacity:0.8} 100%{transform:scale(1.8);opacity:0} }
      `}</style>
    </section>
  );
}
