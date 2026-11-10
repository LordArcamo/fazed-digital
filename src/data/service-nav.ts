// The seven services (owner, 2026-11-10) and which of them have their own page yet. No imports: plain Node scripts
// (gen-llms, generate-og, lint-chat) read this file too. Direction C, docs/design/service-pages/directions.md.
//
// `live: true` means /services/<slug> is built from src/data/service-pages.ts. [slug].astro fails the build if this
// list and the page data disagree, so flipping a service live is one change here plus its entry there.
// `hub` is the /services chapter id (kept: blog posts link to those anchors).
export interface ServiceNavItem {
  id: 'web' | 'brand' | 'seo' | 'product' | 'systems' | 'automations' | 'social';
  /** menu branch index (04 = the Services row) */
  n: string;
  /** dock chip, menu branch and the closing service line */
  short: string;
  name: string;
  slug: string;
  live: boolean;
  hub: string | null;
}

export const SERVICE_NAV: ServiceNavItem[] = [
  { id: 'web', n: '04.1', short: 'Web design', name: 'Web design & development', slug: 'web-design', live: true, hub: 'web' },
  { id: 'brand', n: '04.2', short: 'Branding', name: 'Brand identity', slug: 'branding', live: true, hub: 'brand' },
  { id: 'seo', n: '04.3', short: 'SEO', name: 'SEO and AI search', slug: 'seo', live: true, hub: 'seo' },
  { id: 'product', n: '04.4', short: 'UI/UX', name: 'Product design (UI/UX)', slug: 'ui-ux-design', live: true, hub: 'product' },
  { id: 'systems', n: '04.5', short: 'Web apps', name: 'Custom web apps', slug: 'web-app-development', live: true, hub: 'systems' },
  { id: 'automations', n: '04.6', short: 'Automations', name: 'Automations', slug: 'automations', live: true, hub: 'automations' },
  { id: 'social', n: '04.7', short: 'Social media', name: 'Social media management', slug: 'social-media-management', live: true, hub: 'social' },
];

export const SERVICE_TOTAL = SERVICE_NAV.length;
export const liveServices = SERVICE_NAV.filter((s) => s.live);
export const servicePath = (s: ServiceNavItem) => `/services/${s.slug}`;

/** the one link for a service: its page once live, else its /services chapter */
export function serviceHref(id: string): string {
  const s = SERVICE_NAV.find((x) => x.id === id);
  if (!s) return '/services';
  if (s.live) return servicePath(s);
  return s.hub ? `/services#${s.hub}` : '/services';
}
