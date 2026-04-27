import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Cursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot   = dotRef.current!;
    const ring  = ringRef.current!;
    const label = labelRef.current!;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    // quickTo — single tween instance, zero allocation per mousemove
    const xDot  = gsap.quickTo(dot,  'x', { duration: 0.06, ease: 'none' });
    const yDot  = gsap.quickTo(dot,  'y', { duration: 0.06, ease: 'none' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power2.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power2.out' });

    const move = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };

    // Cursor state tracking — prevents re-triggering the same animation
    let curState = 'default';

    const reset = () => {
      if (curState === 'default') return;
      curState = 'default';
      gsap.to(ring,  { scale: 1, background: 'transparent', borderColor: 'rgba(245,244,240,0.4)', duration: 0.35, ease: 'power2.out' });
      gsap.to(dot,   { scale: 1, duration: 0.2 });
      gsap.to(label, { opacity: 0, scale: 0.6, duration: 0.2 });
    };
    const onLinkEnter = () => {
      if (curState === 'link') return;
      curState = 'link';
      gsap.to(ring, { scale: 2, borderColor: 'rgba(245,244,240,0.8)', duration: 0.3, ease: 'power2.out' });
      gsap.to(dot,  { scale: 0, duration: 0.15 });
    };
    const onBtnEnter = () => {
      if (curState === 'button') return;
      curState = 'button';
      gsap.to(ring, { scale: 2.8, background: 'rgba(201,255,87,0.08)', borderColor: 'var(--accent)', duration: 0.35, ease: 'back.out(1.7)' });
      gsap.to(dot,  { scale: 0, duration: 0.15 });
    };
    const onViewEnter = (text: string) => {
      if (curState === `view:${text}`) return;
      curState = `view:${text}`;
      label.textContent = text;
      gsap.to(ring,  { scale: 3.2, background: 'rgba(201,255,87,0.1)', borderColor: 'var(--accent)', duration: 0.4, ease: 'back.out(1.5)' });
      gsap.to(dot,   { scale: 0, duration: 0.15 });
      gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' });
    };

    window.addEventListener('mousemove', move, { passive: true });

    // Event delegation — two document listeners instead of per-element bindings + MutationObserver.
    // mouseover bubbles up so we can check the closest matching ancestor.
    const SELECTOR = '[data-cursor-label], button, [data-cursor="button"], a:not([data-cursor]), [data-cursor="link"]';

    const over = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest(SELECTOR) as HTMLElement | null;
      if (!target) return; // not over anything interactive
      const lbl = target.dataset.cursorLabel;
      if (lbl)                                         onViewEnter(lbl);
      else if (target.matches('button, [data-cursor="button"]')) onBtnEnter();
      else                                              onLinkEnter();
    };

    const out = (e: MouseEvent) => {
      // Only reset when leaving an interactive element for a non-interactive one
      const to = e.relatedTarget as Element | null;
      if (to?.closest(SELECTOR)) return; // still hovering interactive element
      reset();
    };

    document.addEventListener('mouseover',  over, { passive: true });
    document.addEventListener('mouseout',   out,  { passive: true });

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover',  over);
      document.removeEventListener('mouseout',   out);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 7, height: 7, borderRadius: '50%',
        background: 'var(--white)', pointerEvents: 'none',
        zIndex: 99999, mixBlendMode: 'difference',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0,
        width: 34, height: 34, borderRadius: '50%',
        border: '1px solid rgba(245,244,240,0.4)',
        pointerEvents: 'none', zIndex: 99998,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span ref={labelRef} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.42rem', letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--accent)',
          opacity: 0, userSelect: 'none', pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }} />
      </div>
    </>
  );
}
