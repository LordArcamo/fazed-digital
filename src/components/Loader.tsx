import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Loader() {
  const loaderRef  = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const wordRef    = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader  = loaderRef.current!;
    const counter = counterRef.current!;
    const bar     = barRef.current!;
    const word    = wordRef.current!;

    document.body.classList.add('loading');

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('loading');
        gsap.set(loader, { display: 'none' });
      },
    });

    tl.to(obj, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate() {
        counter.textContent = String(Math.round(obj.val)).padStart(3, '0');
        bar.style.transform = `scaleX(${obj.val / 100})`;
      },
    })
    .to(word, { yPercent: -110, duration: 0.7, ease: 'power3.inOut' }, '-=0.2')
    .to(counter, { yPercent: -110, duration: 0.65, ease: 'power3.inOut' }, '<0.04')
    .to(loader, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.35');

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={loaderRef} style={{
      position: 'fixed', inset: 0,
      background: 'var(--black)',
      zIndex: 99990,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '3rem',
      overflow: 'hidden',
    }}>
      {/* Wordmark */}
      <div ref={wordRef} style={{ overflow: 'hidden', lineHeight: 1 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 9vw, 9rem)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--white)',
          lineHeight: 1,
        }}>
          Fazed<span style={{ fontStyle: 'normal', fontWeight: 300, color: 'var(--gray-500)' }}> Digital</span>
        </div>
      </div>

      {/* Progress row */}
      <div style={{ width: 'min(420px, 80vw)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--gray-500)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Loading
          </span>
          <span ref={counterRef} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--white)', fontWeight: 700 }}>
            000
          </span>
        </div>
        <div style={{ width: '100%', height: '1px', background: 'var(--gray-800)' }}>
          <div ref={barRef} style={{
            height: '100%',
            background: 'var(--white)',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }} />
        </div>
      </div>
    </div>
  );
}
