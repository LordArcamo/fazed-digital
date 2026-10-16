// CPU formation generators (§4.3). Every formation fills N slots of
//   data  = (x px, y px, layer, tone)   layer 0 = flat, 1..3 = mark plane (z = (layer-2)·uDepth)
//   alpha = 0..1, or negative = "dust" (alpha = -a · uDust)
// Coordinates are viewport CSS px, top-left origin, so formations line up with the DOM.

export interface Formation {
  id: string;
  n: number;
  data: Float32Array;
  alpha: Float32Array;
  size: number; // dot diameter in CSS px
  anchor: [number, number];
  visible: number; // count of points with alpha != 0 (they come first)
}
export interface View { w: number; h: number; pitch: number; originX: number }
type Pt = [number, number, number, number, number]; // x, y, layer, tone, alpha

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], seed = 7): T[] {
  const r = rng(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Lattice node centres for the viewport (shared by parking + the lattice formation). */
export function latticeNodes(v: View, margin = 1): [number, number][] {
  const p = v.pitch;
  const x0 = ((v.originX % p) + p) % p;
  const out: [number, number][] = [];
  for (let y = p / 2 - margin * p; y < v.h + margin * p; y += p)
    for (let x = x0 - margin * p; x < v.w + margin * p; x += p) out.push([x, y]);
  return out;
}

/** Pack visible points (shuffled, seed 7) then park the rest on lattice nodes at α 0. */
export function pack(id: string, pts: Pt[], n: number, v: View, size: number, anchor: [number, number], shuffleSeed: number | null = 7): Formation {
  const data = new Float32Array(n * 4);
  const alpha = new Float32Array(n);
  if (shuffleSeed !== null) shuffle(pts, shuffleSeed);
  const vis = Math.min(pts.length, n);
  for (let i = 0; i < vis; i++) {
    const p = pts[i];
    data.set([p[0], p[1], p[2], p[3]], i * 4);
    alpha[i] = p[4];
  }
  const nodes = latticeNodes(v, 0);
  const r = rng(11);
  for (let i = vis; i < n; i++) {
    const q = nodes[Math.floor(r() * nodes.length)] ?? [0, 0];
    data.set([q[0], q[1], 0, 0], i * 4);
    alpha[i] = 0;
  }
  return { id, n, data, alpha, size, anchor, visible: vis };
}

/* ── lattice ─────────────────────────────────────────────────────────────── */
export function lattice(v: View, n: number, opts: { lit?: (x: number, y: number, i: number) => number } = {}): Formation {
  const pts: Pt[] = latticeNodes(v, 0).map(([x, y], i) => [x, y, 0, opts.lit ? opts.lit(x, y, i) : 0, 1]);
  return pack('lattice', pts, n, v, 2, [v.w / 2, v.h / 2]);
}

/* ── mark (dots at a 4px pitch inside the 2-bit plane mask) ──────────────── */
export interface Mask { w: number; h: number; bits: Uint8Array }
export function parseMask(buf: ArrayBuffer): Mask {
  const b = new Uint8Array(buf);
  return { w: b[0] | (b[1] << 8), h: b[2] | (b[3] << 8), bits: b.subarray(4) };
}
export const maskAt = (m: Mask, u: number, v: number) => {
  const x = Math.min(m.w - 1, Math.max(0, Math.floor(u * m.w)));
  const y = Math.min(m.h - 1, Math.max(0, Math.floor(v * m.h)));
  const i = y * m.w + x;
  return (m.bits[i >> 2] >> ((i & 3) * 2)) & 3;
};

export const MARK_PITCH = 4;
export const MARK_DOT = 2.2;

/** rect = the poster mark box (getBoundingClientRect, viewport px). */
export function mark(rect: DOMRect | { left: number; top: number; width: number; height: number }, mask: Mask, n: number, v: View, dust = true): Formation {
  const pts: Pt[] = [];
  const P = MARK_PITCH;
  const marks: Pt[] = [];
  for (let y = rect.top + P / 2; y < rect.top + rect.height; y += P) {
    for (let x = rect.left + P / 2; x < rect.left + rect.width; x += P) {
      const plane = maskAt(mask, (x - rect.left) / rect.width, (y - rect.top) / rect.height);
      if (!plane) continue;
      marks.push([x, y, plane, 1, 1]);
    }
  }
  // "luma": brighter towards the top and the front plane; the top 30% are the lime-lit dots
  const luma = (p: Pt) => (1 - (p[1] - rect.top) / rect.height) * 0.7 + (p[2] / 3) * 0.3;
  const sorted = marks.map(luma).sort((a, b) => b - a);
  const thr = sorted[Math.floor(sorted.length * 0.3)] ?? 1;
  for (const p of shuffle(marks, 7)) { if (luma(p) >= thr) p[3] = 2; pts.push(p); }
  const markCount = pts.length;
  if (dust) {
    const r = rng(3);
    const dustN = Math.min(n - markCount, Math.round((v.w * v.h) / 900));
    for (let i = 0; i < dustN; i++) pts.push([r() * v.w, r() * v.h, 0, 1, -0.14]);
  }
  // the mark must come first so T3 (prefix) still draws the whole mark: shuffle only within groups
  const f = pack('mark', pts, n, v, MARK_DOT, [rect.left + rect.width / 2, rect.top + rect.height / 2], null);
  return f;
}

/* ── shot (case screenshot sampled into dots) ────────────────────────────── */
export interface Shot { cols: number; rows: number; luma: Uint8Array }
export function parseShot(buf: ArrayBuffer): Shot {
  const b = new Uint8Array(buf);
  return { cols: b[0], rows: b[2], luma: b.subarray(8) };
}
export function shot(id: string, rect: { left: number; top: number; width: number; height: number }, s: Shot, n: number, v: View, densify = 1): Formation {
  const pts: Pt[] = [];
  const pw = rect.width / s.cols, ph = rect.height / s.rows;
  // lime = exactly the top 6% by luma (rank-based, so white-background shots don't go all-lime);
  // ties broken by distance from the top edge (headers/CTAs light first)
  const order = Array.from(s.luma, (l, i) => i).sort((a, b) => s.luma[b] - s.luma[a] || a - b);
  const lit = new Uint8Array(s.luma.length);
  const litN = Math.floor(order.length * 0.06);
  for (let k = 0; k < litN; k++) if (s.luma[order[k]] > 40 && s.luma[order[k]] < 250) lit[order[k]] = 1;
  const r = rng(5);
  for (let j = 0; j < s.rows; j++) for (let i = 0; i < s.cols; i++) {
    const l = s.luma[j * s.cols + i];
    const tone = lit[j * s.cols + i] ? 2 : 0.08 + (l / 255) * 0.92;
    for (let k = 0; k < densify; k++) {
      const jx = k === 0 ? 0 : (r() - 0.5) * 0.9 * pw, jy = k === 0 ? 0 : (r() - 0.5) * 0.9 * ph;
      pts.push([rect.left + (i + 0.5) * pw + jx, rect.top + (j + 0.5) * ph + jy, 0, tone, 1]);
    }
  }
  const size = Math.max(1.4, Math.min(4, Math.min(pw, ph) * (densify > 1 ? 0.62 : 0.8)));
  return pack(id, pts, n, v, size, [rect.left + rect.width / 2, rect.top], 7);
}

/* ── helpers ─────────────────────────────────────────────────────────────── */
type P2 = { x: number; y: number };
const line = (out: Pt[], a: P2, b: P2, pitch: number, tone: number, alpha = 1) => {
  const len = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.floor(len / pitch));
  for (let i = 0; i <= n; i++) out.push([a.x + ((b.x - a.x) * i) / n, a.y + ((b.y - a.y) * i) / n, 0, tone, alpha]);
};
const cluster = (out: Pt[], c: P2, r: number, count: number, tone: number, seed: number) => {
  const rr = rng(seed);
  for (let i = 0; i < count; i++) {
    const a = rr() * Math.PI * 2, d = Math.sqrt(rr()) * r;
    out.push([c.x + Math.cos(a) * d, c.y + Math.sin(a) * d, 0, tone, 1]);
  }
};

/* ── glyphs (baked: 5 × stroke samples in a 280 box) ─────────────────────── */
export interface Glyphs { pts: { x: number; y: number; lit: number }[][] }
export function parseGlyphs(buf: ArrayBuffer): Glyphs {
  const dv = new DataView(buf);
  const counts = [0, 1, 2, 3, 4].map((i) => dv.getUint16(i * 2, true));
  let o = 10;
  const pts = counts.map((c) => {
    const arr = [];
    for (let k = 0; k < c; k++) { arr.push({ x: dv.getUint16(o, true), y: dv.getUint16(o + 2, true), lit: dv.getUint8(o + 4) }); o += 5; }
    return arr;
  });
  return { pts };
}
export const SERVICE_IDS = ['web', 'brand', 'seo', 'product', 'systems'];

/* ── pentagon: 5 nodes + edges + spokes; the active node becomes its glyph ── */
export function pentagon(c: P2, r: number, n: number, v: View, active = -1, glyphs?: Glyphs, glyphSize = 220): Formation {
  const pts: Pt[] = [];
  const nodes = [0, 1, 2, 3, 4].map((k) => {
    const a = (-90 + k * 72) * (Math.PI / 180);
    return { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r };
  });
  for (let k = 0; k < 5; k++) {
    line(pts, nodes[k], nodes[(k + 1) % 5], 6, 0.7);
    line(pts, c, nodes[k], 6, 0.35, 0.8);
  }
  cluster(pts, c, 6, 30, 1.6, 9);
  nodes.forEach((p, k) => {
    if (k === active && glyphs) {
      const g = glyphs.pts[k], s = glyphSize / 280;
      for (const q of g) pts.push([p.x + (q.x - 140) * s, p.y + (q.y - 140) * s, 0, q.lit ? 2 : 1, 1]);
    } else cluster(pts, p, k === active ? 14 : 9, 40, k === active ? 2 : 1, 20 + k);
  });
  return pack('pentagon', pts, n, v, 2.2, [c.x, c.y]);
}

/* ── globe: fibonacci sphere, land from the baked bitmask, z via layer ──── */
export const GLOBE_N = 20480;
export function fib(i: number, lon0 = 160) {
  const ga = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (GLOBE_N - 1)) * 2;
  const lat = Math.asin(y) * 180 / Math.PI;
  let lon = ((i * ga * 180) / Math.PI) % 360;
  if (lon > 180) lon -= 360;
  return { lat, lon };
}
export function project(lat: number, lon: number, R: number, lon0 = 160) {
  const p = lat * Math.PI / 180, l = (lon - lon0) * Math.PI / 180;
  return { x: R * Math.cos(p) * Math.sin(l), y: -R * Math.sin(p), z: R * Math.cos(p) * Math.cos(l) };
}
export function globe(c: P2, R: number, land: Uint8Array, n: number, v: View, nodes: [number, number][] = []): Formation {
  const pts: Pt[] = [];
  for (let i = 0; i < GLOBE_N; i++) {
    const isLand = (land[i >> 3] >> (i & 7)) & 1;
    if (!isLand && i % 4) continue; // thin the ocean
    const { lat, lon } = fib(i);
    const q = project(lat, lon, R);
    pts.push([c.x + q.x, c.y + q.y, 2 + q.z / R, isLand ? 1.15 : 0.12, isLand ? 1 : 0.3]);
  }
  // lit client nodes (and Iligan) sit just above the surface
  const rr = rng(88);
  nodes.forEach(([lat, lon], k) => {
    for (let j = 0; j < (k === 0 ? 90 : 50); j++) {
      const q = project(lat + (rr() - 0.5) * 2.2, lon + (rr() - 0.5) * 2.2, R * 1.01);
      pts.push([c.x + q.x, c.y + q.y, 2 + q.z / R, 2, 1]);
    }
  });
  return pack('globe', pts, n, v, isFinite(R) && R < 260 ? 1.8 : 2.1, [c.x, c.y]);
}

/* ── rings: 3 concentric circles in a plane tilted 62°, + 4 person nodes ── */
export function rings(c: P2, vmin: number, n: number, v: View, people = 4, activeP = -1): Formation {
  const pts: Pt[] = [];
  const radii = [0.18, 0.28, 0.4].map((k) => k * vmin);
  const tilt = 62 * Math.PI / 180, Rmax = radii[2];
  radii.forEach((r, ri) => {
    const count = Math.round((2 * Math.PI * r) / 5);
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const x = Math.cos(t) * r, y0 = Math.sin(t) * r;
      pts.push([c.x + x, c.y + y0 * Math.cos(tilt), 2 + (y0 * Math.sin(tilt)) / Rmax, 0.55 + ri * 0.1, 1]);
    }
  });
  for (let p = 0; p < people; p++) {
    const r = radii[p % 3 === 0 ? 2 : p % 3], t = (p / people) * Math.PI * 2 + 0.6;
    const x = Math.cos(t) * r, y0 = Math.sin(t) * r;
    const rr = rng(40 + p), lit = p === activeP;
    for (let k = 0; k < (lit ? 120 : 36); k++) {
      const a = rr() * Math.PI * 2, d = Math.sqrt(rr()) * (lit ? 16 : 7);
      pts.push([c.x + x + Math.cos(a) * d, c.y + y0 * Math.cos(tilt) + Math.sin(a) * d, 2 + (y0 * Math.sin(tilt)) / Rmax, lit ? 2 : 1.4, 1]);
    }
  }
  cluster(pts, c, 5, 24, 2, 77);
  return pack('rings', pts, n, v, 2.1, [c.x, c.y]);
}

/* ── node: everything collapses into one 18px lime node + 3 signal rings ── */
export function node(c: P2, n: number, v: View): Formation {
  const pts: Pt[] = [];
  cluster(pts, c, 9, 420, 2, 5);
  [40, 80, 120].forEach((r, i) => {
    const count = Math.round((2 * Math.PI * r) / 4);
    for (let k = 0; k < count; k++) {
      const t = (k / count) * Math.PI * 2;
      pts.push([c.x + Math.cos(t) * r, c.y + Math.sin(t) * r, 0, 1.2 - i * 0.25, 0.7 - i * 0.18]);
    }
  });
  return pack('node', pts, n, v, 2, [c.x, c.y]);
}

/* ── path4: 4 nodes on one cubic path ───────────────────────────────────── */
export function path4(rect: { left: number; top: number; width: number; height: number }, n: number, v: View, vertical = false, lit = 4): Formation {
  const pts: Pt[] = [];
  const P = vertical
    ? [{ x: rect.left + rect.width * 0.12, y: rect.top }, { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.33 }, { x: rect.left - rect.width * 0.2, y: rect.top + rect.height * 0.66 }, { x: rect.left + rect.width * 0.12, y: rect.top + rect.height }]
    : [{ x: rect.left, y: rect.top + rect.height * 0.7 }, { x: rect.left + rect.width * 0.33, y: rect.top - rect.height * 0.2 }, { x: rect.left + rect.width * 0.66, y: rect.top + rect.height * 1.2 }, { x: rect.left + rect.width, y: rect.top + rect.height * 0.3 }];
  const bez = (t: number) => {
    const u = 1 - t;
    return {
      x: u * u * u * P[0].x + 3 * u * u * t * P[1].x + 3 * u * t * t * P[2].x + t * t * t * P[3].x,
      y: u * u * u * P[0].y + 3 * u * u * t * P[1].y + 3 * u * t * t * P[2].y + t * t * t * P[3].y,
    };
  };
  const N = 900;
  for (let i = 0; i <= N; i++) { const q = bez(i / N); pts.push([q.x, q.y, 0, 0.9, 1]); }
  [0, 1 / 3, 2 / 3, 1].forEach((t, k) => cluster(pts, bez(t), k < lit ? 12 : 8, 60, k < lit ? 2 : 1, 60 + k));
  return pack('path4', pts, n, v, 2.2, [P[0].x, P[0].y]);
}

/* ── wordmark: "FAZED" mask (baked) fitted into a rect at a 5px pitch ───── */
export function parseWordmark(buf: ArrayBuffer) {
  const b = new Uint8Array(buf);
  return { w: b[0] | (b[1] << 8), h: b[2] | (b[3] << 8), bits: b.subarray(4) };
}
export function wordmark(rect: { left: number; top: number; width: number; height: number }, m: { w: number; h: number; bits: Uint8Array }, n: number, v: View): Formation {
  const pts: Pt[] = [];
  const pitch = Math.max(4, Math.round(rect.width / 240));
  const h = rect.width * (m.h / m.w), top = rect.top + (rect.height - h) / 2;
  for (let y = top + pitch / 2; y < top + h; y += pitch) for (let x = rect.left + pitch / 2; x < rect.left + rect.width; x += pitch) {
    const u = Math.floor(((x - rect.left) / rect.width) * m.w), vv = Math.floor(((y - top) / h) * m.h);
    const i = vv * m.w + u;
    if ((m.bits[i >> 3] >> (i & 7)) & 1) pts.push([x, y, 0, 0.45, 1]);
  }
  return pack('wordmark', pts, n, v, Math.min(3, pitch * 0.55), [rect.left + rect.width / 2, rect.top + rect.height / 2]);
}

/* ── scatter (404) ───────────────────────────────────────────────────────── */
export function scatter(n: number, v: View, count = 2400): Formation {
  const r = rng(404), pts: Pt[] = [];
  for (let i = 0; i < count; i++) pts.push([r() * v.w, r() * v.h, 0, 0.3 + r() * 0.8, 0.8]);
  return pack('scatter', pts, n, v, 2, [v.w / 2, v.h / 2]);
}

/* ── days7: 7 nodes on one line (the 7-day timeline); `lit` = how many days are lit ── */
export function days7(rect: { left: number; top: number; width: number; height: number }, n: number, v: View, lit = 7, y?: number): Formation {
  const pts: Pt[] = [];
  const cy = y ?? rect.top + 5, x0 = rect.left + 5, x1 = rect.left + rect.width - rect.width / 7 + 5;
  line(pts, { x: x0, y: cy }, { x: x1, y: cy }, 5, 0.5, 0.8);
  for (let d = 0; d < 7; d++) {
    const x = x0 + ((x1 - x0) * d) / 6;
    const on = lit < 0 ? d === 6 : d < lit; // lit < 0 → only Day 7 (hero)
    cluster(pts, { x, y: cy }, on ? (d === 6 ? 9 : 6) : 5, d === 6 ? 90 : 40, on ? 2 : 1, 70 + d);
  }
  return pack('days7', pts, n, v, 2.2, [x0, cy]);
}
