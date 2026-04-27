import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RECAPTCHA_SITE_KEY = '6LdYgc0sAAAAAJy0R-ZRG3VKjadhIoWs_-9VOZ1x';

const PACKAGES = [
  { value: 'starter', label: 'Starter',  price: '$499',   sub: '5 pages' },
  { value: 'growth',  label: 'Growth',   price: '$899',   sub: 'Most Popular' },
  { value: 'pro',     label: 'Pro',      price: '$1,499', sub: '10+ pages' },
];

const inputCss: React.CSSProperties = {
  width: '100%',
  background: 'var(--gray-900)',
  border: '1px solid var(--border)',
  borderRadius: '0.625rem',
  padding: '0.85rem 1.1rem',
  color: 'var(--white)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.925rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const fieldCss: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

export default function LpForm() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pkg,     setPkg]     = useState('growth');
  const [biz,     setBiz]     = useState('');
  const [message, setMessage] = useState('');
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (document.getElementById('recaptcha-script')) return;
    const s = document.createElement('script');
    s.id    = 'recaptcha-script';
    s.src   = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  useGSAP(() => {
    gsap.from(wrapRef.current, {
      y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: wrapRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    });
  }, { scope: wrapRef });

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.borderColor = 'var(--accent)');
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
    setLoading(true);
    try {
      const captchaToken = await new Promise<string>((resolve, reject) => {
        (window as any).grecaptcha.ready(() => {
          (window as any).grecaptcha
            .execute(RECAPTCHA_SITE_KEY, { action: 'lp_contact' })
            .then(resolve).catch(reject);
        });
      });

      const pkgLabel = PACKAGES.find(p => p.value === pkg);
      const fullMsg  = `Package: ${pkgLabel?.label} (${pkgLabel?.price})\nBusiness: ${biz || 'Not specified'}\n\n${message}`;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, service: 'web', message: fullMsg, captchaToken }),
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

  if (sent) {
    return (
      <div ref={wrapRef} style={{
        padding: '3rem 2rem', borderRadius: 'var(--radius)',
        border: '1px solid var(--accent)', background: 'rgba(201,255,87,0.04)',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '1rem',
      }}>
        <span style={{ fontSize: '3rem' }}>🚀</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em' }}>
          You're on the list!
        </div>
        <p style={{ color: 'var(--gray-400)', maxWidth: '360px', margin: '0 auto' }}>
          We'll reach out within one business day to kick off your 7-day build.
        </p>
      </div>
    );
  }

  return (
    <div ref={wrapRef}>
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', border: '1px solid var(--gray-600)', color: 'var(--gray-300)', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Package selector */}
        <div style={fieldCss}>
          <label className="label">Choose Your Package</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {PACKAGES.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPkg(p.value)}
                style={{
                  padding: '0.8rem 0.5rem',
                  borderRadius: '0.625rem',
                  border: `1px solid ${pkg === p.value ? 'var(--accent)' : 'var(--border)'}`,
                  background: pkg === p.value ? 'rgba(201,255,87,0.08)' : 'var(--gray-900)',
                  cursor: 'pointer',
                  transition: 'all 0.18s',
                  textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: pkg === p.value ? 'var(--accent)' : 'var(--white)', fontFamily: 'var(--font-display)' }}>
                  {p.label}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: pkg === p.value ? 'var(--accent)' : 'var(--gray-300)', marginTop: '0.15rem' }}>
                  {p.price}
                </div>
                <div style={{ fontSize: '0.67rem', color: 'var(--gray-500)', marginTop: '0.1rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  {p.sub}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={fieldCss}>
            <label className="label">Your Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Jane Smith" style={inputCss} onFocus={focus} onBlur={blur} />
          </div>
          <div style={fieldCss}>
            <label className="label">Email Address *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="jane@yourbusiness.com" style={inputCss} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <div style={fieldCss}>
          <label className="label">Business Name</label>
          <input type="text" value={biz} onChange={e => setBiz(e.target.value)}
            placeholder="Your Business Name" style={inputCss} onFocus={focus} onBlur={blur} />
        </div>

        <div style={fieldCss}>
          <label className="label">Tell us about your project *</label>
          <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
            placeholder="What does your business do? Any specific features you need — booking, gallery, e-commerce?"
            style={{ ...inputCss, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '1.05rem 2rem',
            background: loading ? 'var(--gray-700)' : 'var(--accent)',
            color: loading ? 'var(--gray-400)' : '#090909',
            border: 'none', borderRadius: '0.625rem',
            fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.15s, background 0.2s',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          {loading ? 'Sending…' : 'Claim Your Spot →'}
        </button>

        <p style={{ fontSize: '0.72rem', color: 'var(--gray-600)', textAlign: 'center', margin: 0 }}>
          Protected by reCAPTCHA —{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style={{ color: 'var(--gray-500)' }}>Privacy</a>
          {' & '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener" style={{ color: 'var(--gray-500)' }}>Terms</a>
        </p>
      </form>
    </div>
  );
}
