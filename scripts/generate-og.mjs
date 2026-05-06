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
function loadFont(pkg, file) {
  return readFileSync(join(ROOT, `node_modules/@fontsource/${pkg}/files/${file}`));
}

let fontInterBold, fontInterReg, fontSpaceMono;
try {
  fontInterBold  = loadFont('inter',       'inter-latin-700-normal.woff');
  fontInterReg   = loadFont('inter',       'inter-latin-400-normal.woff');
  fontSpaceMono  = loadFont('space-mono',  'space-mono-latin-400-normal.woff');
} catch {
  // Fallback: download from CDN
  console.log('⬇ Fonts not in node_modules, fetching from CDN…');
  [fontInterBold, fontInterReg, fontSpaceMono] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff').then(r => r.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff').then(r => r.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/npm/@fontsource/space-mono@5.0.7/files/space-mono-latin-400-normal.woff').then(r => r.arrayBuffer()),
  ]);
}

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
                    { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [
                      { type: 'div', props: { style: { width: 30, height: 30, backgroundColor: '#C9FF57', borderRadius: 6 } } },
                      { type: 'span', props: { style: { fontFamily: 'Inter', fontSize: 18, fontWeight: 700, color: '#F5F4F0', letterSpacing: '-0.02em' }, children: 'FAZED DIGITAL' } },
                    ]}},
                    { type: 'span', props: { style: { fontFamily: 'SpaceMono', fontSize: 11, color: '#404040', letterSpacing: '0.1em' }, children: 'FAZEDDIGITAL.COM' } },
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
                    { type: 'span', props: { style: { fontFamily: 'Inter', fontSize: titleSize, fontWeight: 700, color: '#F5F4F0', letterSpacing: '-0.035em', lineHeight: 1 }, children: title } },
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
  { name: 'Inter',     data: fontInterBold,  weight: 700, style: 'normal' },
  { name: 'Inter',     data: fontInterReg,   weight: 400, style: 'normal' },
  { name: 'SpaceMono', data: fontSpaceMono,  weight: 400, style: 'normal' },
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
