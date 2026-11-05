// Home featured cases: each frame develops out of the dot pitch as it arrives, dots first, then a
// solid wave across them, and the mask comes off for good. After that the real page scrolls inside
// its frame with the page. Transforms only. Reduced motion never gets here: the frames stay whole and still.
import { gsap } from 'gsap';

export function initFeatured(root: HTMLElement) {
  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>('[data-shots]').forEach((shots) => {
      const frames = [...shots.querySelectorAll<HTMLElement>('.fw-frame')].filter((f) => f.offsetWidth > 0);
      gsap.timeline({
        scrollTrigger: { trigger: shots, start: 'top 82%', once: true },
        onComplete: () => frames.forEach((f) => f.classList.add('is-set')),
      })
        .fromTo(frames, { '--r': 0 }, { '--r': 7, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, 0)
        .fromTo(frames, { '--w': 0 }, { '--w': 125, duration: 1.2, ease: 'power2.inOut', stagger: 0.1 }, 0.2);
      frames.forEach((f) => {
        const img = f.querySelector('img');
        if (!img) return;
        gsap.to(img, {
          y: () => -Math.max(0, img.offsetHeight - f.offsetHeight),
          ease: 'none',
          scrollTrigger: { trigger: shots, start: 'top 45%', end: 'bottom 5%', scrub: true, invalidateOnRefresh: true },
        });
      });
    });
  }, root);
  return () => ctx.revert();
}
