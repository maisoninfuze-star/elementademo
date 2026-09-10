/* vesplus.co.kr clone — behaviour. A verbatim port of the home page timelines from the site's Nuxt bundle
   (pages/index → BMRAm2b8.js) and the layout (default → vhtpTbsT.js). GSAP 3.13 self-hosted in js/vendor. */
(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin);
  const $ = s => document.querySelector(s);
  const $$ = s => gsap.utils.toArray(s);

  /* description "typewriter" frames used by the intro */
  const FRAMES = ['for a perfect real estate market', 'fo a perfect real estate market', 'f a perfect real estate market', ' a perfect real estate market', 'c a perfect real estate market', 'cr a perfect real estate market', 'cre a perfect real estate market', 'crea a perfect real estate market', 'creat a perfect real estate market', 'create a perfect real estate market', 'creates a perfect real estate market'];
  const VALUES = $$('.value.anima-increment').map(el => +el.dataset.value);   // 25 · 19 · 5600 · 200 (served by /pages/main on the live site)

  /* ---------- layout: ScrollSmoother on desktop, native scroll on ≤1024px ---------- */
  let smoother = null;
  const layoutMM = gsap.matchMedia();
  layoutMM.add('(min-width: 1025px)', () => {
    smoother = ScrollSmoother.create({ wrapper: '.layout', content: '.content', ignoreMobileResize: true, smooth: 1.75, effects: false, smoothTouch: false });
    return () => { smoother.kill(); smoother = null; };
  });
  const scrollTop0 = () => smoother ? smoother.scrollTop(0) : window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  const scrollPause = on => { if (smoother) smoother.paused(on); else document.body.classList.toggle('paused', on); };

  /* ---------- nav / hamburger menu ---------- */
  const hamburger = $('.hamburger'), menu = $('.route-list-menu');
  let menuActive = false;
  const setMenu = on => { menuActive = on; hamburger.classList.toggle('active', on); menu.classList.toggle('active', on); scrollPause(on); };
  hamburger.addEventListener('click', () => setMenu(!menuActive));
  matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches && menuActive) setMenu(false); });
  /* demo: the other routes (/about, /portfolios…) are not part of this clone */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-route], a.logo-home'); if (!a) return;
    e.preventDefault(); setMenu(false);
    if (a.classList.contains('logo-home')) (smoother ? smoother.scrollTo(0, true) : window.scrollTo({ top: 0, behavior: 'smooth' }));
  });

  /* ---------- home page ---------- */
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.body.classList.add('lock');
  gsap.set('.loading', { display: 'none' });

  function build(mobile) {
    const q = new SplitText('.title-first, .title-second', { type: 'chars', charsClass: 'char' });
    const O = new SplitText(mobile ? '.script-second .line' : '.script-second', { type: 'chars', charsClass: 'char' });
    const Y = new SplitText('.pre-text-center-wrapper .p', { type: 'chars', linesClass: 'char' });
    const N = new SplitText('.image-animation-group .animation-btn span', { type: 'chars', linesClass: 'char' });
    const logo = $('.text-rail .logo'), rail = $('.text-rail'), navLogo = $('.logo-home');
    const rel = MotionPathPlugin.getRelativePosition(logo, navLogo, [.5, 1], [.5, 0]);
    const trains = $$('.text-train');
    const desc = $('.title-wrapper .description'), frame = { frame: 0 };
    desc.textContent = FRAMES[0];

    /* intro (time-driven, body locked until the title unfolds) */
    const intro = gsap.timeline()
      .fromTo(trains[0], { yPercent: 0 }, { yPercent: -100, ease: 'none', duration: 1, delay: .5 })
      .fromTo(trains[1], { yPercent: 100 }, { yPercent: 0, ease: 'none', duration: 1, delay: .5 }, '-=1.5')
      .fromTo(trains[2], { yPercent: 100 }, { yPercent: 0, ease: 'none', duration: 1, delay: .5 })
      .to(trains[1], { yPercent: -100, ease: 'none', duration: 1, delay: .5 }, '-=1.5')
      .to(frame, { frame: FRAMES.length - 1, snap: 'frame', duration: 1, ease: 'none', onUpdate: () => { desc.textContent = FRAMES[frame.frame]; } })
      .to('.title-wrapper .description', { opacity: 1, height: 0, duration: 1, ease: 'none' })
      .to(rail, { x: '+=' + rel.x, y: '+=' + rel.y, duration: 1, ease: 'none' })
      .to('.text-train.main .logo', { width: mobile ? '22.4vw' : '8.698vw', duration: 1, ease: 'none' }, '-=1')
      .fromTo('nav', { autoAlpha: 0 }, { autoAlpha: 1, duration: .5, ease: 'power2.inOut' })
      .to('.title-wrapper', { autoAlpha: 0, duration: .25, ease: 'power2.inOut' }, '-=.5')
      .fromTo('.title-bottom', { height: 0 }, { height: mobile ? '60dvh' : '50vh', duration: .5, ease: 'power2.in', onComplete: () => { document.body.classList.remove('lock'); } }, '-=.5')
      .fromTo(q.chars, { yPercent: 100 }, { yPercent: 0, duration: .5, ease: 'power2.inOut', stagger: .025 }, 'label-1')
      .fromTo(O.chars, { yPercent: 100 }, { yPercent: 0, duration: .5, ease: 'power2.inOut', stagger: .025 }, 'label-1')
      .fromTo('.images .image', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: 'power2.inOut', stagger: .025 }, 'label-1')
      .from('.scroll-indicator', { opacity: 0, duration: .5, ease: 'power2.inOut' }, 'label-1');

    /* pinned scroll story */
    const step = mobile ? '-=113.87vw' : '-=41.51vw';
    const scroll = gsap.timeline({ scrollTrigger: { trigger: '.content-wrapper', start: 'top top', end: mobile ? '1600% bottom' : '1200% bottom', scrub: 1, pin: true, toggleActions: 'play none none none', invalidateOnRefresh: true } })
      .to('.title-bottom .images', { x: step, duration: 1, ease: 'none', delay: .5 })
      .to('.title-bottom .images .image:nth-child(1)', { yPercent: 100, duration: 1, opacity: 0, ease: 'none', delay: .5 }, '-=1.5')
      .to('.title-bottom .images', { x: step, duration: 1, ease: 'none', delay: .5 })
      .to('.title-bottom .images .image:nth-child(2)', { yPercent: 100, duration: 1, opacity: 0, ease: 'none', delay: .5 }, '-=1.5')
      .to('.title-bottom .images', { x: step, duration: 1, ease: 'none', delay: .5 })
      .to('.title-bottom .images .image:nth-child(3)', { yPercent: 100, duration: 1, opacity: 0, ease: 'none', delay: .5 }, '-=1.5')
      .to('.title-bottom .images', { x: step, duration: 1, ease: 'none', delay: .5 }, 'title-disappear')
      .to('.title-bottom .images .image:nth-child(4)', { yPercent: 100, duration: 1, opacity: 0, ease: 'none', delay: .5 }, 'title-disappear')
      .to(q.chars, { yPercent: 100, duration: .5, ease: 'power2.inOut', stagger: .025 }, 'title-disappear')
      .to(O.chars, { yPercent: 100, duration: .5, ease: 'power2.inOut', stagger: .025 }, 'title-disappear')
      .to('.text-train.main', { yPercent: 100, duration: .5, ease: 'power2.inOut' }, 'title-disappear')
      .to('.title-animation-texts', { opacity: 0, duration: .5, ease: 'power2.inOut' }, 'title-disappear')
      .fromTo('.image-animation-group', { opacity: 0 }, { opacity: 1, duration: 1, ease: 'none' }, 'title-disappear')
      .fromTo('.image-grid-group .image-wrapper', { y: window.innerHeight, rotationX: -70, transformOrigin: '50% 0%', z: -900, autoAlpha: 0 }, { duration: 1, stagger: { amount: .4, from: 'random', grid: [3, 3] }, y: 0, z: 0, rotationX: 0, autoAlpha: 1, ease: 'sine' })
      .fromTo('.pre-text-wrapper.first', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'none' })
      .fromTo('.opacity-text', { autoAlpha: 0, color: '#FFF' }, { autoAlpha: 1, color: '#B19876', duration: 1, ease: 'none' })
      .to('.pre-text-wrapper.first', mobile ? { autoAlpha: 0, duration: 1, ease: 'none' } : { autoAlpha: 0, delay: 2, duration: 1, ease: 'none' })
      .fromTo('.after-image-wrapper', { xPercent: 100 }, { xPercent: 0, duration: 1, stagger: .5, ease: 'power2.inOut' }, 'scene.image-convert')
      .fromTo('.after-image-wrapper img', { xPercent: -100 }, { xPercent: 0, stagger: .5, duration: 1, ease: 'power2.inOut' }, 'scene.image-convert')
      .fromTo('.image-grid-group', { transform: 'scale3d(.4, .4, 1)' }, { transform: 'scale3d(1,1, 1)', duration: 1, ease: 'none' })
      .fromTo('.pre-text-wrapper.second', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'none' })
      .fromTo(Y.chars, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: 'power2.inOut', stagger: .025 })
      .fromTo(N.chars, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: 'power2.inOut', stagger: .025 })
      .fromTo('.image-animation-group .animation-btn .svg-border rect', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, ease: 'power2.inOut' })
      .to(Y.chars, { autoAlpha: 0, duration: 1, ease: 'power2.inOut' }, 'a-1')
      .to('.pre-text-wrapper.second', { opacity: 0, duration: 1, ease: 'none' }, 'a-1')
      .fromTo('.image-animation-group .after-image-wrapper img', { autoAlpha: 1 }, { autoAlpha: 0, duration: 1, ease: 'none' }, 'a-1')
      .fromTo('.image-animation-group .image-wrapper', { border: '1px solid #111' }, { border: '1px solid #838383', duration: 1, ease: 'none' }, 'a-1')
      .to('.image-grid-group', mobile ? { transform: 'scale3d(1,1, 1)', immediateRender: false, duration: 1, ease: 'none' } : { width: '100%', height: '100vh', transform: 'scale3d(1,1, 1)', immediateRender: false, duration: 1, ease: 'none' })
      .to('.image-grid-group .image-wrapper', { stagger: { amount: .4, from: 'random', grid: [3, 3] }, xPercent: i => i % 3 === 0 ? (mobile ? 104 : 102) : i % 3 === 2 ? (mobile ? -104 : -102) : 0, yPercent: i => i < 3 ? (mobile ? 104 : 103) : i > 5 ? (mobile ? -104 : -103) : 0, duration: 1, ease: 'none' }, 'scene.card-shuffle')
      .fromTo('.info-wrapper', { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, ease: 'none' })
      .to('.info-wrapper .info-group', mobile ? { width: '80%', height: '18%', duration: 1, ease: 'power2.inOut' } : { width: '24%', height: '24%', duration: 1, ease: 'power2.inOut' });
    if (mobile) {
      [['68%'], ['47%'], ['26%'], ['5%']].forEach(([bottom], i) => scroll.fromTo(`.info-wrapper .info-group:nth-child(${i + 1})`, { bottom: '50%', yPercent: 50, xPercent: -50, left: '50%' }, { bottom, yPercent: 0, xPercent: -50, left: '50%', duration: 1, ease: 'power2.inOut' }, 'scene.card-order'));
    } else {
      ['0.8%', '25.6%', '50.4%', '75.2%'].forEach((left, i) => scroll.fromTo(`.info-wrapper .info-group:nth-child(${i + 1})`, { top: '50%', yPercent: -50, xPercent: -50, left: '50%' }, { top: '50%', yPercent: -50, left, xPercent: 0, duration: 1, ease: 'power2.inOut' }, 'scene.card-order'));
    }
    scroll
      .fromTo('.info-wrapper .info-group .info-title', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'none' })
      .fromTo('.info-wrapper .info-group .info-val', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'none' }, '-=1')
      .fromTo('.info-wrapper .wrapper-title', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, ease: 'none' }, '-=1')
      .to('.value.anima-increment', { textContent: i => VALUES[i], duration: 1, snap: { textContent: 1 } })
      .set('.image-animation-group', { zIndex: 2 });
    if (mobile) {
      $$('.portfolio-wrapper').forEach((w, i) => scroll
        .fromTo(w, { yPercent: 100 }, { yPercent: 0, duration: 2, ease: 'none', delay: 1 }, 'portfolios-' + i)
        .fromTo(w.querySelector('.portfolio'), { yPercent: -100 }, { yPercent: 0, duration: 2, ease: 'none', delay: 1 }, 'portfolios-' + i));
    } else {
      scroll
        .fromTo('.portfolio-wrapper', { yPercent: 100 }, { yPercent: 0, duration: 1, ease: 'none', delay: i => i * 1.5 + .5 }, 'portfolios')
        .fromTo('.portfolio-wrapper .portfolio', { yPercent: -100 }, { yPercent: 0, duration: 1, ease: 'none', delay: i => i * 1.5 + .5 }, 'portfolios');
    }
    return () => { document.body.classList.remove('lock'); intro.kill(); trains.forEach(t => gsap.killTweensOf(t)); scroll.kill(); [q, O, Y, N].forEach(s => s.revert()); };
  }

  const start = () => {
    scrollTop0();
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1025px)', () => build(false));
    mm.add('(max-width: 1024px)', () => build(true));
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(start));
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
