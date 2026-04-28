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
