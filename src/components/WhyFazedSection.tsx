import { useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedText from './AnimatedText';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ─────────────────────────────────────────────────────────────────
   Animated SVG illustrations — each loops independently via GSAP.
   These replace Lottie files with fully on-brand, zero-dep animations.
───────────────────────────────────────────────────────────────── */

/** 01 · Compass — strategy / direction */
const CompassAnim = memo(function CompassAnim() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const needle = ref.current?.querySelector<SVGElement>('.compass-needle');
    const rings  = ref.current?.querySelectorAll<SVGElement>('.compass-ring');
    const dots   = ref.current?.querySelectorAll<SVGElement>('.compass-dot');
    if (!needle || !rings) return;

    // Needle spins to a new bearing every 2 s
    const bearings = [0, 38, -25, 65, -50, 30, -10];
    let i = 0;
    const rotateTo = () => {
      i = (i + 1) % bearings.length;
      gsap.to(needle, { rotation: bearings[i], duration: 1.1, ease: 'elastic.out(1, 0.5)', transformOrigin: '50% 75%' });
    };
    rotateTo();
    const id = setInterval(rotateTo, 2200);

    // Rings pulse outward
    rings.forEach((ring, idx) => {
      gsap.to(ring, {
        scale: 1.08, opacity: 0.5,
        duration: 1.4, repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: idx * 0.4,
        transformOrigin: 'center',
      });
    });

    // Cardinal dots blink
    if (dots) dots.forEach((d, idx) => {
      gsap.to(d, { opacity: 0.3, duration: 0.8, repeat: -1, yoyo: true, delay: idx * 0.2, ease: 'sine.inOut' });
    });

    return () => clearInterval(id);
  }, { scope: ref });

  return (
    <svg ref={ref} viewBox="0 0 120 120" fill="none" style={{ width: 100, height: 100 }}>
      {/* Outer rings */}
      <circle className="compass-ring" cx="60" cy="60" r="54" stroke="rgba(201,255,87,0.12)" strokeWidth="1" />
      <circle className="compass-ring" cx="60" cy="60" r="44" stroke="rgba(201,255,87,0.18)" strokeWidth="1" />
      {/* Face */}
      <circle cx="60" cy="60" r="34" fill="rgba(201,255,87,0.04)" stroke="rgba(201,255,87,0.3)" strokeWidth="1.2" />
      {/* Tick marks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const r1 = i % 6 === 0 ? 28 : 30, r2 = 33;
        return (
          <line key={i}
            x1={60 + r1 * Math.sin(a)} y1={60 - r1 * Math.cos(a)}
            x2={60 + r2 * Math.sin(a)} y2={60 - r2 * Math.cos(a)}
            stroke={i % 6 === 0 ? 'rgba(201,255,87,0.6)' : 'rgba(255,255,255,0.15)'}
            strokeWidth={i % 6 === 0 ? 1.5 : 0.8}
          />
        );
      })}
      {/* Cardinal dots */}
      {[[60,27],[60,93],[27,60],[93,60]].map(([cx,cy],i) => (
        <circle key={i} className="compass-dot" cx={cx} cy={cy} r="2.5"
          fill={i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.3)'} />
      ))}
      {/* Needle */}
      <g className="compass-needle">
        <polygon points="60,34 63.5,60 60,65 56.5,60" fill="var(--accent)" opacity="0.9" />
        <polygon points="60,86 63.5,60 60,65 56.5,60" fill="rgba(255,255,255,0.25)" />
      </g>
      {/* Center cap */}
      <circle cx="60" cy="60" r="4" fill="var(--gray-800)" stroke="var(--accent)" strokeWidth="1.2" />
      <circle cx="60" cy="60" r="1.5" fill="var(--accent)" />
    </svg>
  );
});

/** 02 · Pen tool path — obsessive craft */
const CraftAnim = memo(function CraftAnim() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const path    = ref.current?.querySelector<SVGPathElement>('.craft-path');
    const cursor  = ref.current?.querySelector<SVGElement>('.craft-cursor');
    const dot1    = ref.current?.querySelector<SVGElement>('.craft-dot1');
    const dot2    = ref.current?.querySelector<SVGElement>('.craft-dot2');
    if (!path || !cursor) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    // Draw path in, pause, erase, repeat
    const loop = () => {
      const tl = gsap.timeline({ onComplete: () => gsap.delayedCall(0.4, loop) });
      tl.to(path, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' })
        .to(dot1, { scale: 1.4, duration: 0.3, yoyo: true, repeat: 1, ease: 'back.out(2)', transformOrigin: 'center' }, 0)
        .to(dot2, { scale: 1.4, duration: 0.3, yoyo: true, repeat: 1, ease: 'back.out(2)', transformOrigin: 'center' }, 1.1)
        .to(path, { strokeDashoffset: -len, duration: 1.4, ease: 'power2.in', delay: 0.5 })
        .set(path, { strokeDashoffset: len });
    };
    loop();

    // Cursor follows the path
    gsap.to(cursor, {
      motionPath: { path: '.craft-path', align: '.craft-path', alignOrigin: [0.5, 0.5], autoRotate: true },
      duration: 2.2, repeat: -1, repeatDelay: 1.9, ease: 'power2.inOut',
    });

    // Subtle glow pulse
    gsap.to(ref.current?.querySelector('.craft-glow') ?? {}, {
      opacity: 0.6, scale: 1.15, duration: 1.8,
      repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center',
    });
  }, { scope: ref });

  return (
    <svg ref={ref} viewBox="0 0 120 100" fill="none" style={{ width: 110, height: 90 }}>
      <defs>
        <radialGradient id="craftGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(201,255,87,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <ellipse className="craft-glow" cx="60" cy="50" rx="50" ry="40" fill="url(#craftGlow)" opacity="0.3" />
      {/* Grid dots */}
      {[20,40,60,80,100].flatMap(x => [20,40,60,80].map(y => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="0.8" fill="rgba(255,255,255,0.08)" />
      )))}
      {/* The drawing path */}
      <path className="craft-path"
        d="M18 72 C18 72 28 30 50 22 C72 14 88 42 98 58 C108 74 90 84 78 72 C66 60 72 44 60 38"
        stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"
      />
      {/* Anchor dots */}
      <circle className="craft-dot1" cx="18" cy="72" r="4" fill="rgba(201,255,87,0.8)" stroke="var(--gray-900)" strokeWidth="1.5" />
      <circle className="craft-dot2" cx="60" cy="38" r="4" fill="rgba(255,255,255,0.7)" stroke="var(--gray-900)" strokeWidth="1.5" />
      <circle cx="98" cy="58" r="4" fill="rgba(201,255,87,0.8)" stroke="var(--gray-900)" strokeWidth="1.5" />
      {/* Cursor triangle */}
      <g className="craft-cursor">
        <path d="M0 -6 L3.5 3 L0 1.5 L-3.5 3 Z" fill="var(--white)" opacity="0.9" />
      </g>
    </svg>
  );
});

/** 03 · Bar chart — results / growth */
const ResultsAnim = memo(function ResultsAnim() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const bars   = ref.current?.querySelectorAll<SVGRectElement>('.res-bar');
    const line   = ref.current?.querySelector<SVGPolylineElement>('.res-line');
    const lineDots = ref.current?.querySelectorAll<SVGCircleElement>('.res-ldot');
    if (!bars) return;

    const heights = [28, 42, 35, 56, 48, 68];
    const baseY   = 82;

    const animate = () => {
      bars.forEach((bar, i) => {
        const h = heights[i];
        gsap.set(bar, { attr: { y: baseY, height: 0 } });
        gsap.to(bar, {
          attr: { y: baseY - h, height: h },
          duration: 0.7, delay: i * 0.1,
          ease: 'power3.out',
        });
      });
      if (line && lineDots) {
        const pts = heights.map((h, i) => `${16 + i * 18},${baseY - h}`).join(' ');
        line.setAttribute('points', `16,${baseY} ` + pts + ` ${16 + (heights.length-1)*18},${baseY}`);
        const len = line.getTotalLength?.() ?? 200;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
        gsap.to(line, { strokeDashoffset: 0, duration: 1.4, delay: 0.6, ease: 'power2.out' });
        lineDots.forEach((d, i) => {
          gsap.fromTo(d, { scale: 0, opacity: 0 }, {
            scale: 1, opacity: 1, duration: 0.35, delay: 0.6 + i * 0.1,
            ease: 'back.out(2)', transformOrigin: 'center',
          });
        });
      }
    };

    animate();
    // Replay loop
    gsap.delayedCall(3.5, function loop() { animate(); gsap.delayedCall(3.5, loop); });
  }, { scope: ref });

  const heights = [28, 42, 35, 56, 48, 68];
  const baseY   = 82;

  return (
    <svg ref={ref} viewBox="0 0 120 100" fill="none" style={{ width: 110, height: 90 }}>
      {/* Horizontal grid lines */}
      {[20, 40, 60].map(y => (
        <line key={y} x1="10" y1={y} x2="110" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Baseline */}
      <line x1="10" y1={baseY} x2="110" y2={baseY} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      {/* Bars */}
      {heights.map((h, i) => (
        <rect
          key={i}
          className="res-bar"
          x={10 + i * 18}
          y={baseY}
          width="12"
          height="0"
          rx="2"
          fill={i === heights.length - 1 ? 'var(--accent)' : 'rgba(201,255,87,0.3)'}
        />
      ))}
      {/* Trend line */}
      <polyline className="res-line"
        stroke="rgba(201,255,87,0.7)" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* Dots on trend line */}
      {heights.map((h, i) => (
        <circle key={i} className="res-ldot"
          cx={16 + i * 18} cy={baseY - h} r="2.5"
          fill={i === heights.length - 1 ? 'var(--accent)' : 'rgba(201,255,87,0.7)'}
        />
      ))}
      {/* Top label */}
      <text x="108" y={baseY - heights[heights.length-1] - 5}
        fontFamily="'Space Mono', monospace" fontSize="7"
        fill="rgba(201,255,87,0.8)" textAnchor="end">+4×</text>
    </svg>
  );
});

/** 04 · Network nodes — custom systems */
const SystemsAnim = memo(function SystemsAnim() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(() => {
    const nodes  = ref.current?.querySelectorAll<SVGCircleElement>('.sys-node');
    const pulses = ref.current?.querySelectorAll<SVGCircleElement>('.sys-pulse');
    const packet = ref.current?.querySelector<SVGCircleElement>('.sys-packet');
    if (!nodes) return;

    // Nodes breathe at different rates
    nodes.forEach((n, i) => {
      gsap.to(n, {
        scale: 1.25, opacity: 0.9,
        duration: 1.2 + i * 0.3, repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: i * 0.25,
        transformOrigin: `${n.getAttribute('cx')}px ${n.getAttribute('cy')}px`,
      });
    });

    // Pulses expand out
    pulses?.forEach((p, i) => {
      gsap.set(p, { scale: 0, opacity: 0.8, transformOrigin: `${p.getAttribute('cx')}px ${p.getAttribute('cy')}px` });
      gsap.to(p, {
        scale: 2.5, opacity: 0,
        duration: 2, repeat: -1, delay: i * 0.7,
        ease: 'power2.out',
      });
    });

    // Packet travels between nodes
    if (packet) {
      const path = 'M60,50 L30,25 L60,10 L90,25 L60,50 L85,72 L60,88 L35,72 L60,50';
      gsap.to(packet, {
        motionPath: { path, align: 'self' },
        duration: 4, repeat: -1, ease: 'none',
      });
    }
  }, { scope: ref });

  const nodes = [
    { cx: 60, cy: 50, r: 6,   fill: 'var(--accent)' },          // center
    { cx: 30, cy: 25, r: 4.5, fill: 'rgba(255,255,255,0.5)' },  // top-left
    { cx: 90, cy: 25, r: 4.5, fill: 'rgba(201,255,87,0.6)' },   // top-right
    { cx: 60, cy: 10, r: 3.5, fill: 'rgba(255,255,255,0.35)' }, // top
    { cx: 35, cy: 72, r: 4,   fill: 'rgba(201,255,87,0.5)' },   // bottom-left
    { cx: 85, cy: 72, r: 4,   fill: 'rgba(255,255,255,0.4)' },  // bottom-right
    { cx: 60, cy: 88, r: 3.5, fill: 'rgba(201,255,87,0.5)' },   // bottom
  ];
  const edges = [
    [60,50,30,25],[60,50,90,25],[60,50,60,10],
    [60,50,35,72],[60,50,85,72],[60,50,60,88],
    [30,25,60,10],[90,25,60,10],[35,72,60,88],[85,72,60,88],
  ];

  return (
    <svg ref={ref} viewBox="0 0 120 100" fill="none" style={{ width: 110, height: 90 }}>
      {/* Edges */}
      {edges.map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      ))}
      {/* Pulse rings */}
      {nodes.slice(0,3).map((n, i) => (
        <circle key={i} className="sys-pulse" cx={n.cx} cy={n.cy} r={n.r + 4}
          fill="none" stroke="rgba(201,255,87,0.4)" strokeWidth="1" />
      ))}
      {/* Nodes */}
      {nodes.map((n, i) => (
        <circle key={i} className="sys-node"
          cx={n.cx} cy={n.cy} r={n.r} fill={n.fill} />
      ))}
      {/* Traveling packet */}
      <circle className="sys-packet" r="2.5" fill="var(--accent)" opacity="0.95" />
    </svg>
  );
});

/* ─────────────────────────────────────────────────────────────────
   Feature card
───────────────────────────────────────────────────────────────── */
const features = [
  {
    num: '01',
    title: 'Strategy before pixels.',
    body: 'Every project starts with the right questions. We discover who you are, who you\'re talking to, and what you want them to feel — then design from that foundation.',
    Icon: CompassAnim,
  },
  {
    num: '02',
    title: 'Craft at every level.',
    body: 'Typography, spacing, motion — every micro-decision earns its place. We obsess over the things most people never consciously notice but always feel.',
    Icon: CraftAnim,
  },
  {
    num: '03',
    title: 'Results, not just aesthetics.',
    body: 'Beautiful work that performs. We track what matters — conversions, rankings, revenue — and optimise relentlessly until your numbers move.',
    Icon: ResultsAnim,
  },
  {
    num: '04',
    title: 'Systems built to scale.',
    body: 'We build for where you\'re going, not just where you are. Design systems, technical architecture, and processes that hold up as your brand grows.',
    Icon: SystemsAnim,
  },
];

function FeatureCard({ f, index }: { f: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 60, autoAlpha: 0, duration: 0.85,
      delay: index * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: cardRef.current, start: 'top 86%', toggleActions: 'play none none none' },
    });
    const el = cardRef.current!;
    const enter = () => gsap.to(el, { y: -6, borderColor: 'rgba(201,255,87,0.35)', duration: 0.35, ease: 'power2.out' });
    const leave = () => gsap.to(el, { y: 0,  borderColor: 'var(--border)',           duration: 0.4,  ease: 'power2.out' });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mouseenter', enter); el.removeEventListener('mouseleave', leave); };
  }, { scope: cardRef });

  return (
    <div ref={cardRef} style={{
      padding: 'clamp(1.75rem, 3vw, 2.5rem)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      background: 'var(--gray-900)',
      display: 'flex', flexDirection: 'column', gap: '1.5rem',
      willChange: 'transform',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '0.16em', color: 'var(--accent)',
        }}>{f.num}</span>
        <div ref={iconRef}>{<f.Icon />}</div>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'clamp(1.35rem, 2.2vw, 1.85rem)',
        letterSpacing: '-0.02em', lineHeight: 1.1,
        color: 'var(--white)',
      }}>{f.title}</h3>
      <p className="body" style={{ color: 'var(--gray-400)', lineHeight: 1.75 }}>{f.body}</p>
    </div>
  );
}

export default function WhyFazedSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="section" style={{ background: 'var(--black)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ marginBottom: 'clamp(3rem, 5vw, 5rem)', maxWidth: '60ch' }}>
          <div className="label" style={{ marginBottom: '1.25rem' }}>Why Fazed</div>
          <AnimatedText
            text="The difference is in how we think."
            as="h2"
            className="display-md"
            style={{ marginBottom: '1.5rem' }}
          />
          <p className="body-lg" style={{ color: 'var(--gray-400)' }}>
            Any agency can make something that looks good. Few make something that
            works — strategically, technically, and commercially. Here's what sets us apart.
          </p>
        </div>

        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1.25rem' }}>
          {features.map((f, i) => <FeatureCard key={f.num} f={f} index={i} />)}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
