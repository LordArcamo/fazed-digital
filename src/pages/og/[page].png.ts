import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export const prerender = false;

// ── Font cache (warm across Lambda invocations) ────────────────────────────────
let fontInterBold:  ArrayBuffer | null = null;
let fontInterReg:   ArrayBuffer | null = null;
let fontSpaceMono:  ArrayBuffer | null = null;

async function ensureFonts() {
  [fontInterBold, fontInterReg, fontSpaceMono] = await Promise.all([
    fontInterBold  ?? fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-700-normal.woff').then(r => r.arrayBuffer()),
    fontInterReg   ?? fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/files/inter-latin-400-normal.woff').then(r => r.arrayBuffer()),
    fontSpaceMono  ?? fetch('https://cdn.jsdelivr.net/npm/@fontsource/space-mono@5.0.7/files/space-mono-latin-400-normal.woff').then(r => r.arrayBuffer()),
  ]);
}

// ── Per-page metadata ──────────────────────────────────────────────────────────
const PAGES: Record<string, { label: string; title: string; desc: string }> = {
  home:          { label: 'Bold Creative Agency',        title: 'Fazed Digital',    desc: 'Web Design · Brand Identity · SEO · Digital Products' },
  about:         { label: 'Who We Are',                  title: 'About Us',         desc: 'Meet the team behind Fazed Digital — Iligan City, PH' },
  services:      { label: 'What We Do',                  title: 'Our Services',     desc: 'Web Design · Brand Identity · SEO · Digital Strategy' },
  work:          { label: 'Portfolio',                   title: 'Our Work',         desc: 'Real projects. Real results. See what we\'ve shipped.' },
  contact:       { label: 'Say Hello',                   title: 'Get In Touch',     desc: 'Let\'s build something great together.' },
  blog:          { label: 'Insights & Resources',        title: 'Blog',             desc: 'Tips, trends, and stories from the Fazed Digital team.' },
  'lp-7day':     { label: '7-Day Website Package',       title: 'Live in 7 Days.',  desc: 'Professional websites for small businesses. From $499.' },
  'lp-7day-ph':  { label: '7-Day Website · PH Pricing',  title: 'Live in 7 Days.',  desc: 'Para sa mga negosyo sa Pilipinas. Mula ₱19,999.' },
};

// ── Dot grid (right-panel accent) ─────────────────────────────────────────────
function dotGrid(): object[] {
  const ROWS = 9, COLS = 5;
  const MR = 4, MC = 2; // centre of grid

  return Array.from({ length: ROWS }, (_, r) => ({
    type: 'div',
    props: {
      style: { display: 'flex' },
      children: Array.from({ length: COLS }, (_, c) => {
        const d = Math.sqrt((r - MR) ** 2 + (c - MC) ** 2);
        const isCore  = d < 0.6;
        const isNear  = d < 1.6;
        const isMid   = d < 2.8;
        return {
          type: 'div',
          props: {
            style: {
              width: 5,
              height: 5,
              borderRadius: 999,
              margin: 9,
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

// ── Element tree builder ───────────────────────────────────────────────────────
function buildOgImage(meta: { label: string; title: string; desc: string }): object {
  const titleSize = meta.title.length <= 10 ? 80
    : meta.title.length <= 18 ? 70
    : 56;

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: 1200,
        height: 630,
        backgroundColor: '#090909',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [

        // ── Subtle lime glow top-right ──
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: -160,
              right: 80,
              width: 420,
              height: 420,
              borderRadius: 999,
              backgroundColor: 'rgba(201,255,87,0.055)',
            },
          },
        },

        // ── Left lime accent bar ──
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: 6,
              height: 630,
              backgroundColor: '#C9FF57',
            },
          },
        },

        // ── Main content column ──
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 56,
              paddingBottom: 60,
              paddingLeft: 82,
              paddingRight: 56,
              flexGrow: 1,
              height: 630,
            },
            children: [

              // Header: wordmark + domain
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                  children: [
                    // Logo mark + wordmark
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', alignItems: 'center', gap: 12 },
                        children: [
                          // Lime square icon
                          {
                            type: 'div',
                            props: {
                              style: {
                                width: 30,
                                height: 30,
                                backgroundColor: '#C9FF57',
                                borderRadius: 6,
                              },
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontFamily: 'Inter',
                                fontSize: 18,
                                fontWeight: 700,
                                color: '#F5F4F0',
                                letterSpacing: '-0.02em',
                              },
                              children: 'FAZED DIGITAL',
                            },
                          },
                        ],
                      },
                    },
                    // Domain label
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontFamily: 'SpaceMono',
                          fontSize: 11,
                          color: '#404040',
                          letterSpacing: '0.1em',
                        },
                        children: 'FAZEDDIGITAL.COM',
                      },
                    },
                  ],
                },
              },

              // Flex spacer — pushes content to lower portion
              { type: 'div', props: { style: { flexGrow: 1 } } },

              // ── Content block ──
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  },
                  children: [

                    // Label row: dash + text
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', alignItems: 'center', gap: 10 },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                width: 22,
                                height: 2,
                                backgroundColor: '#C9FF57',
                              },
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontFamily: 'SpaceMono',
                                fontSize: 12,
                                color: '#C9FF57',
                                letterSpacing: '0.15em',
                              },
                              children: meta.label.toUpperCase(),
                            },
                          },
                        ],
                      },
                    },

                    // Page title
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontFamily: 'Inter',
                          fontSize: titleSize,
                          fontWeight: 700,
                          color: '#F5F4F0',
                          letterSpacing: '-0.035em',
                          lineHeight: 1,
                        },
                        children: meta.title,
                      },
                    },

                    // Description
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontFamily: 'Inter',
                          fontSize: 22,
                          fontWeight: 400,
                          color: '#676767',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.5,
                        },
                        children: meta.desc,
                      },
                    },

                  ],
                },
              },
            ],
          },
        },

        // ── Right dot-grid panel ──
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 248,
              height: 630,
              borderLeft: '1px solid #1C1C1C',
            },
            children: dotGrid(),
          },
        },

      ],
    },
  };
}

// ── Route handler ──────────────────────────────────────────────────────────────
export const GET: APIRoute = async ({ params }) => {
  const slug = (params.page ?? 'home').replace(/\.png$/i, '');
  const meta = PAGES[slug] ?? PAGES.home;

  await ensureFonts();

  const svg = await satori(buildOgImage(meta) as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter',      data: fontInterBold!,  weight: 700, style: 'normal' },
      { name: 'Inter',      data: fontInterReg!,   weight: 400, style: 'normal' },
      { name: 'SpaceMono',  data: fontSpaceMono!,  weight: 400, style: 'normal' },
    ],
  });

  const resvg  = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png    = resvg.render().asPng();

  return new Response(png, {
    headers: {
      'Content-Type':  'image/png',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
};
