import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Target, ShoppingBag, Award, RefreshCcw, Rocket, MessageSquare,
  Minus, Zap, Briefcase, Smile, CheckCircle,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const RECAPTCHA_SITE_KEY = '6LdYgc0sAAAAAJy0R-ZRG3VKjadhIoWs_-9VOZ1x';
const TOTAL_STEPS = 5;

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  package: string;
  businessName: string;
  industry: string;
  currentWebsite: string;
  goal: string;
  styleVibe: string;
  pagesNeeded: string[];
  brandColors: string;
  inspirationUrls: string;
  name: string;
  email: string;
  phone: string;
  referral: string;
  notes: string;
}

const INITIAL: FormData = {
  package: '', businessName: '', industry: '', currentWebsite: '',
  goal: '', styleVibe: '', pagesNeeded: ['Home', 'About', 'Contact'],
  brandColors: '', inspirationUrls: '', name: '', email: '',
  phone: '', referral: '', notes: '',
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const PACKAGES_USD = [
  { value: 'starter', name: 'Starter', price: '$499',    tagline: 'New businesses getting online',      features: ['5 custom pages', 'Mobile-responsive design', 'On-page SEO setup', 'Contact form', '2 revision rounds', '7-day delivery'] },
  { value: 'growth',  name: 'Growth',  price: '$899',    tagline: 'Best for growing small businesses',  popular: true, features: ['8 custom pages', 'Custom design system', 'Advanced SEO', 'Blog + CMS setup', 'Google Analytics', '3 revision rounds', '7-day delivery'] },
  { value: 'pro',     name: 'Pro',     price: '$1,499',  tagline: 'For businesses ready to scale',      features: ['10+ custom pages', 'Full brand integration', 'E-commerce ready', 'Performance < 2s', 'Unlimited revisions', 'Priority support', '7-day delivery'] },
];

const PACKAGES_PHP = [
  { value: 'starter', name: 'Starter', price: '₱19,999', tagline: 'New businesses getting online',      features: ['5 custom pages', 'Mobile-responsive design', 'On-page SEO setup', 'Contact form', '2 revision rounds', '7-day delivery'] },
  { value: 'growth',  name: 'Growth',  price: '₱34,999', tagline: 'Best for growing small businesses',  popular: true, features: ['8 custom pages', 'Custom design system', 'Advanced SEO', 'Blog + CMS setup', 'Google Analytics', '3 revision rounds', '7-day delivery'] },
  { value: 'pro',     name: 'Pro',     price: '₱59,999', tagline: 'For businesses ready to scale',      features: ['10+ custom pages', 'Full brand integration', 'E-commerce ready', 'Performance < 2s', 'Unlimited revisions', 'Priority support', '7-day delivery'] },
];

const INDUSTRIES = ['Restaurant & Food', 'Retail & Fashion', 'Professional Services', 'Healthcare & Wellness', 'Real Estate', 'E-commerce', 'Education', 'Construction & Trades', 'Beauty & Salon', 'Tech & Startups', 'Other'];

const GOALS = [
  { value: 'leads',       label: 'Get more leads & inquiries',    Icon: Target       },
  { value: 'sell',        label: 'Sell products online',          Icon: ShoppingBag  },
  { value: 'credibility', label: 'Build credibility & trust',     Icon: Award        },
  { value: 'replace',     label: 'Replace old/outdated website',  Icon: RefreshCcw   },
  { value: 'launch',      label: 'Launch a new business',         Icon: Rocket       },
  { value: 'other',       label: 'Something else',                Icon: MessageSquare },
];

const STYLE_VIBES = [
  { value: 'minimal',   Icon: Minus,     label: 'Minimal & Clean',         desc: 'Whitespace, simple typography' },
  { value: 'bold',      Icon: Zap,       label: 'Bold & Vibrant',          desc: 'Strong colors, high energy' },
  { value: 'corporate', Icon: Briefcase, label: 'Corporate & Professional', desc: 'Formal, trustworthy, polished' },
  { value: 'playful',   Icon: Smile,     label: 'Playful & Fun',           desc: 'Friendly, colorful, approachable' },
];

const ALL_PAGES = ['Home', 'About', 'Services', 'Contact', 'Blog', 'Gallery', 'Portfolio', 'FAQ', 'Team', 'Testimonials', 'Pricing', 'Shop / Store'];

const REFERRALS = ['Google Search', 'Facebook / Instagram', 'TikTok', 'Referred by a friend', 'LinkedIn', 'Other'];

const STEP_LABELS = ['Package', 'Business', 'Design', 'Contact', 'Review'];

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputCss: React.CSSProperties = {
  width: '100%', background: 'var(--gray-900)', border: '1px solid var(--border)',
  borderRadius: '0.625rem', padding: '0.8rem 1rem', color: 'var(--white)',
  fontFamily: 'var(--font-body)', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.18s',
};
const labelCss: React.CSSProperties = {
  fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'var(--gray-500)', marginBottom: '0.4rem', display: 'block',
};

// ─── Small helpers ────────────────────────────────────────────────────────────
function Row({ children, gap = '1rem' }: { children: React.ReactNode; gap?: string }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap }}>{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column' }}><label style={labelCss}>{label}</label>{children}</div>;
}
function StepHeading({ step, title, sub }: { step: number; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <div style={{ ...labelCss, color: 'var(--accent)', marginBottom: '0.5rem' }}>Step {step} of {TOTAL_STEPS}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,1.75rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>{title}</div>
      <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.4rem' }}>{sub}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LpForm({ variant = 'usd' }: { variant?: 'usd' | 'php' }) {
  const PACKAGES = variant === 'php' ? PACKAGES_PHP : PACKAGES_USD;
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stepRef   = useRef<HTMLDivElement>(null);
  const [step,    setStep]    = useState(1);
  const [data,    setData]    = useState<FormData>(INITIAL);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  // Load reCAPTCHA script
  useEffect(() => {
    if (document.getElementById('recaptcha-script')) return;
    const s = document.createElement('script');
    s.id = 'recaptcha-script';
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  // Entrance animation
  useGSAP(() => {
    gsap.from(wrapRef.current, {
      y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: wrapRef.current, start: 'top 88%', toggleActions: 'play none none none' },
    });
  }, { scope: wrapRef });

  // Step transition
  const animateStep = (newStep: number, dir: 1 | -1) => {
    const el = stepRef.current;
    if (!el) { setStep(newStep); return; }
    gsap.to(el, {
      x: dir * -30, autoAlpha: 0, duration: 0.18, ease: 'power2.in',
      onComplete: () => {
        setStep(newStep);
        setError('');
        gsap.fromTo(el, { x: dir * 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
      },
    });
  };

  const next = () => {
    const err = validate(step, data);
    if (err) { setError(err); return; }
    if (step < TOTAL_STEPS) animateStep(step + 1, 1);
  };
  const back = () => { if (step > 1) animateStep(step - 1, -1); };

  const set = (field: keyof FormData, value: any) => {
    setData(d => ({ ...d, [field]: value }));
    setError('');
  };

  const togglePage = (page: string) => {
    setData(d => ({
      ...d,
      pagesNeeded: d.pagesNeeded.includes(page)
        ? d.pagesNeeded.filter(p => p !== page)
        : [...d.pagesNeeded, page],
    }));
    setError('');
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'var(--accent)');
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = 'var(--border)');

  const handleSubmit = async () => {
    const err = validate(TOTAL_STEPS, data);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const captchaToken = await new Promise<string>((resolve, reject) => {
        (window as any).grecaptcha.ready(() => {
          (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'lp_submit' }).then(resolve).catch(reject);
        });
      });

      const res = await fetch('/api/lp-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package:        data.package,
          businessName:   data.businessName,
          industry:       data.industry,
          goal:           data.goal,
          styleVibe:      data.styleVibe,
          pagesNeeded:    data.pagesNeeded,
          brandColors:    data.brandColors,
          inspirationUrls: data.inspirationUrls,
          name:           data.name,
          email:          data.email,
          phone:          data.phone,
          referral:       data.referral,
          notes:          data.notes,
          captchaToken,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error((d as any).error ?? 'Something went wrong. Please try again.');
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div ref={wrapRef} style={{
        padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--accent)',
        background: 'rgba(201,255,87,0.04)', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(201,255,87,0.1)', border: '1px solid rgba(201,255,87,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
          <CheckCircle size={30} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em' }}>
          You're booked in!
        </div>
        <p style={{ color: 'var(--gray-400)', maxWidth: '360px', margin: 0, lineHeight: 1.6 }}>
          We've received your brief and will reach out to <strong style={{ color: 'var(--white)' }}>{data.email}</strong> within one business day to confirm your start date.
        </p>
        <div style={{ marginTop: '0.5rem', padding: '1rem 1.5rem', background: 'var(--gray-900)', borderRadius: '0.625rem', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--gray-400)' }}>
          📦 <strong style={{ color: 'var(--white)' }}>{PACKAGES.find((p: any) => p.value === data.package)?.name}</strong> package · {PACKAGES.find((p: any) => p.value === data.package)?.price}
        </div>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div ref={wrapRef} style={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}>

      {/* Progress bar */}
      <div style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const active    = step === n;
            const completed = step > n;
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n < STEP_LABELS.length ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                    background: completed ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--gray-800)',
                    color: completed || active ? '#090909' : 'var(--gray-500)',
                    border: `1.5px solid ${completed || active ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'all 0.3s',
                  }}>
                    {completed ? '✓' : n}
                  </div>
                  <span style={{
                    fontSize: '0.6rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: active ? 'var(--accent)' : completed ? 'var(--gray-400)' : 'var(--gray-600)',
                    transition: 'color 0.3s', whiteSpace: 'nowrap',
                  }}>{label}</span>
                </div>
                {n < STEP_LABELS.length && (
                  <div style={{
                    flex: 1, height: 1.5, margin: '0 0.4rem', marginBottom: '1.2rem',
                    background: step > n ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div style={{ padding: '2.5rem' }}>
        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'rgba(255,100,100,0.08)', borderRadius: '0.5rem', border: '1px solid rgba(255,100,100,0.2)', color: '#ff9090', fontSize: '0.84rem' }}>
            {error}
          </div>
        )}

        <div ref={stepRef}>
          {step === 1 && <Step1 data={data} set={set} packages={PACKAGES} />}
          {step === 2 && <Step2 data={data} set={set} focus={focus} blur={blur} />}
          {step === 3 && <Step3 data={data} set={set} togglePage={togglePage} focus={focus} blur={blur} />}
          {step === 4 && <Step4 data={data} set={set} focus={focus} blur={blur} />}
          {step === 5 && <Step5 data={data} set={set} focus={focus} blur={blur} packages={PACKAGES} />}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', alignItems: 'center' }}>
          {step > 1 && (
            <button onClick={back} style={{
              padding: '0.8rem 1.25rem', background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '0.625rem', color: 'var(--gray-400)', fontFamily: 'var(--font-body)',
              fontSize: '0.875rem', cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray-500)'; (e.currentTarget as HTMLElement).style.color = 'var(--white)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--gray-400)'; }}
            >← Back</button>
          )}
          {step < TOTAL_STEPS && (
            <button onClick={next} style={{
              flex: 1, padding: '0.9rem 1.5rem', background: 'var(--white)',
              color: '#090909', border: 'none', borderRadius: '0.625rem',
              fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700,
              cursor: 'pointer', transition: 'background 0.2s, transform 0.15s', letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--white)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >Continue →</button>
          )}
          {step === TOTAL_STEPS && (
            <button onClick={handleSubmit} disabled={loading} style={{
              flex: 1, padding: '0.9rem 1.5rem',
              background: loading ? 'var(--gray-700)' : 'var(--accent)',
              color: loading ? 'var(--gray-400)' : '#090909',
              border: 'none', borderRadius: '0.625rem',
              fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, transform 0.15s', letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >{loading ? 'Submitting…' : 'Submit & Get Started 🚀'}</button>
          )}
        </div>

        <p style={{ fontSize: '0.7rem', color: 'var(--gray-700)', textAlign: 'center', marginTop: '1rem', marginBottom: 0 }}>
          Protected by reCAPTCHA —{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style={{ color: 'var(--gray-600)' }}>Privacy</a>
          {' & '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener" style={{ color: 'var(--gray-600)' }}>Terms</a>
        </p>
      </div>
    </div>
  );
}

// ─── Step 1: Package ──────────────────────────────────────────────────────────
function Step1({ data, set, packages }: { data: FormData; set: (f: keyof FormData, v: any) => void; packages: typeof PACKAGES_USD }) {
  return (
    <div>
      <StepHeading step={1} title="Choose your package." sub="Pick the plan that fits your business. You can always upgrade later." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {packages.map(pkg => {
          const active = data.package === pkg.value;
          return (
            <button key={pkg.value} type="button" onClick={() => set('package', pkg.value)} style={{
              width: '100%', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', cursor: 'pointer',
              border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              background: active ? 'rgba(201,255,87,0.06)' : 'var(--gray-900)',
              textAlign: 'left', transition: 'all 0.2s', position: 'relative',
            }}>
              {pkg.popular && (
                <span style={{
                  position: 'absolute', top: -10, right: 16,
                  background: 'var(--accent)', color: '#090909',
                  fontSize: '0.6rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem', borderRadius: '2rem',
                }}>Most Popular</span>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: active ? 'var(--accent)' : 'var(--white)', letterSpacing: '-0.02em' }}>
                    {pkg.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-500)', marginTop: '0.15rem' }}>{pkg.tagline}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: active ? 'var(--accent)' : 'var(--white)', letterSpacing: '-0.03em' }}>
                  {pkg.price}
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {pkg.features.map(f => (
                  <span key={f} style={{
                    fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                    padding: '0.2rem 0.55rem', borderRadius: '2rem',
                    background: active ? 'rgba(201,255,87,0.1)' : 'rgba(255,255,255,0.04)',
                    color: active ? 'rgba(201,255,87,0.8)' : 'var(--gray-500)',
                    border: `1px solid ${active ? 'rgba(201,255,87,0.2)' : 'var(--border)'}`,
                  }}>{f}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Business Details ─────────────────────────────────────────────────
function Step2({ data, set, focus, blur }: { data: FormData; set: (f: keyof FormData, v: any) => void; focus: any; blur: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <StepHeading step={2} title="Tell us about your business." sub="The more context you give, the better we can tailor your site." />

      <Field label="Business Name *">
        <input type="text" value={data.businessName} onChange={e => set('businessName', e.target.value)}
          placeholder="e.g. Sunrise Coffee Co." style={inputCss} onFocus={focus} onBlur={blur} />
      </Field>

      <Field label="Industry *">
        <select value={data.industry} onChange={e => set('industry', e.target.value)}
          style={{ ...inputCss, appearance: 'none' }} onFocus={focus} onBlur={blur}>
          <option value="">Select your industry…</option>
          {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </Field>

      <Field label="Current Website (if any)">
        <input type="url" value={data.currentWebsite} onChange={e => set('currentWebsite', e.target.value)}
          placeholder="https://yoursite.com" style={inputCss} onFocus={focus} onBlur={blur} />
      </Field>

      <Field label="Main Goal for Your New Website *">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {GOALS.map(g => {
            const active = data.goal === g.value;
            return (
              <button key={g.value} type="button" onClick={() => set('goal', g.value)} style={{
                padding: '0.75rem 1rem', borderRadius: '0.5rem', cursor: 'pointer',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.7rem',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'rgba(201,255,87,0.06)' : 'var(--gray-900)',
                color: active ? 'var(--accent)' : 'var(--gray-300)',
                fontFamily: 'var(--font-body)', fontSize: '0.875rem', transition: 'all 0.18s',
              }}>
                <g.Icon size={15} strokeWidth={1.75} style={{ flexShrink: 0, color: active ? 'var(--accent)' : 'var(--gray-500)' }} />
                {g.label}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

// ─── Step 3: Design Preferences ───────────────────────────────────────────────
function Step3({ data, set, togglePage, focus, blur }: { data: FormData; set: (f: keyof FormData, v: any) => void; togglePage: (p: string) => void; focus: any; blur: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <StepHeading step={3} title="Design preferences." sub="Help us nail the look and feel of your site." />

      <Field label="Style Vibe *">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          {STYLE_VIBES.map(v => {
            const active = data.styleVibe === v.value;
            return (
              <button key={v.value} type="button" onClick={() => set('styleVibe', v.value)} style={{
                padding: '1rem 0.9rem', borderRadius: '0.625rem', cursor: 'pointer', textAlign: 'left',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'rgba(201,255,87,0.06)' : 'var(--gray-900)',
                transition: 'all 0.18s', fontFamily: 'var(--font-body)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: active ? 'rgba(201,255,87,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${active ? 'rgba(201,255,87,0.3)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: active ? 'var(--accent)' : 'var(--gray-400)',
                  marginBottom: '0.6rem', transition: 'all 0.18s',
                }}>
                  <v.Icon size={16} strokeWidth={1.75} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: active ? 'var(--accent)' : 'var(--white)' }}>{v.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)', marginTop: '0.2rem', lineHeight: 1.3 }}>{v.desc}</div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Pages You Need *">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {ALL_PAGES.map(p => {
            const active = data.pagesNeeded.includes(p);
            return (
              <button key={p} type="button" onClick={() => togglePage(p)} style={{
                padding: '0.35rem 0.7rem', borderRadius: '2rem', cursor: 'pointer',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'rgba(201,255,87,0.1)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--gray-400)',
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
                textTransform: 'uppercase', transition: 'all 0.15s',
              }}>{active ? '✓ ' : ''}{p}</button>
            );
          })}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--gray-600)', marginTop: '0.4rem' }}>
          {data.pagesNeeded.length} page{data.pagesNeeded.length !== 1 ? 's' : ''} selected
        </div>
      </Field>

      <Field label="Brand Colors (optional)">
        <input type="text" value={data.brandColors} onChange={e => set('brandColors', e.target.value)}
          placeholder="e.g. Navy blue, gold, and white" style={inputCss} onFocus={focus} onBlur={blur} />
      </Field>

      <Field label="Inspiration URLs (optional)">
        <textarea rows={2} value={data.inspirationUrls} onChange={e => set('inspirationUrls', e.target.value)}
          placeholder="Paste links to websites you like the look of…"
          style={{ ...inputCss, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
      </Field>
    </div>
  );
}

// ─── Step 4: Contact Info ─────────────────────────────────────────────────────
function Step4({ data, set, focus, blur }: { data: FormData; set: (f: keyof FormData, v: any) => void; focus: any; blur: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <StepHeading step={4} title="Your contact details." sub="We'll use these to reach out with your project brief and start date." />

      <Row>
        <Field label="Your Name *">
          <input type="text" value={data.name} onChange={e => set('name', e.target.value)}
            placeholder="Jane Smith" style={inputCss} onFocus={focus} onBlur={blur} />
        </Field>
        <Field label="Email Address *">
          <input type="email" value={data.email} onChange={e => set('email', e.target.value)}
            placeholder="jane@yourbusiness.com" style={inputCss} onFocus={focus} onBlur={blur} />
        </Field>
      </Row>

      <Field label="Phone Number (optional)">
        <input type="tel" value={data.phone} onChange={e => set('phone', e.target.value)}
          placeholder="+63 9XX XXX XXXX" style={inputCss} onFocus={focus} onBlur={blur} />
      </Field>

      <Field label="How did you hear about us?">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {REFERRALS.map(r => {
            const active = data.referral === r;
            return (
              <button key={r} type="button" onClick={() => set('referral', r)} style={{
                padding: '0.4rem 0.8rem', borderRadius: '2rem', cursor: 'pointer',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'rgba(201,255,87,0.1)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--gray-400)',
                fontFamily: 'var(--font-body)', fontSize: '0.8rem', transition: 'all 0.15s',
              }}>{r}</button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

// ─── Step 5: Review ───────────────────────────────────────────────────────────
function Step5({ data, set, focus, blur, packages }: { data: FormData; set: (f: keyof FormData, v: any) => void; focus: any; blur: any; packages: typeof PACKAGES_USD }) {
  const pkg  = packages.find(p => p.value === data.package);
  const goal = GOALS.find(g => g.value === data.goal);
  const vibe = STYLE_VIBES.find(v => v.value === data.styleVibe);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <StepHeading step={5} title="Review your brief." sub="Everything look good? Submit and we'll be in touch within one business day." />

      {/* Summary card */}
      <div style={{ background: 'var(--gray-900)', border: '1px solid var(--border)', borderRadius: '0.75rem', overflow: 'hidden' }}>
        {[
          { label: '📦 Package',   value: `${pkg?.name} — ${pkg?.price}` },
          { label: '🏢 Business',  value: `${data.businessName} · ${data.industry}` },
          { label: '🎯 Goal',      value: goal?.label },
          { label: '🎨 Style',     value: vibe?.label },
          { label: '📄 Pages',     value: `${data.pagesNeeded.join(', ')} (${data.pagesNeeded.length})` },
          { label: '👤 Contact',   value: `${data.name} · ${data.email}` },
        ].map((row, i, arr) => (
          <div key={row.label} style={{
            display: 'flex', gap: '1rem', padding: '0.75rem 1.25rem',
            borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--gray-500)', minWidth: '90px', paddingTop: '0.1rem' }}>
              {row.label}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--gray-200)', lineHeight: 1.5, flex: 1 }}>
              {row.value || '—'}
            </span>
          </div>
        ))}
      </div>

      <Field label="Anything else we should know? (optional)">
        <textarea rows={3} value={data.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Special requirements, launch deadline, anything else…"
          style={{ ...inputCss, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
      </Field>

      <div style={{ padding: '1rem', background: 'rgba(201,255,87,0.04)', border: '1px solid rgba(201,255,87,0.15)', borderRadius: '0.625rem', fontSize: '0.82rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
        ✅ No payment required yet — we'll confirm your spot and send you a project brief first.
      </div>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate(step: number, data: FormData): string {
  if (step === 1) {
    if (!data.package) return 'Please select a package to continue.';
  }
  if (step === 2) {
    if (!data.businessName.trim()) return 'Please enter your business name.';
    if (!data.industry)            return 'Please select your industry.';
    if (!data.goal)                return 'Please select your main goal.';
  }
  if (step === 3) {
    if (!data.styleVibe)              return 'Please choose a style vibe.';
    if (data.pagesNeeded.length === 0) return 'Please select at least one page.';
  }
  if (step === 4 || step === 5) {
    if (!data.name.trim())  return 'Please enter your name.';
    if (!data.email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Please enter a valid email address.';
  }
  return '';
}
