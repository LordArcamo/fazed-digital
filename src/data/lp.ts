// 7-day LP FAQ (visible copy == FAQPage JSON-LD). copy/lp-7-day-*.md + answers #3 #21 #23
// Order = strongest objection first (docs/conversion/lp-7day-conversion.md §1 #7). Every answer is a fact already
// on the site: prices/caps (proof.ts), founding rate (offers.ts), hours (site.ts), process + guarantee (Lp.astro).
import { prices } from './proof';
import { FOUNDING_PH, offerPrice } from './offers';
import { NAP } from './site';

export const lpFaq = (php: boolean) => {
  const P = php ? prices.php : prices.usd;
  return [
    { q: 'Is the 7-day delivery actually guaranteed?', a: 'Yes, with two conditions on your side: send everything we need on Day 1, and send your feedback within 24 hours at each review. Do that and we launch in 7 business days. If we miss it on our side, you get 20% off the project fee.' },
    php
      ? { q: 'Why does it cost less than a typical agency?', a: 'Because the scope is fixed. Each package has a set number of pages and revision rounds, and every build follows the same 5-step process. No hourly rates, no open-ended scope. You see the full price before you commit.' }
      : { q: 'Why does it cost less than a typical agency?', a: 'Because the scope is fixed. Each package has a set number of pages and revision rounds, and every build follows the same 5-step process. No hourly rates, no open-ended scope. We’re also a small studio based in Iligan City, Philippines, working with clients in the USA and Australia.' },
    { q: 'What happens after I send the brief?', a: `A real person replies within one business day (${NAP.hours}) with your confirmed start date. No payment now, and no commitment until you approve the quote.` },
    { q: 'What do I need to provide to get started?', a: `Your business details, your logo (if you have one), colour or style references, and the text and photos for the site. We walk you through all of it on Day 1 with a short brief form.${php ? ' Have a Facebook page? Share it and we’ll pull your photos and details from it.' : ''}` },
    { q: 'What if I’m not happy with the design?', a: 'You see your design mockups on Day 2–3, before anything is built. Every package includes revision rounds: 2 for Starter, 3 for Growth, unlimited for Pro. On Day 6 you test the whole site on a staging link before it goes live.' },
    ...(php ? [] : [{ q: 'Who will I be working with?', a: `A small team based in Iligan City, Philippines, led by our founder. You get a direct line to the people designing and building your site. We reply within one business day, ${NAP.hours} (UTC+8).` }]),
    { q: 'Will I own the website?', a: 'Yes. The domain, the site and the content are yours. No lock-in contract.' },
    { q: 'Are the domain and hosting included?', a: 'We can provide your domain and connect it for you. Hosting is your choice: we launch your site on the host you prefer, in your own account, and every build is optimised to load in under 2 seconds.' },
    { q: 'What if I change my mind?', a: 'You pay nothing until you approve the quote. If you’ve paid a deposit and change your mind before work starts, it’s refunded.' },
    php
      ? { q: 'What payment methods do you accept?', a: `GCash, Maya (PayMaya), bank transfer (BPI or Metrobank) and Wise.${FOUNDING_PH.on ? ' Founding client rate spots are secured with a deposit, refundable if you change your mind before work starts.' : ''}` }
      : { q: 'How do I pay?', a: 'By Wise or bank transfer. We confirm the details with your quote.' },
    { q: 'What if I need more pages or custom features?', a: `Extra pages are ${P.page} each. Booking systems, membership portals and custom e-commerce are scoped separately. You get the price upfront, never as a surprise.` },
    { q: 'Do you offer ongoing maintenance?', a: `Yes. Monthly plans start at ${P.care} and cover updates, backups, security monitoring, uptime checks and small content changes.` },
    { q: 'What platform will my website be built on?', a: 'Usually WordPress (easy to manage yourself) or Astro (maximum speed and SEO). We recommend the best fit at the Day 1 kickoff.' },
    ...(php ? [
      { q: 'Can you meet in person?', a: 'If you’re in or near Iligan City, yes. Otherwise we run the kickoff on a video call.' },
      { q: 'Do you work with businesses outside Iligan?', a: 'Yes, anywhere in the Philippines. Everything runs online, from the Day 1 brief to launch.' },
    ] : []),
  ];
};

// The 3 packages and the 7-day process: shown on the LPs (Lp.astro) and read by the site chat (src/lib/chat/knowledge.ts).
export const lpPlans = (variant: 'usd' | 'php') => {
  const P = variant === 'php' ? prices.php : prices.usd;
  const st = offerPrice(variant, 'starter'); // { price, founding }: the founding rate while FOUNDING_PH.on, else the standard price
  return [
    { id: 'starter', name: 'Starter', price: st.price, was: st.founding ? P.starter : '', tag: st.founding ? `Founding rate · ${FOUNDING_PH.spots} spots` : '', for: st.founding ? `New businesses getting online. Founding rate for our first ${FOUNDING_PH.spots} clients, secured with a refundable deposit.` : 'New businesses getting online', rows: ['5 custom-designed pages', 'Mobile-responsive layout', 'On-page SEO setup', 'Contact form', '2 revision rounds', '7-day delivery'] },
    { id: 'growth', name: 'Growth', price: P.growth, for: 'Growing small businesses', popular: true, rows: ['8 custom-designed pages', 'Custom design system', 'Advanced on-page SEO', 'Blog + CMS setup · Google Analytics + Search Console', '3 revision rounds', '7-day delivery'] },
    { id: 'pro', name: 'Pro', price: P.pro, for: 'Businesses ready to scale', rows: ['10+ custom pages', 'Full brand integration', 'Performance optimised (under 2s load)', 'E-commerce ready · Priority support', 'Unlimited revisions', '7-day delivery'] },
  ];
};

export const lpProcess = [
  ['Day 1', 'Kickoff & brief', 'You fill in a short brief and send your logo, photos and references. We confirm goals and the timeline.'],
  ['Day 2–3', 'Design', 'We design your custom mockups. You review and send feedback within 24 hours.'],
  ['Day 4–5', 'Build', 'We build the full site: mobile-first, fast-loading and set up for search.'],
  ['Day 6', 'Review & revise', 'You test it on our staging link. We make the final changes.'],
  ['Day 7', 'Launch', 'Your site goes live. We connect your domain, launch on the host you prefer and hand everything over.'],
];
