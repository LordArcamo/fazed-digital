// /framer and /webflow: our no-code builds (concept sites for fictional brands, never client work).
// Facts come from ~/Projects/fazed-framer-sites/STATUS.md and ~/Projects/fazed-webflow-sites/STATUS.md (2026-10-21).
// Only published builds are listed; #02 Southerly (Framer) is not published yet.

export type Platform = 'framer' | 'webflow';

export interface NoCodeBuild {
  id: string;
  platform: Platform;
  brand: string;
  category: string;
  /** the build's own hero line */
  line: string;
  /** what we built, in one or two sentences */
  what: string;
  chips: string[];
  url: string;
  host: string;
  /** ISO date published */
  date: string;
  alt: string;
}

export const NOCODE_LABEL = 'Concept site · fictional brand';

export const builds: NoCodeBuild[] = [
  {
    id: 'suddle', platform: 'framer', brand: 'Suddle', category: 'Pet shampoo · waitlist', line: 'Bath time, minus the drama.',
    what: 'The bubbly, playful version of a launch site for a new dog and cat shampoo: soap bubbles you can pop (they grow back), round pebble photos, a foam cloud hero and a waitlist form. The main site adds a Bath Tips blog on Framer CMS, a waitlist pop-up and a liquid shader.',
    chips: ['Poppable bubbles', 'Framer components', 'Waitlist forms', 'Framer CMS blog', 'Desktop · tablet · phone'],
    url: 'https://stormy-board-163108.framer.app/playful', host: 'stormy-board-163108.framer.app/playful', date: '2026-10-20',
    alt: 'Suddle playful concept page built in Framer: the headline Bath time, minus the drama in a foam cloud, with round photos of a wet spaniel and a fluffy cat, soap bubbles and a waitlist email form.',
  },
  {
    id: 'ricko', platform: 'framer', brand: 'Ricko', category: 'Rice milk · shop page', line: 'Shake it like you mean it.',
    what: 'A shop page for a rice milk brand with a loud berry-and-lime look: a flavour range, add-to-cart pills, a drawn carton mascot, polaroid photos and a newsletter form. Built as reusable Framer components.',
    chips: ['Framer components', 'Shop layout', 'Code component', 'Desktop · tablet · phone'],
    url: 'https://fun-purpose-184828.framer.app', host: 'fun-purpose-184828.framer.app', date: '2026-10-21',
    alt: 'Ricko concept site built in Framer: the headline Shake it like you mean it over a berry wave, a rice milk carton and two polaroid photos.',
  },
  {
    id: 'signalbox', platform: 'webflow', brand: 'Signalbox', category: 'AI software · B2B', line: 'Every agent, on the board.',
    what: 'A product site for an AI agent control plane, styled like a railway signal box: a register board of agent runs, a lever that holds every run, a pinned scroll section where routes draw in, pricing, FAQ and a demo-request form. Animated with Webflow Interactions and custom SVG.',
    chips: ['Webflow Interactions', 'Variables', 'SVG', 'Webflow form', 'Structured data'],
    url: 'https://lord-rynkar-tracy-dwights-supercool-sit.webflow.io', host: 'webflow.io', date: '2026-10-20',
    alt: 'Signalbox concept site built in Webflow: the headline Every agent, on the board above a register of AI agent runs and a red lever.',
  },
];

export const platforms = {
  framer: {
    name: 'Framer',
    path: '/framer',
    title: 'Framer Website Design & Development | Fazed Digital',
    description: 'Framer websites designed and built by Fazed Digital in the Philippines: landing pages, waitlists, CMS blogs and shop pages, on desktop, tablet and phone.',
    eyebrow: 'Framer · Design and build',
    h1: ['Framer websites,', 'designed and built by one team.'],
    deck: 'Fazed Digital designs and builds Framer websites from Iligan City, Philippines, for businesses in the USA, Australia and the Philippines. Launch pages, waitlists, CMS blogs and shop pages, designed for desktop, tablet and phone, then handed over so your team can edit them.',
    setup: [
      ['Landing pages and waitlists', 'One strong page that gets sign-ups: the offer, the proof and a form in the right places, including a pop-up when it helps.'],
      ['Framer CMS and blogs', 'Collections for posts, tips or products, with list and article templates. Your team adds a post without touching the design.'],
      ['Motion with a reason', 'Scroll effects, hover states and small moments that make the page feel alive, with reduced-motion settings respected.'],
      ['Components you can reuse', 'Buttons, forms, cards and FAQ blocks built once as Framer components, so new pages stay on-brand.'],
      ['SEO basics, done', 'Page titles, descriptions, social images and clean headings on every page, plus a privacy page when you collect emails.'],
      ['Handover', 'The project sits in your Framer account. We show you how to edit text, images and CMS items, and publish to your domain.'],
    ],
    faq: [
      { q: 'Do you build websites in Framer?', a: 'Yes. We design and build Framer websites: launch pages, waitlists, CMS blogs and shop pages. Every page is designed for desktop, tablet and phone, and the project is handed over in your own Framer account.' },
      { q: 'How much does a Framer website cost?', a: 'We quote Framer projects after a short call, with the price upfront, because a one-page waitlist and a multi-page site with a blog are very different jobs. If you just need a fast, fixed-price site, our 7-day websites start at $499 (₱19,999 in the Philippines).' },
      { q: 'Can I edit my Framer site myself?', a: 'Yes. Text, images and CMS items like blog posts can be changed in Framer’s editor without touching the design. We show you how at handover.' },
      { q: 'Who pays for Framer hosting?', a: 'Framer charges its own site plan for a custom domain. It sits in your account and you pay Framer directly, so the site is always yours.' },
      { q: 'Are the sites on this page client work?', a: 'No. They are concept sites for fictional brands, built by our team to show what we can do in Framer. Our client case studies are on the Work page.' },
    ],
  },
  webflow: {
    name: 'Webflow',
    path: '/webflow',
    title: 'Webflow Website Design & Development | Fazed Digital',
    description: 'Webflow websites designed and built by Fazed Digital in the Philippines: product sites, interactions, CMS and forms, on desktop, tablet and phone.',
    eyebrow: 'Webflow · Design and build',
    h1: ['Webflow websites,', 'designed and built by one team.'],
    deck: 'Fazed Digital designs and builds Webflow websites from Iligan City, Philippines, for businesses in the USA, Australia and the Philippines. Product and marketing sites with real interactions, a clean class system and forms that work, then handed over so your team can edit them.',
    setup: [
      ['Product and marketing sites', 'Clear pages for software and service businesses: the product, how it works, security, pricing, FAQ and a form to book a demo.'],
      ['Webflow Interactions', 'Load animations, scroll-linked sections, toggles and reveals built in Webflow’s own interactions panel, tuned for desktop, tablet and phone.'],
      ['A tidy class system', 'Variables for colour, type and spacing, and reusable classes, so the next page is quick to build and stays consistent.'],
      ['Webflow CMS', 'Collections for posts, case studies or team members, with templates your team fills in from the Editor.'],
      ['SEO basics, done', 'Page titles, descriptions, social images, clean headings and structured data, so Google and AI search can read the site.'],
      ['Handover', 'The site sits in your Webflow workspace. We show you how to edit content and publish, and we stay on call if you need changes.'],
    ],
    faq: [
      { q: 'Do you build websites in Webflow?', a: 'Yes. We design and build Webflow websites with Webflow Interactions, variables, CMS collections and native forms. Every page is designed for desktop, tablet and phone, and the site is handed over in your Webflow workspace.' },
      { q: 'How much does a Webflow website cost?', a: 'We quote Webflow projects after a short call, with the price upfront, because scope varies a lot. If you just need a fast, fixed-price site, our 7-day websites start at $499 (₱19,999 in the Philippines).' },
      { q: 'Can my team update a Webflow site?', a: 'Yes. Your team edits text, images and CMS items in Webflow’s Editor without touching the layout. We show you how at handover.' },
      { q: 'Who pays for Webflow hosting?', a: 'Webflow charges its own site plan for a custom domain. It sits in your workspace and you pay Webflow directly, so the site is always yours.' },
      { q: 'Is the site on this page client work?', a: 'No. Signalbox is a concept site for a fictional brand, built by our team to show what we can do in Webflow. Our client case studies are on the Work page.' },
    ],
  },
} as const;

/** shared: when to pick which (answer-first, honest about custom code) */
export const choose = [
  ['Framer', 'Best for design-led marketing sites, launch pages and waitlists that need to look great and go live fast. Editing is simple, and the CMS covers blogs and lists.', '/framer'],
  ['Webflow', 'Best when you want more structure: bigger CMS needs, a strict class system and detailed interactions, edited by a marketing team.', '/webflow'],
  ['Custom code', 'Best for apps, portals, bookings and anything a site builder can’t do, or when you want to own the code and avoid a monthly builder plan. We build these in Astro, Next.js and WordPress.', '/services#web'],
] as const;
