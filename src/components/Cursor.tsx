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

    // quickTo for cursor — single tween instance, no allocation per move
    const xDot  = gsap.quickTo(dot,  'x', { duration: 0.06, ease: 'none' });
    const yDot  = gsap.quickTo(dot,  'y', { duration: 0.06, ease: 'none' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power2.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power2.out' });

    const move = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY);
      xRing(e.clientX); yRing(e.clientY);
    };

    const reset = () => {
      gsap.to(ring, { scale: 1, background: 'transparent', borderColor: 'rgba(245,244,240,0.4)', duration: 0.35, ease: 'power2.out' });
      gsap.to(dot,  { scale: 1, duration: 0.2 });
      gsap.to(label, { opacity: 0, scale: 0.6, duration: 0.2 });
    };
    const onLinkEnter = () => {
      gsap.to(ring, { scale: 2, borderColor: 'rgba(245,244,240,0.8)', duration: 0.3, ease: 'power2.out' });
      gsap.to(dot,  { scale: 0, duration: 0.15 });
    };
    const onBtnEnter = () => {
      gsap.to(ring, { scale: 2.8, background: 'rgba(201,255,87,0.08)', borderColor: 'var(--accent)', duration: 0.35, ease: 'back.out(1.7)' });
      gsap.to(dot,  { scale: 0, duration: 0.15 });
    };
    const onViewEnter = (text: string) => {
      label.textContent = text;
      gsap.to(ring, { scale: 3.2, background: 'rgba(201,255,87,0.1)', borderColor: 'var(--accent)', duration: 0.4, ease: 'back.out(1.5)' });
      gsap.to(dot, { scale: 0, duration: 0.15 });
      gsap.to(label, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' });
    };

    window.addEventListener('mousemove', move, { passive: true });

    // Track already-bound elements to prevent duplicate listeners
    const bound = new WeakSet<Element>();

    const bind = () => {
      document.querySelectorAll<Element>('a:not([data-cursor]), [data-cursor="link"]').forEach(el => {
        if (bound.has(el)) return;
        bound.add(el);
        el.addEventListener('mouseenter', onLinkEnter);
        el.addEventListener('mouseleave', reset);
      });
      document.querySelectorAll<Element>('button, [data-cursor="button"]').forEach(el => {
        if (bound.has(el)) return;
        bound.add(el);
        el.addEventListener('mouseenter', onBtnEnter);
        el.addEventListener('mouseleave', reset);
      });
      document.querySelectorAll<Element>('[data-cursor-label]').forEach(el => {
        if (bound.has(el)) return;
        bound.add(el);
        const text = (el as HTMLElement).dataset.cursorLabel ?? 'VIEW';
        el.addEventListener('mouseenter', () => onViewEnter(text));
        el.addEventListener('mouseleave', reset);
      });
    };
    bind();

    // Only watch for added nodes — not all mutations
    const obs = new MutationObserver(mutations => {
      const hasNew = mutations.some(m => m.addedNodes.length > 0);
      if (hasNew) bind();
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      obs.disconnect();
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
