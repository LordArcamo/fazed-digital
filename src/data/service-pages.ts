// /services/<slug>: one template (src/pages/services/[slug].astro, Direction C "Runtime"), content per page here.
// Copy: copy/service-pages/<slug>.md (The Wordsmith, 10 Nov 2026, draft) on the brief docs/seo/pages/service-pages.md.
// Every price comes from proof.ts / offers.ts (never typed). Case facts from cases.ts. Lines the copy marked [TBC] are
// either the owner's defaults (marked `// TBC owner`) or left out until confirmed (noted where they were cut).
//
// Adding or changing a page: edit its entry below; its slug must be `live: true` in service-nav.ts ([slug].astro fails
// the build if the two disagree). OG cards: scripts/generate-og.mjs reads this file.
// Retainers (seo, automations, social) use months: bars there may only be `own` (our own site or business, with a start
// date pinned to a commit) or `plan` rows. Never a client bar without a case, never a placeholder: rulerBars() throws.
// Prices in running text use "$X (₱Y)": the geo swap in Base.astro reduces that pattern to the visitor's currency.
import { prices, capsCopy, automationPrices, automationTerms, socialPrices, socialTerms, quotedCopy } from './proof.ts';
import { chapters, serviceFaq } from './services.ts';
import { caseIndex } from './cases.ts';

type Pair = [string, string];
export interface Link { label: string; href: string; market?: 'ph' | 'usd' }
/** a price shown per market: the template prints both (crawlers see both) and the geo swap hides one */
export interface Money { usd: string; php: string }

/* ── the ruler ────────────────────────────────────────────────────────────── */
export type BarDef =
  | { case: string; label?: string }
  /** our own site or business: a start date pinned to a commit, length computed at build */
  | { own: string; since: string; commit: string }
  /** a plan row (social): one dot per post per month, short videos lit, no end node */
  | { plan: string; posts: number; videos: number; label: string };
export interface RulerDef {
  unit: 'weeks' | 'months';
  span: number;
  unitLabel?: string;
  bands: { from: number; to: number; label: string }[];
  marks: { at: number; label: string }[];
  /** short lime runs on the baseline (automation fix windows) */
  runs: { from: number; to: number; label: string }[];
  bars: BarDef[];
  aria: string;
}
export interface Meter { lead: string; big: string | Money; unit: string; tail: string | Money; tailPre?: string }

/* ── sections ─────────────────────────────────────────────────────────────── */
export interface Item { t: string; d?: string }
export interface CaseRun { slug: string; small: string; headline: string; before: string; after: string; caption: string }
export interface PricePoint { at: number; to?: number; label: string; value: Money | string }
export type Section = { id?: string; eyebrow: string; h2: Pair; lead?: string } & (
  | { kind: 'getfit'; getH: string; get: Item[]; getNote?: string; fit: string[] }
  | { kind: 'prose'; body: string[]; list?: Item[]; links?: Link[]; small?: string; flow?: { from: string[]; to: string[] } }
  | { kind: 'rows'; rows: (Item & { link?: Link; market?: 'ph' })[] }
  /** `colTable`: columns are the options (head), rows are attributes; else rows are the options. Cells may hold
   *  [label](href) links. `pick`: the recommended column. */
  | { kind: 'table'; head: string[]; rows: { th: string; cells: (string | Money)[] }[]; foot?: string; ctas?: Link[]; pick?: number; colTable?: boolean }
  | { kind: 'runs'; runs: CaseRun[]; after?: Link & { lead: string } }
  | { kind: 'process'; steps: Pair[]; timeline: string; timelineLink?: Link; price?: { span: number; unit: 'weeks' | 'months'; points: PricePoint[]; text?: string; sub: string } }
);

export interface ServicePage {
  id: string;
  title: string;
  description: string;
  crumb: string;
  /** Service schema name */
  name: string;
  h1: Pair;
  intro: string;
  cta: Link;
  ghost: Link;
  meter: Meter;
  ruler: RulerDef;
  sections: Section[];
  faq: { q: string; a: string }[];
  /** blog slugs; a `{ usd, ph }` pair swaps by market */
  related: (string | { usd: string; ph: string })[];
  close: { h2: Pair; body: string; caps: string[]; next: Link; also: Link[]; alsoLead?: string };
  schema: { serviceType: string; offers?: { name: string; price: string; monthly?: boolean; url: string }[]; caseList?: string[] };
}

const U = prices.usd, P = prices.php;
// the regular PH Starter price: the founding rate (offers.ts) only appears where it is labelled as the founding offer
const phStarter = prices.php.starter;
const m = (usd: string, php: string): Money => ({ usd, php });
const both = (usd: string, php: string) => `${usd} (${php})`;
const range = prices.customRange, rangeTo = range.replace('–', ' to '), rangeAnd = `between ${range.split('–')[0]} and ${range.split('–')[1]}`;
const ch = (id: string) => chapters.find((c) => c.id === id)!;
const kase = (slug: string) => caseIndex.find((c) => c.slug === slug)!;
export const weeksOf = (slug: string) => parseInt(kase(slug).duration, 10);
const faqQ = (q: string) => serviceFaq.find((f) => f.q === q)!;
type AId = (typeof automationPrices)[number]['id'];
type SId = (typeof socialPrices)[number]['id'];
const A = Object.fromEntries(automationPrices.map((p) => [p.id, p])) as Record<AId, (typeof automationPrices)[number]>;
const S = Object.fromEntries(socialPrices.map((p) => [p.id, p])) as Record<SId, (typeof socialPrices)[number]>;
const perMonth = (s: string) => s.replace('/month', '');
const num = (s: string) => perMonth(s).replace(/[^\d.]/g, '');
const IP = 'On full payment, all intellectual property in the final deliverables is assigned to you.';
const DEPOSIT = 'A 50% deposit starts the work.';
const REPLY = 'Send a short brief. We’ll reply within one business day with questions, a rough scope and next steps.';
const SAME5: Pair = ['Same five steps.', 'The length changes.'];
const close = (h2: Pair, next: Link, extra: Partial<ServicePage['close']> = {}): ServicePage['close'] => ({ h2, body: REPLY, caps: [], next, also: [], ...extra });
const run = (slug: string, small: string, headline: string, before: string, after: string): CaseRun => {
  const c = kase(slug);
  const host = c.liveLabel ? c.liveUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '') : '';
  return { slug, small, headline, before, after, caption: host || 'Private staff system · no public link' };
};
// Our own lead flow (contact form + chat → Gmail + HubSpot): commit 583ecb7, 2026-10-18 ("Every lead: Gmail alert +
// HubSpot record"), jury fixes 04321e4 the same day; chat leads joined in 88e9d89 (2026-11-05).
const LEAD_FLOW = { own: 'Our own lead flow · since 18 Oct 2026', since: '2026-10-18', commit: '583ecb7' };
// Our own site's SEO work: docs/seo/strategy.md, first commit 120cffb (2026-10-19, strategy + content calendar).
const OWN_SEO = { own: 'Our own site · SEO since Oct 2026 · in progress', since: '2026-10-19', commit: '120cffb' };

export const servicePages: Record<string, ServicePage> = {
  /* ── 01 Web design & development · copy/service-pages/web-design.md ──────────────────────────────── */
  'web-design': {
    id: 'web',
    title: 'Custom Web Design & Development Services | Fazed Digital',
    description: `Custom websites, never templates, in WordPress, Astro, Next.js or Webflow. 7-day sites from ${U.starter}; custom builds ${range}. You own everything.`,
    crumb: 'Web design', name: 'Web design & development',
    h1: ['Web design & development.', 'A website that brings in enquiries.'],
    intro: `Fazed Digital designs and builds custom websites, never templates, from Iligan City, Philippines, for businesses in the USA, Australia and the Philippines. We build in WordPress, Astro, React, Next.js or Webflow, mobile-first and to WCAG 2.1 AA. Fixed-price sites start at ${both(U.starter, phStarter)} and go live in 7 business days. Custom builds take 4–12+ weeks and typically run ${range}.`,
    cta: ch('web').cta, ghost: { label: 'See real build times', href: '#proof' },
    meter: { lead: 'Live in', big: '7', unit: 'days', tailPre: 'from', tail: m(U.starter, phStarter) },
    ruler: {
      unit: 'weeks', span: 14, bands: [{ from: 4, to: 12, label: `Custom builds · 4–12+ weeks · ${range}` }], marks: [{ at: 1, label: '7-day website' }], runs: [],
      bars: [{ case: '09' }, { case: '01' }, { case: '04' }, { case: '08' }],
      aria: 'Our real website projects by build length: Dotted Studios 1 week, A Framing Company 6 weeks, The Telecom Shop 10 weeks, QLD Law Group 14 weeks.',
    },
    sections: [
      { kind: 'getfit', eyebrow: 'What you get · who it’s for', h2: ['Every week of it,', 'spelled out.'], lead: `${ch('web').body[1]} ${ch('web').body[2]}`, getH: 'In every build', get: ch('web').get.map((t) => ({ t })), fit: ch('web').fit },
      {
        kind: 'table', id: 'ways', eyebrow: 'Two ways in', h2: ['Fixed price in 7 days,', 'or custom.'], lead: 'Most studios say “it depends”. We publish both routes.', colTable: true,
        head: ['7-day website', 'Custom build'],
        rows: [
          { th: 'Price', cells: [m(`Starter ${U.starter} · Growth ${U.growth} · Pro ${U.pro}`, `Starter ${phStarter} · Growth ${P.growth} · Pro ${P.pro}`), `Typically ${range}, quoted after a discovery call`] },
          { th: 'Time', cells: ['Live in 7 business days', '4 weeks for simpler builds, 12+ for complex ones'] },
          { th: 'Pages', cells: ['5, 8 or 10+ custom-designed pages', 'Scoped to what the site must do'] },
          { th: 'Included', cells: ['On-page SEO setup, contact form, 2 or 3 revision rounds (unlimited on Pro); Growth adds a blog and CMS, Google Analytics and Search Console; Pro is e-commerce ready', 'Custom design, the platform that fits your team, CMS handover training'] },
          { th: 'Best for', cells: ['New and growing small businesses', 'Bigger sites, stores, migrations and anything with custom features'] },
        ],
        ctas: [{ label: 'Get live in 7 days', href: '/lp/7-day-website' }, { label: 'Start a website project', href: '/contact?service=web' }],
        foot: `Extra pages are ${both(U.page, P.page)} each. Booking systems, membership portals and custom e-commerce are scoped separately, with the price upfront.`,
      },
      {
        kind: 'rows', id: 'platform', eyebrow: 'Platform', h2: ['The right fit,', 'not our favourite.'],
        rows: [
          { t: 'WordPress', d: 'When you want to edit everything yourself.' },
          { t: 'Astro, React or Next.js', d: 'When performance and flexibility matter most.' },
          { t: 'Framer', d: 'Best for design-led marketing sites, launch pages and waitlists that need to look great and go live fast.', link: { label: 'Framer websites', href: '/framer' } },
          { t: 'Webflow', d: 'Best when you want more structure: bigger CMS needs, a strict class system and detailed interactions, edited by a marketing team.', link: { label: 'Webflow websites', href: '/webflow' } },
          { t: 'Selling online?', d: 'We build stores and run migrations, like The Telecom Shop’s move from Magento to PrestaShop.', link: { label: 'E-commerce stores and migrations', href: '/ecommerce' } },
          { t: 'Already designed it?', d: 'We can build from your own Figma file. Dotted Studios designed their site in Figma; we kept their layout, palette, type and copy and built the motion, content system and enquiry form on top.' },
        ],
      },
      {
        kind: 'runs', id: 'proof', eyebrow: 'Proof · 04 real runs, shortest first', h2: ['Real projects.', 'Real weeks.'],
        runs: [
          run('09', 'Website + CMS', 'From a dead link to a site built around the work.', 'Their work lived on Behance and Facebook, and the website on their profiles led to a dead portfolio page.', 'We built the site from their own Figma design. It went live at dottedstudios.com one week after the build started.'),
          run('01', 'WordPress website', 'A website they now pitch new work with.', 'An outdated site with no portfolio. They were losing bids to competitors who simply looked more credible online.', 'A portfolio-led WordPress site the team edits themselves. It’s now a core part of how they pitch for work.'),
          run('04', 'Magento to PrestaShop migration', 'Magento to PrestaShop. Zero data loss.', 'Their Magento store had become slow, expensive to maintain and hard to update.', 'Catalogue, customers and order history moved in stages, with zero data loss and minimal disruption to trading.'),
          run('08', 'Website + web app + mobile app', 'Three products. One client experience.', 'They needed a website, a secure client portal and a mobile app: three connected products.', 'All three shipped as one suite. Clients now self-serve document uploads and status checks.'),
        ],
        after: { lead: 'Brand and website together?', label: 'See Cleen & Green', href: '/work/02' },
      },
      {
        kind: 'process', eyebrow: 'Process and timeline', h2: SAME5,
        steps: [
          ['Short call', 'What the site must do, who it’s for, and what you already have. You get a price and a timeline upfront.'],
          ['Direction', 'A look and a page plan, agreed before we build, so there are no surprises later.'],
          ['Build', 'Custom design, built in the platform that fits your team.'],
          ['Review', 'You test it on a staging link and we make the changes.'],
          ['Launch and hand over', 'Domain, hosting, logins and files are yours. No lock-in.'],
        ],
        timeline: 'Websites take 4 weeks for simpler builds and 12+ weeks for complex ones. On the 7-day route it’s Day 1 brief, Days 2–3 design, Days 4–5 build, Day 6 review on staging, Day 7 launch.',
        timelineLink: { label: 'Get live in 7 days', href: '/lp/7-day-website' },
        price: {
          span: 14, unit: 'weeks',
          points: [{ at: 1, label: '7-day website · week 1', value: m(U.starter, phStarter) }, { at: 4, to: 12, label: 'Custom · 4–12+ weeks', value: range }],
          sub: `Live in 7 business days, or 20% off if we miss it on our side (you send everything on Day 1 and feedback within 24 hours). Custom websites are quoted after a discovery call. ${DEPOSIT} Care plans from ${both(U.care, P.care)} cover updates, backups, security monitoring, uptime checks and small content changes.`,
        },
      },
      { kind: 'prose', eyebrow: 'After launch', h2: ['Yours,', 'all of it.'], body: [`Your domain, hosting, logins, design files and content are yours once paid for. ${IP} No lock-in contracts. If you want us to keep looking after it, care plans start at ${both(U.care, P.care)}.`] },
    ],
    faq: [
      { q: 'How much does a website cost?', a: `Our fixed-price 7-day websites start at ${U.starter} (${phStarter} in the Philippines). Growth is ${U.growth} and Pro is ${U.pro}. Extra pages are ${U.page}. Custom websites are quoted after a discovery call and typically run ${range}.` },
      { q: 'How long does a website take?', a: 'A 7-day website goes live in 7 business days if you send everything on Day 1 and feedback within 24 hours at each review. If we miss it on our side, you get 20% off. Custom websites take 4 weeks for simpler builds and 12+ weeks for complex ones.' },
      { q: 'Which platforms do you build on?', a: 'WordPress when you want to edit everything yourself. Astro, React or Next.js when performance and flexibility matter most. Framer or Webflow when your marketing team wants a site builder. We recommend the best fit for you.' },
      faqQ('Will I own my website?'),
      { q: 'Can you build our site from our own Figma design?', a: 'Yes. Dotted Studios designed their site in Figma, so we kept their layout, palette, type and copy, then built the motion, the content system and the enquiry form on top. It went live one week after the build started.' },
      { q: 'Do you offer support after launch?', a: `Yes. Monthly care plans start at ${U.care} (${P.care} in the Philippines) and cover updates, backups, security monitoring, uptime checks and small content changes.` },
    ],
    related: ['how-long-to-build-a-website', 'wordpress-vs-custom-build', 'signs-website-needs-redesign', { usd: 'small-business-website-cost-us', ph: 'web-design-pricing-guide' }],
    close: close(['Week 0', 'starts here.'], { label: 'Next: Brand identity', href: '/services/branding' }, {
      caps: [capsCopy.custom, capsCopy.sevenDay], alsoLead: 'Need it in a week?',
      also: [{ label: 'Get live in 7 days', href: '/lp/7-day-website' }, { label: 'See peso pricing (₱)', href: '/lp/7-day-website/ph', market: 'ph' }],
    }),
    schema: { serviceType: 'Web design and development', offers: (['starter', 'growth', 'pro'] as const).map((k) => ({ name: `7-day website: ${k[0].toUpperCase()}${k.slice(1)}`, price: num(U[k]), url: '/lp/7-day-website' })) },
  },

  /* ── 02 Brand identity · copy/service-pages/branding.md ────────────────────────────────────────────── */
  branding: {
    id: 'brand',
    title: 'Brand Identity Design: Logo, Colour & Guidelines | Fazed',
    description: 'Brand identity from a Philippine studio: positioning first, then logo system, colour, type, guidelines and templates your team can use. 4–6 week projects.',
    crumb: 'Branding', name: 'Brand identity',
    h1: ['Brand identity design.', 'Look as good as you actually are.'],
    intro: 'Fazed Digital designs complete brand identities: logo and its variations, colour, typography, guidelines and templates. We start with positioning, not the logo, and hand over a system your team can use for years. Brand projects typically take 4–6 weeks and are quoted per project. We can build the website in the same project, as we did for Cleen & Green.',
    cta: ch('brand').cta, ghost: { label: 'See the Cleen & Green run', href: '#proof' },
    meter: { lead: 'Brand projects', big: '4–6', unit: 'wks', tail: quotedCopy.brand.toLowerCase() },
    ruler: {
      unit: 'weeks', span: 10, bands: [{ from: 4, to: 6, label: 'Brand identity · 4–6 weeks' }], marks: [], runs: [],
      // one bar is the honest count: Dotted Studios' brand is theirs (we built their site from their own Figma)
      bars: [{ case: '02', label: '02 Cleen & Green · brand + website' }],
      aria: 'Our brand identity timeline: brand projects typically take 4 to 6 weeks. Cleen & Green, a brand identity and website together, took 8 weeks.',
    },
    sections: [
      {
        kind: 'getfit', eyebrow: 'What you get · who it’s for', h2: ['A system,', 'not just a logo.'], lead: ch('brand').body[0], getH: 'In every brand',
        // TBC owner: the one-line explanation under each deliverable (copy §15)
        get: [
          { t: 'Logo design and all its variations', d: 'The main mark plus the versions you need for small spaces, dark backgrounds and social profiles.' },
          { t: 'Typography system and font licensing guidance', d: 'Which fonts, where, and what you’re allowed to use them for.' },
          { t: 'Colour palette and usage rules', d: 'The colours, and when each one is used.' },
          { t: 'Brand guidelines document', d: 'The rules written down, so the next person who makes something gets it right.' },
          { t: 'Social media templates', d: 'Posts your team fills in without breaking the look.' },
          { t: 'Print and packaging design', d: 'Signage, stationery and packaging in the same system.' },
        ],
        fit: ch('brand').fit,
      },
      { kind: 'prose', eyebrow: 'How we start', h2: ['Who it’s for comes', 'before what it looks like.'], body: [ch('brand').body[1]] },
      {
        kind: 'runs', id: 'proof', eyebrow: 'Proof · 01 real run', h2: ['Real project.', 'Real weeks.'],
        runs: [run('02', 'Brand identity + website', 'A rebrand that opened a new revenue stream.', 'They wanted to sit above the typical cleaning service, but their brand and website didn’t show the premium, eco-conscious service they actually delivered.', 'A full identity built on their eco values, a WordPress site with a quote request flow, and a franchise page that opened a growth channel they couldn’t use before.')],
        after: { lead: 'Reading this from a cleaning business?', label: 'Cleaning Business Branding: Lessons From Cleen & Green', href: '/blog/cleaning-business-branding-philippines' },
      },
      { kind: 'prose', eyebrow: 'Brand + web', h2: ['One team,', 'from logo to launch.'], body: ['For Cleen & Green we built the brand identity and a WordPress site with service pages, a quote request flow and a franchise page, in one 8-week project. The brand and the site came from the same people, so they match on day one.'], links: [{ label: 'Web design and development', href: '/services/web-design' }] },
      {
        kind: 'process', eyebrow: 'Process and timeline', h2: SAME5,
        steps: [
          ['Short call', 'What you sell, who buys it and what’s not working today.'],
          ['Positioning', 'Who you’re for and what they should feel, agreed before any design.'],
          ['The system', 'Logo, colour and type, designed together.'],
          ['The rules', 'Guidelines and templates, written down so anyone can use them.'],
          ['Hand over', 'Final files your team can use for years. The IP is yours on full payment.'],
        ],
        timeline: 'Brand identity projects typically take 4–6 weeks. A brand and website together take longer: Cleen & Green took 8 weeks.',
        price: { span: 10, unit: 'weeks', points: [], text: quotedCopy.brand, sub: `Every brand is scoped per client, so we quote after a short call, once we know what you need. A brand plus a website, like Cleen & Green, is custom work, and our custom projects typically fall ${rangeAnd}.` },
      },
      { kind: 'prose', eyebrow: 'Ownership', h2: ['Your brand.', 'Your files.'], body: [`${IP} You get the files, not a licence to use them.`] },
    ],
    faq: [
      { q: 'How long does a brand identity project take?', a: 'Brand identity projects typically take 4–6 weeks, from the positioning brief to the final guidelines handover. A full brand and website together take longer; Cleen & Green took 8 weeks.' },
      { q: 'How much does a brand identity cost?', a: `We quote brand work per project, once we know the scope: a logo refresh is a different job from a full system with guidelines, templates and packaging. A brand plus website, like Cleen & Green, is custom work, typically ${rangeAnd}.` },
      { q: 'What does a brand identity include?', a: 'Logo design and all its variations, a typography system with font licensing guidance, a colour palette with usage rules, a brand guidelines document, social media templates, and print and packaging design.' },
      { q: 'Do you start with the logo?', a: 'No. We start with positioning: who you are for and what they should feel. Then we design the system, write the rules down and hand you files your team can use for years.' },
      { q: 'Who owns the brand files?', a: `You do. ${IP}` },
    ],
    related: ['brand-identity-price-philippines', 'cleaning-business-branding-philippines', 'rebranding-when-and-how', 'brand-style-guide'],
    // no caps line: whether brand-only work counts against the 3 custom projects a month is unconfirmed (copy §11)
    close: close(['Week 0', 'starts here.'], { label: 'Next: SEO and AI search', href: '/services/seo' }, { alsoLead: 'In Iligan or CDO?', also: [{ label: 'Web design, branding and SEO in Iligan City', href: '/web-design-iligan-city', market: 'ph' }] }),
    schema: { serviceType: 'Brand identity design' },
  },

  /* ── 03 SEO and AI search · copy/service-pages/seo.md ──────────────────────────────────────────────── */
  seo: {
    id: 'seo',
    title: 'SEO & AI Search Services for Small Businesses | Fazed',
    description: 'Technical SEO, keywords, on-page work, local SEO and visibility in ChatGPT and Google AI answers. Setup takes about a month. Plain-English monthly reports.',
    crumb: 'SEO', name: 'SEO and AI search',
    h1: ['SEO and AI search.', 'Get found on Google and in AI answers.'],
    intro: 'Fazed Digital’s SEO service fixes your site’s technical foundation, builds a keyword and content plan, optimises every page and earns relevant links. It includes AI search: making your business clear enough for ChatGPT and Google’s AI answers to understand and cite. Setup takes about a month, and results usually show in 6–12 months. You get a plain-English report every month.',
    cta: ch('seo').cta, ghost: { label: 'Book a free 15-minute website check', href: '/audit' },
    meter: { lead: 'Setup in', big: '1', unit: 'month', tail: 'results usually in 6–12 months' },
    ruler: {
      unit: 'months', span: 12, bands: [{ from: 6, to: 12, label: 'Results usually show · months 6–12' }], marks: [{ at: 1, label: 'Setup · month 1' }], runs: [],
      bars: [OWN_SEO],
      aria: 'How SEO runs: setup takes about a month, and results usually show in 6 to 12 months. Our own site has been in SEO work since October 2026.',
    },
    sections: [
      {
        kind: 'getfit', eyebrow: 'What you get · who it’s for', h2: ['Every month of it,', 'spelled out.'], getH: 'In every plan',
        lead: 'The customers who search are the ones most ready to buy. SEO puts you in front of them, whether that’s “framing contractor Utah” or “cleaning service near me” in Cagayan de Oro, and, more and more, when they ask an AI assistant instead of typing into Google.',
        // TBC owner: the AI-search deliverable stays as written (coordinator default, 10 Nov)
        get: ['Technical SEO audit and fixes', 'Keyword and content strategy', 'On-page optimisation', 'AI search: clear answers, structured data and consistent business details, so AI tools can read and cite you', 'Link acquisition (relevant links only, no schemes)', 'Google Search Console and GA4 setup', 'Local SEO and Google Business Profile, for businesses that serve an area', 'Monthly reporting and analytics'].map((t) => ({ t })),
        fit: ch('seo').fit,
      },
      { kind: 'prose', eyebrow: 'Month 1', h2: ['Fix it, plan it,', 'measure it.'], body: ['Setup takes about a month. We audit and fix the technical foundation, build the keyword and content plan, and set up Google Search Console and GA4 so we can measure from day one.'] },
      { kind: 'prose', eyebrow: 'Months 2–12', h2: ['The work,', 'and the report.'], body: ['We optimise every page, follow the content plan and earn relevant links. No link schemes. Every month you get a plain-English report: what we did, what moved, and what’s next.'] },
      {
        kind: 'prose', eyebrow: 'AI search', h2: ['Found when they ask,', 'not just when they search.'],
        // TBC owner: the AI-search work as written stays (coordinator default, 10 Nov)
        body: ['People now ask ChatGPT, or read Google’s AI answer, before they click a single link. Those answers are built from pages the AI can read and trust. So we write clear, direct answers at the top of your key pages, add structured data that says who you are and what you offer, and make sure your business name, address and details match everywhere they appear online.'],
        list: [
          { t: 'We do it on our own site first', d: 'Every page here carries structured data, and the site publishes an llms.txt file, a plain index of our services, work and guides for AI tools to read.' },
          { t: 'The honest part', d: 'No one can promise rankings, and no one can promise an AI answer will name you. We do the work that makes it possible and report what moves.' },
        ],
      },
      { kind: 'prose', eyebrow: 'Local', h2: ['Show up on the map,', 'where you actually work.'], body: ['For businesses that serve an area, we fix the technical basics, plan the keywords local customers actually type, optimise each page and set up your Google Business Profile so you can show on Maps.'], links: [{ label: 'Web design and local SEO in Iligan City', href: '/web-design-iligan-city' }] },
      {
        kind: 'prose', eyebrow: 'The cheapest way in', h2: ['SEO basics come', 'with every 7-day site.'],
        body: [`Every 7-day package includes on-page SEO setup. Growth (${U.growth}) adds advanced on-page SEO, a blog and CMS, Google Analytics and Search Console. Starter is ${U.starter}. Ongoing SEO is a separate monthly retainer.`, 'When we moved The Telecom Shop from Magento to PrestaShop, protecting search was part of the brief, so the new store was built to match the existing catalogue structure.'],
        links: [{ label: 'Get live in 7 days', href: '/lp/7-day-website' }, { label: 'See peso pricing (₱)', href: '/lp/7-day-website/ph', market: 'ph' }, { label: 'Read the Telecom Shop case', href: '/work/04' }],
      },
      {
        kind: 'prose', id: 'proof', eyebrow: 'Proof · our own site', h2: ['No client results to show yet.', 'Here’s our own work.'],
        body: ['SEO retainers are a service we’re building a record in, so we won’t show you borrowed numbers. What you can check today is our own site:'],
        list: [
          { t: '{postCount} practical guides', d: 'On our blog, written for small-business owners.' },
          { t: 'Structured data on every page', d: 'And an llms.txt file for AI tools.' },
          { t: 'Search Console and GA4', d: 'Set up and checked on our own site.' },
        ],
        links: [{ label: 'Read the SEO guides', href: '/blog/category/seo' }],
      },
      {
        kind: 'process', eyebrow: 'Process and timeline', h2: ['Same five steps.', 'Measured in months.'],
        steps: [
          ['Short call', 'Your market, your competitors and what a customer would type to find you.'],
          ['Fix', 'Technical audit and fixes in month one.'],
          ['Plan and track', 'Keyword and content plan, Search Console and GA4.'],
          ['Work every month', 'Pages, content, relevant links and AI search.'],
          ['Report', 'What we did, what moved and what’s next, in plain English.'],
        ],
        timeline: 'SEO is a retainer. Setup takes about a month; results usually show in 6–12 months, depending on your market and competition.',
        // TBC owner: the retainer is quoted per project (quotedCopy.seoRetainer); no monthly price on the line
        price: { span: 12, unit: 'months', points: [{ at: 0, label: 'SEO setup inside every 7-day site · from', value: m(U.starter, phStarter) }], sub: 'Ongoing SEO retainers are priced on your discovery call, once we know your market and competition. Ask us about options.' },
      },
    ],
    faq: [
      faqQ('How long does SEO take?'),
      { q: 'Do you optimise for ChatGPT and Google’s AI answers?', a: 'Yes, it’s part of the service. We write clear answers on your key pages, add structured data and keep your business details consistent online, so AI tools can read and cite you. No one can promise an AI answer will name you.' },
      { q: 'What do you do in the first month?', a: 'We audit and fix the technical foundation, build the keyword and content plan, and set up Google Search Console and GA4 so we can measure from day one.' },
      { q: 'Do you do local SEO and Google Business Profile?', a: 'Yes, for businesses that serve an area. We fix the technical basics, plan the keywords local customers actually type, optimise each page and set up your Google Business Profile so you can show on Maps.' },
      { q: 'Can you guarantee first place on Google?', a: 'No. No one can promise rankings. We do the technical, content and link work that earns them, and every month we report what we did and what moved.' },
      { q: 'Is SEO included when you build a website?', a: 'The basics are. Every 7-day package includes on-page SEO setup, and Growth adds advanced on-page SEO plus Google Analytics and Search Console. Ongoing SEO is a separate retainer.' },
    ],
    related: ['seo-for-new-websites', 'local-seo-small-business-guide', 'schema-markup-small-business', { usd: 'technical-seo-small-business', ph: 'seo-iligan-city' }],
    close: close(['Month 1', 'starts here.'], { label: 'Next: UI/UX design', href: '/services/ui-ux-design' }, { alsoLead: 'Not sure where you stand?', also: [{ label: 'Book a free 15-minute website check', href: '/audit' }] }),
    schema: { serviceType: 'Search engine optimisation' },
  },

  /* ── 04 UI/UX and product design · copy/service-pages/ui-ux-design.md ──────────────────────────────── */
  'ui-ux-design': {
    id: 'product',
    title: 'UI/UX Design Services for Apps, Portals & MVPs | Fazed',
    description: 'Research, flows, wireframes and Figma UI for apps, portals and MVPs, with a design system and developer-ready handoff. Design only, or design and build.',
    crumb: 'UI/UX design', name: 'Product design (UI/UX)',
    h1: ['UI/UX and product design.', 'Apps and platforms people finish using.'],
    intro: 'Fazed Digital designs apps, portals and platforms: user research and information architecture first, then wireframes, prototypes and high-fidelity UI in Figma, with a design system and a developer-ready handoff. Hire us for the design only, or for design and build. CrateOnScene went from idea to a live web app in 5 weeks.',
    cta: ch('product').cta, ghost: { label: 'See real build times', href: '#proof' },
    meter: { lead: 'Idea to live MVP in', big: '5', unit: 'wks', tail: 'CrateOnScene · design + build' },
    ruler: {
      // no design-only band yet: TBC owner (design-only price and typical timeline, brief TBC-7)
      unit: 'weeks', span: 14, unitLabel: 'weeks, design + build →', bands: [], marks: [], runs: [],
      bars: [{ case: '03', label: '03 CrateOnScene · design + build' }, { case: '06', label: '06 8Drive · design + build' }, { case: '07', label: '07 UGLQ · design + build' }, { case: '08', label: '08 QLD Law Group · design + build' }],
      aria: 'Our app and platform projects, designed and built by us, by length: CrateOnScene 5 weeks, 8Drive 10 weeks, UGLQ 12 weeks, QLD Law Group 14 weeks.',
    },
    sections: [
      {
        kind: 'getfit', eyebrow: 'What you get · who it’s for', h2: ['Research first.', 'Polish second.'], lead: ch('product').body[0], getH: 'In every project',
        get: [
          { t: 'User research and interviews', d: 'We talk to the people who’ll use it before we draw anything.' },
          { t: 'Information architecture', d: 'What goes where, and what each kind of user sees.' },
          { t: 'Wireframes and prototypes', d: 'Clickable flows you can test before a line of code.' },
          { t: 'High-fidelity UI design in Figma', d: 'Every screen, every state.' },
          { t: 'Design system creation', d: 'Components and rules, so new screens match the old ones.' },
          { t: 'Developer-ready handoff', d: 'Files your developers can build from without guessing.' },
        ],
        fit: ch('product').fit,
      },
      // TBC owner: design-only work is offered (owner 10 Nov) and quoted per project (quotedCopy.designOnly)
      { kind: 'prose', eyebrow: 'Two ways in', h2: ['We can build it.', 'Or hand it over.'], body: ['You get developer-ready files and a design system whether we build it or your own team does. Hire us for the design only and your developers get Figma files, the design system and a handoff they can build from. Or hire us for both, as CrateOnScene, 8Drive, UGLQ and QLD Law Group did.'], links: [{ label: 'Custom web apps and portals', href: '/services/web-app-development' }] },
      {
        kind: 'runs', id: 'proof', eyebrow: 'Proof · 04 design-and-build runs, shortest first', h2: ['Real projects.', 'Real weeks.'],
        runs: [
          run('03', 'MVP platform (PWA)', 'Idea to live platform in 5 weeks.', 'An idea for one hub where drivers, spectators, businesses and organisers find each other. It had to feel polished from day one, not like a prototype.', 'A tight first release (event discovery, driver profiles, business listings, organiser tools) with a car-culture UI and browsing by event type, date and location. Shipped as an installable PWA.'),
          run('06', 'Booking + fleet system', 'Screens for staff who use it all day.', 'Bookings, fleet, customer records and chauffeur scheduling were mostly manual.', 'One system for the whole rental workflow, with every screen designed for speed in a premium dark UI that matches the brand.'),
          run('07', 'Membership portal', 'Three roles. Each sees only what’s relevant.', 'Member records, communications and lodge admin lived in disconnected legacy systems.', 'One role-based portal: Grand Lodge administrators, lodge secretaries and members each see only what’s relevant to them, in a design that reflects the organisation’s heritage.'),
          run('08', 'Website + web app + mobile app', 'A portal designed around the client.', 'The firm needed a website, a client portal and a mobile app that felt like one product.', 'A clear, secure, accessible client experience across all three, with the firm’s red palette carried through every screen.'),
        ],
      },
      { kind: 'prose', eyebrow: 'MVPs', h2: ['Fast comes from', 'what you leave out.'], body: ['CrateOnScene went from scoping to launch in 5 weeks. The speed came from a tight scope: event discovery, driver profiles, business listings and organiser tools, and nothing else in the first release. A progressive web app made sense: people add it to their home screen with no app store in the way, and one build serves phones and desktops.'] },
      {
        kind: 'rows', eyebrow: 'Roles', h2: ['One platform,', 'many kinds of user.'],
        rows: [
          { t: 'CrateOnScene', d: 'Drivers, spectators, businesses and organisers, at once.', link: { label: 'The CrateOnScene case', href: '/work/03' } },
          { t: 'UGLQ Connect', d: 'Grand Lodge administrators, lodge secretaries and members, each seeing only what’s relevant.', link: { label: 'The UGLQ case', href: '/work/07' } },
          { t: 'QLD Law Group', d: 'A portal designed around the client: clear, secure and accessible.', link: { label: 'The QLD Law Group case', href: '/work/08' } },
          { t: '8Drive', d: 'Screens for staff who use the system all day.', link: { label: 'The 8Drive case', href: '/work/06' } },
        ],
      },
      {
        kind: 'process', eyebrow: 'Process and timeline', h2: SAME5,
        steps: [
          ['Short call', 'What the product must do, who uses it and what exists today.'],
          ['Research', 'Interviews with the people who’ll use it.'],
          ['Structure', 'Information architecture, flows, wireframes and a prototype.'],
          ['UI', 'High-fidelity screens in Figma and the design system behind them.'],
          ['Handoff', 'Developer-ready files for your team, or we build it.'],
        ],
        timeline: 'Our design-and-build projects have run 5–14 weeks: CrateOnScene 5, 8Drive 10, UGLQ 12, QLD Law Group 14.',
        price: { span: 14, unit: 'weeks', points: [{ at: 5, to: 14, label: 'Design + build', value: `typically ${range}` }], sub: `Design-and-build projects like CrateOnScene typically fall in our ${range} range. Design-only projects are quoted once we know the scope. ${capsCopy.custom}` },
      },
    ],
    faq: [
      { q: 'Can you only design it, without building it?', a: 'Yes. You get high-fidelity UI in Figma, a design system and a developer-ready handoff, so your own developers can build without guessing. If you’d rather we build it too, we do that as well.' },
      { q: 'What do we get at handoff?', a: 'High-fidelity UI in Figma, a design system and a developer-ready handoff, so your developers can build without guessing.' },
      { q: 'How long does an MVP take?', a: 'CrateOnScene took 5 weeks from scoping to launch, design and build together. The speed came from a tight scope: event discovery, driver profiles, business listings and organiser tools, and nothing else in the first release.' },
      { q: 'Should an MVP be a PWA or a native app?', a: 'For CrateOnScene a progressive web app made sense: people add it to their home screen with no app store in the way, and one build serves phones and desktops. A native app suits products that need deeper device features.' },
      { q: 'Can one platform serve several kinds of user?', a: 'Yes. CrateOnScene serves drivers, spectators, businesses and organisers at once, and UGLQ Connect gives Grand Lodge administrators, lodge secretaries and members access by role, each seeing only what is relevant.' },
    ],
    related: ['ux-mistakes-killing-conversions', 'website-navigation-design', 'visual-hierarchy-web-design', 'website-accessibility-guide'],
    close: close(['Week 0', 'starts here.'], { label: 'Next: Custom web apps', href: '/services/web-app-development' }, { caps: [capsCopy.custom], alsoLead: 'Exploring what’s possible?', also: [{ label: 'Immersive 3D concept sites in the Fazed Lab', href: '/lab' }] }),
    schema: { serviceType: 'UX and UI design' },
  },

  /* ── 05 Custom web apps · copy/service-pages/web-app-development.md ────────────────────────────────── */
  'web-app-development': {
    id: 'systems',
    title: 'Custom Web Apps, Booking Systems & Portals | Fazed Digital',
    description: `Booking systems, membership and client portals, and admin tools built around how your team works. Builds of 8–14 weeks, typically ${range}.`,
    crumb: 'Web apps', name: 'Custom web apps and portals',
    h1: ['Custom web apps and portals.', 'Built around how your team works.'],
    intro: `Fazed Digital builds custom web applications for teams that have outgrown spreadsheets and tools that don’t talk to each other: booking and fleet systems, membership and client portals, admin dashboards and automation. Access is by role and secure by default. Our system builds have run 8–14 weeks and typically cost ${range}. ${capsCopy.custom}`,
    cta: ch('systems').cta, ghost: { label: 'See real build times', href: '#proof' },
    meter: { lead: 'Our builds', big: '8–14', unit: 'wks', tail: `typically ${range}` },
    ruler: {
      unit: 'weeks', span: 14, bands: [{ from: 8, to: 14, label: 'Our system builds · 8–14 weeks' }], marks: [], runs: [],
      bars: [{ case: '05' }, { case: '06' }, { case: '07' }, { case: '08' }],
      aria: 'Our real system projects by build length: Canwell 8 weeks, 8Drive 10 weeks, UGLQ 12 weeks, QLD Law Group 14 weeks.',
    },
    sections: [
      { kind: 'getfit', eyebrow: 'What you get · who it’s for', h2: ['Every week of it,', 'spelled out.'], lead: ch('systems').body[0], getH: 'In every build', get: ch('systems').get.map((t) => ({ t })), fit: ch('systems').fit },
      {
        kind: 'table', eyebrow: 'By problem', h2: ['Five systems.', 'Three countries.'],
        head: ['Problem', 'What we built', 'Case'],
        rows: [
          ['Bookings and fleet on paper and memory', 'One app for bookings, real-time fleet availability, customers, chauffeurs and reporting', '06', '8Drive · Philippines'],
          ['A network running on disconnected tools', 'A role-based membership portal for every lodge in the state', '07', 'UGLQ Connect · Queensland'],
          ['Clients calling for updates', 'A client portal plus iOS and Android app: track matters, upload documents, message their lawyer', '08', 'QLD Law Group · Queensland'],
          ['A public site and an ops tool, built apart', 'The public website and a separate admin portal, delivered together', '05', 'Canwell · Australia'],
          ['An idea that needs real users, fast', 'A multi-user MVP shipped as an installable PWA', '03', 'CrateOnScene · USA'],
        ].map(([th, built, slug, name]) => ({ th, cells: [built, `[${name}](/work/${slug})`] })),
        foot: 'Need one workflow automated, not a whole system? [Business automations](/services/automations)',
      },
      {
        kind: 'runs', id: 'proof', eyebrow: 'Proof · 04 real runs, shortest first', h2: ['Real projects.', 'Real weeks.'],
        runs: [
          run('05', 'Web platform + admin portal', 'The public site and its ops tool, built as one.', 'They needed a public website and a solid admin portal for users, practitioners and content, under one system.', 'Both launched together. The admin portal replaced manual processes and gave the operations team the tools to scale.'),
          run('06', 'Booking + fleet system', 'From manual bookings to one system.', 'Bookings, fleet availability, customer records and chauffeur scheduling were mostly manual, with no central system.', 'One web app now runs bookings, real-time fleet, customers, chauffeurs and reporting. Bookings got noticeably faster.'),
          run('07', 'Membership portal', 'One secure portal for a state-wide network.', 'Membership records, communications and lodge admin ran on disconnected legacy systems.', 'One role-based portal for Grand Lodge administrators, lodge secretaries and members. Lodge secretaries report big time savings on admin.'),
          run('08', 'Website + web app + mobile app', 'Three products. One client experience.', 'They needed a website, a secure client portal and a mobile app: three connected products.', 'Clients track matters, upload documents and message their lawyer in the portal or the iOS and Android app.'),
        ],
      },
      { kind: 'prose', eyebrow: 'Build or buy', h2: ['Sometimes the answer', 'is “buy”.'], body: ['Packaged software suits many organisations. A custom system earns its cost when your structure or workflow is unusual, like UGLQ’s network of lodges reporting to one governing body, or 8Drive’s chauffeur scheduling alongside bookings and fleet. If your needs are simpler, a well-set-up off-the-shelf tool and a good website will often serve you better for far less. We’ll tell you which on the first call.'], links: [{ label: 'Online Booking System in the Philippines: Build or Buy?', href: '/blog/online-booking-system-philippines' }] },
      {
        kind: 'rows', eyebrow: 'Under the hood', h2: ['Access by role.', 'Secure by default.'],
        rows: [
          { t: 'Roles', d: 'Each kind of user sees only what’s relevant to them: UGLQ’s administrators, secretaries and members; QLD Law Group’s clients and lawyers.' },
          { t: 'APIs and integrations', d: 'Custom API design, and the links between your system and the tools you keep.' },
          { t: 'Payments', d: 'Payment gateway setup, including GCash, when a booking, ordering or membership platform needs its own checkout.' },
          { t: 'Built to grow', d: 'Database architecture planned so new features can be added, as with Canwell.' },
        ],
      },
      {
        kind: 'process', eyebrow: 'Process and timeline', h2: SAME5,
        steps: [
          ['Short call', 'How your team works today, what breaks, and who needs access. You get a rough scope and next steps.'],
          ['Direction', 'Roles, screens and data agreed before we build, so there are no surprises later.'],
          ['Build', 'Full-stack web app, APIs and the automation in between.'],
          ['Review', 'Your team tests it on a staging link and we make the changes.'],
          ['Launch and hand over', 'Ongoing maintenance and support, so it grows with you.'],
        ],
        timeline: 'Our system builds have run 8–14 weeks: Canwell 8, 8Drive 10, UGLQ 12, QLD Law Group 14. CrateOnScene, a tightly scoped MVP, took 5.',
        price: { span: 14, unit: 'weeks', points: [{ at: 8, to: 14, label: 'Our system builds · 8–14 weeks', value: range }], sub: `Every system is priced on its own scope (the users, roles and data involved), separate from our 7-day website packages. We quote once the scope is clear. ${DEPOSIT} Support after launch is priced with the build, not on our website care plans. ${capsCopy.custom}` },
      },
      { kind: 'prose', eyebrow: 'After launch', h2: ['It’s yours.', 'We stay on call.'], body: [`${IP} Ongoing maintenance and support is part of the service, scoped and priced with your build, and the system is built so it can grow with you.`] },
      {
        kind: 'rows', eyebrow: 'Where we work', h2: ['Australia,', 'or the Philippines.'],
        rows: [
          (() => { const au = caseIndex.filter((c) => c.country === 'Australia'), s = au.filter((c) => c.discipline.includes('systems')); const w = ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six']; return { t: 'Australia', d: `${w[s.length]} of our ${w[au.length].toLowerCase()} Australian cases are systems. We work remotely with clear milestones, regular video check-ins and detailed written updates.`, link: { label: 'Web design for Australian businesses', href: '/australia' } }; })(),
          { t: 'Philippines', d: 'When a spreadsheet and Messenger can’t keep up.', link: { label: 'Booking systems for Iligan and CDO businesses', href: '/web-design-iligan-city' }, market: 'ph' as const },
        ],
      },
    ],
    faq: [
      { q: 'How much does a custom system cost?', a: `Custom websites and systems typically fall in our ${rangeTo} range, depending on scope: the users, roles and data involved. Systems are priced separately from our 7-day packages, and we quote once the scope is clear.` },
      { q: 'How long does it take to build?', a: 'Our system builds have run 8–14 weeks: Canwell 8, 8Drive 10, UGLQ 12 and QLD Law Group 14. CrateOnScene, a tightly scoped MVP, took 5.' },
      { q: 'Should we build a custom system or buy software?', a: 'Packaged software suits many organisations. A custom system earns its cost when your structure or workflow is unusual, like UGLQ’s network of lodges or 8Drive’s chauffeur scheduling alongside bookings and fleet.' },
      { q: 'Can our clients or members serve themselves?', a: 'Yes. QLD Law Group’s clients track their matter, upload documents and message their lawyer in the portal and the iOS and Android app, and UGLQ members see only what is relevant to their role.' },
      { q: 'Can you add online payments, including GCash?', a: 'Yes. Payment gateway setup is part of our custom systems work when a booking, ordering or membership platform needs its own checkout, not just a plugin.' },
      { q: 'Do you look after the system after launch?', a: 'Yes. Ongoing maintenance and support is part of the service. It’s scoped and priced with your build rather than on our website care plans, and the system is built so it can grow with you.' },
    ],
    related: ['online-booking-system-philippines', 'payment-gateway-philippines-gcash', 'wordpress-vs-custom-build', { usd: 'outsource-web-development-philippines', ph: 'offshore-web-design-australia' }],
    close: close(['Week 0', 'starts here.'], { label: 'Next: Automations', href: '/services/automations' }, { caps: [capsCopy.custom] }),
    schema: { serviceType: 'Custom web application development', caseList: ['03', '05', '06', '07', '08'] },
  },

  /* ── 06 Automations · copy/service-pages/automations.md ────────────────────────────────────────────── */
  automations: {
    id: 'automations',
    title: 'Business Automation Services: n8n, Zapier & Make | Fazed',
    description: `We automate repeat work with n8n, Zapier, Make, HubSpot or custom code. One workflow from ${A.single.usd}, live in 5 business days. Start with a free 15-minute check.`,
    crumb: 'Automations', name: 'Business automations',
    h1: ['Business automations.', 'Let your tools do the busywork.'],
    intro: `Fazed Digital automates the repeat work in your business with n8n, Zapier, Make, HubSpot or custom code. Leads, follow-ups, reports, handoffs between apps: if your team does it the same way every time, we can automate it. A single automation is ${both(A.single.usd, A.single.php)} and goes live in 5 business days. Start with a free 15-minute automation check.`,
    cta: { label: 'Ask for a free 15-minute automation check', href: '/contact?service=automations' }, ghost: { label: 'See the packages', href: '#price' },
    meter: { lead: 'Live in', big: '5', unit: 'business days', tailPre: 'from', tail: m(A.single.usd, A.single.php) },
    ruler: {
      // plotted in weeks (jury P1-1): live in 5 business days = week 1, then 14 days of fixes, then optional care. The
      // pack's timeline is not set (TBC owner), so only the single automation's fix window is drawn.
      unit: 'weeks', span: 8, marks: [{ at: 1, label: 'Live in 5 business days' }],
      runs: [{ from: 1, to: 3, label: '14 days of fixes' }],
      bands: [{ from: 3, to: 8, label: `Optional care · ${A.care.usd}` }],
      bars: [LEAD_FLOW],
      aria: 'How an automation runs: a single automation goes live in 5 business days, then 14 days of fixes, then optional monthly care. Our own lead flow has run on automation since 18 October 2026.',
    },
    sections: [
      {
        kind: 'getfit', eyebrow: 'What we automate · who it’s for', h2: ['If it’s the same every time,', 'it can run itself.'], getH: 'What we work with',
        lead: 'Most small teams lose hours to copying details from one app to another: a new lead into the CRM, a booking into the calendar, an order into a spreadsheet. We connect the tools you already pay for so that work happens on its own, the same way, every time.',
        get: [
          { t: 'n8n', d: 'Flexible workflows.' }, // TBC owner: "including ones that run on your own server" is cut until self-hosting is confirmed
          { t: 'Zapier', d: 'Quick links between thousands of everyday apps.' },
          { t: 'Make', d: 'Visual, multi-step scenarios.' },
          { t: 'HubSpot', d: 'Lead capture, contact records and follow-ups inside your CRM.' },
          { t: 'Custom code', d: 'For systems with no ready-made link, and for AI agents.' },
        ],
        getNote: 'We pick the tool that fits what you already use, not the one we like best.',
        fit: ['Someone on your team copies the same details between apps every week', 'New leads wait in an inbox before anyone follows up', 'You pay for tools that don’t talk to each other'],
      },
      {
        kind: 'prose', id: 'proof', eyebrow: 'Proof · our own business', h2: ['No client automations to show yet.', 'Here’s ours.'],
        body: ['When you fill in our contact form or leave your details in our site chat, nobody copies them anywhere. The lead lands in our Gmail inbox and in HubSpot at the same moment, and a chat lead arrives with a summary and the conversation attached. If one channel fails, the others still get the lead. We built it, and we run on it every day.'],
        flow: { from: ['Contact form', 'Site chat'], to: ['Gmail · team alert', 'HubSpot · contact record'] },
        small: 'Our own business, not a client project.',
      },
      {
        kind: 'table', id: 'price', eyebrow: 'Price', h2: ['Five ways in.', 'One is free.'],
        head: ['Package', 'Price', 'What you get'],
        rows: [
          { th: A.check.name, cells: ['Free', 'A 15-minute call. We look at how work moves through your business and name what’s worth automating first.'] },
          { th: A.single.name, cells: [m(A.single.usd, A.single.php), 'One workflow, live in 5 business days, with 14 days of fixes.'] },
          { th: A.pack.name, cells: [m(A.pack.usd, A.pack.php), 'Up to 3 connected workflows, a walkthrough video and written steps, and 30 days of fixes.'] },
          { th: A.custom.name, cells: [m(A.custom.usd, `${A.custom.php[0].toUpperCase()}${A.custom.php.slice(1)} in pesos`), 'Custom code, AI agents, and systems with no ready-made link.'] },
          { th: A.care.name, cells: [m(A.care.usd, A.care.php), 'Monitoring, and fixes when a tool changes.'] },
        ],
        foot: 'Tool subscriptions (Zapier, Make, n8n, HubSpot and the rest) are in your own name and paid by you, so the automations stay yours if we stop working together.',
      },
      ...(automationTerms.founding.on ? [{ kind: 'prose' as const, eyebrow: 'Founding clients', h2: [`${automationTerms.founding.off} off`, `for our first ${automationTerms.founding.spots} clients.`] as Pair, body: [`Automations is our newest service, so the first ${automationTerms.founding.spots} automation clients get ${automationTerms.founding.off} off. Nothing is asked in return.`], small: `Founding rate for the first ${automationTerms.founding.spots} automation clients only.` }] : []),
      { kind: 'prose', eyebrow: 'Ownership', h2: ['Your accounts.', 'Your automations.'], body: ['We build inside your own accounts, and every tool subscription is in your name. Packs come with a walkthrough video and written steps, so your team knows what runs, when and why.'] },
      {
        kind: 'process', eyebrow: 'Process and timeline', h2: ['Same five steps.', 'Measured in days.'],
        steps: [
          ['Free check', 'A 15-minute call about how work moves through your business.'],
          ['Scope and price', 'Which workflow, which tools, and the fixed price, before we start.'],
          ['Build', 'In your own accounts, with your tool subscriptions in your name.'],
          ['Live', 'A single automation goes live in 5 business days.'],
          ['Fixes, then care', '14 days of fixes (30 on a pack), then optional monthly care.'],
        ],
        timeline: 'A single automation goes live in 5 business days. Packs and custom work are timed when we scope them.', // TBC owner: pack and custom timelines
      },
    ],
    faq: [
      { q: 'Which tools do you use?', a: 'n8n, Zapier, Make, HubSpot and custom code. We pick what fits the tools you already use. If two apps have no ready-made link, we write the code that connects them.' },
      { q: 'What can you automate?', a: 'Any process your team repeats the same way: moving leads into a CRM, follow-up emails, reports, bookings, handoffs between apps. If you’re not sure, the free 15-minute check is for exactly that.' },
      { q: 'How much does it cost?', a: `A single automation is ${both(A.single.usd, A.single.php)} and goes live in 5 business days. A pack of up to 3 connected workflows is ${both(A.pack.usd, A.pack.php)}. Custom work with code or AI agents starts at ${A.custom.usd.replace('from ', '')}. Care is ${both(A.care.usd, A.care.php)}.` },
      { q: 'Who pays for the tools?', a: 'You do, directly. Every tool subscription is in your own name, so the automations stay yours.' },
      { q: 'What happens when one of the apps changes?', a: `Every automation comes with a fixes window: 14 days for a single automation, 30 days for a pack. After that, automation care at ${both(A.care.usd, A.care.php)} covers monitoring and fixes when a tool changes.` },
      { q: 'Have you done this for other businesses?', a: `Not as a paid service yet. Automations is our newest service. We run our own lead flow on it: every contact form and chat lead goes to Gmail and HubSpot automatically.${automationTerms.founding.on ? ` Our first ${automationTerms.founding.spots} automation clients get ${automationTerms.founding.off} off.` : ''}` },
    ],
    related: ['online-booking-system-philippines', 'contact-page-design', 'get-more-google-reviews', 'website-maintenance-guide'],
    close: close(['Day 1', 'starts here.'], { label: 'Next: Social media management', href: '/services/social-media-management' }, {
      body: 'Ask for a free 15-minute check, or send a short brief. We’ll reply within one business day with questions, a rough scope and next steps.',
      alsoLead: 'Need a whole system, not one workflow?', also: [{ label: 'Custom web apps and portals', href: '/services/web-app-development' }],
    }),
    schema: {
      serviceType: 'Business process automation',
      offers: [
        { name: A.check.name, price: '0', url: '/contact?service=automations' },
        { name: A.single.name, price: num(A.single.usd), url: '/services/automations' },
        { name: A.pack.name, price: num(A.pack.usd), url: '/services/automations' },
        { name: A.care.name, price: num(A.care.usd), monthly: true, url: '/services/automations' },
      ],
    },
  },

  /* ── 07 Social media management · copy/service-pages/social-media-management.md ────────────────────── */
  'social-media-management': {
    id: 'social',
    title: 'Social Media Management for Small Businesses | Fazed',
    description: `Designed posts, short videos, captions and scheduling across your platforms, from your own photos and footage. Plans from ${perMonth(S.starter.usd)} a month, 3-month minimum.`,
    crumb: 'Social media', name: 'Social media management',
    h1: ['Social media management.', 'Your pages, handled every week.'],
    intro: `Fazed Digital manages your social media on every platform you use. We design the posts, edit short videos from your own photos and footage, write the captions and schedule everything. On Growth, we also reply to comments and messages on business days. Plans start at ${both(S.starter.usd, S.starter.php)}, with a 3-month minimum, then month to month.`,
    cta: { label: 'Ask about social media', href: '/contact?service=social' }, ghost: { label: 'Compare the plans', href: '#price' },
    meter: { lead: 'From', big: m(perMonth(S.starter.usd), perMonth(S.starter.php)), unit: '/month', tail: '3-month minimum' },
    ruler: {
      unit: 'months', span: 12, marks: [], runs: [],
      bands: [{ from: 0, to: 3, label: '3-month minimum' }, { from: 3, to: 12, label: 'Then month to month · 30 days’ notice' }],
      // plan rows, not clients: one dot per post per month, short videos lit, no end node, no screen sample
      bars: [
        { plan: 'starter', posts: 12, videos: 0, label: 'Plan · Starter · 12 posts a month' },
        { plan: 'growth', posts: 20, videos: 4, label: 'Plan · Growth · 20 posts, 4 short videos' },
        { plan: 'pro', posts: 30, videos: 8, label: 'Plan · Pro · 30 posts, 8 short videos' },
      ],
      aria: 'How a social media plan runs: a 3-month minimum, then month to month with 30 days’ notice. Starter has 12 posts a month, Growth 20 including 4 short videos, Pro 30 including 8 short videos.',
    },
    sections: [
      {
        kind: 'getfit', eyebrow: 'What we do · who it’s for', h2: ['Every post of it,', 'spelled out.'], getH: 'What we handle',
        lead: 'Posting every week is easy to promise and hard to keep while you’re running a business. We take it off your plate: the design, the video edits, the captions and the schedule, on every platform you use.',
        get: ['Designed posts in your brand', 'Short videos edited from your own photos and footage', 'Captions written for each post', 'Scheduling across your platforms', 'Stories, and replies to comments and messages on business days (Growth)', 'Ads management, with the ad spend paid by you (Pro)', 'A monthly report, plus a monthly call on Growth'].map((t) => ({ t })),
        fit: ['Your last post was weeks ago', 'Your pages look different every time someone new posts', 'Comments and messages wait days for a reply'],
      },
      // the copy's "we'll tell you exactly what to capture on your phone" line is cut until the owner confirms it (copy §4)
      { kind: 'prose', eyebrow: 'Your photos, our design', h2: ['We design and edit.', 'You bring the moments.'], body: ['We design every post and edit your short videos from the photos and footage you already have, or send us from the job, the shop floor or the kitchen. We don’t run photo shoots.'] },
      {
        kind: 'table', id: 'price', eyebrow: 'Price', h2: ['Three plans.', 'Growth is the one we recommend.'], colTable: true, pick: 1,
        // TBC owner: plans are not cumulative; each tier lists only its own contents, as approved
        head: ['Starter', 'Growth', 'Pro'],
        rows: [
          { th: 'Price', cells: [m(S.starter.usd, S.starter.php), m(S.growth.usd, S.growth.php), m(S.pro.usd, S.pro.php)] },
          { th: 'Platforms', cells: ['Up to 3', 'Up to 5', 'All your platforms'] },
          { th: 'Posts a month', cells: ['12 designed posts', '20, including 4 short videos', '30, including 8 short videos'] },
          { th: 'Included', cells: ['Captions, scheduling, monthly report', 'Stories, replies to comments and DMs on business days, monthly report and call', 'Ads management (ad spend paid by you), content calendar'] },
        ],
        ctas: [{ label: 'Ask about Starter', href: '/contact?service=social&plan=starter' }, { label: 'Ask about Growth', href: '/contact?service=social&plan=growth' }, { label: 'Ask about Pro', href: '/contact?service=social&plan=pro' }],
        foot: socialTerms.minimum,
      },
      // the copy's hand-off line ("messages that need you, we pass straight to you") is cut until the owner confirms it
      { kind: 'prose', eyebrow: 'Replies', h2: ['Real replies,', 'in business hours.'], body: ['On Growth, we answer comments and DMs on business days, Monday to Friday, 8:30am–5:00pm Philippine time (UTC+8).', 'That’s evening and overnight in the US, and late morning to early evening on Australia’s east coast.'] },
      ...(socialTerms.founding.on ? [{ kind: 'prose' as const, eyebrow: 'Founding clients', h2: [`${socialTerms.founding.off} off your first ${socialTerms.founding.months} months,`, `for our first ${socialTerms.founding.spots} clients.`] as Pair, body: [`Social media management is our newest service. Our first ${socialTerms.founding.spots} clients get ${socialTerms.founding.off} off the first ${socialTerms.founding.months} months of any plan. Nothing is asked in return.`], small: `First ${socialTerms.founding.spots} clients only. ${socialTerms.founding.off} applies to months 1–${socialTerms.founding.months}.` }] : []),
      {
        kind: 'process', eyebrow: 'Process', h2: ['Same five steps.', 'Then every month.'],
        steps: [
          ['Short call', 'Your platforms, your customers and what you already have to post.'],
          ['Plan', 'The month’s posts, built from your photos and footage.'],
          ['Design, edit, and you approve', 'Posts, captions and short videos. You approve the month’s content calendar before anything is posted.'], // TBC owner: monthly client approval (coordinator default, 10 Nov)
          ['Schedule and reply', 'Everything goes out on time; on Growth we answer comments and DMs on business days.'],
          ['Report', 'What went out and what people did with it, every month.'],
        ],
        timeline: socialTerms.minimum,
      },
    ],
    faq: [
      { q: 'Which platforms do you cover?', a: 'All the platforms you use. Starter covers up to 3, Growth up to 5, and Pro covers all of them.' },
      { q: 'How much does social media management cost?', a: `Starter is ${both(S.starter.usd, S.starter.php)}, Growth is ${both(S.growth.usd, S.growth.php)} and Pro is ${both(S.pro.usd, S.pro.php)}. Ad spend on Pro is paid by you, separately.` },
      { q: 'Is there a contract?', a: 'A 3-month minimum, then month to month. To stop, give us 30 days’ notice.' },
      { q: 'Do you do photo shoots?', a: 'No. We design posts and edit short videos from your own photos and footage.' },
      { q: 'When do you reply to comments and messages?', a: 'On the Growth plan, on business days: Monday to Friday, 8:30am–5:00pm Philippine time.' },
      { q: 'Do you have social media clients we can look at?', a: `Not yet. It’s our newest service${socialTerms.founding.on ? `, so our first ${socialTerms.founding.spots} clients get ${socialTerms.founding.off} off their first ${socialTerms.founding.months} months` : ''}.` },
    ],
    related: ['facebook-page-vs-website', 'content-strategy-small-business', 'brand-voice-guide', 'client-testimonials-strategy'],
    close: close(['Month 1', 'starts here.'], { label: 'Next: Web design', href: '/services/web-design' }, {
      body: 'Send a short brief: your platforms and what you sell. We’ll reply within one business day with questions and the plan we’d recommend.',
      alsoLead: 'Pages look different every time?', also: [{ label: 'Start with the brand', href: '/services/branding' }],
    }),
    schema: { serviceType: 'Social media management', offers: (['starter', 'growth', 'pro'] as const).map((k) => ({ name: `Social media management: ${S[k].name}`, price: num(S[k].usd), monthly: true, url: '/services/social-media-management' })) },
  },
};

/** whole calendar months from a start date to the build date (Oct → Nov = 1) */
const monthsSince = (iso: string, now = new Date()) => {
  const [y, mo] = iso.split('-').map(Number);
  return (now.getUTCFullYear() - y) * 12 + (now.getUTCMonth() + 1 - mo);
};
/** whole weeks from a start date (PHT) to the build date */
const weeksSince = (iso: string, now = new Date()) => Math.floor((now.getTime() - Date.parse(`${iso}T00:00:00+08:00`)) / (7 * 864e5));

export interface PlottedBar { kind: 'case' | 'own' | 'plan'; slug: string; shot: string; label: string; client: string; w: number; posts?: number; videos?: number }
/** resolve a ruler into plotted bars, shortest first (plan rows keep their order). Throws on anything unsourced. */
export function rulerBars(r: RulerDef): PlottedBar[] {
  const out = r.bars.map((b): PlottedBar | null => {
    if ('case' in b) {
      const c = kase(b.case);
      if (!c) throw new Error(`ruler: no case ${b.case} in cases.ts`);
      if (r.unit !== 'weeks') throw new Error(`ruler: case ${b.case} on a months ruler (no client retainer case exists)`);
      return { kind: 'case', slug: b.case, shot: b.case, label: b.label ?? `${b.case} ${c.title}`, client: c.title, w: weeksOf(b.case) };
    }
    if ('own' in b) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(b.since) || !/^[0-9a-f]{7,}$/.test(b.commit)) throw new Error(`ruler: own bar "${b.own}" needs a start date pinned to a commit`);
      const w = Math.min(r.span, r.unit === 'weeks' ? weeksSince(b.since) : monthsSince(b.since));
      return w > 0 ? { kind: 'own', slug: 'own', shot: '', label: b.own, client: b.own, w } : null; // under one unit old: no bar yet
    }
    return { kind: 'plan', slug: `plan-${b.plan}`, shot: '', label: b.label, client: b.label, w: r.span, posts: b.posts, videos: b.videos };
  }).filter((x): x is PlottedBar => !!x);
  return out.some((b) => b.kind === 'plan') ? out : out.sort((a, b) => a.w - b.w);
}
