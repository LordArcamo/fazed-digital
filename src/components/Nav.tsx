import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const links = [
  { href: '/',         label: 'Home',     num: '01' },
  { href: '/about',    label: 'About',    num: '02' },
  { href: '/services', label: 'Services', num: '03' },
  { href: '/work',     label: 'Work',     num: '04' },
  { href: '/blog',     label: 'Blog',     num: '05' },
  { href: '/contact',  label: 'Contact',  num: '06' },
];

const meta = [
  { label: 'Email',    value: 'info@fazeddigital.com', href: 'mailto:info@fazeddigital.com' },
  { label: 'Phone',    value: '+63 922 123 4567',      href: 'tel:+639221234567' },
  { label: 'Location', value: 'Iligan City, PH',       href: undefined },
  { label: 'Hours',    value: 'Mon–Fri 8:30–5:00',     href: undefined },
];

export default function Nav({ currentPath = '/' }: { currentPath?: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);
  const tlRef        = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const overlay = overlayRef.current!;
    const items   = overlay.querySelectorAll('.nav-link');
    const metas   = overlay.querySelectorAll('.nav-meta');
    const panel   = overlay.querySelector('.nav-right-panel') as HTMLElement;

    // Pre-set items so they're invisible before open — no flash on first render
    gsap.set(items,  { y: 32, autoAlpha: 0 });
    gsap.set(panel,  { x: 20, autoAlpha: 0 });
    gsap.set(metas,  { y: 10, autoAlpha: 0 });

    tlRef.current = gsap.timeline({
      paused: true,
      // After reverse completes, truly hide the overlay (accessibility + perf)
      onReverseComplete: () => {
        gsap.set(overlay, { visibility: 'hidden', pointerEvents: 'none' });
      },
    })
      // Overlay wipe — clip from bottom up
      .to(overlay, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.7,
        ease: 'expo.inOut',
      })
      // Nav links stagger in
      .to(items, {
        y: 0, autoAlpha: 1,
        stagger: 0.05, duration: 0.55, ease: 'power3.out',
      }, '-=0.35')
      // Right panel slides in
      .to(panel, {
        x: 0, autoAlpha: 1,
        duration: 0.5, ease: 'power2.out',
      }, '<0.05')
      // Contact meta fades up
      .to(metas, {
        y: 0, autoAlpha: 1,
        stagger: 0.04, duration: 0.4, ease: 'power2.out',
      }, '<0.1');
  }, { scope: containerRef });

  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) toggle(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const toggle = () => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!open) {
      // Make overlay visible immediately before playing — zero flash
      gsap.set(overlayRef.current!, {
        visibility: 'visible',
        pointerEvents: 'auto',
      });
      tl.play();
      document.body.style.overflow = 'hidden';
    } else {
      tl.reverse();
      // onReverseComplete handles visibility; restore scroll now
      document.body.style.overflow = '';
    }
    setOpen(p => !p);
  };

  return (
    <div ref={containerRef}>
      {/* ── Top bar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.4rem clamp(1.5rem, 4vw, 3rem)',
        mixBlendMode: 'difference',
      }}>
        <a href="/" aria-label="Fazed Digital home" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Logo mark */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 116" fill="none"
            style={{ width: '1.5rem', height: 'auto', color: 'var(--white)', flexShrink: 0 }}
            aria-hidden="true">
            <path fill="currentColor" fillRule="evenodd" d="
              M 0,28 L 38,0 L 100,18
              L 100,50 L 66,64 L 66,72 L 100,86
              L 100,104 L 56,116 L 0,100 Z
              M 0,28 L 8,34 L 46,6 L 38,0 Z
              M 16,40 L 28,48 L 66,20 L 54,12 Z
              M 28,48 L 28,92 L 66,64 L 66,20 Z
            "/>
          </svg>
          {/* Wordmark */}
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--white)' }}>
            Fazed
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gray-500)', alignSelf: 'flex-end', paddingBottom: '0.2rem' }}>
            Digital
          </span>
        </a>

        <button
          onClick={toggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '8px', margin: '-8px' }}
        >
          {[0, 1].map(i => (
            <span key={i} style={{
              display: 'block', width: 26, height: '1.5px',
              background: 'var(--white)', borderRadius: 2,
              transition: 'transform 0.4s var(--ease-expo)',
              transform: open
                ? i === 0 ? 'translateY(3.25px) rotate(45deg)' : 'translateY(-3.25px) rotate(-45deg)'
                : 'none',
            }} />
          ))}
        </button>
      </header>

      {/* ── Full-screen overlay ──
          Always display:flex — never toggled. Hidden via visibility + pointerEvents.
          This eliminates the display-change flash that caused the stutter. */}
      <div
        ref={overlayRef}
        className="nav-overlay"
        style={{
          display: 'flex',
          visibility: 'hidden',
          pointerEvents: 'none',
          position: 'fixed', inset: 0,
          background: 'var(--gray-900)',
          zIndex: 999,
          flexDirection: 'row',
          clipPath: 'inset(0 0 100% 0)',
          willChange: 'clip-path',
          overflowY: 'auto',
        }}
      >
        {/* Left — nav links */}
        <div className="nav-left" style={{
          flex: '1 1 55%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(2rem, 6vw, 6rem)',
          borderRight: '1px solid var(--border)',
        }}>
          <div className="label" style={{ marginBottom: '2rem', color: 'var(--accent)' }}>Navigation</div>
          <nav aria-label="Main navigation">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {links.map(({ href, label, num }) => {
                const active = href === currentPath;
                return (
                  <li key={href} style={{ overflow: 'hidden' }}>
                    <a
                      href={href}
                      className="nav-link"
                      onClick={toggle}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1.25rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 4.5vw, 5rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.025em', lineHeight: 1.05,
                        color: active ? 'var(--white)' : 'var(--gray-600)',
                        padding: '0.25rem 0',
                        transition: 'color 0.2s',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => {
                        if (!active) gsap.to(e.currentTarget, { color: 'var(--white)', x: 8, duration: 0.25, ease: 'power2.out' });
                      }}
                      onMouseLeave={e => {
                        if (!active) gsap.to(e.currentTarget, { color: 'var(--gray-600)', x: 0, duration: 0.3, ease: 'power2.out' });
                      }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                        color: active ? 'var(--accent)' : 'var(--gray-700)',
                        letterSpacing: '0.1em', lineHeight: 1,
                        flexShrink: 0, paddingTop: '0.2em',
                      }}>
                        {num}
                      </span>
                      {label}
                      {active && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginLeft: 'auto' }} />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Right — info panel */}
        <div className="nav-right-panel" style={{
          flex: '1 1 45%',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 'clamp(2rem, 6vw, 6rem)',
          borderLeft: '1px solid var(--border)',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 8vw, 9rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 0.88,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.08)',
              userSelect: 'none',
            }}>
              Fazed
            </div>
          </div>

          <div>
            <div className="label" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Get In Touch</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {meta.map(({ label, value, href }) => (
                <div key={label} className="nav-meta" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span className="label" style={{ color: 'var(--gray-600)' }}>{label}</span>
                  {href
                    ? <a href={href} style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--gray-300)', transition: 'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--white)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--gray-300)')}
                      >{value}</a>
                    : <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{value}</span>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .nav-overlay { flex-direction: column !important; }
          .nav-left {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
            flex: none !important;
            padding-top: 6rem !important;
            padding-bottom: 2rem !important;
            justify-content: flex-end !important;
          }
          .nav-right-panel { flex: none !important; border-left: none !important; }
        }
      `}</style>
    </div>
  );
}
