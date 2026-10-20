// Which blog posts are written for Philippine readers (peso pricing first in the post's offer card).
// Calendar posts are picked up automatically from docs/seo/content-calendar.md ("| PH |" lines the routine ticked
// with "→ /blog/<slug>"); older PH posts are listed by hand. Lives outside the blog arrays on purpose.
import calendar from '../../docs/seo/content-calendar.md?raw';

const OLDER_PH = ['how-to-choose-web-design-agency-philippines', 'web-design-pricing-guide', 'facebook-page-vs-website'];

const fromCalendar = [...calendar.matchAll(/^- \[x\] [^|]+\|\s*PH\s*\|.*→ \/blog\/([a-z0-9-]+)/gm)].map((m) => m[1]);

export const phPosts = new Set([...OLDER_PH, ...fromCalendar]);
