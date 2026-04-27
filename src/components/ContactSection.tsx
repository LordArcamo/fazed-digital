import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';
import MagneticButton from './MagneticButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const inputCss: React.CSSProperties = {
  width: '100%', background: 'var(--gray-900)',
  border: '1px solid var(--border)', borderRadius: '0.625rem',
  padding: '0.85rem 1.1rem', color: 'var(--white)',
  fontFamily: 'var(--font-body)', fontSize: '0.925rem', outline: 'none',
  transition: 'border-color 0.2s',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

export default function ContactSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const formRef     = useRef<HTMLDivElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);
  const shapesRef   = useRef<HTMLDivElement>(null);

  const [sent,     setSent]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [service,  setService]  = useState('');
  const [message,  setMessage]  = useState('');
  const [error,    setError]    = useState('');

  useGSAP(() => {
    gsap.from(formRef.current, {
      y: 45, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: formRef.current, start: 'top 80%', toggleActions: 'play none none none' },
    });
    gsap.to(bgRef.current, {
      x: -60, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2 },
    });

    const shapes = shapesRef.current?.querySelectorAll<SVGSVGElement>('.ct-shape');
    if (shapes) {
      shapes.forEach((s, i) => {
        gsap.from(s, {
          autoAlpha: 0, scale: 0.4, rotation: -30,
          duration: 1.2, delay: i * 0.15, ease: 'back.out(1.4)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
        gsap.to(s, {
          y: i % 2 === 0 ? -18 : 18,
          rotation: i % 2 === 0 ? 15 : -15,
          duration: 3 + i * 0.7,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
          delay: i * 0.4,
        });
      });
    }
  }, { scope: sectionRef });

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'var(--white)');
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'var(--border)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const btn = (e.currentTarget as HTMLFormElement).querySelector('[type="submit"]') as HTMLElement;
    gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Something went wrong. Please try again.');
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section ref={sectionRef} className="section" id="contact" style={{ background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>
      <div ref={bgRef} aria-hidden style={{
        position: 'absolute', bottom: '1rem', left: 0,
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(6rem, 16vw, 18rem)', fontWeight: 600,
        color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.025)',
        whiteSpace: 'nowrap', lineHeight: 0.85, letterSpacing: '-0.02em',
        pointerEvents: 'none', userSelect: 'none',
      }}>Get in touch</div>

      {/* Floating decorative shapes */}
      <div ref={shapesRef} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Top-right diamond */}
        <svg className="ct-shape" viewBox="0 0 48 48" fill="none"
          style={{ position: 'absolute', top: '8%', right: '6%', width: 42, height: 42, opacity: 0 }}>
          <rect x="4" y="4" width="40" height="40" rx="3"
            stroke="rgba(201,255,87,0.22)" strokeWidth="1.5"
            transform="rotate(45 24 24)" />
        </svg>

        {/* Mid-left dashed circle */}
        <svg className="ct-shape" viewBox="0 0 64 64" fill="none"
          style={{ position: 'absolute', top: '38%', left: '2%', width: 64, height: 64, opacity: 0 }}>
          <circle cx="32" cy="32" r="28"
            stroke="rgba(255,255,255,0.1)" strokeWidth="1"
            strokeDasharray="5 8" />
          <circle cx="32" cy="32" r="4" fill="rgba(201,255,87,0.35)" />
        </svg>

        {/* Bottom-right triangle */}
        <svg className="ct-shape" viewBox="0 0 48 48" fill="none"
          style={{ position: 'absolute', bottom: '15%', right: '3%', width: 36, height: 36, opacity: 0 }}>
          <path d="M24 6 L44 42 L4 42 Z"
            stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M24 18 L35 38 L13 38 Z"
            stroke="rgba(201,255,87,0.2)" strokeWidth="1" strokeLinejoin="round" />
        </svg>

        {/* Top-left cross */}
        <svg className="ct-shape" viewBox="0 0 32 32" fill="none"
          style={{ position: 'absolute', top: '20%', left: '4%', width: 28, height: 28, opacity: 0 }}>
          <line x1="16" y1="2" x2="16" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="16" x2="30" y2="16" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16" cy="16" r="2.5" fill="rgba(201,255,87,0.5)" />
        </svg>

        {/* Mid-right small hexagon */}
        <svg className="ct-shape" viewBox="0 0 48 48" fill="none"
          style={{ position: 'absolute', top: '60%', right: '8%', width: 34, height: 34, opacity: 0 }}>
          <path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z"
            stroke="rgba(201,255,87,0.18)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 8rem)', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <div className="label" style={{ marginBottom: '1.5rem' }}>Start a Project</div>
            <AnimatedText text="Let's build something great together." as="h2" className="display-md" style={{ marginBottom: '2rem' }} />
            <p className="body-lg" style={{ color: 'var(--gray-400)', marginBottom: '3rem' }}>
              Ready to take your brand to the next level? Drop us a line and we'll
              get back to you within one business day.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'Email',    val: 'info@fazeddigital.com', href: 'mailto:info@fazeddigital.com' },
                { label: 'Phone',    val: '+63 922 123 4567',        href: 'tel:+639221234567' },
                { label: 'Location', val: 'Iligan City, Lanao del Norte, PH' },
              ].map(({ label, val, href }) => (
                <div key={label}>
                  <div className="label" style={{ marginBottom: '0.25rem' }}>{label}</div>
                  {href
                    ? <a href={href} style={{ color: 'var(--white)', fontWeight: 500 }}>{val}</a>
                    : <span style={{ color: 'var(--gray-300)' }}>{val}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div ref={formRef}>
            {sent ? (
              <div style={{
                padding: '3rem', border: '1px solid var(--white)',
                borderRadius: 'var(--radius)', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem' }}>✓</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 600 }}>
                  Message sent!
                </div>
                <p style={{ color: 'var(--gray-400)' }}>We'll be in touch within one business day.</p>
                <MagneticButton onClick={() => { setSent(false); setName(''); setEmail(''); setService(''); setMessage(''); }} variant="outline" size="sm">
                  Send another
                </MagneticButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{
                padding: '2.25rem', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', background: 'var(--surface)',
                display: 'flex', flexDirection: 'column', gap: '1.1rem',
              }}>
                {error && (
                  <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid var(--gray-600)', color: 'var(--gray-300)', fontSize: '0.85rem' }}>
                    {error}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Field label="Name *">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" style={inputCss} onFocus={focus} onBlur={blur} />
                  </Field>
                  <Field label="Email *">
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@company.com" style={inputCss} onFocus={focus} onBlur={blur} />
                  </Field>
                </div>
                <Field label="Service">
                  <select value={service} onChange={e => setService(e.target.value)} style={{ ...inputCss, appearance: 'none' }} onFocus={focus} onBlur={blur}>
                    <option value="">Select a service…</option>
                    <option value="web">Web Design & Development</option>
                    <option value="brand">Brand Identity</option>
                    <option value="seo">SEO Marketing</option>
                    <option value="product">Product Design</option>
                    <option value="other">Other</option>
                  </select>
                </Field>
                <Field label="Message *">
                  <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us about your project…" style={{ ...inputCss, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
                </Field>
                <MagneticButton type="submit" variant="primary" size="lg">
                  {loading ? 'Sending…' : 'Send Message →'}
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
