// Generative dot covers (deterministic from slug × category family), 64×64 SVG, SSR.
// SEO = concentric · Branding = hex · Strategy = path · Development = grid · Design = pentagon
const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rnd = (seed: number) => () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
export function coverDots(slug: string, category: string): { x: number; y: number; r: number; lit: boolean }[] {
  const r = rnd(hash(slug));
  const out: { x: number; y: number; r: number; lit: boolean }[] = [];
  const push = (x: number, y: number, rr = 1, lit = false) => out.push({ x: +x.toFixed(1), y: +y.toFixed(1), r: rr, lit });
  const litIdx = () => Math.floor(r() * 1000);
  switch (category) {
    case 'SEO': { const rings = 3 + Math.floor(r() * 2), L = litIdx(); for (let k = 1; k <= rings; k++) { const n = 6 + k * 5, rad = k * (26 / rings); for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + k; push(32 + Math.cos(a) * rad, 32 + Math.sin(a) * rad, 1, (k * 13 + i) % 37 === L % 37); } } push(32, 32, 2.2, true); break; }
    case 'Branding': { const s = 8 + r() * 4; for (let q = -3; q <= 3; q++) for (let p = -3; p <= 3; p++) { const x = 32 + (p + q / 2) * s * 0.9, y = 32 + q * s * 0.78; if (Math.hypot(x - 32, y - 32) < 28) push(x, y, 1.2, r() < 0.08); } push(32, 32, 2.2, true); break; }
    case 'Strategy': { const pts = [[8, 50], [20 + r() * 10, 12], [40 + r() * 10, 56], [56, 14]]; for (let i = 0; i <= 40; i++) { const t = i / 40, u = 1 - t; const x = u * u * u * pts[0][0] + 3 * u * u * t * pts[1][0] + 3 * u * t * t * pts[2][0] + t * t * t * pts[3][0]; const y = u * u * u * pts[0][1] + 3 * u * u * t * pts[1][1] + 3 * u * t * t * pts[2][1] + t * t * t * pts[3][1]; push(x, y, 0.9); } [0, 13, 27, 40].forEach((k, j) => { const d = out[k]; d.r = 2; d.lit = j === 3; }); break; }
    case 'Development': { const L = litIdx(); for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) { if (r() < 0.18) continue; push(8 + i * 8, 8 + j * 8, 1, (i + j * 7) % 49 === L % 49); } break; }
    default: { const n = [0, 1, 2, 3, 4].map((k) => { const a = (-90 + k * 72) * Math.PI / 180; return [32 + Math.cos(a) * 24, 32 + Math.sin(a) * 24]; }); const act = Math.floor(r() * 5); n.forEach(([x, y], k) => { const [x2, y2] = n[(k + 1) % 5]; for (let i = 1; i < 6; i++) push(x + ((x2 - x) * i) / 6, y + ((y2 - y) * i) / 6, 0.7); push(x, y, 2, k === act); }); push(32, 32, 1.4); }
  }
  return out;
}
export const SERVICE_FOR: Record<string, { label: string; href: string }> = {
  SEO: { label: 'SEO marketing', href: '/services#seo' },
  Branding: { label: 'Brand identity', href: '/services#brand' },
  Design: { label: 'Web design', href: '/services#web' },
  Development: { label: 'Web development', href: '/services#web' },
  Strategy: { label: '7-day website', href: '/lp/7-day-website' },
};
export const HUBS: Record<string, { intro: string; pillar: string }> = {
  SEO: { intro: 'Get found by the people already searching. Start with the basics, then work through the checklists.', pillar: 'seo-for-new-websites' },
  Branding: { intro: 'Make a good business look as good as it is: logo, colour, voice and when to rebrand.', pillar: 'why-brand-identity-matters' },
  Design: { intro: 'Layouts, menus and pages that guide people to the one action that matters.', pillar: 'signs-website-needs-redesign' },
  Development: { intro: 'Hosting, speed, accessibility and the platform question, explained without jargon.', pillar: 'small-business-website-checklist' },
  Strategy: { intro: 'Pricing, choosing an agency, copy and competing with bigger players. Decisions before you spend.', pillar: 'web-design-pricing-guide' },
};
export const catSlug = (c: string) => c.toLowerCase();
