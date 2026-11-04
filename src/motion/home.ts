// Home DOM choreography (§5.1). The field listens to the same events (fz:* on document).
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initServices } from './services';

const emit = (type: string, detail?: unknown) => document.dispatchEvent(new CustomEvent(type, { detail }));

export function initHome(rm: boolean) {
  const offs: (() => void)[] = [];

  /* §3 services: the layered deck (reduced motion keeps the stacked rows) */
  const svc = document.getElementById('services');
  if (svc && !rm) offs.push(initServices(svc));

  /* §5 flood: circle wipe from Day 1 (scrub), then days light 1→7 */
  const flood = document.getElementById('flood');
  if (flood && !rm) {
    const days = [...flood.querySelectorAll<HTMLElement>('.day')];
    const a = ScrollTrigger.create({
      trigger: flood, start: 'top 85%', end: 'top 15%', scrub: true,
      onUpdate: (s) => flood.style.setProperty('--flood', `${(s.progress * 150).toFixed(1)}%`),
      onLeave: () => flood.style.setProperty('--flood', '150%'),
    });
    const b = ScrollTrigger.create({
      trigger: flood, start: 'top 40%', end: 'bottom 70%', scrub: true,
      onUpdate: (s) => days.forEach((d, i) => d.classList.toggle('is-lit', s.progress * 7.2 > i)),
    });
    offs.push(() => { a.kill(); b.kill(); flood.style.removeProperty('--flood'); });
  }

  /* §8 people: hover/focus parity → field lights the person's node */
  const ppl = document.querySelector<HTMLElement>('[data-rings-anchor]');
  if (ppl) {
    const on = (e: Event) => {
      const p = (e.target as HTMLElement).closest<HTMLElement>('[data-person]');
      ppl.querySelectorAll('.person').forEach((x) => x.classList.toggle('is-on', x === p));
      emit('fz:person', p ? Number(p.dataset.person) : -1);
    };
    const off = () => { ppl.querySelectorAll('.person').forEach((x) => x.classList.remove('is-on')); emit('fz:person', -1); };
    ppl.addEventListener('pointerover', on);
    ppl.addEventListener('focusin', on);
    ppl.addEventListener('pointerleave', off);
    ppl.addEventListener('focusout', off);
    offs.push(() => { ppl.removeEventListener('pointerover', on); ppl.removeEventListener('focusin', on); ppl.removeEventListener('pointerleave', off); ppl.removeEventListener('focusout', off); });
  }

  return () => offs.forEach((f) => f());
}
