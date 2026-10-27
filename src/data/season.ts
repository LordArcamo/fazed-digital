// Seasonal takeovers. The window is checked in the browser (Manila time) by the boot script in Base.astro, so a
// static build switches on and off by itself. Preview anytime with ?season=halloween, hide with ?season=off.
export const HALLOWEEN = { from: [10, 20], to: [11, 1] } as const; // [month, day], inclusive, Asia/Manila
