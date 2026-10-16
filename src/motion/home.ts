// Home DOM choreography (§5.1). The field listens to the same events (fz:* on document).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const emit = (type: string, detail?: unknown) => document.dispatchEvent(new CustomEvent(type, { detail }));

export function initHome(rm: boolean) {
  const offs: (() => void)[] = [];
  const desktop = matchMedia('(min-width: 1024px)').matches;

  /* §3 services: pinned 150vh on desktop, 5 snapped steps; real buttons step the pin */
  const svc = document.getElementById('services');
  if (svc) {
    const items = [...svc.querySelectorAll<HTMLElement>('.svc')];
    const btns = [...svc.querySelectorAll<HTMLButtonElement>('.svc-step')];
    let cur = -1;
    const show = (i: number) => {
      if (i === cur) return;
      cur = i;
      items.forEach((el, k) => el.classList.toggle('is-on', k === i));
      btns.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
      typeScope(items[i]);
      emit('fz:svc', i);
    };
    if (desktop && !rm) {
      svc.classList.add('svc-live');
      show(0);
      const pin = svc.querySelector<HTMLElement>('.svc-pin')!;
      const st = ScrollTrigger.create({
        trigger: svc, pin, start: 'top top', end: '+=150%', pinSpacing: true,
        onUpdate: (s) => show(Math.min(4, Math.floor(s.progress * 5))),
      });
      btns.forEach((b, k) => b.addEventListener('click', () => {
        const y = st.start + ((st.end - st.start) * (k + 0.5)) / 5;
        const l = (window as any).__lenis;
        l ? l.scrollTo(y, { duration: 0.8 }) : scrollTo({ top: y });
        show(k);
      }));
      // focus inside the pin scrolls it into view
      svc.addEventListener('focusin', () => { if (scrollY < st.start || scrollY > st.end) scrollTo({ top: st.start + 2 }); });
      offs.push(() => { st.kill(); svc.classList.remove('svc-live'); });
    }
  }

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

/* scope list types in mono (0.02s/char, max 0.5s) */
function typeScope(item?: HTMLElement) {
  if (!item || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  item.querySelectorAll<HTMLElement>('.svc-scope li').forEach((li, k) => {
    const full = li.dataset.full ?? li.textContent ?? '';
    li.dataset.full = full;
    const dur = Math.min(0.5, full.length * 0.02);
    const o = { n: 0 };
    gsap.fromTo(o, { n: 0 }, { n: full.length, duration: dur, delay: k * 0.08, ease: 'none', onUpdate: () => { li.textContent = full.slice(0, Math.round(o.n)); }, onComplete: () => { li.textContent = full; } });
  });
}
