import { useEffect, useRef } from 'react';

interface Dot {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  lime: boolean;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    let raf: number;
    let mx = -9999, my = -9999;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const makeParticles = (): Dot[] => {
      // Reduced from 90 → 50 max; fewer particles = fewer O(n²) connection checks
      const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 14000));
      return Array.from({ length: count }, (_, i) => ({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        vx:   (Math.random() - 0.5) * 0.3,
        vy:   (Math.random() - 0.5) * 0.3,
        r:    Math.random() * 1.2 + 0.4,
        lime: i % 7 === 0,
      }));
    };

    let dots = makeParticles();

    const onResize = () => { resize(); dots = makeParticles(); };
    window.addEventListener('resize', onResize, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Pre-compute squared thresholds — avoids sqrt in the hot O(n²) path
    const LINK    = 110;
    const LINK_SQ = LINK * LINK;
    const REPEL   = 80;
    const REPEL_SQ = REPEL * REPEL;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update physics + draw dots
      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < REPEL_SQ && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const f = ((REPEL - dist) / REPEL) * 0.018;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }
        d.vx *= 0.98; d.vy *= 0.98;
        d.x  += d.vx; d.y  += d.vy;
        if (d.x < -5)                d.x = canvas.width  + 5;
        if (d.x > canvas.width  + 5) d.x = -5;
        if (d.y < -5)                d.y = canvas.height + 5;
        if (d.y > canvas.height + 5) d.y = -5;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.lime ? 'rgba(201,255,87,0.55)' : 'rgba(255,255,255,0.45)';
        ctx.fill();
      }

      // Draw connections — squared distance check skips sqrt for ~97% of pairs
      ctx.lineWidth = 0.6;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;
          if (dSq > LINK_SQ) continue;
          const d = Math.sqrt(dSq);
          const alpha = (1 - d / LINK) * 0.1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = (a.lime || b.lime)
            ? `rgba(201,255,87,${(alpha * 1.6).toFixed(3)})`
            : `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}
