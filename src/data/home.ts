import { prices } from './proof';

// Home FAQ (visible copy == FAQPage JSON-LD). docs/seo/pages/answer-first-copy.md §2
export const homeFaq = [
  { q: 'How much does a website cost?', a: `Our fixed-price 7-day websites start at ${prices.usd.starter} (${prices.php.starter} in the Philippines). Growth is ${prices.usd.growth} (${prices.php.growth}) and Pro is ${prices.usd.pro} (${prices.php.pro}). Extra pages are ${prices.usd.page} (${prices.php.page}). Custom websites and systems are quoted after a discovery call and typically run ${prices.customRange}. Care plans start at ${prices.usd.care} (${prices.php.care}).` },
  { q: 'How long does it take?', a: 'A 7-day website goes live in 7 business days if you send everything we need on Day 1 and your feedback within 24 hours at each review. If we miss it on our side, you get 20% off. Custom websites take 4 to 12+ weeks, brand identity 4–6 weeks, and our system builds have run 8–14 weeks.' },
  { q: 'Can a Philippine studio build for a US or Australian business?', a: 'Yes. Most of our case studies are for clients in the USA and Australia, including a framing contractor in Utah and a law firm in Queensland. We work remotely with clear milestones, regular video check-ins and written updates. Prices are in US dollars, paid by Wise or bank transfer.' },
  { q: 'Who owns the website?', a: `You do. Once it’s paid for, the domain, hosting, logins, design files and content are yours, all in your name. There’s no lock-in contract. If you want us to look after it, care plans start at ${prices.usd.care} (${prices.php.care} in the Philippines).` },
];
