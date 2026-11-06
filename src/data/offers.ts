// Limited offers. One switch per offer: the LP banner, the 7-day form and the lead email/HubSpot label all read
// from here, so turning an offer off removes it everywhere at once.
import { prices } from './proof';

/** Founding client rate (Lord, 2026-11-01): PH Starter for the first 5 clients, secured with a deposit. Nothing is asked
 *  in return: no discount may be tied to a review (owner, 2026-11-06). Set `on: false` when the 5 spots are gone. */
export const FOUNDING_PH = {
  on: true,
  pkg: 'starter',
  price: '₱14,999',
  standard: prices.php.starter,
  spots: 5,
} as const;

/** price shown for a package, with the founding rate applied where it is live */
export const offerPrice = (variant: 'usd' | 'php', pkg: string): { price: string; founding: boolean } => {
  const base = (prices[variant] as Record<string, string>)[pkg] ?? '';
  return variant === 'php' && FOUNDING_PH.on && pkg === FOUNDING_PH.pkg ? { price: FOUNDING_PH.price, founding: true } : { price: base, founding: false };
};
