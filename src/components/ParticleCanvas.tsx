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
      const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 11000));
      return Array.from({ length: count }, (_, i) => ({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        vx:   (Math.random() - 0.5) * 0.35,
        vy:   (Math.random() - 0.5) * 0.35,
        r:    Math.random() * 1.2 + 0.4,
        lime: i % 7 === 0, // ~14% lime coloured
      }));
    };

    let dots = makeParticles();

    const onResize = () => { resize(); dots = makeParticles(); };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }, { passive: true });

    const LINK  = 140; // max connection distance
    const REPEL = 90;  // mouse repel radius

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const d of dots) {
        // Mouse repulsion
        const dx = d.x - mx, dy = d.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL && dist > 0) {
          const f = ((REPEL - dist) / REPEL) * 0.018;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f;
        }
        d.vx *= 0.98;
        d.vy *= 0.98;
        d.x  += d.vx;
        d.y  += d.vy;
        // Wrap edges instead of bouncing — smoother feel
        if (d.x < -5)               d.x = canvas.width  + 5;
        if (d.x > canvas.width  + 5) d.x = -5;
        if (d.y < -5)               d.y = canvas.height + 5;
        if (d.y > canvas.height + 5) d.y = -5;

        // Draw dot
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.lime ? 'rgba(201,255,87,0.55)' : 'rgba(255,255,255,0.45)';
        ctx.fill();
      }

      // Draw connections — O(n²) but n≤90 so ~4k checks/frame, fine at 60fps
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > LINK) continue;
          const alpha = (1 - d / LINK) * 0.1;
          const isLime = a.lime || b.lime;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = isLime
            ? `rgba(201,255,87,${alpha * 1.6})`
            : `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
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
