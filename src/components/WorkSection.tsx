import { useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ── SVG thumbnails — thematic per client ── */
const ThumbFraming = memo(function ThumbFraming() {
  return (
    <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="tfg" cx="35%" cy="55%" r="65%">
          <stop offset="0%" stopColor="rgba(255,160,60,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#tfg)" />

      {/* Blueprint grid */}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <line key={`v${i}`} x1={i*90} y1="0" x2={i*90} y2="400"
          stroke="white" strokeOpacity="0.035" strokeWidth="1"/>
      ))}
      {[0,1,2,3,4,5].map(i => (
        <line key={`h${i}`} x1="0" y1={i*80} x2="800" y2={i*80}
          stroke="white" strokeOpacity="0.035" strokeWidth="1"/>
      ))}

      {/* Structural frame — A-frame silhouette */}
      <polyline points="200,340 400,80 600,340" fill="none"
        stroke="rgba(255,160,60,0.45)" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Horizontal tie beam */}
      <line x1="255" y1="230" x2="545" y2="230"
        stroke="rgba(255,160,60,0.35)" strokeWidth="1.4"/>
      {/* Vertical king post */}
      <line x1="400" y1="80" x2="400" y2="340"
        stroke="rgba(255,160,60,0.25)" strokeWidth="1.2" strokeDasharray="6 5"/>
      {/* Rafter sub-lines */}
      <line x1="310" y1="155" x2="255" y2="230"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <line x1="490" y1="155" x2="545" y2="230"
        stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

      {/* Corner node dots */}
      {[[400,80],[200,340],[600,340],[255,230],[545,230],[400,230]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={i===0?5:3.5}
          fill={i===0?'rgba(255,160,60,0.9)':'rgba(255,160,60,0.45)'}/>
      ))}

      {/* Measurement ticks */}
      <line x1="200" y1="360" x2="600" y2="360" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <line x1="200" y1="354" x2="200" y2="366" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <line x1="600" y1="354" x2="600" y2="366" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <line x1="400" y1="354" x2="400" y2="366" stroke="rgba(255,160,60,0.4)" strokeWidth="1"/>

      {/* Floating dimension text */}
      <text x="400" y="382" fontFamily="monospace" fontSize="9" fill="rgba(255,160,60,0.4)"
        textAnchor="middle" letterSpacing="2">SPAN 40'-0"</text>
      <text x="130" y="210" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.15)"
        textAnchor="middle" letterSpacing="1" transform="rotate(-63 130 210)">RAFTER</text>

      {/* Number watermark */}
      <text x="680" y="360" fontFamily="serif" fontStyle="italic" fontSize="220"
        fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1.5" textAnchor="middle">01</text>
    </svg>
  );
});

const ThumbCleen = memo(function ThumbCleen() {
  return (
    <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="tcg" cx="60%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(80,210,120,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#tcg)" />

      {/* Soft grid */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="400"
          stroke="white" strokeOpacity="0.03" strokeWidth="1"/>
      ))}
      {[0,1,2,3,4].map(i => (
        <line key={`h${i}`} x1="0" y1={i*100} x2="800" y2={i*100}
          stroke="white" strokeOpacity="0.03" strokeWidth="1"/>
      ))}

      {/* Leaf / organic shape — main */}
      <ellipse cx="420" cy="200" rx="130" ry="160" transform="rotate(-25 420 200)"
        fill="none" stroke="rgba(80,210,120,0.35)" strokeWidth="1.4"/>
      <ellipse cx="420" cy="200" rx="130" ry="160" transform="rotate(25 420 200)"
        fill="none" stroke="rgba(80,210,120,0.22)" strokeWidth="1.2"/>

      {/* Vein lines */}
      <path d="M420,80 Q450,200 420,320" fill="none"
        stroke="rgba(80,210,120,0.3)" strokeWidth="1.2"/>
      <path d="M420,140 Q470,175 460,210" fill="none"
        stroke="rgba(80,210,120,0.18)" strokeWidth="1"/>
      <path d="M420,140 Q375,175 385,210" fill="none"
        stroke="rgba(80,210,120,0.18)" strokeWidth="1"/>
      <path d="M420,190 Q475,215 475,245" fill="none"
        stroke="rgba(80,210,120,0.14)" strokeWidth="1"/>
      <path d="M420,190 Q365,215 365,245" fill="none"
        stroke="rgba(80,210,120,0.14)" strokeWidth="1"/>

      {/* Center droplet / dot */}
      <circle cx="420" cy="200" r="8" fill="rgba(80,210,120,0.8)"/>
      <circle cx="420" cy="200" r="20" fill="none"
        stroke="rgba(80,210,120,0.3)" strokeWidth="1"/>
      <circle cx="420" cy="200" r="36" fill="none"
        stroke="rgba(80,210,120,0.15)" strokeWidth="1"/>

      {/* Water droplets scattered */}
      {[[180,130],[620,260],[150,280],[680,130],[580,310]].map(([cx,cy],i) => (
        <g key={i}>
          <path d={`M${cx},${cy-12} C${cx-7},${cy-5} ${cx-7},${cy+4} ${cx},${cy+8} C${cx+7},${cy+4} ${cx+7},${cy-5} ${cx},${cy-12}Z`}
            fill="none" stroke="rgba(80,210,120,0.25)" strokeWidth="1"/>
          <circle cx={cx} cy={cy} r="1.5" fill="rgba(80,210,120,0.4)"/>
        </g>
      ))}

      {/* Outer ring */}
      <circle cx="420" cy="200" r="170" fill="none"
        stroke="rgba(80,210,120,0.08)" strokeWidth="1"/>

      {/* Label */}
      <text x="200" y="350" fontFamily="monospace" fontSize="8"
        fill="rgba(80,210,120,0.3)" letterSpacing="3">ECO-CERTIFIED · ALL-NATURAL · FAMILY SAFE</text>

      {/* Number watermark */}
      <text x="90" y="360" fontFamily="serif" fontStyle="italic" fontSize="220"
        fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1.5" textAnchor="middle">02</text>
    </svg>
  );
});

const thumbs = [ThumbFraming, ThumbCleen];

const projects = [
  { id: '01', title: 'A Framing Company', category: 'Web Design + WordPress',    year: '2024', span: 1 },
  { id: '02', title: 'Cleen & Green',     category: 'Brand Identity + WordPress', year: '2025', span: 1 },
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
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, { scope: cardRef });

  return (
    <a
      href={`/work/${p.id}`}
      style={{ gridColumn: `span ${p.span}`, display: 'block', textDecoration: 'none' }}
      data-cursor-label="VIEW"
    >
      <div ref={cardRef} style={{
        borderRadius: 'var(--radius)', overflow: 'hidden',
        background: 'var(--gray-900)', border: '1px solid var(--border)',
        aspectRatio: '4/3',
        position: 'relative',
      }}>
        {/* Thumbnail art */}
        <div ref={imgRef} style={{ position: 'absolute', inset: 0 }}>
          <ThumbComp />
        </div>

        {/* Hover overlay */}
        <div ref={hoverRef} style={{
          position: 'absolute', inset: 0,
          background: 'rgba(9,9,9,0.84)',
          backdropFilter: 'blur(2px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2.25rem)', fontWeight: 700,
            color: 'var(--accent)', letterSpacing: '-0.02em',
          }}>View Case Study →</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.14em', color: 'var(--gray-400)', textTransform: 'uppercase',
          }}>
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
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.015em',
            }}>
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
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          flexWrap: 'wrap', gap: '2rem', marginBottom: '3.5rem',
        }}>
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
        }
      `}</style>
    </section>
  );
}
