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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="372 205 755 1089"
            style={{ width: '1.4rem', height: 'auto', color: 'var(--white)', flexShrink: 0 }}
            aria-hidden="true">
            <g transform="translate(0 1500) scale(0.1 -0.1)" fill="currentColor">
              <path d="M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z"/>
              <path d="M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z"/>
              <path d="M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z"/>
            </g>
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
