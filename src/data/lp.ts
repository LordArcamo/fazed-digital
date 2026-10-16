// 7-day LP FAQ (visible copy == FAQPage JSON-LD). copy/lp-7-day-*.md + answers #3 #21 #23
export const lpFaq = (php: boolean) => [
  { q: 'What do I need to provide to get started?', a: 'Your business details, your logo (if you have one), colour or style references, and the text and photos for the site. We walk you through all of it on Day 1 with a short brief form.' },
  { q: 'Is the 7-day delivery actually guaranteed?', a: 'Yes. If you send everything we need on Day 1 and your feedback within 24 hours at each review, we launch in 7 business days. If we miss it on our side, you get 20% off the project fee.' },
  { q: 'What platform will my website be built on?', a: 'Usually WordPress (easy to manage yourself) or Astro (maximum speed and SEO). We recommend the best fit at the Day 1 kickoff.' },
  { q: 'What if I need more pages or custom features?', a: php ? 'Extra pages are ₱2,500 each. Booking systems, membership portals and custom e-commerce are scoped separately, and you get the price upfront.' : 'Extra pages are $79 each. Booking systems, membership portals and custom e-commerce are scoped separately. You get the price upfront, never as a surprise.' },
  { q: 'Do you offer ongoing maintenance?', a: `Yes. Monthly plans start at ${php ? '₱3,500/month' : '$99/month'} and cover updates, backups, security monitoring, uptime checks and small content changes.` },
  { q: 'What if I’m not happy with the design?', a: 'Every package includes revision rounds: 2 for Starter, 3 for Growth, unlimited for Pro. Our live portfolio shows the standard we hold ourselves to.' },
  { q: 'Will I own the website?', a: 'Yes. The domain, the site and the content are yours. No lock-in contract.' },
  php
    ? { q: 'What payment methods do you accept?', a: 'GCash, Maya (PayMaya), bank transfer (BPI or Metrobank) and Wise.' }
    : { q: 'How do I pay?', a: 'By Wise or bank transfer. We confirm the details with your quote.' },
  ...(php ? [
    { q: 'Can you meet in person?', a: 'If you’re in or near Iligan City, yes. Otherwise we run the kickoff on a video call.' },
    { q: 'Do you work with businesses outside Iligan?', a: 'Yes, anywhere in the Philippines. Everything runs online, from the Day 1 brief to launch.' },
  ] : []),
];
