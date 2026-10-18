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
  /** full fictional brand name */
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
  { n: '07', slug: 'fitness', brand: 'Fitness', short: 'Fitness', category: 'Fitness studio', status: 'queued' },
  { n: '08', slug: 'music', brand: 'Music', short: 'Music', category: 'Music artist', status: 'queued' },
  { n: '09', slug: 'resort', brand: 'Resort', short: 'Resort', category: 'Island resort', status: 'queued' },
  { n: '10', slug: 'headphones', brand: 'Headphones', short: 'Headphones', category: 'Premium headphones', status: 'queued' },
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
