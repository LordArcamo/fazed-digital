// copy/home.md HOME-03 (node blocks). Full chapters for /services live in copy/services.md.
export const services = [
  { id: 'web', n: '01', title: 'Web design & development', line: 'Fast, mobile-first sites you can update yourself, built to bring in enquiries.', scope: ['Custom design', 'WordPress / Astro', 'Core Web Vitals', 'CMS handover'], proof: { label: 'CASE 01 →', name: 'A Framing Company', href: '/work/01' } },
  { id: 'brand', n: '02', title: 'Brand identity', line: 'Logos, colour, type and guidelines that make a good business look as good as it is.', scope: ['Logo system', 'Colour + type', 'Guidelines', 'Templates'], proof: { label: 'CASE 02 →', name: 'Cleen & Green', href: '/work/02' } },
  { id: 'seo', n: '03', title: 'SEO marketing', line: 'Get found by the people already searching for what you sell, locally or worldwide.', scope: ['Technical audit', 'Keywords', 'On-page', 'GA4 + Search Console'], proof: { label: 'READ THE GUIDES →', name: 'SEO guides', href: '/blog' } },
  { id: 'product', n: '04', title: 'Product design', line: 'Research, flows and UI for apps and platforms people actually finish using.', scope: ['UX research', 'Wireframes', 'Figma UI', 'Design systems'], proof: { label: 'CASE 03 →', name: 'CrateOnScene', href: '/work/03' } },
  { id: 'systems', n: '05', title: 'Custom systems', line: 'Booking, membership and admin tools built around how your team really works.', scope: ['Web apps', 'Portals', 'APIs', 'Automation'], proof: { label: 'CASE 06 →', name: '8Drive', href: '/work/06' } },
] as const;

// copy/services.md [SERV-01..05] + answers-2026-10-16.md (#6 range, #17 local SEO/GBP, #18 SEO timing)
type Link = { label: string; href: string };
export interface Chapter {
  id: string; n: string; h2: string; outcome: string; body: string[]; get: string[]; fit: string[];
  proof: { tag: string; text: string; link: Link }[]; timeline?: string; reading: Link[]; cta: Link;
}
const post = (slug: string, label: string): Link => ({ label, href: `/blog/${slug}` });
export const chapters: Chapter[] = [
  {
    id: 'web', n: '01', h2: 'Web design & development', outcome: 'A website that brings in enquiries, not just compliments.',
    body: [
      'Your website is often the first meeting a customer has with you, and usually on a phone. We design it custom (no templates, ever) and build it to load fast, read clearly and push people towards one action: call, book or buy.',
      'We build in WordPress when your team wants to edit everything themselves, and in Astro, React, Next.js or Webflow when speed and flexibility matter most. We’ll recommend the right fit, not the one we like best.',
      'When it launches, the domain, hosting, logins and files are yours. No lock-in.',
    ],
    get: ['Custom design, no templates', 'Built in WordPress, Astro, React, Next.js or Webflow', 'Mobile-first, accessibility to WCAG 2.1 AA', 'Core Web Vitals optimisation', 'Headless or editable CMS, with handover training', 'Ongoing support and maintenance (plans from $99/month)'],
    fit: ['Your site looks older than your business', 'You’re losing bids or bookings to competitors who just look more credible', 'You need a site your own team can update'],
    proof: [
      { tag: 'Case 01 · USA', text: 'A Framing Company: a WordPress site built around the project portfolio, used in the bidding process.', link: { label: 'Read the A Framing case', href: '/work/01' } },
      { tag: 'Case 08 · AU', text: 'QLD Law Group: the website, client portal and mobile app as one suite.', link: { label: 'Read the QLD Law Group case', href: '/work/08' } },
      { tag: 'Case 04 · AU', text: 'The Telecom Shop: e-commerce migration with zero data loss.', link: { label: 'Read the Telecom Shop case', href: '/work/04' } },
    ],
    timeline: 'Websites take 4 weeks for simpler builds and 12+ weeks for complex ones. Need it in a week?',
    reading: [post('wordpress-vs-custom-build', 'WordPress vs custom build'), post('small-business-website-checklist', 'Small business website checklist'), post('website-speed-fixes', 'Why is my website so slow?')],
    cta: { label: 'Start a website project', href: '/contact?service=web' },
  },
  {
    id: 'brand', n: '02', h2: 'Brand identity', outcome: 'Look as good as you actually are.',
    body: [
      'Plenty of businesses are better than they look. A brand closes that gap. We build a complete identity system (logo, colour, type, voice) so every touchpoint, from your van to your website, says the same thing in the same way.',
      'We start with positioning, not with the logo. Who are you for, and what should they feel? Then we design the system, write the rules down and hand you files your team can use for years.',
    ],
    get: ['Logo design and all its variations', 'Typography system and font licensing guidance', 'Colour palette and usage rules', 'Brand guidelines document', 'Social media templates', 'Print and packaging design'],
    fit: ['You’ve moved up-market and your brand hasn’t', 'Your materials look different every time someone new makes them', 'You’re launching something new and want it right the first time'],
    proof: [{ tag: 'Case 02 · PH', text: 'Cleen & Green: a premium eco brand and a WordPress site, plus a franchise section that opened a new growth channel.', link: { label: 'Read the Cleen & Green case', href: '/work/02' } }],
    timeline: 'Brand identity projects typically take 4–6 weeks.',
    reading: [post('why-brand-identity-matters', 'Why brand identity matters'), post('brand-colours-guide', 'How to choose brand colours'), post('brand-style-guide', 'Brand style guide'), post('rebranding-when-and-how', 'When to rebrand')],
    cta: { label: 'Start a brand project', href: '/contact?service=brand' },
  },
  {
    id: 'seo', n: '03', h2: 'SEO marketing', outcome: 'Get found by people already looking for you.',
    body: [
      'The customers who search are the ones most ready to buy. SEO puts you in front of them, whether that’s “framing contractor Utah” or “cleaning service near me” in Cagayan de Oro.',
      'We fix the technical foundation first, then build the keyword and content plan, optimise every page and earn links that count. Every month you get a plain-English report: what we did, what moved, and what’s next.',
    ],
    get: ['Technical SEO audit and fixes', 'Keyword and content strategy', 'On-page optimisation', 'Link acquisition (relevant links only, no schemes)', 'Monthly reporting and analytics', 'Google Search Console and GA4 setup', 'Local SEO and Google Business Profile, for businesses that serve an area'],
    fit: ['You have a decent site that nobody finds', 'Competitors outrank you for the searches that pay', 'You’ve never set up Search Console or GA4 properly'],
    proof: [
      { tag: 'Case 01 · USA', text: 'A Framing Company: more inbound enquiries from contractors and developers who found them through search.', link: { label: 'Read the A Framing case', href: '/work/01' } },
      { tag: 'Our own site', text: '37+ practical guides on our blog, plus structured data on every page of this site. We practise what we sell.', link: { label: 'Read the SEO guides', href: '/blog/category/seo' } },
    ],
    timeline: 'SEO is a retainer. Setup takes about a month; results usually show in 6–12 months. Ask us about options on your discovery call.',
    reading: [post('seo-for-new-websites', 'SEO for new websites'), post('on-page-seo-checklist', 'On-page SEO checklist'), post('local-seo-small-business-guide', 'Local SEO guide'), post('google-business-profile-optimization', 'Google Business Profile optimisation'), post('technical-seo-small-business', 'Technical SEO')],
    cta: { label: 'Ask about SEO', href: '/contact?service=seo' },
  },
  {
    id: 'product', n: '04', h2: 'Product design', outcome: 'Apps and platforms people finish using.',
    body: [
      'A feature nobody can find is a feature nobody uses. We design the flows, screens and system behind your app or platform: research and structure first, polished UI second.',
      'You get developer-ready files and a design system, whether we build it or your own team does.',
    ],
    get: ['User research and interviews', 'Information architecture', 'Wireframes and prototypes', 'High-fidelity UI design in Figma', 'Design system creation', 'Developer-ready handoff'],
    fit: ['You’re turning an idea into an MVP', 'Your platform works but confuses people', 'Your dev team needs designs they can build from without guessing'],
    proof: [
      { tag: 'Case 03 · USA', text: 'CrateOnScene: event discovery designed for four kinds of user, shipped as a PWA in 5 weeks.', link: { label: 'Read the CrateOnScene case', href: '/work/03' } },
      { tag: 'Case 08 · AU', text: 'QLD Law Group: a client portal designed around the client’s experience, clear and secure.', link: { label: 'Read the QLD Law Group case', href: '/work/08' } },
    ],
    reading: [post('ux-mistakes-killing-conversions', '7 UX mistakes killing conversions'), post('website-navigation-design', 'Website navigation design'), post('visual-hierarchy-web-design', 'Visual hierarchy in web design')],
    cta: { label: 'Start a product project', href: '/contact?service=product' },
  },
  {
    id: 'systems', n: '05', h2: 'Custom system development', outcome: 'Software that fits how your team works.',
    body: [
      'Off-the-shelf tools rarely fit. So your team ends up working around spreadsheets, inboxes and three apps that don’t talk to each other. We build the one system that replaces them: bookings, memberships, portals, dashboards and the automation in between.',
      'Access by role, secure by default, and built so it can grow with you.',
    ],
    get: ['Full-stack web applications', 'Custom API design and integration', 'Business process automation', 'Internal tools and dashboards', 'Database architecture and optimisation', 'Ongoing maintenance and support'],
    fit: ['Your operations run on manual processes and memory', 'You’ve outgrown a patchwork of legacy tools', 'You need clients or members to self-serve'],
    proof: [
      { tag: 'Case 06 · PH', text: '8Drive: bookings, fleet, customers and chauffeurs in one rental system.', link: { label: 'Read the 8Drive case', href: '/work/06' } },
      { tag: 'Case 07 · AU', text: 'UGLQ: a role-based membership portal for the Freemason lodges across Queensland.', link: { label: 'Read the UGLQ case', href: '/work/07' } },
      { tag: 'Case 05 · AU', text: 'Canwell: a public site and admin portal delivered together.', link: { label: 'Read the Canwell case', href: '/work/05' } },
    ],
    timeline: 'Our system builds have run 8–14 weeks (Canwell 8, 8Drive 10, UGLQ 12, QLD Law Group 14).',
    reading: [post('wordpress-vs-custom-build', 'WordPress vs custom build'), post('website-maintenance-guide', 'Website maintenance guide')],
    cta: { label: 'Scope a system', href: '/contact?service=systems' },
  },
];

export const serviceFaq = [
  { q: 'Do you work with businesses outside the Philippines?', a: 'Yes. Most of our case studies are for clients in the USA and Australia. We work remotely with clear milestones, regular video check-ins and detailed written updates.' },
  { q: 'How long does a project take?', a: 'Brand identity takes 4–6 weeks. Websites take 4 weeks for simpler builds and 12+ weeks for complex ones. Need it fast? Our 7-day website package has a fixed timeline and price.' },
  { q: 'How much does a website cost?', a: 'Our 7-day packages start at $499 (₱19,999 in the Philippines). Custom projects are quoted after a discovery call, and a typical custom website or system runs $5,000–$20,000 depending on scope.' },
  { q: 'How long does SEO take?', a: 'Setup takes about a month: the technical fixes, keyword plan and tracking. Results usually show in 6–12 months, depending on your market and competition. You get a plain-English report every month.' },
  { q: 'Will I own my website?', a: 'Yes. Your domain, hosting, logins, design files and content are yours once paid for. No lock-in contracts.' },
  { q: 'Which platforms do you build on?', a: 'WordPress when you want to edit everything yourself. Astro, React or Next.js when performance and flexibility matter most. Webflow when it fits. We recommend the best fit for you.' },
  { q: 'Do you offer support after launch?', a: 'Yes. Monthly maintenance plans start at $99/month (₱3,500 in the Philippines), and SEO retainers are available for continued growth.' },
];
