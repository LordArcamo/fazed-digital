import type { Tier } from '../boot/gpu';

export interface TierSpec { points: number; dpr: number; halo: boolean; ripple: boolean; compute: boolean; densify: number }

export const TIERS: Record<Exclude<Tier, 't0'>, TierSpec> = {
  t1: { points: 61440, dpr: 2, halo: true, ripple: true, compute: true, densify: 3 },
  t2: { points: 20480, dpr: 1.5, halo: true, ripple: true, compute: false, densify: 1 },
  t3: { points: 8192, dpr: 1.25, halo: false, ripple: false, compute: false, densify: 1 },
};

/** One-step downgrade used by the watchdog. */
export function downgrade(s: TierSpec): TierSpec {
  return { ...s, points: Math.max(8192, Math.round(s.points / 1.5 / 1024) * 1024), dpr: Math.max(1, s.dpr - 0.25), halo: false };
}
