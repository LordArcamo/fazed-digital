// Internal-linking map (The Navigator, docs/seo/internal-linking.md, 2026-11-02).
// One place for the contextual links that tie blog posts, case studies, platform pages and the Lab to the money pages.
// Anchors are written per placement (descriptive, varied, never "read more"). Notes use facts already on the site only
// (services.ts, nocode.ts, cases.ts, proof.ts). Never link /halloween (seasonal) or any private preview from here.
import { prices } from './proof';
import { caseIndex } from './cases';

export interface RelLink { href: string; label: string; note: string }

/** money pages and hubs, with a fact-only one-line note. Keys are used by every map below. */
const T = {
  web: { href: '/services#web', note: 'Custom design, no templates. Built in WordPress, Astro, Next.js or Webflow.' },
  brand: { href: '/services#brand', note: 'Logo, colour, type and guidelines. Brand projects typically take 4–6 weeks.' },
  seo: { href: '/services#seo', note: 'Technical fixes, keywords, on-page work, local SEO and a plain-English monthly report.' },
  product: { href: '/services#product', note: 'Research, flows and Figma UI for apps and platforms.' },
  systems: { href: '/services#systems', note: 'Booking, membership and admin tools built around how your team works.' },
  framer: { href: '/framer', note: 'Launch pages, waitlists, CMS blogs and shop pages, designed and built in Framer.' },
  webflow: { href: '/webflow', note: 'Product and marketing sites with Webflow Interactions, CMS and native forms.' },
  ecom: { href: '/ecommerce', note: 'Product pages, carts, buying tools and store migrations, quoted upfront.' },
  iligan: { href: '/web-design-iligan-city', note: 'Meet us in person in Iligan or Cagayan de Oro. Peso prices, GCash or Maya.' },
  australia: { href: '/australia', note: 'Real Australian work, close working hours and fixed US dollar prices.' },
  lp: { href: '/lp/7-day-website', note: `Fixed price from ${prices.usd.starter}, live in 7 business days.` },
  lpph: { href: '/lp/7-day-website/ph', note: `Fixed price from ${prices.php.starter}, live in 7 business days.` },
  audit: { href: '/audit', note: 'A free 15-minute review on Google Meet: the 3 fixes likely to bring more calls.' },
  lab: { href: '/lab', note: 'Immersive 3D concept sites for fictional brands, built by our team.' },
  work: { href: '/work', note: `${caseIndex.length} live client projects in the USA, Australia and the Philippines.` },
} as const;
type Key = keyof typeof T | `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

const caseNote = (slug: string) => {
  const c = caseIndex.find((x) => x.slug === slug);
  return c ? `Case ${slug} · ${c.sector} · ${c.country}. ${c.changed}` : '';
};
/** resolve [key, anchor] pairs into links (cases by slug, everything else from T) */
export const resolve = (pairs: [Key, string][]): RelLink[] =>
  pairs.map(([k, label]) => (/^0\d$/.test(k) ? { href: `/work/${k}`, label, note: caseNote(k) } : { ...T[k as keyof typeof T], label }));

/** default anchor per key, for posts the nightly routine adds later (no hand-written entry yet) */
const DEFAULT_ANCHOR: Record<Key, string> = {
  web: 'Web design and development', brand: 'Brand identity design', seo: 'SEO marketing service', product: 'Product and UX design',
  systems: 'Custom booking systems and portals', framer: 'Framer website design', webflow: 'Webflow website design',
  ecom: 'E-commerce website design', iligan: 'Web design in Iligan City', lp: '7-day website package', lpph: '7-day website in pesos',
  audit: 'Free 15-minute website check', lab: 'Fazed Lab concept sites', work: 'Client case studies',
  '01': 'A Framing Company case study', '02': 'Cleen & Green case study', '03': 'CrateOnScene app MVP case study',
  '04': 'The Telecom Shop migration case study', '05': 'Canwell platform case study', '06': '8Drive booking system case study',
  '07': 'UGLQ Connect portal case study', '08': 'QLD Law Group case study', '09': 'Dotted Studios case study',
};

// ── Blog posts → services, platforms, cases (rendered under the post body, outside the posts arrays) ──
const POSTS: Record<string, [Key, string][]> = {
  'how-long-to-build-a-website': [['web', 'Custom website design and development'], ['02', 'The 8-week Cleen & Green brand and website'], ['03', 'CrateOnScene, an app MVP shipped in 5 weeks']],
  'website-cost-australia-2027': [['08', 'A Queensland law firm’s website and client portal'], ['05', 'Canwell, an Australian health platform with an admin portal'], ['web', 'Website design and development, quoted in USD']],
  'payment-gateway-philippines-gcash': [['ecom', 'E-commerce website design and development'], ['systems', 'Custom booking systems and portals'], ['06', 'The 8Drive car rental booking system']],
  'website-design-general-contractors': [['01', 'A Framing Company, a Utah framing contractor’s website'], ['web', 'Website design for trades and contractors'], ['framer', 'A Framer concept site for a plumber and electrician']],
  'brand-identity-price-philippines': [['brand', 'Our brand identity design service'], ['02', 'The Cleen & Green rebrand'], ['09', 'Dotted Studios, an Iligan City branding studio’s website']],
  'small-business-website-cost-uk': [['web', 'What a custom website build includes'], ['framer', 'Framer website design, quoted upfront'], ['webflow', 'Webflow website development']],
  'magento-to-prestashop-migration': [['04', 'The Telecom Shop: the full migration case study'], ['ecom', 'E-commerce store migrations'], ['seo', 'SEO support before and after a platform move']],
  'ecommerce-website-price-philippines': [['ecom', 'E-commerce website design and development'], ['04', 'A Magento to PrestaShop store migration'], ['framer', 'Framer shop pages we designed and built']],
  'fixed-price-website-design': [['web', 'Custom website design beyond a package'], ['framer', 'Framer website design'], ['webflow', 'Webflow website design']],
  'web-developer-cagayan-de-oro': [['iligan', 'Web design in Iligan City and Northern Mindanao'], ['09', 'Dotted Studios, our Iligan City client'], ['web', 'Web design and development services']],
  'free-website-audit': [['seo', 'Technical SEO audits and fixes'], ['web', 'Website redesign and development'], ['01', 'A contractor site that now brings in enquiries']],
  'offshore-web-design-australia': [['08', 'QLD Law Group: website, client portal and app'], ['07', 'UGLQ Connect, a Queensland membership portal'], ['05', 'Canwell’s public site and admin portal']],
  'seo-iligan-city': [['seo', 'Local SEO and Google Business Profile setup'], ['09', 'The Dotted Studios website in Iligan City'], ['02', 'Cleen & Green, a Philippine cleaning brand']],
  'outsource-web-development-philippines': [['01', 'A Framing Company in Utah'], ['03', 'CrateOnScene, a US event platform MVP'], ['web', 'Web design and development from the Philippines']],
  'get-more-google-reviews': [['seo', 'Local SEO and Google Business Profile help'], ['iligan', 'Local web design in Iligan City'], ['web', 'Web design that puts reviews where decisions get made']],
  'image-optimisation-small-business': [['web', 'Fast, mobile-first web design'], ['ecom', 'Online stores that stay fast on phones'], ['04', 'The Telecom Shop’s faster PrestaShop store']],
  'contact-page-design': [['web', 'Web design that brings in enquiries'], ['framer', 'Framer sites with booking and quote forms'], ['01', 'A contractor website built for bids']],
  'technical-seo-small-business': [['seo', 'Technical SEO audits and fixes'], ['04', 'A store migration planned around search'], ['web', 'Web development with Core Web Vitals in mind']],
  'brand-style-guide': [['brand', 'Brand guidelines and identity design'], ['02', 'Cleen & Green’s eco brand system'], ['09', 'Dotted Studios’ site, built from their own Figma']],
  'client-testimonials-strategy': [['01', 'The A Framing Company website'], ['02', 'The Cleen & Green website'], ['web', 'Website design and development']],
  'web-hosting-small-business-guide': [['web', 'Website builds where the hosting is yours'], ['webflow', 'Webflow websites (hosting explained)'], ['framer', 'Framer websites (hosting explained)']],
  'website-navigation-design': [['web', 'Our web design service'], ['product', 'Product and UX design'], ['07', 'UGLQ Connect, a role-based membership portal']],
  'schema-markup-small-business': [['seo', 'SEO marketing, structured data included'], ['webflow', 'Webflow sites with structured data'], ['ecom', 'Product SEO for online stores']],
  'brand-voice-guide': [['brand', 'Brand identity, voice included'], ['02', 'The Cleen & Green brand'], ['09', 'A branding studio’s own website']],
  'compete-with-larger-competitors': [['brand', 'Brand identity for small businesses'], ['seo', 'SEO marketing for local and niche searches'], ['02', 'Cleen & Green’s premium rebrand']],
  'website-accessibility-guide': [['web', 'Accessible web design (WCAG 2.1 AA)'], ['product', 'Product design for apps and portals'], ['framer', 'Framer sites with reduced-motion settings']],
  'link-building-small-business': [['seo', 'SEO with relevant links only, no schemes'], ['iligan', 'Local web design and SEO in Iligan City'], ['01', 'A contractor found through search']],
  'visual-hierarchy-web-design': [['web', 'Custom web design'], ['product', 'UI and product design'], ['lab', '3D concept sites in the Fazed Lab']],
  'logo-design-small-business': [['brand', 'Logo and brand identity design'], ['02', 'The Cleen & Green eco brand'], ['09', 'Dotted Studios, a branding studio we built for']],
  'google-analytics-4-small-business': [['seo', 'GA4 and Search Console setup'], ['web', 'Web design and development'], ['lp', 'The 7-day Growth package, GA4 and Search Console included']],
  'web-design-pricing-guide': [['web', 'Custom web design, quoted upfront'], ['ecom', 'E-commerce website builds'], ['framer', 'Framer websites, quoted after a short call']],
  'local-seo-small-business-guide': [['seo', 'Local SEO and Google Business Profile'], ['iligan', 'Web design and local SEO in Iligan City'], ['01', 'A Utah contractor’s website']],
  'rebranding-when-and-how': [['brand', 'Brand identity projects'], ['02', 'The Cleen & Green rebrand'], ['09', 'A new site for an Iligan branding studio']],
  'landing-page-conversion-design': [['framer', 'Framer landing pages and waitlists'], ['webflow', 'Webflow product sites'], ['web', 'Web design built for conversions']],
  'wordpress-vs-custom-build': [['web', 'WordPress and custom web development'], ['framer', 'Framer websites'], ['webflow', 'Webflow websites']],
  'keyword-research-small-business': [['seo', 'Keyword and content strategy'], ['iligan', 'Local SEO in Iligan City'], ['01', 'A Framing Company, found through search']],
  'seo-for-new-websites': [['seo', 'Our SEO marketing service'], ['09', 'Dotted Studios, a site launched in October 2026'], ['web', 'New website design and development']],
  'how-to-choose-web-design-agency-philippines': [['work', 'Our client case studies'], ['iligan', 'A web design studio in Iligan City'], ['web', 'Web design and development services']],
  'website-maintenance-guide': [['web', 'Website support and maintenance plans'], ['04', 'A store moved to a faster platform'], ['systems', 'Custom systems that need ongoing care']],
  'brand-colours-guide': [['brand', 'Colour and brand identity design'], ['02', 'Cleen & Green’s eco brand identity'], ['lab', 'The Fazed Lab’s 3D concept sites']],
  'homepage-copywriting-that-sells': [['web', 'Website design and copy that sells'], ['framer', 'Framer launch pages'], ['01', 'A contractor homepage built around the portfolio']],
  'on-page-seo-checklist': [['seo', 'On-page optimisation'], ['webflow', 'Webflow sites with SEO basics done'], ['ecom', 'SEO for product pages']],
  'website-speed-fixes': [['web', 'Core Web Vitals optimisation'], ['04', 'The Telecom Shop’s faster store'], ['ecom', 'Fast e-commerce builds']],
  'facebook-page-vs-website': [['web', 'A website you own, designed and built'], ['seo', 'Local SEO and Google Business Profile'], ['02', 'A Philippine brand with its own website']],
  'signs-website-needs-redesign': [['web', 'Website redesign'], ['09', 'Dotted Studios: from a dead link to a live site'], ['02', 'Cleen & Green: a rebrand and a new website']],
  'google-business-profile-optimization': [['seo', 'Google Business Profile setup'], ['iligan', 'Local web design in Iligan City'], ['web', 'Websites built to pair with your profile']],
  'mobile-first-web-design': [['web', 'Mobile-first web design'], ['framer', 'Framer sites for desktop, tablet and phone'], ['03', 'The CrateOnScene progressive web app']],
  'small-business-website-checklist': [['web', 'Website design and development'], ['webflow', 'Webflow website builds'], ['01', 'A small business site built to pitch work']],
  'why-brand-identity-matters': [['brand', 'Brand identity design'], ['02', 'A rebrand that opened a franchise channel'], ['09', 'A branding studio’s website']],
  'core-web-vitals-seo': [['web', 'Core Web Vitals optimisation'], ['seo', 'Technical SEO'], ['04', 'A faster PrestaShop store']],
  'astro-vs-nextjs-agencies': [['web', 'Astro and Next.js development'], ['lab', 'three.js concept sites in the Fazed Lab'], ['09', 'Dotted Studios, built with three.js and GSAP']],
  'ux-mistakes-killing-conversions': [['product', 'UX and product design'], ['web', 'Conversion-focused web design'], ['06', '8Drive: manual bookings moved into one system']],
  'content-strategy-small-business': [['seo', 'Keyword and content strategy'], ['webflow', 'Webflow CMS sites'], ['framer', 'Framer CMS blogs']],
  'typography-web-design': [['brand', 'Typography systems and brand identity'], ['web', 'Custom web design'], ['lab', 'Concept sites from the Fazed Lab']],
};

/** topic rules for posts without a hand-written entry (first matches win, max 3 links) */
const RULES: [RegExp, Key][] = [
  [/iligan|cagayan|\bcdo\b|mindanao|lanao/, 'iligan'],
  [/e-?commerce|online store|shop|magento|prestashop|woocommerce|shopify|gcash|paymongo|xendit|payment/, 'ecom'],
  [/webflow/, 'webflow'], [/framer/, 'framer'],
  [/contractor|construction|framing|roof|plumb|electric|tradie|trades/, '01'],
  [/clean/, '02'], [/\bmvp\b|\bpwa\b|\bapp\b/, '03'], [/health|wellness|ndis|physio|clinic/, '05'],
  [/booking|rental|reservation/, '06'], [/membership|non-?profit|association/, '07'], [/law|legal|lawyer/, '08'],
  [/brand|logo/, 'brand'], [/\bseo\b|google|keyword|search|maps/, 'seo'], [/\b3d\b|three\.?js|immersive|webgl/, 'lab'],
  [/australia/, '08'], [/redesign|website|web design/, 'web'],
];
const CAT_KEY: Record<string, Key> = { SEO: 'seo', Branding: 'brand', Design: 'web', Development: 'web', Strategy: 'web' };

export function postLinks(slug: string, title: string, category: string): RelLink[] {
  if (POSTS[slug]) return resolve(POSTS[slug]);
  const hay = `${slug} ${title}`.toLowerCase().replace(/-/g, ' ');
  const keys: Key[] = [];
  for (const [re, k] of RULES) if (re.test(hay) && !keys.includes(k)) keys.push(k);
  const cat = CAT_KEY[category];
  if (cat && !keys.includes(cat)) keys.unshift(cat);
  return resolve(keys.slice(0, 3).map((k) => [k, DEFAULT_ANCHOR[k]]));
}

// ── Blog category hubs → the pages each topic feeds ──
export const HUB_LINKS: Record<string, RelLink[]> = {
  SEO: resolve([['iligan', 'local SEO in Iligan City'], ['audit', 'a free 15-minute website check']]),
  Branding: resolve([['02', 'the Cleen & Green rebrand'], ['09', 'a branding studio’s website']]),
  Design: resolve([['framer', 'Framer websites'], ['webflow', 'Webflow websites'], ['product', 'product design']]),
  Development: resolve([['ecom', 'e-commerce builds'], ['webflow', 'Webflow development'], ['systems', 'custom systems']]),
  Strategy: resolve([['work', 'our case studies'], ['iligan', 'web design in Iligan City']]),
};

// ── Platform pages (/framer, /webflow, /ecommerce) → guides, cases and next steps ──
export const PLATFORM_LINKS: Record<'framer' | 'webflow' | 'ecommerce', { guides: RelLink[]; next: RelLink[] }> = {
  framer: {
    guides: [
      { href: '/blog/landing-page-conversion-design', label: 'The anatomy of a high-converting landing page', note: 'What a launch page or waitlist needs above the fold.' },
      { href: '/blog/wordpress-vs-custom-build', label: 'WordPress, a site builder or a custom build?', note: 'How to pick the platform before you pay for it.' },
      { href: '/blog/mobile-first-web-design', label: 'Why your website must be built for phones first', note: 'Most visitors meet your business on a phone.' },
    ],
    next: resolve([['lp', 'A fixed-price 7-day website instead'], ['09', 'Dotted Studios: a site built from the client’s own Figma'], ['lab', 'Our 3D concept sites, built in code']]),
  },
  webflow: {
    guides: [
      { href: '/blog/wordpress-vs-custom-build', label: 'WordPress vs a custom build: which is right?', note: 'How to pick the platform before you pay for it.' },
      { href: '/blog/schema-markup-small-business', label: 'Schema markup for small businesses', note: 'The structured data we set up on every Webflow build.' },
      { href: '/blog/content-strategy-small-business', label: 'A content strategy your CMS can keep up with', note: 'What to publish once the collections exist.' },
    ],
    next: resolve([['lp', 'A fixed-price 7-day website instead'], ['systems', 'Custom web apps and portals, when a builder is not enough'], ['08', 'QLD Law Group: website, client portal and app']]),
  },
  ecommerce: {
    guides: [
      { href: '/blog/ecommerce-website-price-philippines', label: 'Ecommerce website prices in the Philippines', note: 'What you pay for, from shop pages to full stores.' },
      { href: '/blog/magento-to-prestashop-migration', label: 'Magento to PrestaShop: lessons from a real store move', note: 'The plan behind the Telecom Shop migration.' },
      { href: '/blog/payment-gateway-philippines-gcash', label: 'GCash and card payments on your store', note: 'Payment gateway options for Philippine shops.' },
      { href: '/blog/image-optimisation-small-business', label: 'Image optimisation for faster product pages', note: 'Cut load times without losing photo quality.' },
    ],
    next: [
      { href: '/lp/7-day-website', label: 'The e-commerce-ready 7-day Pro package', note: `${prices.usd.pro} fixed, live in 7 business days.` },
      { href: '/lp/7-day-website/ph', label: 'The 7-day Pro package in pesos', note: `${prices.php.pro} fixed, e-commerce ready.` },
      ...resolve([['iligan', 'Online stores for Iligan and CDO businesses']]),
    ],
  },
};

const FR_VAR = ['Framer websites', 'Framer sites', 'sites in Framer']; // read as "We also design and build …"
const WF_VAR = ['Webflow websites', 'Webflow sites', 'sites in Webflow'];
// ── Case studies → the platform pages a similar buyer weighs up (a sentence under the related links) ──
/** marketing-site cases get the site-builder alternatives; the store migration gets the store hub */
export const casePlatformLinks = (slug: string, discipline: readonly string[]): RelLink[] =>
  slug === '04' ? resolve([['ecom', 'online stores and migrations'], ['lp', 'the e-commerce-ready 7-day Pro package']])
    : discipline.includes('web') && !discipline.includes('systems') ? resolve([['framer', FR_VAR[Number(slug) % 3]], ['webflow', WF_VAR[Number(slug) % 3]]])
      : []; // apps and portals: the related links already point at custom systems and product design

// ── /lab → everyday services (same team, real brands) ──
export const LAB_LINKS: RelLink[] = resolve([
  ['web', 'custom web design and development'], ['framer', 'Framer websites'], ['webflow', 'Webflow websites'], ['ecom', 'online stores with 3D buying tools'],
]);

// ── /services chapters → platform and local pages (rendered as an "Also" line per chapter) ──
export const SERVICE_ALSO: Record<string, { lead: string; links: RelLink[] }> = {
  web: { lead: 'Prefer a site builder, or selling online?', links: resolve([['webflow', 'Webflow websites'], ['framer', 'Framer websites'], ['ecom', 'E-commerce stores and migrations']]) },
  seo: { lead: 'Local business?', links: resolve([['iligan', 'Web design and local SEO in Iligan City'], ['audit', 'Book a free 15-minute website check']]) },
  systems: { lead: 'In the Philippines?', links: resolve([['iligan', 'Booking systems for Iligan and CDO businesses']]) },
  product: { lead: 'Exploring what’s possible?', links: resolve([['lab', 'Immersive 3D concept sites in the Fazed Lab']]) },
};
