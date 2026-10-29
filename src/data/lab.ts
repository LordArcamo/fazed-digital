// Fazed Lab: the concept-site series (copy/lab.md + brief/lab-spec.md; USER ANSWERS 2026-10-17 win).
// Every entry is a concept site for a fictional brand: never client work, never results or awards.
// Stacks are from each series site's package.json + build brief (#04: OGL, Lenis; no GSAP, and
// PlayCanvas is not listed because its live configurator ships switched off).

/** #04 Halde Ø1 uses a CC BY-NC-SA 4.0 base mesh. 'full' = row + plate + silhouette + visible credit
 *  (the user's choice, 2026-10-17), 'text' = row without any render, 'hide' = not rendered. */
export const LAB_04: 'full' | 'text' | 'hide' = 'full';
/** Internal jury scores: never shown (user, 2026-10-17). The numbers stay out of the data on purpose. */
export const LAB_SHOW_JURY = false;
export const LAB_TOTAL = 10;

export type LabStatus = 'shipped' | 'research' | 'queued';
export interface LabItem {
  n: string;
  slug: string;
  /** full fictional brand name (#08: Fazzy is our real mascot; the album is the fiction) */
  brand: string;
  /** caption on the contact sheet */
  short: string;
  category: string;
  /** the concept site's own hero line */
  line?: string;
  sub?: string;
  chips?: string[];
  built?: string;
  url?: string;
  /** ISO date the site went live (GitHub repo creation, Manila time) */
  date?: string;
  status: LabStatus;
  alt?: string;
  desc?: string;
  credit?: { text: string; author: string; authorUrl: string; licence: string; licenceUrl: string; model: string };
}

export const LABEL = 'Concept site · fictional brand';

const all: LabItem[] = [
  {
    n: '01', slug: 'nocturne', brand: 'Nocturne Espresso Bar', short: 'Nocturne', category: 'Café', line: 'Pulled slow. Poured late.',
    sub: 'A crema dive into an amber flood. Every object in the scene is generated in code.',
    chips: ['Three.js', 'GPGPU', 'Web Audio', 'GSAP + Lenis'], built: 'Astro · Three.js',
    url: 'https://fazed-nocturne-espresso.vercel.app', date: '2026-10-15', status: 'shipped',
    alt: 'Nocturne Espresso Bar concept site: a black cup of espresso under warm light with the headline Pulled slow. Poured late.',
    desc: 'Concept site for a fictional espresso bar. A scroll-driven WebGL scene with a crema dive into an amber flood.',
  },
  {
    n: '02', slug: 'offcut', brand: 'OFFCUT COURT-7', short: 'OFFCUT', category: 'Sneaker drop', line: 'Take it apart.',
    sub: 'A seven-layer teardown that snaps back together, then a real unboxing finale.',
    chips: ['React Three Fiber', 'drei', 'Blender', 'GSAP + Lenis'], built: 'Astro · R3F',
    url: 'https://fazed-offcut-frame7.vercel.app', date: '2026-10-15', status: 'shipped',
    alt: 'OFFCUT COURT-7 concept site: a white leather court sneaker over the headline TAKE IT APART and a raffle countdown.',
    desc: 'Concept sneaker-drop site for a fictional brand. Scroll takes the shoe apart into seven labelled layers.',
  },
  {
    n: '03', slug: 'ossel', brand: 'Maison Ossel OS-01', short: 'Ossel', category: 'Watch', line: 'Eight beats a second.',
    sub: 'A 40× macro on the escapement that pulls back through the sapphire caseback.',
    chips: ['WebGPU', 'TSL', 'Threlte', 'Blender', 'Web Audio'], built: 'Svelte · Three.js',
    url: 'https://fazed-maison-ossel.vercel.app', date: '2026-10-16', status: 'shipped',
    alt: 'Maison Ossel OS-01 concept site: a titanium watch seen through its sapphire caseback with the headline Eight beats a second.',
    desc: 'Concept launch site for a fictional hand-wound watch whose movement runs at 4 Hz in WebGPU.',
  },
  {
    n: '04', slug: 'halde', brand: 'Halde Ø1', short: 'Halde Ø1', category: 'Electric GT', line: 'Drawn in one line.',
    sub: 'A light blade repaints the car nose to tail. Cycles-rendered plates, OGL compositor.',
    chips: ['OGL', 'Blender Cycles', 'Lenis', 'Seedance clip'], built: 'Astro · OGL',
    url: 'https://fazed-halde-o1.vercel.app', date: '2026-10-17', status: 'shipped',
    alt: 'Halde Ø1 concept site: a dark green electric GT in a pale studio, a blade of light repainting it lime, with the headline Drawn in one line.',
    desc: 'Concept site for a fictional electric GT. Path-traced renders are recoloured live by a blade of light.',
    // wording mirrors 04-electric-vehicle/site/CREDITS.md and that site's own footer credit
    credit: {
      text: 'Base 3D model: “2026 Ferrari 296 Speciale A” by OUTPISTON (Sketchfab), CC BY-NC-SA 4.0, modified (electrified and restyled) for this non-commercial concept.',
      model: '2026 Ferrari 296 Speciale A', author: 'OUTPISTON', authorUrl: 'https://sketchfab.com/outpiston',
      licence: 'CC BY-NC-SA 4.0', licenceUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
  },
  {
    n: '05', slug: 'vitrene', brand: 'Vitrène Sérum 1.47', short: 'Vitrène', category: 'Skincare', line: 'Made to disappear.',
    sub: 'A serum tuned to the refractive index of glass. Dip the pipette and it vanishes; tap the wall to drop a ripple.',
    chips: ['PixiJS', 'Blender Cycles', 'GSAP + Lenis', 'Multi-pass plates'], built: 'Astro · PixiJS',
    url: 'https://fazed-vitrene-serum.vercel.app', date: '2026-10-17', status: 'shipped',
    alt: 'Vitrène Sérum 1.47 concept site: a glass dropper bottle of amber serum against a pale blue wall with the headline Made to disappear.',
    desc: 'Concept site for a fictional optical-skincare brand. Path-traced glass passes are refracted live in the browser.',
  },
  {
    n: '06', slug: 'casa-ocaso', brand: 'Saltrae · Casa Ocaso', short: 'Casa Ocaso', category: 'Luxury real estate', line: 'Built for the last hour of light.',
    sub: 'Scroll is the clock: the sun sets on a rammed-earth villa and the house switches itself on, room by room.',
    chips: ['Three.js', 'Live lighting', 'postprocessing', 'KTX2', 'GSAP + Lenis'], built: 'Astro · Three.js',
    url: 'https://fazed-casa-ocaso.vercel.app', date: '2026-10-19', status: 'shipped',
    alt: 'Saltrae Casa Ocaso concept site: a long rammed-earth desert villa at dusk with lit windows, under the headline Built for the last hour of light.',
    desc: 'Concept site for a fictional desert villa. Real-time 3D with live lighting: scroll runs the evening from 17:52 to 21:04.',
  },
  {
    n: '07', slug: 'whiting', brand: 'Whiting', short: 'Whiting', category: 'Strength studio', line: 'Slow is strong.',
    sub: 'A chalk-dust athlete forms on the platform and lifts in tempo. Set your own tempo and watch every rep get counted.',
    chips: ['Three.js WebGPU', 'TSL', 'Live lighting', 'Motion capture', 'Lenis'], built: 'Astro · Three.js',
    url: 'https://fazed-whiting.vercel.app', date: '2026-10-21', status: 'shipped',
    alt: 'Whiting concept site: a chalk-dust athlete forming above a barbell with red plates in a dark brick mill, under the headline Slow is strong.',
    desc: 'Concept site for a fictional strength studio. Real-time 3D with live lighting: a chalk athlete lifts in tempo inside a 1920s mill.',
  },
  {
    n: '08', slug: 'plain-text', brand: 'Fazzy · PLAIN TEXT', short: 'PLAIN TEXT', category: 'Music artist', line: 'PLAIN TEXT',
    sub: 'Fazzy, our mascot, drops a debut album written as rows of text. Make a beat, remix the songs and scroll to hear them play.',
    chips: ['OGL', 'Tone.js', 'GSAP + Lenis', 'SVG rig'], built: 'Astro · OGL · Tone.js',
    url: 'https://fazed-plain-text.vercel.app', date: '2026-10-20', status: 'shipped',
    alt: 'PLAIN TEXT concept site: Fazzy the Fazed Digital mascot waving in front of rows of lime and white blocks, under a dotted PLAIN TEXT headline.',
    desc: 'Concept site for a fictional album by Fazzy, the Fazed Digital mascot. Interactive music: make a beat, remix the stems, scroll plays the song.',
  },
  {
    n: '09', slug: 'linaw', brand: 'Linaw', short: 'Linaw', category: 'Island resort', line: 'The island keeps the tide’s time.',
    sub: 'A 14-villa island in the Sulu Sea, built as a cut-away model. Walk the sandbar at low tide, dine on the dry reef, swim with the glow at night.',
    chips: ['Three.js WebGPU', 'TSL', 'Vue', 'Blender', 'Live audio'], built: 'Astro · Vue · Three.js',
    url: 'https://fazed-linaw.vercel.app', date: '2026-10-24', status: 'shipped',
    alt: 'Linaw concept site: a cut-away island model with clear turquoise water over reef and sand under a limestone cliff, beside the headline The island keeps the tide’s time.',
    desc: 'Concept site for a fictional island resort. A real-time cut-away island in the Sulu Sea, where the tide, the reef and the night glow play out as you scroll.',
  },
  {
    n: '10', slug: 'tacet', brand: 'TACET Model 01', short: 'TACET', category: 'Premium headphones', line: 'The quietest thing we make is a wave.',
    sub: 'A noise-cancelling over-ear you watch cancel noise in real time: scroll and the headphones come apart, part by part, while the sound wave flattens to silence.',
    chips: ['Next.js', 'Three.js', 'Exploded view', 'Live audio', 'Blender'], built: 'Next.js · Three.js',
    url: 'https://fazed-tacet.vercel.app', date: '2026-10-29', status: 'shipped',
    alt: 'TACET Model 01 concept site: dark graphite over-ear headphones inside a green ring, beside the headline The quietest thing we make is a wave.',
    desc: 'Concept site for a fictional headphone brand. Real-time 3D with live audio: the headphones explode into their parts while the noise cancels on screen.',
  },
];

/** in 'hide' mode #04 drops out of every list and count; in 'text' it stays but loses its imagery */
export const labItems = all.map((i) => (i.n === '04' && LAB_04 === 'hide' ? { ...i, status: 'queued' as const, hidden: true } : i)) as (LabItem & { hidden?: boolean })[];
export const labShipped = labItems.filter((i) => i.status === 'shipped');
export const labUpcoming = labItems.filter((i) => i.status !== 'shipped');
/** ids with dot imagery (silhouette bin + plate) */
export const labImaged = labShipped.filter((i) => i.n !== '04' || LAB_04 === 'full').map((i) => i.n);
export const pad2 = (k: number) => String(k).padStart(2, '0');
export const labDate = (iso?: string) => (iso ? iso.replace(/-/g, '.') : '');
export const hostOf = (url?: string) => (url ? new URL(url).host : '');
