// Seasonal takeovers. The window is checked in the browser (Manila time) by the boot script in Base.astro, so a
// static build switches on and off by itself. Preview anytime with ?season=halloween, hide with ?season=off.
export const HALLOWEEN = { from: [10, 20], to: [11, 1] } as const; // [month, day], inclusive, Asia/Manila
// Owner: hide Halloween after Halloween (2026-11-02). Off = no pill in the HTML, /halloween 302s to /audit (vercel.json),
// and it's out of the sitemap. Next year: set true and remove the redirect.
export const HALLOWEEN_LIVE = false;

// Black Friday (owner, 2026-11-24): 50% off the fixed-price 7-day websites, Fri 27 to Mon 30 Nov. Static pages print both
// prices; html.bf (boot script in Base.astro, visitor's own clock) picks one, so the sale starts and ends by itself.
// The form emails and the chat use blackFridayLive(). Preview off the live domain with ?season=blackfriday; `on: false` removes it all.
export const BLACK_FRIDAY = { on: true, from: [2026, 11, 27], to: [2026, 11, 30], dates: '27–30 November', ends: 'Monday 30 November' } as const;

/** Server side: live while it is 27–30 Nov anywhere in the world (UTC+14 to UTC-12), so a price someone saw is always honoured. */
export const blackFridayLive = (now = Date.now()) => {
  const { on, from: f, to: t } = BLACK_FRIDAY, H = 3_600_000;
  return on && now >= Date.UTC(f[0], f[1] - 1, f[2]) - 14 * H && now < Date.UTC(t[0], t[1] - 1, t[2] + 1) + 12 * H;
};
