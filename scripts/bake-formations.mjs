/**
 * bake-formations.mjs
 * Bakes the formation data the dot field fetches at runtime into public/formations/.
 *
 *  mark-mask.bin   2-bit mask of the 3 isometric planes (192×277), 0 = empty, 1..3 = plane
 *  shot-NN.bin     case screenshots: 16:10 top crop sampled on a 181×113 grid (20,453 pts)
 *                  layout: header (8 B) + cols*rows u8 luma
 *  glyphs.bin      the 5 service glyphs stroke-sampled every 3px in a 280×280 box
 *  globe.bin       land bitmask over a 20,480-point fibonacci sphere (1 bit per index)
 *  wordmark.bin    "FAZED" rasterised with Clash Display 700, 2-bit-ish 1-bit mask
 *
 * Every bin is deterministic. Skips work when the inputs are older than the outputs.
 */
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MARK_PATHS, MARK_TRANSFORM, MARK_VIEWBOX } from './lib/mark.mjs';
import { GLYPHS } from './lib/glyphs.mjs';
import { LAND } from './lib/land.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/formations');
mkdirSync(OUT, { recursive: true });

await initWasm(readFileSync(join(ROOT, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')));

const render = (svg, opts = {}) => {
  const r = new Resvg(svg, { fitTo: { mode: 'original' }, background: 'rgba(0,0,0,0)', ...opts });
  const img = r.render();
  return { w: img.width, h: img.height, px: img.pixels };
};

const stale = (out, ...ins) => {
  if (process.env.FORCE_BAKE) return true;
  if (!existsSync(out)) return true;
  const t = statSync(out).mtimeMs;
  return ins.some((i) => existsSync(i) && statSync(i).mtimeMs > t);
};
const me = fileURLToPath(import.meta.url);
const log = (...a) => console.log('[bake]', ...a);

/* ── 1. mark mask ─────────────────────────────────────────────────────────── */
{
  const out = join(OUT, 'mark-mask.bin');
  if (stale(out, me, join(ROOT, 'scripts/lib/mark.mjs'))) {
    const W = 192, H = 277;
    const [vx, vy, vw, vh] = MARK_VIEWBOX;
    const planes = MARK_PATHS.map((d) => {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${vx} ${vy} ${vw} ${vh}"><g transform="${MARK_TRANSFORM}"><path fill="#fff" d="${d}"/></g></svg>`;
      return render(svg);
    });
    const bytes = new Uint8Array(4 + Math.ceil((W * H) / 4));
    bytes[0] = W & 255; bytes[1] = W >> 8; bytes[2] = H & 255; bytes[3] = H >> 8;
    let count = 0;
    for (let i = 0; i < W * H; i++) {
      let v = 0;
      for (let p = 0; p < 3; p++) if (planes[p].px[i * 4 + 3] > 127) v = p + 1;
      if (v) count++;
      bytes[4 + (i >> 2)] |= v << ((i & 3) * 2);
    }
    writeFileSync(out, bytes);
    log('mark-mask.bin', bytes.length, 'B, filled', count);
  }
}

/* ── 2. screenshots ───────────────────────────────────────────────────────── */
const SHOTS = {
  '01': 'work-aframing.jpg', '02': 'work-cleen.jpg', '03': 'work-crate.jpg', '04': 'work-telecom.jpg',
  '05': 'work-canwell.jpg', '06': 'work-8drive.jpg', '07': 'work-uglq.jpg', '08': 'work-qldlaw.jpg',
};
export const SHOT_COLS = 181, SHOT_ROWS = 113;
for (const [id, file] of Object.entries(SHOTS)) {
  const src = join(ROOT, 'public/images', file);
  const out = join(OUT, `shot-${id}.bin`);
  if (!existsSync(src) || !stale(out, src, me)) continue;
  const meta = await sharp(src).metadata();
  const cropH = Math.round(meta.width / 1.6);
  const { data } = await sharp(src)
    .extract({ left: 0, top: 0, width: meta.width, height: Math.min(cropH, meta.height) })
    .resize(SHOT_COLS, SHOT_ROWS, { fit: 'fill', kernel: 'lanczos3' })
    .greyscale().raw().toBuffer({ resolveWithObject: true });
  const bytes = new Uint8Array(8 + SHOT_COLS * SHOT_ROWS);
  bytes[0] = SHOT_COLS; bytes[1] = 0; bytes[2] = SHOT_ROWS; bytes[3] = 0;
  bytes.set(data, 8);
  writeFileSync(out, bytes);
  log(`shot-${id}.bin`, bytes.length, 'B');
}

/* ── 3. service glyphs: stroke-sampled points in a 280-unit box ───────────── */
{
  const out = join(OUT, 'glyphs.bin');
  if (stale(out, me, join(ROOT, 'scripts/lib/glyphs.mjs'))) {
    // Rasterise each glyph's strokes at 1px/unit, then keep a 3px-pitch subsample of
    // the stroke pixels (a cheap, even "stroke sampled every 3px").
    const S = 280, P = 3;
    const parts = [];
    for (const g of GLYPHS) {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${g.box} ${g.box}">${g.svg}</svg>`;
      const { px } = render(svg);
      const pts = [];
      for (let y = 1; y < S; y += P) for (let x = 1; x < S; x += P) {
        if (px[(y * S + x) * 4 + 3] > 110) pts.push(x, y, px[(y * S + x) * 4 + 1] > 200 && px[(y * S + x) * 4] < 230 ? 1 : 0);
      }
      parts.push(pts);
    }
    // layout: u16 count per glyph ×5, then per point u16 x, u16 y, u8 lit (padded to 6 B)
    const total = parts.reduce((a, p) => a + p.length / 3, 0);
    const buf = Buffer.alloc(10 + total * 5);
    let o = 10;
    parts.forEach((p, i) => {
      buf.writeUInt16LE(p.length / 3, i * 2);
      for (let k = 0; k < p.length; k += 3) { buf.writeUInt16LE(p[k], o); buf.writeUInt16LE(p[k + 1], o + 2); buf[o + 4] = p[k + 2]; o += 5; }
    });
    writeFileSync(out, buf);
    log('glyphs.bin', buf.length, 'B', parts.map((p) => p.length / 3).join('/'));
  }
}

/* ── 4. globe: fibonacci sphere masked by land ─────────────────────────────── */
{
  const out = join(OUT, 'globe.bin');
  if (stale(out, me, join(ROOT, 'scripts/lib/land.mjs'))) {
    const N = 20480;
    const inside = (lon, lat) => {
      // point-in-polygon over the simplified land rings
      for (const ring of LAND) {
        let c = false;
        for (let i = 0, j = ring.length - 2; i < ring.length; j = i, i += 2) {
          const xi = ring[i], yi = ring[i + 1], xj = ring[j], yj = ring[j + 1];
          if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-9) + xi) c = !c;
        }
        if (c) return true;
      }
      return false;
    };
    const pts = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const lat = (Math.asin(y) * 180) / Math.PI;
      let lon = ((i * ga * 180) / Math.PI) % 360;
      if (lon > 180) lon -= 360;
      pts.push(lon, lat, inside(lon, lat) ? 1 : 0);
    }
    // 1 bit per fibonacci index: the positions are regenerated at runtime (same formula)
    const buf = Buffer.alloc(N / 8);
    for (let i = 0; i < N; i++) if (pts[i * 3 + 2]) buf[i >> 3] |= 1 << (i & 7);
    writeFileSync(out, buf);
    log('globe.bin', buf.length, 'B, land', pts.filter((_, i) => i % 3 === 2).reduce((a, b) => a + b, 0));
  }
}

/* ── 5. wordmark: "FAZED" in Clash Display 700 ───────────────────────────── */
{
  const out = join(OUT, 'wordmark.bin');
  const font = join(ROOT, 'public/fonts/clash/ClashDisplay-Bold.woff2');
  const fontTtf = join(ROOT, 'scripts/.cache/ClashDisplay-Bold.ttf');
  if (stale(out, me, font) && existsSync(fontTtf)) {
    const W = 600, H = 132;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><text x="${W / 2}" y="${H * 0.86}" text-anchor="middle" font-family="Clash Display" font-weight="700" font-size="${H * 1.12}" letter-spacing="-4" fill="#fff">FAZED</text></svg>`;
    const r = new Resvg(svg, { font: { fontBuffers: [readFileSync(fontTtf)], defaultFontFamily: 'Clash Display', loadSystemFonts: false }, background: 'rgba(0,0,0,0)' });
    const { pixels } = r.render();
    const bytes = new Uint8Array(4 + Math.ceil((W * H) / 8));
    bytes[0] = W & 255; bytes[1] = W >> 8; bytes[2] = H & 255; bytes[3] = H >> 8;
    let n = 0;
    for (let i = 0; i < W * H; i++) if (pixels[i * 4 + 3] > 127) { bytes[4 + (i >> 3)] |= 1 << (i & 7); n++; }
    writeFileSync(out, bytes);
    log('wordmark.bin', bytes.length, 'B, filled', n);
  } else if (!existsSync(fontTtf)) {
    log('wordmark: no TTF in scripts/.cache, keeping the committed wordmark.bin');
  }
}
