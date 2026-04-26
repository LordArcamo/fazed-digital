import { useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ── Unique SVG thumbnails — memo so they never re-render ── */
const Thumb01 = memo(function Thumb01() {
  return (
    <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="t01g" cx="65%" cy="35%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#t01g)" />
      {[0,1,2,3,4,5,6,7].map(i => <line key={i} x1={i*115} y1="0" x2={i*115} y2="400" stroke="white" strokeOpacity="0.04" strokeWidth="1"/>)}
      {[0,1,2,3,4].map(i => <line key={i} x1="0" y1={i*100} x2="800" y2={i*100} stroke="white" strokeOpacity="0.04" strokeWidth="1"/>)}
      <rect x="200" y="60" width="380" height="300" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="1"/>
      {[0,1,2,3,4].map(col => [0,1,2,3].map(row => (
        <rect key={`${col}${row}`} x={220+col*64} y={80+row*62} width={44} height={42} fill="none" stroke="white" strokeOpacity={0.08+row*0.06} strokeWidth="1"/>
      )))}
      <circle cx="660" cy="200" r="110" fill="none" stroke="rgba(201,255,87,0.18)" strokeWidth="1"/>
      <circle cx="660" cy="200" r="70" fill="none" stroke="rgba(201,255,87,0.10)" strokeWidth="1"/>
      <circle cx="660" cy="200" r="30" fill="rgba(201,255,87,0.06)" stroke="rgba(201,255,87,0.2)" strokeWidth="1"/>
      <text x="28" y="360" fontFamily="'Clash Display', sans-serif" fontSize="200" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1.5">01</text>
    </svg>
  );
});

const Thumb02 = memo(function Thumb02() {
  const pts = [60,220, 140,190, 200,175, 270,140, 340,120, 400,90, 450,70].join(' ');
  return (
    <svg viewBox="0 0 460 280" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="t02g" cx="70%" cy="25%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="460" height="280" fill="url(#t02g)" />
      {[0,1,2,3,4,5].map(i => <line key={i} x1="0" y1={i*56} x2="460" y2={i*56} stroke="white" strokeOpacity="0.04" strokeWidth="1"/>)}
      {[0,1,2,3,4,5,6].map(i => <line key={i} x1={i*75} y1="0" x2={i*75} y2="280" stroke="white" strokeOpacity="0.04" strokeWidth="1"/>)}
      {/* Trend line */}
      <polyline points={pts} fill="none" stroke="rgba(201,255,87,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Area fill */}
      <polygon points={`60,260 ${pts} 450,260`} fill="rgba(201,255,87,0.04)"/>
      {/* Data dots */}
      {[[60,220],[140,190],[270,140],[400,90],[450,70]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i===4?5:3} fill={i===4?'rgba(201,255,87,0.9)':'rgba(201,255,87,0.45)'} />
      ))}
      <text x="230" y="265" fontFamily="'Clash Display', sans-serif" fontSize="160" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1" textAnchor="middle">02</text>
    </svg>
  );
});

const Thumb03 = memo(function Thumb03() {
  return (
    <svg viewBox="0 0 460 345" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="t03g" cx="40%" cy="50%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="460" height="345" fill="url(#t03g)" />
      {/* Organic petal shapes */}
      <ellipse cx="230" cy="172" rx="80" ry="140" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="1"/>
      <ellipse cx="230" cy="172" rx="140" ry="80" fill="none" stroke="white" strokeOpacity="0.10" strokeWidth="1"/>
      <ellipse cx="230" cy="172" rx="55" ry="120" transform="rotate(45 230 172)" fill="none" stroke="rgba(201,255,87,0.18)" strokeWidth="1"/>
      <ellipse cx="230" cy="172" rx="55" ry="120" transform="rotate(-45 230 172)" fill="none" stroke="rgba(201,255,87,0.12)" strokeWidth="1"/>
      {/* Center circle */}
      <circle cx="230" cy="172" r="28" fill="rgba(255,255,255,0.04)" stroke="white" strokeOpacity="0.25" strokeWidth="1"/>
      <circle cx="230" cy="172" r="6" fill="rgba(201,255,87,0.7)"/>
      {/* Outer ring */}
      <circle cx="230" cy="172" r="160" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1"/>
      <text x="230" y="335" fontFamily="'Clash Display', sans-serif" fontSize="160" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1" textAnchor="middle">03</text>
    </svg>
  );
});

const Thumb04 = memo(function Thumb04() {
  return (
    <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="t04g" cx="30%" cy="60%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#t04g)" />
      {/* App UI wireframe – main window */}
      <rect x="80" y="60" width="320" height="280" rx="8" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="1"/>
      {/* Window titlebar */}
      <rect x="80" y="60" width="320" height="36" rx="8" fill="rgba(255,255,255,0.04)" stroke="white" strokeOpacity="0.14" strokeWidth="1"/>
      <circle cx="106" cy="78" r="5" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="1"/>
      <circle cx="124" cy="78" r="5" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="1"/>
      <circle cx="142" cy="78" r="5" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="1"/>
      {/* Nav sidebar */}
      <rect x="80" y="96" width="68" height="244" fill="rgba(255,255,255,0.02)" stroke="white" strokeOpacity="0.1" strokeWidth="1"/>
      {[0,1,2,3,4].map(i => <rect key={i} x="94" y={112+i*36} width="40" height="8" rx="4" fill="rgba(255,255,255,0.06)" />)}
      {/* Content area */}
      <rect x="162" y="108" width="224" height="16" rx="4" fill="rgba(255,255,255,0.08)" />
      <rect x="162" y="134" width="180" height="10" rx="4" fill="rgba(255,255,255,0.04)" />
      <rect x="162" y="156" width="220" height="80" rx="6" fill="rgba(255,255,255,0.03)" stroke="white" strokeOpacity="0.08" strokeWidth="1"/>
      <rect x="162" y="248" width="100" height="32" rx="6" fill="rgba(201,255,87,0.12)" stroke="rgba(201,255,87,0.3)" strokeWidth="1"/>
      <text x="212" y="269" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="9" fill="rgba(201,255,87,0.7)" textAnchor="middle">Get Started</text>
      {/* Second floating card */}
      <rect x="440" y="90" width="240" height="180" rx="8" fill="rgba(255,255,255,0.03)" stroke="white" strokeOpacity="0.1" strokeWidth="1"/>
      <rect x="456" y="110" width="120" height="12" rx="4" fill="rgba(255,255,255,0.07)" />
      {[0,1,2].map(i => <rect key={i} x="456" y={136+i*30} width={180-i*40} height="8" rx="4" fill="rgba(255,255,255,0.04)" />)}
      {/* Connection lines */}
      <line x1="400" y1="200" x2="440" y2="180" stroke="rgba(201,255,87,0.2)" strokeWidth="1" strokeDasharray="4 6"/>
      <circle cx="400" cy="200" r="3" fill="rgba(201,255,87,0.4)"/>
      <circle cx="440" cy="180" r="3" fill="rgba(201,255,87,0.4)"/>
      <text x="650" y="370" fontFamily="'Clash Display', sans-serif" fontSize="200" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1.5">04</text>
    </svg>
  );
});

const thumbs = [Thumb01, Thumb02, Thumb03, Thumb04];

const projects = [
  { id: '01', title: 'Arcadia Studio',   category: 'Brand Identity + Web', year: '2024', span: 2 },
  { id: '02', title: 'Meridian Finance',  category: 'Web Design + SEO',     year: '2024', span: 1 },
  { id: '03', title: 'Bloom Organics',   category: 'E-commerce + Brand',   year: '2023', span: 1 },
  { id: '04', title: 'NexaTech SaaS',    category: 'Product Design',        year: '2024', span: 2 },
];

function ProjectCard({ p, ThumbComp }: { p: typeof projects[0]; ThumbComp: () => JSX.Element }) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card  = cardRef.current!;
    const hover = hoverRef.current!;
    gsap.set(hover, { y: '101%' });
    gsap.from(card, {
      y: 70, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 86%', toggleActions: 'play none none none' },
    });
    const onEnter = () => {
      gsap.to(hover,          { y: '0%', duration: 0.5, ease: 'power3.out' });
      gsap.to(imgRef.current, { scale: 1.05, duration: 0.8, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(hover,          { y: '101%', duration: 0.4, ease: 'power3.in' });
      gsap.to(imgRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' });
    };
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => { card.removeEventListener('mouseenter', onEnter); card.removeEventListener('mouseleave', onLeave); };
  }, { scope: cardRef });

  const large = p.span === 2;
  return (
    <a
      href={`/work/${p.id}`}
      style={{ gridColumn: `span ${p.span}`, display: 'block', textDecoration: 'none' }}
      data-cursor-label="VIEW"
    >
      <div ref={cardRef} style={{
        borderRadius: 'var(--radius)', overflow: 'hidden',
        background: 'var(--gray-900)', border: '1px solid var(--border)',
        aspectRatio: large ? '16/8' : '4/3',
        position: 'relative',
      }}>
        {/* Thumbnail art */}
        <div ref={imgRef} style={{ position: 'absolute', inset: 0 }}>
          <ThumbComp />
        </div>

        {/* Hover overlay */}
        <div ref={hoverRef} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(9,9,9,0.82)',
          backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2.25rem)', fontWeight: 700,
            color: 'var(--accent)', letterSpacing: '-0.02em',
          }}>View Project →</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--gray-400)', textTransform: 'uppercase' }}>
            {p.category}
          </span>
        </div>

        {/* Info bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '1.5rem 2rem',
          background: 'linear-gradient(to top, rgba(9,9,9,0.9) 0%, transparent 100%)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <div className="label" style={{ color: 'var(--gray-500)', marginBottom: '0.3rem' }}>{p.category}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.015em' }}>
              {p.title}
            </div>
          </div>
          <span className="label" style={{ color: 'var(--gray-600)' }}>{p.year}</span>
        </div>
      </div>
    </a>
  );
}

export default function WorkSection() {
  return (
    <section className="section" id="work" style={{ background: 'var(--black)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem' }}>
          <div>
            <div className="label" style={{ marginBottom: '1.25rem' }}>Selected Work</div>
            <AnimatedText text="Projects we're proud of." as="h2" className="display-md" />
          </div>
          <MagneticButton href="/work" variant="outline" size="md">All Projects →</MagneticButton>
        </div>
        <div className="work-section-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }}>
          {projects.map((p, i) => {
            const ThumbComp = thumbs[i];
            return <ProjectCard key={p.id} p={p} ThumbComp={ThumbComp} />;
          })}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .work-section-grid { grid-template-columns: 1fr !important; }
          .work-section-grid [style*="span 2"] { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  );
}
