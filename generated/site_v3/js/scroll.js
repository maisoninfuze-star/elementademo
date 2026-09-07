/* Scroll — Lenis smooth scrolling (wheel only; touch stays native) and the pinned-stage progress. */
export function initScroll({ reduce }) {
  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (target, opts = {}) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.4, ...opts });
    else if (typeof target === 'number') window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  return { lenis, scrollTo };
}
/* Progress of the pinned story: 0 when its top reaches the viewport top, 1 when its bottom reaches the viewport bottom. */
export function pinProgress(el, onUpdate) {
  return ScrollTrigger.create({ trigger: el, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => onUpdate(s.progress) });
}
export function progressToY(el, p) { return el.offsetTop + p * (el.offsetHeight - window.innerHeight); }
