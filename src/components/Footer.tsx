import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const cols = {
  Services: [
    { label: 'Web Design',    href: '/services#web' },
    { label: 'Brand Identity', href: '/services#brand' },
    { label: 'SEO Marketing', href: '/services#seo' },
    { label: 'Product Design', href: '/services#product' },
    { label: 'Custom Systems', href: '/services#systems' },
  ],
  Company: [
    { label: 'About',   href: '/about' },
    { label: 'Work',    href: '/work' },
    { label: 'Blog',    href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy',    href: '/privacy' },
    { label: 'Terms of Service',  href: '/terms' },
  ],
};

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(footerRef.current!.querySelectorAll('.f-col'), {
      y: 25, autoAlpha: 0, stagger: 0.07, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: footerRef.current, start: 'top 88%', toggleActions: 'play none none none' },
    });
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} style={{ background: 'var(--gray-900)', borderTop: '1px solid var(--border)', padding: 'clamp(4rem,8vw,8rem) 0 2rem', overflow: 'hidden', position: 'relative' }}>
      {/* Big watermark */}
      <div aria-hidden style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(8rem, 20vw, 24rem)', fontWeight: 700,
        color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.03)',
        lineHeight: 0.85, letterSpacing: '-0.02em',
        textAlign: 'center', userSelect: 'none', pointerEvents: 'none',
        marginBottom: '-3rem',
      }}>
        Fazed
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Main grid */}
        <div className="footer-grid" style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem',
          marginBottom: '4rem', paddingBottom: '4rem',
          borderBottom: '1px solid var(--border)',
        }}>
          {/* Brand */}
          <div className="f-col" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="372 205 755 1089"
                style={{ width: '1.4rem', height: 'auto', color: 'var(--white)', flexShrink: 0 }}
                aria-hidden="true">
                <g transform="translate(0 1500) scale(0.1 -0.1)" fill="currentColor">
                  <path d="M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z"/>
                  <path d="M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z"/>
                  <path d="M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z"/>
                </g>
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Fazed<span style={{ fontWeight: 300, color: 'var(--gray-500)' }}> Digital</span>
              </span>
            </div>
            <p className="small" style={{ color: 'var(--gray-500)', maxWidth: '24ch', lineHeight: 1.7 }}>
              Bold creative agency building identities that speak your story — visually and verbally.
            </p>
            <a href="mailto:info@fazeddigital.com" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent)', letterSpacing: '0.06em' }}>
              info@fazeddigital.com
            </a>
          </div>

          {/* Link cols */}
          {Object.entries(cols).map(([group, links]) => (
            <div key={group} className="f-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="label">{group}</div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {links.map(l => (
                  <a key={l.label} href={l.href}
                    className="small"
                    style={{ color: 'var(--gray-500)', transition: 'color 0.2s' }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--white)'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--gray-500)'; }}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="f-col" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="label">© {new Date().getFullYear()} Fazed Digital. All rights reserved.</span>
          <span className="label">Iligan City, PH · Mon–Fri 8:30–5:00</span>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
