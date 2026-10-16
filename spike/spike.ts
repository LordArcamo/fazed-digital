import { readFlags } from '../src/boot/flags';
import { gate } from '../src/boot/gpu';
import { TIERS } from '../src/field/tiers';
import { lattice, mark, parseMask, parseShot, shot, type View } from '../src/field/formations';
import { MARK_PATHS, MARK_TRANSFORM, MARK_VIEWBOX } from '../scripts/lib/mark.mjs';

const R: any = (window as any).__spike = { stage: 'boot', errors: [] as string[] };
addEventListener('error', (e) => R.errors.push(String(e.message)));
addEventListener('unhandledrejection', (e: any) => R.errors.push(String(e.reason?.message || e.reason)));
const hud = document.getElementById('hud')!;
const say = (s: string) => { hud.textContent += s + '\n'; };

// poster clip paths (objectBoundingBox units)
const [vx, vy, vw, vh] = MARK_VIEWBOX;
document.getElementById('mkpaths')!.innerHTML = MARK_PATHS.map((d) =>
  `<path transform="scale(${1 / vw} ${1 / vh}) translate(${-vx} ${-vy}) ${MARK_TRANSFORM}" d="${d}"/>`).join('');

const q = new URLSearchParams(location.search);
const flags = readFlags();
const g = await gate(flags);
R.gate = g;
say(`gate ${g.tier} ${g.backend} ${g.reason} ${g.renderer.slice(0, 60)}`);
if (g.tier === 't0') { R.stage = 'poster'; throw 0; }

const backend = q.get('backend') === 'webgl' ? 'webgl2' : g.backend!;
const spec = { ...TIERS[(q.get('tier') as 't1') || (g.tier as 't1')] };
if (q.get('nocompute')) spec.compute = false;
const tLoad = performance.now();
const { createField } = await import('../src/field/field');
R.chunkMs = performance.now() - tLoad;
const canvas = document.getElementById('c') as HTMLCanvasElement;
const field = await createField(canvas, backend as any, spec);
R.backend = field.backend;
R.timings = field.timings;
const v: View = { w: innerWidth, h: innerHeight, pitch: 24, originX: 64 };
const mask = parseMask(await (await fetch('/formations/mark-mask.bin')).arrayBuffer());
const shotData = parseShot(await (await fetch('/formations/shot-04.bin')).arrayBuffer());
const markF = mark(document.getElementById('markbox')!.getBoundingClientRect(), mask, field.n, v);
const latF = lattice(v, field.n);
const shotF = shot('shot-04', document.getElementById('shotbox')!.getBoundingClientRect(), shotData, field.n, v, spec.densify);
R.counts = { mark: markF.visible, lattice: latF.visible, shot: shotF.visible, n: field.n };

field.set(markF);
field.u.uLitGain.value = 0; field.u.uDust.value = 0; field.u.uCurl.value = 0;
const tf = performance.now();
field.render();
await new Promise((r) => requestAnimationFrame(r));
requestAnimationFrame(() => {
  document.documentElement.classList.add('gl-live');
  R.firstFrameMs = performance.now() - tf + field.timings.compile + field.timings.init;
  R.stage = 'live';
  say(`backend ${field.backend} n ${field.n} init ${field.timings.init.toFixed(0)}ms compile ${field.timings.compile.toFixed(0)}ms chunk ${R.chunkMs.toFixed(0)}ms`);
});

if (q.has('still')) { R.stage = 'still'; } else {
  // run loop + fps sampling
  let last = performance.now(), start = last;
  const frames: number[] = [];
  let phase = 0;
  const seq = [latF, shotF, markF];
  addEventListener('pointermove', (e) => field.cursor(e.clientX, e.clientY, true));
  const loop = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const t = (now - start) / 1000;
    frames.push(now);
    // wake (§1): dust, lime, depth, then a morph cycle every 2.5s
    field.u.uDust.value = Math.min(1, Math.max(0, (t - 0.3) / 0.8));
    field.u.uLitGain.value = Math.min(1, Math.max(0, (t - 0.3) / 0.8));
    field.u.uCurl.value = 4 * Math.min(1, t);
    const dp = Math.min(1, Math.max(0, (t - 0.3) / 1.2));
    field.u.uDepth.value = 40 * (1 - Math.pow(2, -10 * dp)) * (1 + 0.08 * Math.sin(t * Math.PI / 3));
    if (q.has('auto')) {
      const p = Math.floor((t - 1.5) / 2.5);
      if (p >= 0 && p !== phase - 1 && p >= phase) { field.target(seq[p % 3]); phase = p + 1; }
      field.u.uMorph.value = Math.min(1, field.u.uMorph.value + dt / 1.1);
    }
    // scripted cursor figure-8 around the mark
    if (q.has('cursor')) {
      const b = document.getElementById('markbox')!.getBoundingClientRect();
      field.cursor(b.left + b.width / 2 + Math.sin(t * 1.3) * b.width * 0.45, b.top + b.height / 2 + Math.sin(t * 2.6) * b.height * 0.25, true);
    }
    field.tick(dt, t);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  R.fps = () => {
    const now = performance.now();
    const recent = frames.filter((f) => f > now - 4000);
    const d = recent.slice(1).map((f, i) => f - recent[i]).sort((a, b) => a - b);
    return { fps: recent.length / 4, median: d[d.length >> 1], p95: d[Math.floor(d.length * 0.95)] };
  };
}
