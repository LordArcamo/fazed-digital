import { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: 'var(--accent)', color: 'var(--black)', border: '1px solid var(--accent)' },
  outline: { background: 'transparent', color: 'var(--white)', border: '1px solid var(--gray-600)' },
  ghost:   { background: 'transparent', color: 'var(--white)', border: '1px solid var(--white)' },
};
const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '0.55rem 1.3rem', fontSize: '0.78rem', gap: '0.4rem' },
  md: { padding: '0.8rem 1.9rem',  fontSize: '0.875rem', gap: '0.5rem' },
  lg: { padding: '1.05rem 2.6rem', fontSize: '0.95rem', gap: '0.5rem' },
};

type QuickFn = (value: number) => void;

export default function MagneticButton({ children, href, onClick, variant = 'primary', size = 'md', type = 'button' }: Props) {
  const btnRef   = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  // quickTo refs — one tween instance per axis, no allocation per mousemove
  const xBtn   = useRef<QuickFn | null>(null);
  const yBtn   = useRef<QuickFn | null>(null);
  const xInner = useRef<QuickFn | null>(null);
  const yInner = useRef<QuickFn | null>(null);

  useEffect(() => {
    if (!btnRef.current || !innerRef.current) return;
    xBtn.current   = gsap.quickTo(btnRef.current,   'x', { duration: 0.38, ease: 'power2.out' });
    yBtn.current   = gsap.quickTo(btnRef.current,   'y', { duration: 0.38, ease: 'power2.out' });
    xInner.current = gsap.quickTo(innerRef.current, 'x', { duration: 0.38, ease: 'power2.out' });
    yInner.current = gsap.quickTo(innerRef.current, 'y', { duration: 0.38, ease: 'power2.out' });
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el   = btnRef.current!;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.38;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.38;
    xBtn.current?.(x);
    yBtn.current?.(y);
    xInner.current?.(x * 0.18);
    yInner.current?.(y * 0.18);
  };

  const onMouseLeave = () => {
    gsap.to(btnRef.current,   { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)' });
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
    if (variant === 'outline') gsap.to(btnRef.current, { borderColor: 'var(--gray-600)', duration: 0.25 });
  };

  const onMouseEnter = () => {
    gsap.to(btnRef.current, { scale: 1.04, duration: 0.28, ease: 'power2.out' });
    if (variant === 'outline') gsap.to(btnRef.current, { borderColor: 'var(--white)', duration: 0.25 });
    if (variant === 'primary') gsap.to(btnRef.current, { background: 'var(--accent-dark)', borderColor: 'var(--accent-dark)', duration: 0.25 });
  };

  const onMouseDown = () => gsap.to(btnRef.current, { scale: 0.965, duration: 0.1 });
  const onMouseUp   = () => gsap.to(btnRef.current, { scale: 1.04,  duration: 0.2, ease: 'back.out(2)' });

  const shared: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '100px',
    fontFamily: 'var(--font-body)', fontWeight: 600,
    letterSpacing: '0.01em', textDecoration: 'none',
    transition: 'background 0.2s',
    willChange: 'transform',
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  const events = { onMouseMove, onMouseLeave, onMouseEnter, onMouseDown, onMouseUp };

  if (href) {
    return (
      <a ref={btnRef as React.RefObject<HTMLAnchorElement>} href={href} style={shared} {...events} data-cursor="button">
        <span ref={innerRef} style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 'inherit' }}>{children}</span>
      </a>
    );
  }
  return (
    <button ref={btnRef as React.RefObject<HTMLButtonElement>} type={type} onClick={onClick} style={shared} {...events} data-cursor="button">
      <span ref={innerRef} style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 'inherit' }}>{children}</span>
    </button>
  );
}
