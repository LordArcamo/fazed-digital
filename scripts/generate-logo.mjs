/**
 * Fazed Digital brand logo generator
 * Outputs SVG + transparent PNG logo files into brand/
 * Run: node scripts/generate-logo.mjs
 */

import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'brand');
mkdirSync(OUT, { recursive: true });

await initWasm(readFileSync(join(ROOT, 'node_modules/@resvg/resvg-wasm/index_bg.wasm')));

// ── The real Fazed mark (3 paths, viewBox 372 205 755 1089) ────────────────────
const VIEWBOX = '372 205 755 1089';
const P1 = 'M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z';
const P2 = 'M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z';
const P3 = 'M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z';

const markSvg = (color, w = 440) => {
  const h = Math.round(w * 1089 / 755);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${VIEWBOX}" fill="none" role="img" aria-label="Fazed Digital">
  <g transform="translate(0 1500) scale(0.1 -0.1)" fill="${color}">
    <path d="${P1}"/>
    <path d="${P2}"/>
    <path d="${P3}"/>
  </g>
</svg>`;
};

// ── 1) Mark-only SVGs (3 colorways) ────────────────────────────────────────────
const MARKS = {
  'fazed-mark-lime':  '#C9FF57',
  'fazed-mark-white': '#F5F4F0',
  'fazed-mark-black': '#090909',
};
for (const [name, color] of Object.entries(MARKS)) {
  const svg = markSvg(color);
  writeFileSync(join(OUT, `${name}.svg`), svg);
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 900 }, background: 'rgba(0,0,0,0)' }).render().asPng();
  writeFileSync(join(OUT, `${name}.png`), png);
  console.log(`✓ ${name}.svg + .png`);
}

// ── 2) Full lockups (mark + "Fazed" + "DIGITAL") via satori → transparent PNG ──
console.log('⬇ Fetching fonts…');
const [fontClash, fontMono] = await Promise.all([
  fetch('https://cdn.fontshare.com/wf/BFBSY7LX5W2U2EROCLVVTQP4VS7S4PC3/IIUX4FGTMD2LK2VWD3RVTAS4SSMUN7B5/53RZKGODFYDW3QHTIL7IPOWTBCSUEZK7.woff').then(r => r.arrayBuffer()),
  fetch('https://cdn.jsdelivr.net/npm/@fontsource/space-mono@5.0.7/files/space-mono-latin-400-normal.woff').then(r => r.arrayBuffer()),
]);
const fonts = [
  { name: 'ClashDisplay', data: fontClash, weight: 700, style: 'normal' },
  { name: 'SpaceMono',    data: fontMono,  weight: 400, style: 'normal' },
];

const lockup = (markColor, textColor, subColor) => ({
  type: 'div',
  props: {
    style: { display: 'flex', width: 760, height: 170, alignItems: 'center', justifyContent: 'center', gap: 18 },
    children: [
      { type: 'svg', props: {
        viewBox: VIEWBOX, width: 70, height: 101, style: { flexShrink: 0 },
        children: [{ type: 'g', props: { transform: 'translate(0 1500) scale(0.1 -0.1)', fill: markColor,
          children: [ { type: 'path', props: { d: P1 } }, { type: 'path', props: { d: P2 } }, { type: 'path', props: { d: P3 } } ] } }],
      }},
      { type: 'span', props: { style: { fontFamily: 'ClashDisplay', fontSize: 64, fontWeight: 700, color: textColor, letterSpacing: '-0.01em' }, children: 'Fazed' } },
      { type: 'span', props: { style: { fontFamily: 'SpaceMono', fontSize: 26, color: subColor, letterSpacing: '0.1em', marginTop: 20 }, children: 'DIGITAL' } },
    ],
  },
});

const LOCKUPS = {
  'fazed-logo-lockup-dark-bg':  lockup('#C9FF57', '#F5F4F0', '#6B6B6B'),  // for dark backgrounds
  'fazed-logo-lockup-light-bg': lockup('#090909', '#090909', '#777777'),  // for light backgrounds
};
for (const [name, tree] of Object.entries(LOCKUPS)) {
  const svg = await satori(tree, { width: 760, height: 170, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1440 }, background: 'rgba(0,0,0,0)' }).render().asPng();
  writeFileSync(join(OUT, `${name}.png`), png);
  console.log(`✓ ${name}.png`);
}

// ── 3) Circular badge versions (profile pics / avatars) ────────────────────────
const circleSvg = (bgColor, markColor, ring = null, D = 1000) => {
  // mark occupies ~48% of diameter, vertically centered
  const mh = D * 0.48;
  const mw = mh * 755 / 1089;
  const mx = (D - mw) / 2;
  const my = (D - mh) / 2;
  const ringEl = ring
    ? `<circle cx="${D/2}" cy="${D/2}" r="${D/2 - 6}" fill="none" stroke="${ring}" stroke-width="10"/>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${D}" height="${D}" viewBox="0 0 ${D} ${D}" fill="none" role="img" aria-label="Fazed Digital">
  <circle cx="${D/2}" cy="${D/2}" r="${D/2}" fill="${bgColor}"/>
  ${ringEl}
  <svg x="${mx}" y="${my}" width="${mw}" height="${mh}" viewBox="${VIEWBOX}">
    <g transform="translate(0 1500) scale(0.1 -0.1)" fill="${markColor}">
      <path d="${P1}"/><path d="${P2}"/><path d="${P3}"/>
    </g>
  </svg>
</svg>`;
};

const CIRCLES = {
  'fazed-circle-black': ['#090909', '#C9FF57', null],       // black bg + lime mark (primary)
  'fazed-circle-lime':  ['#C9FF57', '#090909', null],       // lime bg + black mark
  'fazed-circle-white': ['#F5F4F0', '#090909', '#E2E2DC'],  // white bg + black mark + subtle ring
};
for (const [name, [bg, mark, ring]] of Object.entries(CIRCLES)) {
  const svg = circleSvg(bg, mark, ring);
  writeFileSync(join(OUT, `${name}.svg`), svg);
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1000 }, background: 'rgba(0,0,0,0)' }).render().asPng();
  writeFileSync(join(OUT, `${name}.png`), png);
  console.log(`✓ ${name}.svg + .png`);
}

console.log('\n✅ Brand files in brand/');
