// Service pages (Direction C): each proof screenshot develops out of the dot pitch as it arrives (A's dot → pixel
// resolve, the same develop as the home featured cases), then the mask comes off for good. Reduced motion never gets
// here: the screens stay whole and still.
import { gsap } from 'gsap';

export function initRuntime(root: HTMLElement) {
  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>('.sv-shot').forEach((f) => {
      gsap.timeline({ scrollTrigger: { trigger: f, start: 'top 82%', once: true }, onComplete: () => f.classList.add('is-set') })
        .fromTo(f, { '--r': 0 }, { '--r': 7, duration: 0.5, ease: 'power2.out' }, 0)
        .fromTo(f, { '--w': 0 }, { '--w': 125, duration: 1.2, ease: 'power2.inOut' }, 0.2);
    });
  }, root);
  return () => ctx.revert();
}
