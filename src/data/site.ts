export const SITE_URL = 'https://www.fazeddigital.com';
export const FOUNDED = 2022;
export const BUILD_YEAR = new Date().getFullYear();
export const YEARS = BUILD_YEAR - FOUNDED; // computed at build (4 in 2026)
export const NAP = {
  name: 'Fazed Digital',
  email: 'info@fazeddigital.com',
  phone: '+63 906 825 3451',
  tel: '+639068253451',
  city: 'Iligan City', region: 'Lanao del Norte', country: 'Philippines', countryCode: 'PH',
  hours: 'Mon–Fri 8:30am–5:00pm PHT',
  coords: '8.2280° N 124.2452° E',
  lat: 8.228, lon: 124.2452,
};
// copy/socials.md (verified 2026-10-16). No other profiles exist.
export const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61557960053584' },
  { label: 'Instagram', href: 'https://www.instagram.com/fazedddigital/' },
];
export const abs = (path: string) => new URL(path, SITE_URL).toString().replace(/(?<!:\/)\/$/, (m) => (path === '/' ? m : ''));
