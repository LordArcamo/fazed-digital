// Menu dot field (lazy chunk, loaded on the first menu open). One 2D canvas:
// ambient #2A2A2A dots on the 24px grid fade in as a radial wave from the Menu button,
// and the hovered/focused label is sampled (Clash 600) into lime dots that travel from their
// previous positions. Desktop: right-aligned, ≤50% of the viewport wide. <1024: vertical spine.
type P = { x: number; y: number; ox: number; oy: number };
let cv: HTMLCanvasElement | null = null, ctx: CanvasRenderingContext2D | null = null;
let W = 0, H = 0, dpr = 1, raf = 0, rm = false;
let tNow = 0, mx = 0, my = 0, tOpen = 0, tWord = 0, cur = '', pts: P[] = [];
let grid: Float32Array = new Float32Array(0);
let lime = '#C9FF57', dim = '#2A2A2A';
const off = document.createElement('canvas');
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const mobile = () => W < 1024;

function setup() {
  if (!cv) return;
  W = cv.clientWidth; H = cv.clientHeight; dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  ctx = cv.getContext('2d');
  const g: number[] = [];
  for (let y = 12; y < H; y += 24) for (let x = 12; x < W; x += 24) g.push(x, y, Math.min(400, Math.hypot(x - mx, y - my) * 0.4));
  grid = new Float32Array(g);
}

function sample(word: string): { x: number; y: number }[] {
  const m = mobile(), pitch = m ? 6 : 12;
  const c = off.getContext('2d', { willReadFrequently: true })!;
  const fam = '600 200px "Clash Display", "Clash Fallback", sans-serif';
  c.font = fam;
  const tw = Math.max(1, c.measureText(word).width);
  // target box: desktop ≤50% vw wide and ≤40% vh tall; mobile spine ≤130px thick, ≤70% vh long
  const maxL = m ? H * 0.62 : W * 0.5, maxT = m ? Math.min(130, W * 0.2) : H * 0.4;
  const s = Math.min(maxL / tw, maxT / 200);
  const fs = 200 * s, L = Math.ceil(tw * s), T = Math.ceil(fs * 1.2);
  off.width = Math.ceil(L / pitch) + 2; off.height = Math.ceil(T / pitch) + 2;
  c.clearRect(0, 0, off.width, off.height);
  c.font = `600 ${fs / pitch}px "Clash Display", "Clash Fallback", sans-serif`;
  c.textBaseline = 'alphabetic';
  c.fillStyle = '#fff';
  c.fillText(word, 1, 1 + (fs * 0.95) / pitch);
  const d = c.getImageData(0, 0, off.width, off.height).data;
  const out: { x: number; y: number }[] = [];
  const snap = (v: number) => Math.round(v / pitch) * pitch;
  const ox = m ? snap(W - 14) : snap(W - 90 - L), oy = m ? snap((H - L) / 2) : snap((H - T) / 2);
  for (let gy = 0; gy < off.height; gy++) for (let gx = 0; gx < off.width; gx++) {
    if (d[(gy * off.width + gx) * 4 + 3] < 110) continue;
    // mobile: rotate 90° clockwise, the cap line faces the right edge
    if (m) out.push({ x: ox - gy * pitch, y: oy + gx * pitch });
    else out.push({ x: ox + gx * pitch, y: oy + gy * pitch });
  }
  return out;
}

export function word(w: string) {
  if (!cv || !w || w === cur) return;
  cur = w;
  const next = sample(w);
  tNow = performance.now();
  const old = pts.map(lerpPos);
  const key = (a: { x: number; y: number }) => (mobile() ? a.y * 4 + a.x * 0.01 : a.x * 4 + a.y * 0.01);
  old.sort((a, b) => key(a) - key(b));
  next.sort((a, b) => key(a) - key(b));
  pts = next.map((p, i) => {
    const o = old.length ? old[Math.floor((i * old.length) / next.length)] : { x: mx, y: my };
    return { x: p.x, y: p.y, ox: o.x, oy: o.y };
  });
  tWord = performance.now();
  kick();
}
function lerpPos(p: P) {
  const k = rm ? 1 : ease(Math.min(1, (tNow - tWord) / 420));
  return { x: p.ox + (p.x - p.ox) * k, y: p.oy + (p.y - p.oy) * k };
}

function frame(now: number) {
  raf = 0;
  if (!ctx) return;
  tNow = now;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const tw = rm ? 1e9 : now - tOpen;
  ctx.fillStyle = dim;
  for (let i = 0; i < grid.length; i += 3) {
    const a = Math.max(0, Math.min(1, (tw - grid[i + 2]) / 300));
    if (a <= 0) continue;
    ctx.globalAlpha = a;
    ctx.fillRect(grid[i] - 1, grid[i + 1] - 1, 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = lime;
  const r = mobile() ? 1.8 : 2.8;
  ctx.beginPath();
  for (const p of pts) { const q = lerpPos(p); ctx.moveTo(q.x + r, q.y); ctx.arc(q.x, q.y, r, 0, Math.PI * 2); }
  ctx.fill();
  if (tw < 720 || now - tWord < 440) kick();
}
const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

let onResize: (() => void) | null = null;
export function open(menu: HTMLElement, reduce: boolean) {
  rm = reduce;
  cv = menu.querySelector<HTMLCanvasElement>('.menu-cv');
  if (!cv) return;
  const cs = getComputedStyle(document.documentElement);
  lime = cs.getPropertyValue('--lime').trim() || lime;
  dim = cs.getPropertyValue('--gray-700').trim() || dim;
  mx = parseFloat(menu.style.getPropertyValue('--mx')) || innerWidth;
  my = parseFloat(menu.style.getPropertyValue('--my')) || 0;
  setup();
  tOpen = performance.now() + (rm ? 0 : 250);
  pts = []; cur = '';
  const w = menu.dataset.word || 'Fazed';
  document.fonts.load('600 100px "Clash Display"').finally(() => word(w));
  kick();
  onResize = () => { const c = cur; setup(); cur = ''; pts = []; if (c) word(c); kick(); };
  addEventListener('resize', onResize, { passive: true });
}
export function close(now = false) {
  if (onResize) removeEventListener('resize', onResize);
  onResize = null;
  const done = () => { cancelAnimationFrame(raf); raf = 0; ctx?.clearRect(0, 0, W * 2, H * 2); pts = []; cur = ''; cv = null; ctx = null; };
  if (now) done(); else setTimeout(done, 380);
}
