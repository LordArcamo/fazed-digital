/**
 * generate-og.mjs — 1200×630 OG images in the dot-field style (satori + resvg-wasm).
 *   public/og/{home,about,services,work,contact,blog,lp-7day,lp-7day-ph}.png
 *   public/og/work/NN.png      one per case
 *   public/og/blog/<slug>.png  one per post (from src/data/.generated/posts.json)
 * Fonts are read from scripts/fonts (unmodified kit/OFL files), so the Vercel build is offline-safe.
 * Skips images newer than this script + their inputs unless FORCE_OG=1.
 */
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { MARK_PATHS, MARK_TRANSFORM } from './lib/mark.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/og');
mkdirSync(join(OUT, 'work'), { recursive: true });
mkdirSync(join(OUT, 'blog'), { recursive: true });
await initWasm(readFileSync(join(ROOT, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')));
const fonts = [
  { name: 'Clash', data: readFileSync(join(ROOT, 'scripts/fonts/ClashDisplay-Semibold.woff')), weight: 600, style: 'normal' },
  { name: 'Mono', data: readFileSync(join(ROOT, 'scripts/fonts/space-mono-latin-400-normal.woff')), weight: 400, style: 'normal' },
];
const me = fileURLToPath(import.meta.url);
const fresh = (out, ...ins) => !process.env.FORCE_OG && existsSync(out) && ins.every((i) => !existsSync(i) || statSync(i).mtimeMs < statSync(out).mtimeMs);

const h = (type, style, children) => ({ type, props: { style, children } });
const markSvg = (size, color) => ({
  type: 'svg',
  props: { viewBox: '372 205 755 1089', width: size * 0.693, height: size, children: [{ type: 'g', props: { transform: MARK_TRANSFORM, fill: color, children: MARK_PATHS.map((d) => ({ type: 'path', props: { d } })) } }] },
});

// the /lab contact sheet glyph: 5×2 dotted frames, 01–04 filled, the lime research node in 05
function sheetSvg(shipped) {
  const ch = [], nums = [], W = 92, H = 59, G = 14;
  for (let k = 0; k < 10; k++) {
    const x = (k % 5) * (W + G), y = Math.floor(k / 5) * (H + 34);
    const tone = k < shipped ? '#BCBCBC' : '#2A2A2A';
    for (let i = 3; i < W; i += 6) { ch.push({ type: 'circle', props: { cx: x + i, cy: y + 3, r: 1.2, fill: tone } }); ch.push({ type: 'circle', props: { cx: x + i, cy: y + H - 3, r: 1.2, fill: tone } }); }
    for (let j = 9; j < H - 3; j += 6) { ch.push({ type: 'circle', props: { cx: x + 3, cy: y + j, r: 1.2, fill: tone } }); ch.push({ type: 'circle', props: { cx: x + W - 3, cy: y + j, r: 1.2, fill: tone } }); }
    if (k < shipped) for (let j = 12; j < H - 9; j += 5) for (let i = 12; i < W - 9; i += 5) if (((i * 7 + j * 13 + k * 5) % 11) < 6) ch.push({ type: 'circle', props: { cx: x + i, cy: y + j, r: 1.1, fill: '#F5F4F0', 'fill-opacity': 0.45 } });
    if (k === shipped) { ch.push({ type: 'circle', props: { cx: x + W / 2, cy: y + H / 2, r: 5, fill: '#C9FF57' } }); ch.push({ type: 'circle', props: { cx: x + W / 2, cy: y + H / 2, r: 11, fill: 'none', stroke: '#C9FF57', 'stroke-opacity': 0.35 } }); }
    nums.push(h('span', { position: 'absolute', left: x, top: y + H + 8, fontFamily: 'Mono', fontSize: 14, letterSpacing: 1.5, color: k < shipped ? '#F5F4F0' : k === shipped ? '#C9FF57' : '#939393' }, String(k + 1).padStart(2, '0')));
  }
  const w = 5 * W + 4 * G, ht = 2 * H + 34 + 26;
  return h('div', { display: 'flex', position: 'relative', width: w, height: ht }, [{ type: 'svg', props: { width: w, height: ht, viewBox: `0 0 ${w} ${ht}`, style: { position: 'absolute', left: 0, top: 0 }, children: ch } }, ...nums]);
}
function card({ eyebrow, title, meta, art }) {
  const size = title.length <= 14 ? 104 : title.length <= 28 ? 80 : title.length <= 52 ? 60 : 48;
  return h('div', { display: 'flex', width: 1200, height: 630, backgroundColor: '#090909', position: 'relative' }, [
    { type: 'svg', props: { width: 1200, height: 630, viewBox: '0 0 1200 630', style: { position: 'absolute', left: 0, top: 0 }, children: LATTICE } },
    art ? h('div', { position: 'absolute', right: 64, top: 64, display: 'flex' }, [art]) : h('div', { position: 'absolute', right: 70, top: 92, display: 'flex' }, [markSvg(446, '#1C1C1C')]),
    h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', width: 820, height: 630 }, [
      h('div', { display: 'flex', alignItems: 'center', gap: 14 }, [markSvg(34, '#C9FF57'), h('span', { fontFamily: 'Clash', fontSize: 26, color: '#F5F4F0' }, 'Fazed'), h('span', { fontFamily: 'Clash', fontSize: 26, color: '#939393' }, 'Digital')]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 22 }, [
        h('span', { fontFamily: 'Mono', fontSize: 18, letterSpacing: 2.6, color: '#C9FF57', textTransform: 'uppercase' }, eyebrow),
        h('span', { fontFamily: 'Clash', fontSize: size, lineHeight: 0.95, letterSpacing: -2, color: '#F5F4F0' }, title),
        h('span', { fontFamily: 'Mono', fontSize: 18, letterSpacing: 2, color: '#939393', textTransform: 'uppercase' }, meta),
      ]),
    ]),
  ]);
}
async function render(out, opts) {
  const svg = await satori(card(opts), { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(out, png);
}

// the 24px lattice, as real circles (satori ignores repeating gradients)
const LATTICE = [];
for (let y = 12; y < 630; y += 24) for (let x = 12; x < 1200; x += 24) LATTICE.push({ type: 'circle', props: { cx: x, cy: y, r: 1.3, fill: '#2A2A2A' } });
const META = 'Iligan City, PH · 8.2280° N 124.2452° E · Est. 2022';
const pages = {
  home: { eyebrow: 'Web design · Branding · SEO', title: 'Built in Iligan. Live worldwide.', meta: META },
  about: { eyebrow: 'About · 04 people · 01 city', title: 'We make bold brands for ambitious people.', meta: META },
  services: { eyebrow: 'What we do · 05 services', title: 'Services that move the needle.', meta: 'Web · Brand · SEO · Product · Systems' },
  work: { eyebrow: 'Selected work · 08 cases · 03 countries', title: 'Projects we’re proud of.', meta: 'USA · Australia · Philippines' },
  contact: { eyebrow: 'Signal · reply within 1 business day', title: 'Let’s build something great.', meta: META },
  blog: { eyebrow: 'Insights · practical guides', title: 'Ideas that move brands forward.', meta: 'SEO · Branding · Design · Development · Strategy' },
  'lp-7day': { eyebrow: '7-day website · fixed price', title: 'Your website, live in 7 days.', meta: 'From $499 · You own everything' },
  'lp-7day-ph': { eyebrow: '7-day website · Philippine pricing', title: 'Your website, live in 7 days.', meta: 'From PHP 19,999 · GCash · Maya · Bank' },
};
// /lab: counts from src/data/lab.ts (shipped entries; #04 drops out when LAB_04 = 'hide')
const labSrc = readFileSync(join(ROOT, 'src/data/lab.ts'), 'utf8');
const labShipped = (labSrc.match(/status: 'shipped'/g) || []).length - (/LAB_04[^=]*=\s*'hide'/.test(labSrc) ? 1 : 0);
pages.lab = { eyebrow: 'Concept sites · fictional brands', title: 'Concept sites. Real craft.', meta: `Fazed Lab · ${String(labShipped).padStart(2, '0')} immersive 3D concept sites`, art: sheetSvg(labShipped), dep: join(ROOT, 'src/data/lab.ts') };
let n = 0;
for (const [k, o] of Object.entries(pages)) { const out = join(OUT, `${k}.png`); if (fresh(out, me, ...(o.dep ? [o.dep] : []))) continue; await render(out, o); n++; }

// cases (parse the TS data file without a TS runtime: pull the fields we need)
const casesSrc = readFileSync(join(ROOT, 'src/data/cases.ts'), 'utf8');
for (const m of casesSrc.matchAll(/'(\d\d)': \{\n\s+country: '([^']+)'[^]*?resultHeadline: '([^']+)'[^]*?strip: '([^']+)'/g)) {
  const [, slug, , headline, strip] = m;
  const title = (casesSrc.match(new RegExp(`slug: '${slug}',\\n\\s+title: '([^']+)'`)) || [])[1] || `Case ${slug}`;
  const out = join(OUT, 'work', `${slug}.png`);
  if (fresh(out, me, join(ROOT, 'src/data/cases.ts'))) continue;
  await render(out, { eyebrow: strip, title, meta: headline.replace(/’/g, '’') });
  n++;
}
// posts
const postsFile = join(ROOT, 'src/data/.generated/posts.json');
if (existsSync(postsFile)) {
  for (const p of JSON.parse(readFileSync(postsFile, 'utf8'))) {
    const out = join(OUT, 'blog', `${p.slug}.png`);
    if (fresh(out, me)) continue;
    await render(out, { eyebrow: `${p.category} · ${p.readTime}`, title: p.title, meta: `By ${p.author} · ${p.date}` });
    n++;
  }
}
console.log(`[og] ${n} image(s) rendered`);
