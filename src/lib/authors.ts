// Author photos are fixed at render, not in the data (the nightly routine may still write
// old wp-content URLs, which 403). Name → local photo; null = mono initials avatar.
const MAP: Record<string, string | null> = {
  'Lord Arcamo': '/images/team/lord.jpeg',
  'Russel Heyrana': '/images/team/russel.jpeg',
  'Reancirl Balaba': null,
  'Justin Sumaya': null,
};
export function authorPhoto(name: string, value?: string | null): string | null {
  if (value && !value.includes('wp-content') && value.startsWith('/')) return value;
  return MAP[name] ?? null;
}
export const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
export const authorId = (name: string) => name.split(' ')[0].toLowerCase();
