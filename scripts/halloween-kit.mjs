/**
 * halloween-kit.mjs — Instagram post (1080×1350) + story (1080×1920) for the Halloween campaign.
 * Run: node scripts/halloween-kit.mjs → docs/marketing/halloween/*.png (not part of the site build).
 */
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { MARK_PATHS, MARK_TRANSFORM } from './lib/mark.mjs';
import { pumpkinDots } from './lib/pumpkin.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs/marketing/halloween');
mkdirSync(OUT, { recursive: true });
await initWasm(readFileSync(join(ROOT, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')));
const fonts = [
  { name: 'Clash', data: readFileSync(join(ROOT, 'scripts/fonts/ClashDisplay-Semibold.woff')), weight: 600, style: 'normal' },
  { name: 'Mono', data: readFileSync(join(ROOT, 'scripts/fonts/space-mono-latin-400-normal.woff')), weight: 400, style: 'normal' },
];
const h = (type, style, children) => ({ type, props: { style, children } });
const mark = (size, color) => ({ type: 'svg', props: { viewBox: '372 205 755 1089', width: size * 0.693, height: size, children: [{ type: 'g', props: { transform: MARK_TRANSFORM, fill: color, children: MARK_PATHS.map((d) => ({ type: 'path', props: { d } })) } }] } });
const pumpkin = (size) => {
  const fill = { body: '#BCBCBC', face: '#C9FF57', stem: '#9FCC2E' };
  const ch = [{ type: 'circle', props: { cx: 50, cy: 62, r: 32, fill: '#C9FF57', 'fill-opacity': 0.08 } }];
  for (const d of pumpkinDots()) ch.push({ type: 'circle', props: { cx: d.x, cy: d.y, r: d.role === 'face' ? 0.95 : 0.74, fill: fill[d.role], 'fill-opacity': d.role === 'body' ? d.shade * 0.8 : 1 } });
  return { type: 'svg', props: { width: size, height: size * 76 / 84, viewBox: '8 18 84 76', children: ch } };
};
const lattice = (W, H) => { const c = []; for (let y = 14; y < H; y += 28) for (let x = 14; x < W; x += 28) c.push({ type: 'circle', props: { cx: x, cy: y, r: 1.5, fill: '#242424' } }); return { type: 'svg', props: { width: W, height: H, viewBox: `0 0 ${W} ${H}`, style: { position: 'absolute', left: 0, top: 0 }, children: c } }; };
const signs = ['Slow pages', 'Dead links', 'Invisible on Google', 'A form that vanishes', 'Stuck in 2019'];

function poster(W, H, story) {
  const pk = story ? 900 : 700;
  return h('div', { display: 'flex', flexDirection: 'column', width: W, height: H, backgroundColor: '#090909', position: 'relative', padding: story ? '120px 84px 140px' : '72px 76px', justifyContent: 'space-between' }, [
    lattice(W, H),
    h('div', { display: 'flex', alignItems: 'center', gap: 14 }, [mark(40, '#C9FF57'), h('span', { fontFamily: 'Clash', fontSize: 30, color: '#F5F4F0' }, 'Fazed'), h('span', { fontFamily: 'Clash', fontSize: 30, color: '#939393' }, 'Digital')]),
    h('div', { display: 'flex', justifyContent: 'center', marginTop: story ? 40 : 0 }, [pumpkin(pk)]),
    h('div', { display: 'flex', flexDirection: 'column', gap: story ? 28 : 20 }, [
      h('span', { fontFamily: 'Mono', fontSize: story ? 26 : 22, letterSpacing: 3, color: '#C9FF57', textTransform: 'uppercase' }, 'Halloween · Free website check'),
      h('span', { fontFamily: 'Clash', fontSize: story ? 118 : 96, lineHeight: 0.95, letterSpacing: -3, color: '#F5F4F0' }, 'Is your website haunted?'),
      h('div', { display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 6 }, signs.map((s) => h('span', { fontFamily: 'Mono', fontSize: story ? 24 : 20, color: '#BCBCBC', border: '1.5px solid #2A2A2A', borderRadius: 999, padding: '10px 18px' }, s))),
      h('div', { display: 'flex', flexDirection: story ? 'column' : 'row', alignItems: story ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 22, marginTop: story ? 30 : 16 }, [
        h('span', { fontFamily: 'Clash', fontSize: story ? 40 : 34, color: '#090909', backgroundColor: '#C9FF57', borderRadius: 999, padding: story ? '22px 36px' : '18px 30px' }, 'Book a free 15-min check'),
        h('span', { fontFamily: 'Mono', fontSize: story ? 26 : 22, color: '#939393', letterSpacing: 1 }, 'fazeddigital.com/halloween'),
      ]),
    ]),
  ]);
}
for (const [name, W, H, story] of [['ig-post-1080x1350', 1080, 1350, false], ['ig-story-1080x1920', 1080, 1920, true]]) {
  const svg = await satori(poster(W, H, story), { width: W, height: H, fonts });
  writeFileSync(join(OUT, `${name}.png`), new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng());
  console.log('[halloween-kit]', name);
}
