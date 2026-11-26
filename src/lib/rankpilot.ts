// Rankpilot → blog. Rankpilot (rankpilot.dev) POSTs each article to /api/rankpilot as JSON.
// The webhook turns it into a post object in the same shape as the nightly routine's entries
// and commits it to src/data/rankpilot/<slug>.json; scripts/extract-posts.mjs merges those
// files into the blog at build time. The `const posts = [` arrays are never touched.
import { createHmac, timingSafeEqual } from 'node:crypto';

export type RankpilotPayload = {
  event: string;
  contentItemId?: string;
  title?: string;
  html?: string;
  metaDescription?: string;
  keywords?: string[];
  mainImage?: string;
  type?: string;
  author?: string;
  language?: string;
  status?: 'draft' | 'publish';
};

export type BlogPost = {
  slug: string; title: string; category: string; date: string; readTime: string;
  author: string; authorRole: string; authorPhoto: string; image: string;
  excerpt: string; content: string; featured: boolean;
  source: 'rankpilot'; contentItemId: string; keywords: string[]; receivedAt: string;
};

/** Header: `t=<unix>,v1=<hmac_sha256_hex>` over `${t}.${rawBody}`; rejects anything older than 5 minutes. */
export function verifySignature(rawBody: string, header: string | null, secret: string, nowMs = Date.now()): boolean {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(',').map((p) => {
    const i = p.indexOf('=');
    return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
  }));
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1 || !/^\d+$/.test(t) || !/^[0-9a-f]+$/i.test(v1)) return false;
  if (Math.abs(nowMs / 1000 - Number(t)) >= 300) return false;
  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest('hex');
  const a = Buffer.from(v1.toLowerCase()), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function slugify(s: string): string {
  const base = s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (base.length <= 70) return base;
  const cut = base.slice(0, 70);
  return cut.slice(0, cut.lastIndexOf('-')) || cut;
}

const textOf = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

/** Rankpilot sends sanitized HTML; this is a second pass so it fits our prose styles, TOC and build lints. */
export function cleanHtml(html: string, title: string): string {
  let h = String(html)
    .replace(/<(script|style|iframe|object|embed|form|noscript|svg)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<(script|iframe|object|embed|link|meta|base|input|button)\b[^>]*\/?>/gi, '')
    .replace(/\s(on[a-z]+|style|class|id)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/href\s*=\s*(["'])\s*javascript:[^"']*\1/gi, 'href="#"')
    .replace(/https?:\/\/(www\.)?fazeddigital\.com/gi, 'https://www.fazeddigital.com');
  // our page prints the title as the H1: drop a leading H1 that repeats it, demote any other H1
  h = h.replace(/^\s*<h1[^>]*>([\s\S]*?)<\/h1>/i, (m, inner) => (textOf(inner).toLowerCase() === title.toLowerCase() ? '' : `<h2>${inner}</h2>`));
  h = h.replace(/<h1[^>]*>/gi, '<h2>').replace(/<\/h1>/gi, '</h2>');
  // bare <h2>/<h3> so the template's TOC regex (/<h2>(.*?)<\/h2>/) picks them up
  h = h.replace(/<(h[23])\s[^>]*>/gi, '<$1>');
  // external links open in place but never pass our referrer weight blindly
  h = h.replace(/<a\s+([^>]*href="https?:\/\/(?!www\.fazeddigital\.com)[^"]*"[^>]*)>/gi, (m, attrs) => (/\brel=/.test(attrs) ? m : `<a ${attrs} rel="noopener">`));
  return h.trim();
}

/** Problems that would fail scripts/lint-dist.mjs (and so block every deploy) or break our rules. */
export function contentProblems(html: string): string[] {
  const out: string[] = [];
  if (/\[TBC/.test(html)) out.push('contains a [TBC] placeholder');
  if (/AggregateRating|"@type"\s*:\s*"Review"/i.test(html)) out.push('contains review/rating schema');
  if (/https?:\/\/fazeddigital\.com/i.test(html)) out.push('contains an apex fazeddigital.com link');
  if (textOf(html).split(' ').length < 300) out.push('is shorter than 300 words');
  return out;
}

export function guessCategory(title: string, keywords: string[] = []): string {
  const s = `${title} ${keywords.join(' ')}`.toLowerCase();
  if (/\b(logo|brand|branding|identity|rebrand)/.test(s)) return 'Branding';
  if (/\b(seo|google|rank|ranking|search|keyword|backlink|chatgpt|ai overview|geo|aeo|local pack|search console)/.test(s)) return 'SEO';
  if (/\b(wordpress|shopify|webflow|framer|develop|developer|code|hosting|speed|cms|web app|booking system|plugin|api)/.test(s)) return 'Development';
  if (/\b(design|ux|ui|typography|colou?r|layout|homepage|landing page)/.test(s)) return 'Design';
  return 'Strategy';
}

const TEAM: Record<string, string> = {
  'Lord Arcamo': 'Founder',
  'Reancirl Balaba': 'Co-Founder',
  'Russel Heyrana': 'Marketing Director',
  'Justin Sumaya': 'Head of Development',
};

export function excerptFrom(meta: string | undefined, html: string): string {
  const src = (meta && meta.trim()) || textOf(html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] ?? html);
  if (src.length <= 155) return src;
  const cut = src.slice(0, 154);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\-–—]$/, '') + '…';
}

/** '27 Nov 2026' in Manila time, the format every post uses. */
export function manilaDate(d = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Manila' }).format(d).replace('Sept', 'Sep');
}

export function toPost(p: RankpilotPayload, slug: string, now = new Date()): BlogPost {
  const title = String(p.title ?? '').trim();
  const content = cleanHtml(p.html ?? '', title);
  const words = textOf(content).split(' ').length;
  const author = p.author && TEAM[p.author.trim()] ? p.author.trim() : 'Lord Arcamo';
  const keywords = Array.isArray(p.keywords) ? p.keywords.map(String).slice(0, 12) : [];
  return {
    slug, title,
    category: guessCategory(title, keywords),
    date: manilaDate(now),
    readTime: `${Math.max(2, Math.round(words / 220))} min read`,
    author, authorRole: TEAM[author], authorPhoto: '',
    image: /^https:\/\//.test(p.mainImage ?? '') ? String(p.mainImage) : `https://www.fazeddigital.com/og/blog/${slug}.png`,
    excerpt: excerptFrom(p.metaDescription, content),
    content, featured: false,
    source: 'rankpilot', contentItemId: String(p.contentItemId ?? ''), keywords,
    receivedAt: now.toISOString(),
  };
}
