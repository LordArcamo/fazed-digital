// Direction C "Runtime": the one ruler every service page is drawn on. Shared by the SSR SVG poster
// (src/components/RuntimeRuler.astro) and the GL formation (formations.ts runtime()), so the dots land where the poster
// drew them. Pure: no DOM, no three.
//
// Vertical layout in px of the ruler box (height H): band/fast labels sit above `top`, bars between `top` and `base`,
// ticks end on `base`, week numbers sit under it. Every y is `a + f·H` so the SVG and CSS can place it as
// `calc(f·100% + a px)` without knowing H.

/** kind: a real case (textured with its screen), our own site/business (plain dots), or a plan row (dots per post) */
export interface RulerBar { slug: string; w: number; kind: 'case' | 'own' | 'plan'; posts?: number; videos?: number }
export interface RulerSpec { span: number; bars: RulerBar[]; bands: [number, number][]; marks: number[]; runs: [number, number][] }

export const RULER = {
  top: { desk: 30, phone: 24 },
  bottom: 26, // base = H - bottom
  inset: 14, // breathing room between the last bar and the ticks
  pitch: { desk: 4, phone: 3 }, // bar dot pitch
  rows: { desk: 4, phone: 3 }, // dot rows per bar
  node: { desk: 5, phone: 4 },
  ring: { desk: 11, phone: 8 },
};

/** y of bar k's centre line as a + f·H (px) */
export function barY(k: number, count: number, phone: boolean) {
  const top = phone ? RULER.top.phone : RULER.top.desk;
  const f = (k + 0.5) / count; // share of (H - bottom - inset - top)
  return { a: top - f * (RULER.bottom + RULER.inset + top), f };
}
export const yAt = (p: { a: number; f: number }, H: number) => p.a + p.f * H;

/** the texture row band of a 181×113 shot: 30% down the screen, where most heroes put their headline */
export function shotBand(rows: number, cols: number, luma: Uint8Array, nRows: number) {
  const band = Math.floor(rows * 0.3);
  const out: number[][] = [];
  for (let r = 0; r < nRows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) row.push(luma[(band + r * 4) * cols + c]);
    out.push(row);
  }
  // white-background screens read weakly as dots: invert them (the mock did the same for the admin logins)
  const flat = out.flat();
  const mean = flat.reduce((s, v) => s + v, 0) / flat.length;
  const inv = mean > 140;
  const vals = flat.map((v) => (inv ? 255 - v : v));
  const lo = Math.min(...vals), hi = Math.max(...vals), span = Math.max(24, hi - lo);
  // normalised 0..1 per bar, so a near-black screen still shows its structure
  return out.map((row) => row.map((v) => Math.min(1, Math.max(0, ((inv ? 255 - v : v) - lo) / span))));
}
/** tone of a bar dot from its normalised luma (0..1 → gray → white) */
export const barTone = (v: number) => 0.3 + 0.65 * v;
