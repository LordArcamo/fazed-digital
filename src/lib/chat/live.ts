// The small "Right now" note added after the cached prompt: the studio's open state and exact time-zone figures.
// Worked out here because daylight saving makes these easy for a model to get wrong.
import type { Market } from './knowledge';

const MANILA = 'Asia/Manila';
const ZONES: Record<Market, [string, string][]> = {
  intl: [
    ['New York / Toronto', 'America/New_York'], ['Chicago', 'America/Chicago'], ['Denver / Calgary', 'America/Denver'], ['Los Angeles / Vancouver', 'America/Los_Angeles'],
    ['Sydney / Melbourne', 'Australia/Sydney'], ['Brisbane', 'Australia/Brisbane'], ['Adelaide', 'Australia/Adelaide'], ['Perth', 'Australia/Perth'],
  ],
  ph: [],
};

const at = (d: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(d).replace(/\s/g, ' ');

/** Mon 8:30am and Mon 5:00pm Manila (UTC+8, no daylight saving), on the coming Monday so the zone's current offset applies. */
function studioDay(now: Date): [Date, Date] {
  const day = new Date(now.getTime() + 8 * 3_600_000).getUTCDay();
  const monday = new Date(now.getTime() + 8 * 3_600_000 + ((8 - day) % 7 || 7) * 86_400_000);
  const open = Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate(), 0, 30);
  return [new Date(open), new Date(open + 8.5 * 3_600_000)];
}

export const validZone = (tz: unknown): tz is string => {
  if (typeof tz !== 'string' || tz.length > 64) return false;
  try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return true; } catch { return false; }
};

export function liveNote(o: { market: Market; country: string; tz: string; page: string; leadSent: boolean; now?: Date }): string {
  const now = o.now ?? new Date();
  const local = new Date(now.getTime() + 8 * 3_600_000);
  const day = local.getUTCDay(), mins = local.getUTCHours() * 60 + local.getUTCMinutes();
  const open = day >= 1 && day <= 5 && mins >= 510 && mins < 1020;
  const [a, b] = studioDay(now);
  const span = (tz: string) => `${at(a, tz)} to ${at(b, tz)}`;
  const zones = [...(o.tz ? [['Visitor’s own time zone', o.tz] as [string, string]] : []), ...ZONES[o.market]];
  return [
    '## Right now',
    `In Iligan it is ${at(now, MANILA)}. The studio is ${open ? 'open' : 'closed, and a reply comes the next business day'}.`,
    o.country ? `Visitor's country code: ${o.country}.` : '',
    `Visitor is on the page ${o.page}.`,
    zones.length ? `A studio workday starts and ends at these local times (each weekday, Monday shown):\n${zones.map(([l, tz]) => `- ${l}: ${span(tz)}`).join('\n')}` : '',
    o.leadSent ? 'The visitor already sent their details through the form.' : '',
  ].filter(Boolean).join('\n');
}
