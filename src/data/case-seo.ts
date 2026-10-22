// Per-case SEO layer for /work/NN (The Navigator, docs/seo/pages/case-seo.md, 2026-10-22). Facts only from cases.ts.
// Case study SEO layer. Facts come only from src/data/cases.ts (cases + CASE_EXTRA) and src/data/proof.ts (prices).
// Brief and keyword research: docs/seo/pages/case-seo.md. UK spelling in copy. No metrics (CASE_METRICS_REAL is false).
export interface CaseSeo { kw: string; h1Tail: string; seoTitle: string; seoDescription: string; summary: string; stack: string[]; faq: { q: string; a: string }[]; related: { href: string; label: string }[] }

export const caseSeo: Record<string, CaseSeo> = {
  '01': {
    kw: 'framing contractor website design',
    h1Tail: 'WordPress website for a Utah framing contractor',
    seoTitle: 'Framing Contractor Website Design, Utah | Fazed Digital',
    seoDescription: 'Framing contractor website design for A Framing Company in Utah: a portfolio-led WordPress site with pages for framing, concrete and roofing. 6 weeks.',
    summary: 'A Framing Company is a Utah framing contractor working on residential and commercial builds. Fazed Digital designed and built its portfolio-led WordPress website in 6 weeks, with pages for wood framing, concrete and roofing and a gallery of finished builds. The team edits it themselves, and the site is now a core part of how they pitch for work.',
    stack: ['WordPress'],
    faq: [
      { q: 'How long does a contractor website take to build?', a: 'The A Framing Company site took 6 weeks, including design, service pages for wood framing, concrete and roofing, a project gallery and testimonials. A smaller contractor site can go live faster on our 7-day website package, which starts at $499.' },
      { q: 'What should a framing contractor website include?', a: 'This one was built for three audiences: general contractors, developers and homeowners. It has a clear page per service, a gallery of completed builds across Utah, past-client testimonials where decisions get made, and a mobile-first layout for people checking from a job site.' },
      { q: 'Can we update our own projects after launch?', a: 'Yes. The site runs on WordPress, so the A Framing Company team adds new projects and edits content themselves, with no code and no developer needed for day-to-day changes.' },
    ],
    related: [
      { href: '/lp/7-day-website', label: '7-day website from $499' },
      { href: '/services#web', label: 'Web design and development' },
      { href: '/blog/wordpress-vs-custom-build', label: 'WordPress or a custom build?' },
    ],
  },
  '02': {
    kw: 'cleaning company branding and website',
    h1Tail: 'Brand identity and website for a Philippine cleaning company',
    seoTitle: 'Cleaning Company Branding & Website, Philippines | Fazed',
    seoDescription: 'Cleaning company branding and a WordPress website for Cleen & Green in the Philippines: an eco brand, quote requests and a franchise page. 8 weeks.',
    summary: 'Cleen & Green is a premium, eco-conscious cleaning company in the Philippines. Over 8 weeks, Fazed Digital created its brand identity and built a WordPress website with clear service scopes, a quote request flow and a dedicated franchise page. The brand now matches the service, and the franchise page opened a growth channel they could not use before.',
    stack: ['WordPress'],
    faq: [
      { q: 'How much do branding and a website cost for a cleaning business in the Philippines?', a: 'Our 7-day website packages start at ₱19,999. A full brand identity plus a website, like the 8-week Cleen & Green project, is custom work, and our custom projects typically fall between $5,000 and $20,000. We quote once the scope is clear.' },
      { q: 'What pages does a cleaning company website need?', a: 'For Cleen & Green we built a page per service (deep house cleaning, post-construction cleaning, car interior detailing and eco-safe disinfection), each with a clear scope, plus a quote request form, testimonials at decision points and a separate franchise opportunity page.' },
      { q: 'Can we edit the website ourselves?', a: 'Yes. Every service page on the Cleen & Green site runs on WordPress, so the team updates service scopes and page copy themselves without waiting for a developer.' },
    ],
    related: [
      { href: '/services#brand', label: 'Brand identity' },
      { href: '/lp/7-day-website/ph', label: '7-day website from ₱19,999' },
      { href: '/blog/rebranding-when-and-how', label: 'When and how to rebrand' },
    ],
  },
  '03': {
    kw: 'event discovery app MVP',
    h1Tail: 'Car event discovery app MVP built as a PWA',
    seoTitle: 'Event Discovery App MVP, Built as a PWA in 5 Weeks | Fazed',
    seoDescription: 'An event discovery app MVP for US car culture: a PWA for drivers, organisers, businesses and spectators, shipped in 5 weeks with no app store needed.',
    summary: 'CrateOnScene is a US platform for finding car shows, meets and racing events. Fazed Digital scoped and built its MVP in 5 weeks as a progressive web app, with event discovery, driver profiles, business listings and organiser tools. It launched as a working platform for four kinds of user, installable without an app store.',
    stack: ['Progressive web app (PWA)'],
    faq: [
      { q: 'How long does it take to build an app MVP like this?', a: 'CrateOnScene took 5 weeks from scoping to launch. The speed came from a tight scope: event discovery, driver profiles, business listings and organiser tools, and nothing else in the first release. Custom builds like this typically fall in our $5,000 to $20,000 range.' },
      { q: 'Should an MVP be a PWA or a native app?', a: 'For CrateOnScene a progressive web app made sense: people add it to their home screen straight from the browser, with no app store in the way, and one build serves phones and desktops. A native app suits products that need deeper device features.' },
      { q: 'Can one platform serve several kinds of user?', a: 'Yes. CrateOnScene serves drivers, spectators, businesses and event organisers at once, with driver profiles, business listings and organiser tools, and lets everyone browse events by type, date and location across JDM, tuner, muscle and import scenes.' },
    ],
    related: [
      { href: '/services#product', label: 'Product design' },
      { href: '/services#systems', label: 'Custom systems and web apps' },
      { href: '/work/06', label: 'Car rental system case study' },
    ],
  },
  '04': {
    kw: 'Magento to PrestaShop migration',
    h1Tail: 'Magento to PrestaShop migration for an Australian telco retailer',
    seoTitle: 'Magento to PrestaShop Migration, Zero Data Loss | Fazed',
    seoDescription: 'Magento to PrestaShop migration for The Telecom Shop, an Australian retailer: catalogue, customers and order history moved with zero data loss. 10 weeks.',
    summary: 'The Telecom Shop is an Australian online retailer of phones, tablets, accessories and plans. Fazed Digital migrated its store from Magento to PrestaShop over 10 weeks, moving the full catalogue, customer data and order history in stages. The migration finished with zero data loss and minimal disruption to trading, and the new store is noticeably faster.',
    stack: ['PrestaShop', 'Magento (source platform)'],
    faq: [
      { q: 'How long does a Magento to PrestaShop migration take?', a: 'The Telecom Shop migration took 10 weeks: a data audit and mapping first, then a parallel PrestaShop build matching the existing catalogue structure, then a staged move of products, customers and orders, with go-live sequenced to keep downtime to a minimum.' },
      { q: 'Can you migrate customers and order history, not just products?', a: 'Yes. For The Telecom Shop we moved the full catalogue, customer records and order history from Magento to PrestaShop, in stages, and the migration finished with zero data loss and minimal disruption to trading.' },
      { q: 'Will we lose search rankings when we migrate?', a: 'Protecting search was part of this brief, so the new store was built to match the existing catalogue structure. No one can promise rankings. Every migration should map old URLs to new ones and be checked in Google Search Console after launch.' },
    ],
    related: [
      { href: '/ecommerce', label: 'E-commerce builds and migrations' },
      { href: '/services#seo', label: 'SEO marketing' },
      { href: '/blog/website-speed-fixes', label: 'Website speed fixes' },
    ],
  },
  '05': {
    kw: 'health and wellness platform development',
    h1Tail: 'Health and wellness website with a custom admin portal',
    seoTitle: 'Health & Wellness Platform with Admin Portal | Fazed',
    seoDescription: 'Health and wellness platform development for Canwell in Australia: a public website and a separate admin portal for users and practitioners. 8 weeks.',
    summary: 'Canwell is an Australian health and wellness platform built around the idea “Own Your Health”. In 8 weeks, Fazed Digital designed and built its public website and a separate admin portal for managing users, practitioners and platform data. Both launched together, and the portal replaced manual processes for the operations team.',
    stack: [],
    faq: [
      { q: 'Can a website and an admin portal be built together?', a: 'Yes. For Canwell we delivered both in 8 weeks under one system: a public site that guides visitors through the service categories, and a separate admin portal at admin.canwell.com.au where the team manages users, practitioners and platform data.' },
      { q: 'What does a health platform admin portal do?', a: 'Canwell’s portal gives the operations team full visibility and control over users, practitioners and platform data in one place, replacing manual processes. The architecture was planned so new features can be added as the platform grows.' },
      { q: 'How much does a platform like this cost?', a: 'Custom websites and systems like this typically fall in our $5,000 to $20,000 range, depending on scope. We take on 3 custom projects a month and quote once we understand the users, roles and data involved.' },
    ],
    related: [
      { href: '/services#systems', label: 'Custom systems and portals' },
      { href: '/services#web', label: 'Web design and development' },
      { href: '/work/07', label: 'Membership portal case study' },
    ],
  },
  '06': {
    kw: 'car rental booking system',
    h1Tail: 'Car rental booking and fleet management system',
    seoTitle: 'Car Rental Booking System, Custom Built | Fazed Digital',
    seoDescription: 'A custom car rental booking system for 8Drive Cars in the Philippines: reservations, real-time fleet availability, customers and chauffeurs. 10 weeks.',
    summary: '8Drive Cars runs premium self-drive and chauffeured rentals in the Philippines. Fazed Digital built its internal car rental system in 10 weeks: bookings and reservations, real-time fleet availability, customer records, chauffeur assignment and reporting in one web app. 8Drive moved from mostly manual processes to one system that runs the whole operation.',
    stack: [],
    faq: [
      { q: 'How long does a custom car rental system take to build?', a: '8Drive’s system took 10 weeks to design and build. It covers the full rental workflow: bookings and reservations, real-time fleet availability, customer records, chauffeur assignment and operational reporting, with screens designed for staff who use it all day.' },
      { q: 'Why build a custom car rental system instead of buying software?', a: '8Drive runs self-drive and chauffeured rentals, so they needed chauffeur scheduling in the same system as bookings, fleet and customer records. A custom build fits the way you already work. Our custom systems typically fall in the $5,000 to $20,000 range.' },
      { q: 'Can we see the 8Drive system live?', a: 'No. It is a private, staff-only system, so there is no public link. This case study describes what it handles: bookings, real-time fleet availability, customer records, chauffeur assignment and reporting.' },
    ],
    related: [
      { href: '/services#systems', label: 'Custom booking and business systems' },
      { href: '/services#product', label: 'Product design' },
      { href: '/work/03', label: 'Event platform MVP case study' },
    ],
  },
  '07': {
    kw: 'membership portal for non-profits',
    h1Tail: 'Role-based membership portal for a Queensland non-profit',
    seoTitle: 'Membership Portal for a Non-Profit: UGLQ Connect | Fazed',
    seoDescription: 'Membership portal for a non-profit: UGLQ Connect runs member records, lodge admin, dues and reporting across Queensland, with role-based access. 12 weeks.',
    summary: 'The United Grand Lodge of Queensland governs Freemasonry across the state, with hundreds of lodges and thousands of members. In 12 weeks, Fazed Digital built UGLQ Connect, a secure, role-based membership portal for member records, lodge administration, dues tracking, communications and reporting. It replaced a patchwork of legacy tools with one platform.',
    stack: [],
    faq: [
      { q: 'How long does it take to build a membership portal?', a: 'UGLQ Connect took 12 weeks. It covers member records, lodge administration, dues tracking, communications and reporting for a state-wide network, with separate access levels for Grand Lodge administrators, lodge secretaries and members.' },
      { q: 'Should we build a custom membership portal or buy membership software?', a: 'Packaged membership software suits many organisations. A custom portal earns its cost when your structure is unusual, like UGLQ’s network of lodges reporting to one governing body. Our custom systems typically fall between $5,000 and $20,000.' },
      { q: 'How does role-based access work in a membership portal?', a: 'In UGLQ Connect, access is set by role: Grand Lodge administrators, lodge secretaries and members each see only what is relevant to them. That keeps member data secure while lodge secretaries handle their administration in the same system.' },
    ],
    related: [
      { href: '/services#systems', label: 'Custom systems and portals' },
      { href: '/work/08', label: 'Law firm client portal case study' },
      { href: '/blog/offshore-web-design-australia', label: 'Working with an offshore studio from Australia' },
    ],
  },
  '08': {
    kw: 'law firm client portal',
    h1Tail: 'Law firm website, client portal and mobile app',
    seoTitle: 'Law Firm Client Portal, Website & Mobile App | Fazed',
    seoDescription: 'A law firm client portal, website and iOS and Android app for QLD Law Group in Queensland. Clients track matters and upload documents. 14 weeks.',
    summary: 'QLD Law Group is a Queensland law firm serving individuals and companies. Over 14 weeks, Fazed Digital delivered three connected products: a public website, a secure client portal where clients track matter progress, upload documents and message their lawyer, and iOS and Android apps with the same access. Clients now self-serve uploads and status checks.',
    stack: ['iOS app', 'Android app'],
    faq: [
      { q: 'How long does it take to build a law firm client portal?', a: 'QLD Law Group’s full suite took 14 weeks: the public website, the web client portal and the iOS and Android apps, delivered together. A portal on its own, without the website and mobile apps, is a smaller scope.' },
      { q: 'What can clients do in a law firm client portal?', a: 'In QLD Law Group’s portal, clients track the progress of their matter, upload documents and message their lawyer. The same portal is in the iOS and Android app, so clients check status from their phone instead of calling or emailing the firm.' },
      { q: 'How much does a law firm client portal cost?', a: 'Custom websites and systems typically fall in our $5,000 to $20,000 range. The price depends on scope: which products you need (website, portal, app), how many practice areas, and what the portal must do. We quote once the scope is clear.' },
    ],
    related: [
      { href: '/services#systems', label: 'Custom systems and portals' },
      { href: '/services#web', label: 'Web design and development' },
      { href: '/work/07', label: 'Membership portal case study' },
      { href: '/blog/offshore-web-design-australia', label: 'Working with an offshore studio from Australia' },
    ],
  },
  '09': {
    kw: 'website for a branding studio',
    h1Tail: 'Website and CMS for an Iligan City branding studio',
    seoTitle: 'Website for a Branding Studio in Iligan City | Fazed',
    seoDescription: 'A website and CMS for Dotted Studios, a branding studio in Iligan City, built from their own Figma design with a three.js particle field. Live in one week.',
    summary: 'Dotted Studios is a strategy-led branding studio in Iligan City, led by Julz Arboleda. Fazed Digital built its website from the studio’s own Figma design in one week, adding a three.js Connect the Dots particle field, GSAP scroll motion, a content system and a four-step enquiry form. It went live at dottedstudios.com in October 2026.',
    stack: ['three.js', 'GSAP', 'Keystatic', 'Figma'],
    faq: [
      { q: 'Can you build our website from our own Figma design?', a: 'Yes. Dotted Studios designed their site in Figma, so we kept their layout, palette, type and copy, then built the motion, the content system and the four-step enquiry form on top. It went live one week after the build started.' },
      { q: 'Can a studio site have its own content system?', a: 'Yes. The Dotted Studios site is built on a content system (Keystatic) with collections for projects, blog posts, services, team and testimonials, so new work and posts go in through simple forms with a live preview, not code.' },
      { q: 'How much does a website like this cost in the Philippines?', a: 'Our 7-day website packages start at ₱19,999 ($499). Sites with custom motion, like the Dotted Studios particle field, are quoted on scope once we have seen your design. We are based in Iligan City too.' },
    ],
    related: [
      { href: '/web-design-iligan-city', label: 'Web design in Iligan City' },
      { href: '/lp/7-day-website/ph', label: '7-day website from ₱19,999' },
      { href: '/services#web', label: 'Web design and development' },
    ],
  },
};
