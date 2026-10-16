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
  const sorted = Array.from(s.luma).sort((a, b) => b - a);
  const thr = sorted[Math.floor(sorted.length * 0.06)] ?? 255;
  const r = rng(5);
  for (let j = 0; j < s.rows; j++) for (let i = 0; i < s.cols; i++) {
    const l = s.luma[j * s.cols + i];
    const tone = l >= thr && l > 40 ? 2 : 0.08 + (l / 255) * 0.92;
    for (let k = 0; k < densify; k++) {
      const jx = k === 0 ? 0 : (r() - 0.5) * 0.9 * pw, jy = k === 0 ? 0 : (r() - 0.5) * 0.9 * ph;
      pts.push([rect.left + (i + 0.5) * pw + jx, rect.top + (j + 0.5) * ph + jy, 0, tone, 1]);
    }
  }
  const size = Math.max(1.4, Math.min(4, Math.min(pw, ph) * (densify > 1 ? 0.62 : 0.8)));
  return pack(id, pts, n, v, size, [rect.left + rect.width / 2, rect.top], 7);
}
