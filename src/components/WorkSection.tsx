import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  { id: '01', title: 'A Framing Company', category: 'Web Design + WordPress',        year: '2024', img: '/images/work-aframing.jpg'  },
  { id: '02', title: 'Cleen & Green',     category: 'Brand Identity + WordPress',   year: '2025', img: '/images/work-cleen.jpg'      },
  { id: '03', title: 'CrateOnScene',      category: 'MVP Platform Build',           year: '2024', img: '/images/work-crate.jpg'      },
  { id: '04', title: 'The Telecom Shop',  category: 'E-commerce Migration',         year: '2024', img: '/images/work-telecom.jpg'    },
  { id: '05', title: 'Canwell',           category: 'Web Platform + Admin Portal',  year: '2024', img: '/images/work-canwell.jpg'    },
  { id: '06', title: '8Drive',            category: 'Web App — Car Rental System',  year: '2024', img: '/images/work-8drive.jpg'     },
  { id: '07', title: 'UGLQ',              category: 'Membership Management Portal', year: '2024', img: '/images/work-uglq.jpg'       },
  { id: '08', title: 'QLD Law Group',     category: 'Website + Web App + Mobile',   year: '2025', img: '/images/work-qldlaw.jpg'     },
];

function ProjectCard({ p }: { p: typeof projects[0] }) {
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
      gsap.to(imgRef.current, { scale: 1.04, duration: 0.8, ease: 'power2.out' });
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
    <a href={`/work/${p.id}`} style={{ display: 'block', textDecoration: 'none' }} data-cursor-label="VIEW">
      <div ref={cardRef} style={{
        borderRadius: 'var(--radius)', overflow: 'hidden',
        border: '1px solid var(--border)', aspectRatio: '4/3', position: 'relative',
        background: 'var(--gray-900)',
      }}>
        {/* Screenshot image */}
        <div ref={imgRef} style={{ position: 'absolute', inset: 0 }}>
          <img
            src={p.img}
            alt={`${p.title} website screenshot`}
            loading="lazy"
            decoding="async"
            width={1200}
            height={750}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
          />
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
          }}>{p.category}</span>
        </div>

        {/* Info bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '1.5rem 2rem',
          background: 'linear-gradient(to top, rgba(9,9,9,0.92) 0%, transparent 100%)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <div className="label" style={{ color: 'var(--gray-500)', marginBottom: '0.3rem' }}>{p.category}</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.015em',
            }}>{p.title}</div>
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
          {projects.map((p) => <ProjectCard key={p.id} p={p} />)}
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
