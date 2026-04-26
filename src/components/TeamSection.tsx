import { useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ── Unique portrait SVGs — one per team slot ── */
const P1 = memo(function P1() {
  return (
    <svg viewBox="0 0 400 500" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="pg1" cx="45%" cy="30%" r="65%">
          <stop offset="0%" stopColor="rgba(201,255,87,0.09)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill="url(#pg1)" />
      {/* Radial grid */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => (
        <line key={i} x1="200" y1="250"
          x2={200 + 280 * Math.cos(deg * Math.PI / 180)}
          y2={250 + 280 * Math.sin(deg * Math.PI / 180)}
          stroke="white" strokeOpacity="0.03" strokeWidth="1" />
      ))}
      <circle cx="200" cy="250" r="80"  fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1"/>
      <circle cx="200" cy="250" r="130" fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1"/>
      <circle cx="200" cy="250" r="180" fill="none" stroke="white" strokeOpacity="0.03" strokeWidth="1"/>
      {/* Silhouette */}
      <ellipse cx="200" cy="188" rx="56" ry="66" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <path d="M68 470 C68 382 126 342 200 337 C274 342 332 382 332 470" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" strokeWidth="1"/>
      {/* Eyes */}
      <ellipse cx="181" cy="181" rx="7" ry="5" fill="rgba(201,255,87,0.7)"/>
      <ellipse cx="219" cy="181" rx="7" ry="5" fill="rgba(201,255,87,0.7)"/>
      {/* Crown accent */}
      <polyline points="162,143 176,118 200,132 224,118 238,143"
        fill="none" stroke="rgba(201,255,87,0.55)" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* Ghost num */}
      <text x="48" y="470" fontFamily="'Clash Display',sans-serif" fontSize="170"
        fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1">01</text>
    </svg>
  );
});

const P2 = memo(function P2() {
  return (
    <svg viewBox="0 0 400 500" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="pg2" cx="60%" cy="25%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill="url(#pg2)" />
      {/* Grid lines */}
      {[0,1,2,3,4,5,6].map(i => <line key={i} x1={i*67} y1="0" x2={i*67} y2="500" stroke="white" strokeOpacity="0.03" strokeWidth="1"/>)}
      {[0,1,2,3,4,5,6,7].map(i => <line key={i} x1="0" y1={i*63} x2="400" y2={i*63} stroke="white" strokeOpacity="0.03" strokeWidth="1"/>)}
      {/* Compass rose top-right */}
      <circle cx="318" cy="118" r="44" fill="none" stroke="rgba(201,255,87,0.18)" strokeWidth="1"/>
      <line x1="318" y1="74" x2="318" y2="162" stroke="rgba(201,255,87,0.45)" strokeWidth="1"/>
      <line x1="274" y1="118" x2="362" y2="118" stroke="rgba(201,255,87,0.45)" strokeWidth="1"/>
      <circle cx="318" cy="118" r="6" fill="rgba(201,255,87,0.7)"/>
      {/* Silhouette */}
      <ellipse cx="200" cy="188" rx="56" ry="66" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <path d="M68 470 C68 382 126 342 200 337 C274 342 332 382 332 470" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" strokeWidth="1"/>
      <ellipse cx="181" cy="181" rx="7" ry="5" fill="rgba(255,255,255,0.65)"/>
      <ellipse cx="219" cy="181" rx="7" ry="5" fill="rgba(255,255,255,0.65)"/>
      <text x="48" y="470" fontFamily="'Clash Display',sans-serif" fontSize="170"
        fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1">02</text>
    </svg>
  );
});

const P3 = memo(function P3() {
  return (
    <svg viewBox="0 0 400 500" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="pg3" cx="40%" cy="40%" r="65%">
          <stop offset="0%" stopColor="rgba(201,255,87,0.07)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill="url(#pg3)" />
      {/* Code brackets */}
      <text x="28" y="210" fontFamily="monospace" fontSize="148"
        fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1">{'{'}</text>
      <text x="222" y="210" fontFamily="monospace" fontSize="148"
        fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1">{'}'}</text>
      {/* Silhouette */}
      <ellipse cx="200" cy="188" rx="56" ry="66" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <path d="M68 470 C68 382 126 342 200 337 C274 342 332 382 332 470" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" strokeWidth="1"/>
      {/* Square eyes — dev vibe */}
      <rect x="174" y="176" width="12" height="9" rx="2" fill="rgba(201,255,87,0.65)"/>
      <rect x="214" y="176" width="12" height="9" rx="2" fill="rgba(201,255,87,0.65)"/>
      {/* Binary dots pattern */}
      {[0,1,2,3].map(row => [0,1,2,3,4,5].map(col => (
        <circle key={`${row}-${col}`} cx={40 + col * 20} cy={375 + row * 20}
          r={(row + col) % 2 === 0 ? 2.5 : 1.5}
          fill="white" fillOpacity="0.05" />
      )))}
      <text x="48" y="470" fontFamily="'Clash Display',sans-serif" fontSize="170"
        fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1">03</text>
    </svg>
  );
});

const P4 = memo(function P4() {
  return (
    <svg viewBox="0 0 400 500" fill="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="pg4" cx="55%" cy="28%" r="60%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill="url(#pg4)" />
      {/* Bullseye top-right */}
      <circle cx="318" cy="118" r="64" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="1"/>
      <circle cx="318" cy="118" r="44" fill="none" stroke="white" strokeOpacity="0.07" strokeWidth="1"/>
      <circle cx="318" cy="118" r="24" fill="none" stroke="rgba(201,255,87,0.18)" strokeWidth="1"/>
      <circle cx="318" cy="118" r="6"  fill="rgba(201,255,87,0.65)"/>
      {/* Rising trend line */}
      <polyline points="40,430 90,408 150,382 210,348 270,308 340,268"
        fill="none" stroke="rgba(201,255,87,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
      {[40,150,270,340].map((x,i) => {
        const ys = [430,382,308,268];
        return <circle key={i} cx={x} cy={ys[i]} r="3" fill="rgba(201,255,87,0.55)"/>;
      })}
      {/* Silhouette */}
      <ellipse cx="200" cy="188" rx="56" ry="66" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <path d="M68 470 C68 382 126 342 200 337 C274 342 332 382 332 470" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.16)" strokeWidth="1"/>
      <ellipse cx="181" cy="181" rx="7" ry="5" fill="rgba(255,255,255,0.55)"/>
      <ellipse cx="219" cy="181" rx="7" ry="5" fill="rgba(255,255,255,0.55)"/>
      <text x="48" y="470" fontFamily="'Clash Display',sans-serif" fontSize="170"
        fill="none" stroke="white" strokeOpacity="0.04" strokeWidth="1">04</text>
    </svg>
  );
});

const portraits = [P1, P2, P3, P4];

export const team = [
  {
    name: 'Lord Arcamo',
    role: 'Founder',
    bio: 'The creative force behind Fazed Digital. Drives brand vision and keeps every project bold, strategic, and results-focused.',
    photo: 'https://fazeddigital.com/wp-content/uploads/2026/04/Untitled-design-1-450x450.png',
  },
  {
    name: 'Reancirl Balaba',
    role: 'Co-Founder',
    bio: 'Co-architect of the Fazed vision. Shapes the agency\'s direction and ensures every client relationship is built on trust.',
    photo: 'https://fazeddigital.com/wp-content/uploads/2026/04/117749302_4540601115965165_6039017566881807039_n-450x450.jpg',
  },
  {
    name: 'Russel Heyrana',
    role: 'Marketing Director',
    bio: 'Drives growth through data-informed strategy, brand positioning, and campaigns that actually move the needle.',
    photo: 'https://fazeddigital.com/wp-content/uploads/2026/04/92196516_3500538183295510_7988113410728394752_n-450x450.jpg',
  },
  {
    name: 'Justin Sumaya',
    role: 'Head of Development',
    bio: 'Builds fast, accessible, pixel-perfect websites. Obsessed with performance, clean code, and Core Web Vitals.',
    photo: 'https://fazeddigital.com/wp-content/uploads/2026/04/151652330_3908937289163068_8338977159966182887_n-450x450.jpg',
  },
];

/* ── Card ── */
function MemberCard({ member, index }: { member: typeof team[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 60, autoAlpha: 0, duration: 0.8,
      delay: index * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cardRef.current, start: 'top 87%', toggleActions: 'play none none none' },
    });

    const el   = cardRef.current!;
    const img  = mediaRef.current!;
    const enter = () => {
      gsap.to(img, { scale: 1.06, duration: 0.7, ease: 'power2.out' });
      gsap.to(el,  { borderColor: 'var(--accent)', duration: 0.3 });
    };
    const leave = () => {
      gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
      gsap.to(el,  { borderColor: 'var(--border)', duration: 0.3 });
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); };
  }, { scope: cardRef });

  const Portrait = portraits[index % portraits.length];

  return (
    <div ref={cardRef} style={{
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      overflow: 'hidden', background: 'var(--gray-900)', transition: 'border-color 0.3s',
    }}>
      {/* Photo / Portrait area */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'var(--black)' }}>
        <div ref={mediaRef} style={{ position: 'absolute', inset: 0 }}>
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
          ) : (
            <Portrait />
          )}
        </div>
        {/* Bottom gradient name overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(9,9,9,0.92) 0%, rgba(9,9,9,0.4) 60%, transparent 100%)',
          padding: '2.5rem 1.5rem 1.5rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1rem,1.8vw,1.25rem)', letterSpacing: '-0.01em',
            color: 'var(--white)',
          }}>{member.name}</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--accent)', marginTop: '0.2rem',
          }}>{member.role}</div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <p className="small" style={{ color: 'var(--gray-500)', lineHeight: 1.7 }}>{member.bio}</p>
      </div>
    </div>
  );
}

export default function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="section" style={{
      background: 'var(--gray-900)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container">
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end', flexWrap: 'wrap',
          gap: '2rem', marginBottom: '3.5rem',
        }}>
          <div>
            <div className="label" style={{ marginBottom: '1.25rem' }}>The Team</div>
            <AnimatedText text="The people behind the work." as="h2" className="display-md" />
          </div>
          <p className="body" style={{ color: 'var(--gray-500)', maxWidth: '36ch', textAlign: 'right' }}>
            A tight-knit crew of designers, developers,<br />and strategists — all obsessed with craft.
          </p>
        </div>

        <div className="team-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: '1.25rem',
        }}>
          {team.map((m, i) => <MemberCard key={i} member={m} index={i} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .team-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 560px) {
          .team-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
