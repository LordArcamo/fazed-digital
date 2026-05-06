/**
 * Build-time OG image generator
 * Generates static 1200×630 PNG files into public/og/
 * Run: node scripts/generate-og.mjs
 */

import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Init WASM ─────────────────────────────────────────────────────────────────
const wasmPath = join(ROOT, 'node_modules/@resvg/resvg-wasm/index_bg.wasm');
await initWasm(readFileSync(wasmPath));

// ── Load fonts ────────────────────────────────────────────────────────────────
console.log('⬇ Fetching fonts from CDN…');
const [fontClashBold, fontInterReg, fontSpaceMono] = await Promise.all([
  // Clash Display 700 — the actual --font-display used on the site
  fetch('https://cdn.fontshare.com/wf/BFBSY7LX5W2U2EROCLVVTQP4VS7S4PC3/IIUX4FGTMD2LK2VWD3RVTAS4SSMUN7B5/53RZKGODFYDW3QHTIL7IPOWTBCSUEZK7.woff').then(r => r.arrayBuffer()),
  // Inter 400 — body/description text
  fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff').then(r => r.arrayBuffer()),
  // Space Mono 400 — labels and "DIGITAL"
  fetch('https://cdn.jsdelivr.net/npm/@fontsource/space-mono@5.0.7/files/space-mono-latin-400-normal.woff').then(r => r.arrayBuffer()),
]);

// ── Page metadata ──────────────────────────────────────────────────────────────
const PAGES = {
  'home':         { label: 'Bold Creative Agency',       title: 'Fazed Digital',   desc: 'Web Design · Brand Identity · SEO · Digital Products' },
  'about':        { label: 'Who We Are',                 title: 'About Us',        desc: 'Meet the team behind Fazed Digital — Iligan City, PH' },
  'services':     { label: 'What We Do',                 title: 'Our Services',    desc: 'Web Design · Brand Identity · SEO · Digital Strategy' },
  'work':         { label: 'Portfolio',                  title: 'Our Work',        desc: "Real projects. Real results. See what we've shipped." },
  'contact':      { label: 'Say Hello',                  title: 'Get In Touch',    desc: "Let's build something great together." },
  'blog':         { label: 'Insights & Resources',       title: 'Blog',            desc: 'Tips, trends, and stories from the Fazed Digital team.' },
  'lp-7day':      { label: '7-Day Website Package',      title: 'Live in 7 Days.', desc: 'Professional websites for small businesses. From $499.' },
  'lp-7day-ph':   { label: '7-Day Website · PH Pricing', title: 'Live in 7 Days.', desc: 'Websites for Philippine businesses. From PHP 19,999.' },
};

// ── Dot grid ──────────────────────────────────────────────────────────────────
function dotGrid() {
  const ROWS = 9, COLS = 5;
  const MR = 4, MC = 2;
  return Array.from({ length: ROWS }, (_, r) => ({
    type: 'div',
    props: {
      style: { display: 'flex' },
      children: Array.from({ length: COLS }, (_, c) => {
        const d = Math.sqrt((r - MR) ** 2 + (c - MC) ** 2);
        const isCore = d < 0.6;
        const isNear = d < 1.6;
        const isMid  = d < 2.8;
        return {
          type: 'div',
          props: {
            style: {
              width: 5, height: 5, borderRadius: 999, margin: 9,
              backgroundColor: isCore ? '#C9FF57'
                : isNear ? 'rgba(201,255,87,0.3)'
                : isMid  ? '#2A2A2A'
                : '#1C1C1C',
            },
          },
        };
      }),
    },
  }));
}

// ── Build element tree ────────────────────────────────────────────────────────
function buildOgImage({ label, title, desc }) {
  const titleSize = title.length <= 10 ? 80 : title.length <= 18 ? 70 : 56;
  return {
    type: 'div',
    props: {
      style: { display: 'flex', width: 1200, height: 630, backgroundColor: '#090909', position: 'relative', overflow: 'hidden' },
      children: [
        // lime glow top-right
        { type: 'div', props: { style: { position: 'absolute', top: -160, right: 80, width: 420, height: 420, borderRadius: 999, backgroundColor: 'rgba(201,255,87,0.055)' } } },
        // left accent bar
        { type: 'div', props: { style: { position: 'absolute', top: 0, left: 0, width: 6, height: 630, backgroundColor: '#C9FF57' } } },

        // main content column
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', paddingTop: 56, paddingBottom: 60, paddingLeft: 82, paddingRight: 56, flexGrow: 1, height: 630 },
            children: [
              // header row
              {
                type: 'div',
                props: {
                  style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                  children: [
                    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [
                      // Real Fazed logo mark (3-path F mark)
                      {
                        type: 'svg',
                        props: {
                          viewBox: '372 205 755 1089',
                          width: 18,
                          height: 26,
                          style: { flexShrink: 0 },
                          children: [{
                            type: 'g',
                            props: {
                              transform: 'translate(0 1500) scale(0.1 -0.1)',
                              fill: '#C9FF57',
                              children: [
                                { type: 'path', props: { d: 'M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z' } },
                                { type: 'path', props: { d: 'M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z' } },
                                { type: 'path', props: { d: 'M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z' } },
                              ],
                            },
                          }],
                        },
                      },
                      // Wordmark: "Fazed" bold + "Digital" mono
                      { type: 'span', props: { style: { fontFamily: 'ClashDisplay', fontSize: 17, fontWeight: 700, color: '#F5F4F0', letterSpacing: '-0.01em' }, children: 'Fazed' } },
                      { type: 'span', props: { style: { fontFamily: 'SpaceMono', fontSize: 10, color: '#555', letterSpacing: '0.1em' }, children: 'DIGITAL' } },
                    ]}},
                    { type: 'span', props: { style: { fontFamily: 'SpaceMono', fontSize: 10, color: '#333', letterSpacing: '0.12em' }, children: 'FAZEDDIGITAL.COM' } },
                  ],
                },
              },
              // spacer
              { type: 'div', props: { style: { flexGrow: 1 } } },
              // content block
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: 16 },
                  children: [
                    // label row
                    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [
                      { type: 'div', props: { style: { width: 22, height: 2, backgroundColor: '#C9FF57' } } },
                      { type: 'span', props: { style: { fontFamily: 'SpaceMono', fontSize: 12, color: '#C9FF57', letterSpacing: '0.15em' }, children: label.toUpperCase() } },
                    ]}},
                    // title
                    { type: 'span', props: { style: { fontFamily: 'ClashDisplay', fontSize: titleSize, fontWeight: 700, color: '#F5F4F0', letterSpacing: '-0.03em', lineHeight: 1 }, children: title } },
                    // desc
                    { type: 'span', props: { style: { fontFamily: 'Inter', fontSize: 22, fontWeight: 400, color: '#676767', letterSpacing: '-0.01em', lineHeight: 1.5 }, children: desc } },
                  ],
                },
              },
            ],
          },
        },

        // right dot grid
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 248, height: 630, borderLeft: '1px solid #1C1C1C' },
            children: dotGrid(),
          },
        },
      ],
    },
  };
}

// ── Render & save ─────────────────────────────────────────────────────────────
const outDir = join(ROOT, 'public/og');
mkdirSync(outDir, { recursive: true });

const fonts = [
  { name: 'ClashDisplay', data: fontClashBold,  weight: 700, style: 'normal' },
  { name: 'Inter',        data: fontInterReg,   weight: 400, style: 'normal' },
  { name: 'SpaceMono',    data: fontSpaceMono,  weight: 400, style: 'normal' },
];

for (const [slug, meta] of Object.entries(PAGES)) {
  const svg = await satori(buildOgImage(meta), { width: 1200, height: 630, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();
  const out = join(outDir, `${slug}.png`);
  writeFileSync(out, png);
  console.log(`✓ public/og/${slug}.png`);
}

console.log('\n✅ All OG images generated.');
