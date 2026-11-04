// Home services wall. Pinned on desktop: all five words stay on screen, scroll (or hover/focus) lights one, and the
// dot grid swells into that service's real case image: a halftone wave on a canvas, one dot per lattice cell.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initServices(svc: HTMLElement) {
  const items = [...svc.querySelectorAll<HTMLElement>('.svc')];
  const pics = items.map((el) => el.querySelector<HTMLElement>('.svc-pic')!);
  const imgs = pics.map((p) => p.querySelector('img')!);
  const list = svc.querySelector<HTMLElement>('.svc-list')!;
  const pin = svc.querySelector<HTMLElement>('.svc-pin')!;
  const words = [...svc.querySelectorAll<HTMLElement>('.svc-word')];
  svc.classList.add('svc-live');
  imgs.forEach((i) => { i.loading = 'eager'; });

  const canvas = document.createElement('canvas');
  canvas.className = 'svc-dots';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2';
  list.append(canvas);
  const ctx = canvas.getContext('2d')!;
  const css = getComputedStyle(document.documentElement);
  const lime = css.getPropertyValue('--lime').trim();
  const cell = parseFloat(css.getPropertyValue('--pitch')) || 24;

  let cur = -1, entered = false, wave: gsap.core.Tween | null = null, target = -1;
  const settle = (i: number) => pics.forEach((el, k) => el.classList.toggle('is-shown', k === i));

  const paint = (img: HTMLImageElement, p: number, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell), full = cell * 0.76;
    const sparks: [number, number, number][] = [];
    ctx.save();
    ctx.beginPath();
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      // the wave crosses left to right with a slight fall; each cell has 0.42 of the run to open fully
      const t = Math.min(1, Math.max(0, (p - (x / cols) * 0.46 - (y / rows) * 0.12) / 0.42));
      if (t <= 0) continue;
      const cx = (x + 0.5) * cell, cy = (y + 0.5) * cell, r = full * t * t;
      ctx.moveTo(cx + r, cy);
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      if (t < 0.34) sparks.push([cx, cy, 1.5 + t * 7]);
    }
    ctx.clip();
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    ctx.drawImage(img, (img.naturalWidth - w / s) / 2, 0, w / s, h / s, 0, 0, w, h);
    ctx.restore();
    ctx.fillStyle = lime;
    ctx.beginPath();
    for (const [x, y, r] of sparks) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); }
    ctx.fill();
  };

  const bloom = (i: number) => {
    // cut off mid-wave: that picture lands at once, so the next wave always opens over a full image
    if (wave?.isActive() && target >= 0) settle(target);
    wave?.kill();
    target = i;
    const img = imgs[i];
    const go = () => {
      if (i !== cur) return;
      const { width: w, height: h } = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const st = { p: 0 };
      wave = gsap.to(st, {
        p: 1, duration: 1, ease: 'none',
        onUpdate: () => paint(img, st.p, w, h),
        onComplete: () => { settle(i); ctx.clearRect(0, 0, w, h); },
      });
    };
    img.complete && img.naturalWidth ? go() : img.decode().then(go, go);
  };

  const show = (i: number) => {
    if (i === cur) return;
    cur = i;
    items.forEach((el, k) => el.classList.toggle('is-on', k === i));
    if (entered) bloom(i);
  };
  show(0);

  // the stage keeps the screenshots' own 16:10, so real work is never cropped, and gives way on short screens
  const fit = () => {
    const room = list.clientHeight - parseFloat(getComputedStyle(list).getPropertyValue('--detail'));
    list.style.setProperty('--shot', `${Math.min(pics[0].clientWidth / 1.6, room)}px`);
  };
  fit();

  const st = ScrollTrigger.create({
    trigger: svc, pin, start: 'top top', end: '+=220%', pinSpacing: true,
    onRefresh: fit,
    onUpdate: (s) => show(Math.min(4, Math.floor(s.progress * 5))),
  });

  // first sight: the words rise, then the first picture blooms
  gsap.set(words, { yPercent: 18, autoAlpha: 0 });
  const intro = ScrollTrigger.create({
    trigger: svc, start: 'top 62%', once: true,
    onEnter: () => {
      entered = true;
      gsap.to(words, { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.07, clearProps: 'all' });
      bloom(cur);
    },
  });

  const hover = (e: Event) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('.svc-name')?.parentElement;
    if (li) show(+li.dataset.i!);
  };
  // keyboard: a focused word lights its service and brings the pin into view
  const focus = (e: Event) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>('.svc');
    if (!li) return;
    if (scrollY < st.start || scrollY > st.end) scrollTo({ top: st.start + ((st.end - st.start) * (+li.dataset.i! + 0.5)) / 5 });
    show(+li.dataset.i!);
  };
  list.addEventListener('pointerover', hover);
  svc.addEventListener('focusin', focus);

  return () => {
    wave?.kill();
    st.kill();
    intro.kill();
    list.removeEventListener('pointerover', hover);
    svc.removeEventListener('focusin', focus);
    canvas.remove();
    gsap.set(words, { clearProps: 'all' });
    pics.forEach((el) => el.classList.remove('is-shown'));
    list.style.removeProperty('--shot');
    svc.classList.remove('svc-live');
  };
}
