// Last line of defence on every reply, checked while it streams. The prompt and the market split do the real work;
// this catches what must never reach a visitor even if the model slips: the wrong market's prices, private projects
// and a leaked prompt. Claims are not matched here ("we can't promise page one" must pass): those are for the prompt.
import { prices } from '../../data/proof';
import { CANARY, type Market } from './knowledge';

const usd = Object.values(prices.usd).map((p) => p.replace('/month', '').replace(/[$,]/g, ''));
// USD package prices, written with or without a thousands comma. Custom figures such as $5,000 stay allowed.
const USD_PACKAGE = new RegExp(`(?:\\$|\\bUSD ?|\\bUS\\$ ?)(?:${usd.map((p) => p.replace(/(\d)(\d{3})$/, '$1,?$2')).join('|')})(?!,?\\d)`, 'i');
const PESOS = /₱|\bPHP ?\d|\bP\d{1,3},\d{3}\b|\b\d{1,3}(?:,\d{3})+ ?(?:pesos|php)\b/i;
const PRIVATE = /halde|greenleaf/i;

export const SAFE_LINE = 'Sorry, I can’t help with that one here. Ask me about our services, prices or work, or [send us a brief](/contact#brief) and the team will reply within one business day.';

export function guard(text: string, market: Market): boolean {
  if (text.includes(CANARY) || PRIVATE.test(text)) return false;
  return market === 'ph' ? !USD_PACKAGE.test(text) : !PESOS.test(text);
}
