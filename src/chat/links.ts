// Shared by the chat panel and the server: the bot's name, the limits, and the only links it may print.
export const BOT = 'Fazzy';
export const LIMITS = { userChars: 600, botChars: 3000, turns: 10, bodyBytes: 80_000 };

// A link in a reply is rendered only if it is one of the site's own pages, so a made-up or injected URL stays plain text.
const SITE_PATHS = /^\/(?:lp\/7-day-website(?:\/ph)?|audit|contact(?:\?service=\w+)?(?:#brief)?|work(?:\/\d\d)?|services(?:#\w+)?|lab|about|ecommerce|framer|webflow|web-design-iligan-city|privacy(?:#chat)?|terms|blog(?:\/[\w-]+)?)?$/;
export const isSitePath = (href: string) => SITE_PATHS.test(href);
