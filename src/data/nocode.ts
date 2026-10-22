// /framer, /webflow and /ecommerce: our showcase builds (concept sites for fictional brands, never client work).
// Facts come from ~/Projects/fazed-framer-sites/STATUS.md, ~/Projects/fazed-webflow-sites/STATUS.md and
// ~/Projects/fazed-3d-sites/commerce/SERIES-PLAN.md (2026-10-22). Only published builds are listed; Framer #02 Southerly
// is not published yet. The private Greenleaf Nurseries preview is a real prospect's mock-up: never list it.

export type Platform = 'framer' | 'webflow' | 'code';
export type Page = 'framer' | 'webflow' | 'ecommerce';

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
  /** has a shop: product range, cart or buying tool (listed on /ecommerce) */
  shop?: boolean;
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
    chips: ['Framer components', 'Shop layout', 'Code component', 'Desktop · tablet · phone'], shop: true,
    url: 'https://fun-purpose-184828.framer.app', host: 'fun-purpose-184828.framer.app', date: '2026-10-21',
    alt: 'Ricko concept site built in Framer: the headline Shake it like you mean it over a berry wave, a rice milk carton and two polaroid photos.',
  },
  {
    id: 'dawdle', platform: 'framer', brand: 'Dawdle', category: 'Cold brew · shop page', line: 'Good coffee takes its time.',
    what: 'A cold brew shop page where a drawn drip tower counts the 18-hour steep, then a four-can range with add-to-cart pills, a subscribe toggle, recipes and FAQ.',
    chips: ['Code component', 'Shop range', 'Subscribe toggle', 'Desktop · tablet · phone'], shop: true,
    url: 'https://dynamic-pitch-999479.framer.app', host: 'dynamic-pitch-999479.framer.app', date: '2026-10-22',
    alt: 'Dawdle concept site built in Framer: the headline Good coffee takes its time beside a blue panel with a drawn cold brew drip tower and a bottle.',
  },
  {
    id: 'stillroom', platform: 'framer', brand: 'Stillroom', category: 'Skincare · launch list', line: 'Soft launch.',
    what: 'A launch page for a see-through jelly serum: a holographic blob you can squish, ingredient beads that explain the formula, a countdown and two launch-list forms.',
    chips: ['Squishable blob', 'Countdown', 'Launch-list forms', 'Desktop · tablet · phone'],
    url: 'https://inexpensive-approach-652646.framer.app', host: 'inexpensive-approach-652646.framer.app', date: '2026-10-22',
    alt: 'Stillroom concept site built in Framer: the headline Soft launch next to a pink serum bottle inside a holographic blob, with an email form and a countdown.',
  },
  {
    id: 'lanewise', platform: 'framer', brand: 'Lanewise', category: 'E-bikes · test rides', line: 'Ride it in your colour.',
    what: 'An e-bike site where picking a colour repaints the whole page and the code-drawn bike, plus a model spec table and a test-ride booking form.',
    chips: ['Colour picker', 'Code-drawn bike', 'Spec table', 'Booking form'],
    url: 'https://wild-device-325670.framer.app', host: 'wild-device-325670.framer.app', date: '2026-10-22',
    alt: 'Lanewise concept site built in Framer: the headline Ride it in your colour above a lime e-bike, with a price and a Book a test ride button.',
  },
  {
    id: 'yowch', platform: 'framer', brand: 'YOWCH', category: 'Hot sauce · shop page', line: 'How brave are you today?',
    what: 'A hot sauce shop where a heat slider picks your sauce, repaints the page and makes the chilli mascot react, then five sauces, a gift box bundle and add to cart.',
    chips: ['Heat slider', 'Mascot states', 'Shop range', 'Bundle'], shop: true,
    url: 'https://rare-mars-760640.framer.app', host: 'rare-mars-760640.framer.app', date: '2026-10-22',
    alt: 'YOWCH concept site built in Framer: the headline How brave are you today? with a hot sauce bottle, a chilli mascot and a heat slider set to level 3.',
  },
  {
    id: 'mizzle', platform: 'framer', brand: 'Mizzle', category: 'Smart bottle · waitlist', line: 'The bottle that remembers for you.',
    what: 'A waitlist site for a smart water bottle with a working app demo: log a sip and the phone screen and the bottle cap both respond. Colourways, features and a waitlist band.',
    chips: ['App demo', 'Wave gradient', 'Colourways', 'Waitlist forms'],
    url: 'https://contextual-bookings-857967.framer.app', host: 'contextual-bookings-857967.framer.app', date: '2026-10-22',
    alt: 'Mizzle concept site built in Framer: the headline The bottle that remembers for you beside a white bottle and a phone app showing 1,250 ml.',
  },
  {
    id: 'softlight', platform: 'framer', brand: 'Softlight Dental', category: 'Dental clinic · bookings', line: 'Dentistry that takes its time.',
    what: 'A calm, editorial site for a family dental clinic: a flip board of the next free appointments that links straight to booking, services, a team section, a clear fees panel, emergency help and a booking form.',
    chips: ['Flip board', 'Booking form', 'Fees panel', 'Desktop · tablet · phone'],
    url: 'https://communicative-circumstances-489549.framer.app', host: 'communicative-circumstances-489549.framer.app', date: '2026-10-22',
    alt: 'Softlight Dental concept site built in Framer: the headline Dentistry that takes its time beside a flip board of next openings and a portrait of a smiling dentist.',
  },
  {
    id: 'tapswitch', platform: 'framer', brand: 'Tap & Switch', category: 'Plumber + electrician · quotes', line: 'Every job, logged in public.',
    what: 'A site for a combined plumber and electrician: a big tap-to-call button, a before-and-after slider of recent jobs you can drag, suburb chips for the service area, a licences panel and a quote form.',
    chips: ['Before/after slider', 'Tap to call', 'Service areas', 'Quote form'],
    url: 'https://breathtaking-ferret-099053.framer.app', host: 'breathtaking-ferret-099053.framer.app', date: '2026-10-22',
    alt: 'Tap & Switch concept site built in Framer: the headline Every job, logged in public with a lime tap-to-call button and a before-and-after bathroom photo slider.',
  },
  {
    id: 'signalbox', platform: 'webflow', brand: 'Signalbox', category: 'AI software · B2B', line: 'Every agent, on the board.',
    what: 'A product site for an AI agent control plane, styled like a railway signal box: a register board of agent runs, a lever that holds every run, a pinned scroll section where routes draw in, pricing, FAQ and a demo-request form. Animated with Webflow Interactions and custom SVG.',
    chips: ['Webflow Interactions', 'Variables', 'SVG', 'Webflow form', 'Structured data'],
    url: 'https://lord-rynkar-tracy-dwights-supercool-sit.webflow.io', host: 'webflow.io', date: '2026-10-20',
    alt: 'Signalbox concept site built in Webflow: the headline Every agent, on the board above a register of AI agent runs and a red lever.',
  },
  {
    id: 'madder', platform: 'code', brand: 'Madder & Weft', category: 'Rugs · online store', line: 'Rugs that fit the room, not just the floor.',
    what: 'A rug store with a 3D size planner: pick your room and its size, and the real rug appears at true scale under real-size furniture, with designer rules checked and the best size flagged. Add that size to the cart, then a demo checkout.',
    chips: ['Three.js', '3D size planner', 'Cart drawer', 'Astro'], shop: true,
    url: 'https://madder-and-weft.vercel.app', host: 'madder-and-weft.vercel.app', date: '2026-10-21',
    alt: 'Madder & Weft concept store: the headline Rugs that fit the room, not just the floor beside a red patterned rug in a bright living room.',
  },
  {
    id: 'saltkiln', platform: 'code', brand: 'Salt & Kiln', category: 'Tiles · online store', line: 'Handmade tiles, and exactly how many boxes.',
    what: 'A tile store with a 3D visualiser: a kitchen splashback or bathroom floor in your tile, pattern and grout colour, then the exact box count with cut allowance. Add the boxes to the cart, then a demo checkout.',
    chips: ['Three.js', '3D tile visualiser', 'Box calculator', 'Cart drawer'], shop: true,
    url: 'https://salt-and-kiln.vercel.app', host: 'salt-and-kiln.vercel.app', date: '2026-10-21',
    alt: 'Salt & Kiln concept store: the headline Handmade tiles, and exactly how many boxes beside a red tiled kitchen splashback.',
  },
];

export const platforms = {
  framer: {
    name: 'Framer',
    path: '/framer',
    title: 'Framer Website Design & Development | Fazed Digital',
    description: 'Framer websites designed and built by Fazed Digital in the Philippines: landing pages, waitlists, CMS blogs and shop pages, on desktop, tablet and phone.',
    eyebrow: 'Framer · Design and build',
    filter: (b: NoCodeBuild) => b.platform === 'framer',
    buildsEye: 'Built in Framer', buildsH: ['Our Framer builds.', 'Open them, click around.'],
    setupH: ['Everything a Framer site needs', 'to work on day one.'], stepBuild: 'Every page in Framer, designed for desktop, tablet and phone, with forms, motion and SEO basics in place.',
    stepHand: 'We connect your domain and hand over the Framer project, with a walkthrough of how to edit it.',
    cta: 'Talk about your Framer site', see: 'See our Framer builds', faqH: 'Questions about Framer.', endH: 'Got a Framer site in mind?', quote: 'Get a Framer quote', also: 'webflow',
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
    filter: (b: NoCodeBuild) => b.platform === 'webflow',
    buildsEye: 'Built in Webflow', buildsH: ['Our Webflow builds.', 'Open them, click around.'],
    setupH: ['Everything a Webflow site needs', 'to work on day one.'], stepBuild: 'Every page in Webflow, designed for desktop, tablet and phone, with forms, interactions and SEO basics in place.',
    stepHand: 'We connect your domain and hand over the Webflow site, with a walkthrough of how to edit it.',
    cta: 'Talk about your Webflow site', see: 'See our Webflow build', faqH: 'Questions about Webflow.', endH: 'Got a Webflow site in mind?', quote: 'Get a Webflow quote', also: 'framer',
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
  ecommerce: {
    name: 'E-commerce',
    path: '/ecommerce',
    title: 'E-commerce Website Design & Development | Fazed Digital',
    description: 'Online stores designed and built by Fazed Digital in the Philippines: product pages, carts, 3D buying tools and store migrations, quoted upfront.',
    eyebrow: 'E-commerce · Design and build',
    filter: (b: NoCodeBuild) => !!b.shop,
    buildsEye: 'Stores we built', buildsH: ['Shops you can try.', 'Add to cart, it’s safe.'],
    setupH: ['Everything a store needs', 'to sell from day one.'], stepBuild: 'Product pages, cart and checkout, built for desktop, tablet and phone and connected to your store platform.',
    stepHand: 'We launch on your domain, test real orders end to end, and show your team how to add products and run promotions.',
    cta: 'Talk about your store', see: 'Try our concept stores', faqH: 'Questions about online stores.', endH: 'Selling online, or about to?', quote: 'Get a store quote', also: '',
    h1: ['Online stores', 'that help people buy.'],
    deck: 'Fazed Digital designs and builds e-commerce websites from Iligan City, Philippines, for brands in the USA, Australia and the Philippines. Product pages, carts and buying tools that answer the question that stops a sale, like “what size?” or “how many boxes?”. We also move stores between platforms, with zero data loss.',
    setup: [
      ['Product pages that sell', 'Clear photos, variants, sizes and prices, with the answers buyers need right next to the add-to-cart button.'],
      ['Buying tools', 'Size planners, calculators and 3D previews that answer the question that stops a sale, then add the right product to the cart.'],
      ['Cart and checkout', 'A cart drawer with quantities and shipping options, connected to your store platform and payment provider.'],
      ['Store migrations', 'Products, customers and order history moved to a new platform without losing sales or search rankings.'],
      ['Fast on phones', 'Shop sections stay light; heavy 3D only loads when a shopper reaches the tool, with a simple fallback for older phones.'],
      ['SEO for products', 'Product titles, descriptions, structured data and clean category pages, so Google and AI search can find what you sell.'],
    ],
    faq: [
      { q: 'Do you build online stores?', a: 'Yes. We design and build e-commerce websites: product pages, carts and checkouts, buying tools like size planners and calculators, and full store migrations. We work with brands in the USA, Australia and the Philippines.' },
      { q: 'Which platform should my store use?', a: 'It depends on how many products you have, who runs the store and what it needs to do. We pick it with you on a short call. We have migrated a store from Magento to PrestaShop, built shop pages in Framer and built custom stores in code.' },
      { q: 'How much does an e-commerce website cost?', a: 'Custom stores are quoted after a short call, with the price upfront. If you need something smaller and fixed-price, our 7-day Pro package ($1,499, or ₱59,999 in the Philippines) is e-commerce ready.' },
      { q: 'Can you move my store to a new platform?', a: 'Yes. For The Telecom Shop in Australia we moved the full catalogue, customer data and order history from Magento to PrestaShop with zero data loss and minimal disruption to trading.' },
      { q: 'Are the stores on this page real?', a: 'The Telecom Shop is a real client. The other stores are concept sites for fictional brands, built by our team to show what we can do: the cart works, but checkout ends in a demo.' },
    ],
  },
} as const;

/** shared: when to pick which (answer-first, honest about custom code) */
export const choose = [
  ['Framer', 'Best for design-led marketing sites, launch pages and waitlists that need to look great and go live fast. Editing is simple, and the CMS covers blogs and lists.', '/framer'],
  ['Webflow', 'Best when you want more structure: bigger CMS needs, a strict class system and detailed interactions, edited by a marketing team.', '/webflow'],
  ['Custom code', 'Best for apps, portals, bookings and anything a site builder can’t do, or when you want to own the code and avoid a monthly builder plan. We build these in Astro, Next.js and WordPress.', '/services#web'],
] as const;
