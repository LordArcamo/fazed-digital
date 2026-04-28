import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  { id: '01', title: 'A Framing Company', category: 'Web Design + WordPress',        year: '2024', img: '/images/work-aframing.jpg'  },
  { id: '02', title: 'Cleen & Green',     category: 'Brand Identity + WordPress',    year: '2025', img: '/images/work-cleen.jpg'      },
  { id: '03', title: 'CrateOnScene',      category: 'MVP Platform Build',            year: '2024', img: '/images/work-crate.jpg'      },
  { id: '04', title: 'The Telecom Shop',  category: 'E-commerce Migration',          year: '2024', img: '/images/work-telecom.jpg'    },
  { id: '05', title: 'Canwell',           category: 'Web Platform + Admin Portal',   year: '2024', img: '/images/work-canwell.jpg'    },
  { id: '06', title: '8Drive',            category: 'Web App — Car Rental System',   year: '2024', img: '/images/work-8drive.jpg'     },
  { id: '07', title: 'UGLQ',              category: 'Membership Management Portal',  year: '2024', img: '/images/work-uglq.jpg'       },
  { id: '08', title: 'QLD Law Group',     category: 'Website + Web App + Mobile',    year: '2025', img: '/images/work-qldlaw.jpg'     },
];

export default function WorkSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const cardRefs    = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current!;
    const track   = trackRef.current!;
    const cards   = cardRefs.current.filter(Boolean) as HTMLAnchorElement[];

    // ── Hover overlays (all viewports) ──────────────────────────
    cards.forEach(card => {
      const overlay = card.querySelector<HTMLElement>('.wc-overlay');
      const img     = card.querySelector<HTMLImageElement>('.wc-img');
      if (!overlay || !img) return;
      card.addEventListener('mouseenter', () => {
        gsap.to(overlay, { opacity: 1, duration: 0.3,  ease: 'power2.out' });
        gsap.to(img,     { scale: 1.05, duration: 0.6, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(overlay, { opacity: 0, duration: 0.22, ease: 'power2.in' });
        gsap.to(img,     { scale: 1,   duration: 0.5,  ease: 'power2.out' });
      });
    });

    // ── Desktop: pinned horizontal scroll ───────────────────────
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      // Entrance — cards stagger in just before the pin engages
      gsap.from(cards, {
        x: 80, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Horizontal scroll driven by vertical scroll
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger:  section,
          start:    'top top',
          end:      () => `+=${track.scrollWidth - window.innerWidth}`,
          pin:      true,
          scrub:    1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            // Progress bar
            if (progressRef.current) {
              gsap.set(progressRef.current, {
                scaleX: self.progress,
                transformOrigin: 'left center',
              });
            }
            // "01 / 08" counter
            if (counterRef.current) {
              const idx = Math.min(
                Math.floor(self.progress * projects.length),
                projects.length - 1
              );
              const num = String(idx + 1).padStart(2, '0');
              counterRef.current.textContent = `${num} / ${String(projects.length).padStart(2, '0')}`;
            }
          },
        },
      });
    });

    // ── Mobile: native CSS scroll, simple entrance ──────────────
    mm.add('(max-width: 767px)', () => {
      gsap.from(cards, {
        y: 40, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="work"
      className="ws-section"
      style={{ background: 'var(--black)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="container ws-header" style={{ flexShrink: 0 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          flexWrap: 'wrap', gap: '2rem',
        }}>
          <div>
            <div className="label" style={{ marginBottom: '1.25rem' }}>Selected Work</div>
            <AnimatedText text="Projects we're proud of." as="h2" className="display-md" />
          </div>
          <MagneticButton href="/work" variant="outline" size="md">All Projects →</MagneticButton>
        </div>

        {/* Scroll hint + progress bar + counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--gray-600)', whiteSpace: 'nowrap',
          }}>
            Scroll to explore
          </span>
          <div style={{
            flex: 1, height: '1px', background: 'var(--border)',
            position: 'relative', borderRadius: 2, overflow: 'hidden',
          }}>
            <div ref={progressRef} style={{
              position: 'absolute', inset: 0,
              background: 'var(--accent)',
              transform: 'scaleX(0)',
              transformOrigin: 'left center',
            }} />
          </div>
          <span ref={counterRef} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
            letterSpacing: '0.12em', color: 'var(--accent)', whiteSpace: 'nowrap',
            minWidth: '4.5rem', textAlign: 'right',
          }}>
            01 / 08
          </span>
        </div>
      </div>

      {/* ── Reel track — fills remaining section height ────────── */}
      <div className="ws-track-fill">
        <div
          ref={trackRef}
          className="ws-track"
          style={{
            display: 'flex',
            gap: '1.5rem',
            paddingLeft:  'clamp(1.5rem, 4vw, 5rem)',
            paddingRight: 'clamp(1.5rem, 4vw, 5rem)',
            height: '100%',
            willChange: 'transform',
          }}
        >
        {projects.map((p, i) => (
          <a
            key={p.id}
            href={`/work/${p.id}`}
            ref={el => { cardRefs.current[i] = el; }}
            draggable={false}
            data-cursor="link"
            style={{ flexShrink: 0, display: 'block', textDecoration: 'none', height: '100%' }}
            className="ws-card-link"
          >
            <article style={{
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              background: 'var(--gray-900)',
              border: '1px solid var(--border)',
              position: 'relative',
              height: '100%',        /* fills track height — no fixed aspect ratio */
              minWidth: 'clamp(260px, 38vw, 540px)',
            }}>
              {/* Screenshot */}
              <img
                className="wc-img"
                src={p.img}
                alt={`${p.title} screenshot`}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'top center',
                  display: 'block', transformOrigin: 'center center',
                }}
              />

              {/* Hover overlay */}
              <div className="wc-overlay" style={{
                position: 'absolute', inset: 0,
                background: 'rgba(9,9,9,0.82)',
                backdropFilter: 'blur(3px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                opacity: 0,
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'clamp(1.3rem, 2.2vw, 2rem)',
                  color: 'var(--accent)', letterSpacing: '-0.02em',
                }}>View Case Study →</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.63rem',
                  letterSpacing: '0.13em', color: 'var(--gray-400)', textTransform: 'uppercase',
                }}>{p.category}</span>
              </div>

              {/* Info bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '1.75rem 2rem',
                background: 'linear-gradient(to top, rgba(9,9,9,0.93) 0%, transparent 100%)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
              }}>
                <div>
                  <div className="label" style={{ color: 'var(--gray-500)', marginBottom: '0.3rem' }}>{p.category}</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: 'clamp(1.05rem, 1.8vw, 1.4rem)',
                    color: 'var(--white)', letterSpacing: '-0.015em',
                  }}>{p.title}</div>
                </div>
                <span className="label" style={{ color: 'var(--gray-600)', flexShrink: 0, marginLeft: '1rem' }}>
                  {p.year}
                </span>
              </div>
            </article>
          </a>
        ))}
        </div>
      </div>

      <style>{`
        /* Section fills viewport height, flex column */
        .ws-section {
          height: 100svh;
          gap: 0;
          padding-top: clamp(6rem, 10vw, 9rem);
          padding-bottom: 0;
        }
        /* Header keeps its own spacing */
        .ws-header {
          padding-bottom: 2.5rem;
        }
        /* Track fill area: takes all remaining height */
        .ws-track-fill {
          flex: 1;
          min-height: 0;          /* essential for flex children to shrink */
          overflow: hidden;
          padding-bottom: clamp(2rem, 4vw, 3.5rem);
        }
        /* Track row */
        .ws-track {
          align-items: stretch;
        }

        /* Mobile: auto height, native horizontal scroll */
        @media (max-width: 767px) {
          .ws-section {
            height: auto;
            min-height: unset;
            padding-top: clamp(5rem, 10vw, 7rem);
            padding-bottom: 4rem;
          }
          .ws-header { padding-bottom: 2rem; }
          .ws-track-fill {
            overflow: visible;
            padding-bottom: 0;
            flex: none;
          }
          .ws-track {
            overflow-x: scroll;
            overflow-y: hidden;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            height: auto !important;
            align-items: flex-start;
            padding-bottom: 1rem;
          }
          .ws-track::-webkit-scrollbar { display: none; }
          .ws-card-link {
            height: auto !important;
            scroll-snap-align: start;
          }
          .ws-card-link article {
            height: auto !important;
            min-width: unset !important;
            width: clamp(260px, 78vw, 340px);
            aspect-ratio: 4/3;
          }
        }
      `}</style>
    </section>
  );
}
