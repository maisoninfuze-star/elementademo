/* Elementa Expériences — /vesplus/ demo behaviour.
   Converted in place from the vesplus.co.kr clone: same stack (GSAP 3.13 core, ScrollTrigger, ScrollSmoother, SplitText,
   DrawSVGPlugin, MotionPathPlugin, all self-hosted in js/vendor), same structural ideas (intro logo flying into the nav,
   pinned dimensional photo grid with colour wipes, outlined buttons, full-screen chapter reveals), Elementa content.
   One script for the home page and the secondary pages: every block checks that its markup exists.
   Copy lives in js/i18n.js (generated from src/i18n.json by tools/build.py). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const html = document.documentElement;
  const hasGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText && window.DrawSVGPlugin);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anim = hasGsap && !reduce;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin);
  if (reduce) html.classList.add('reduced');
  if (anim) html.classList.add('js-anim');
  const nav = $('.nav'), main = $('main'), footer = $('.site-footer'), early = $('.early'), intro = $('#intro'), hero = $('.hero');
  const page = html.dataset.page || 'home';
  const isMobile = () => matchMedia('(max-width: 1024px)').matches;
  const inertAll = v => [main, footer, early].forEach(el => { if (el) el.inert = v; });

  /* ---------------- copy (FR / EN) ---------------- */
  const I18N = window.EL_I18N || { fr: {}, en: {} };
  const urlLang = new URLSearchParams(location.search).get('lang');
  let lang = (() => {
    if (urlLang === 'fr' || urlLang === 'en') return urlLang;
    try { const s = localStorage.getItem('elementa-lang'); if (s === 'fr' || s === 'en') return s; } catch (e) {}
    return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  })();
  const t = k => (I18N[lang] && I18N[lang][k] != null ? I18N[lang][k] : I18N.fr[k]);
  function applyLang() {
    html.lang = lang;
    const title = t(`meta.${page}.title`), desc = t(`meta.${page}.desc`);
    if (title) document.title = title;
    const set = (sel, attr, v) => { const m = $(sel); if (m && v) m.setAttribute(attr, v); };
    set('meta[name="description"]', 'content', desc); set('meta[property="og:title"]', 'content', title); set('meta[property="og:description"]', 'content', desc);
    set('meta[property="og:locale"]', 'content', lang === 'fr' ? 'fr_CA' : 'en_CA'); set('meta[property="og:locale:alternate"]', 'content', lang === 'fr' ? 'en_CA' : 'fr_CA');
    $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v != null && !Array.isArray(v)) el.innerHTML = v; });
    $$('[data-i18n-list]').forEach(el => { const v = t(el.dataset.i18nList); if (v) el.innerHTML = v.map(x => `<li>${x}</li>`).join(''); });
    $$('[data-i18n-options]').forEach(el => { const v = t(el.dataset.i18nOptions); if (v) { const i = el.selectedIndex; el.innerHTML = v.map(x => `<option>${x}</option>`).join(''); el.selectedIndex = Math.max(0, i); } });
    $$('[data-i18n-alt]').forEach(el => { const v = t(el.dataset.i18nAlt); if (v) el.alt = v; });
    $$('[data-i18n-aria]').forEach(el => { const v = t(el.dataset.i18nAria); if (v) el.setAttribute('aria-label', v); });
    $$('[data-i18n-ph]').forEach(el => { const v = t(el.dataset.i18nPh); if (v) el.placeholder = v; });
    const other = lang === 'fr' ? 'en' : 'fr';
    $$('.lang').forEach(b => { b.textContent = b.classList.contains('lang-alt') || b.classList.contains('lang-foot') ? t('langAlt') : t('lang'); b.setAttribute('aria-label', t('langAria')); b.lang = other; });
    $$('[data-page-link]').forEach(a => { const on = a.dataset.pageLink === page; a.classList.toggle('active', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    try { localStorage.setItem('elementa-lang', lang); } catch (e) {}
  }
  applyLang();

  /* ---------------- smooth scroll (desktop) ---------------- */
  let smoother = null, locked = false, menuOpen = false;
  const overlayOpen = () => !!(($('#lightbox') && !$('#lightbox').hidden) || ($('#tour') && !$('#tour').hidden));
  if (anim && window.ScrollSmoother) {
    gsap.matchMedia().add('(min-width: 1025px)', () => {
      smoother = ScrollSmoother.create({ wrapper: '.layout', content: '.content', smooth: 1.75, effects: false, smoothTouch: false, ignoreMobileResize: true });
      if (locked || menuOpen || overlayOpen()) smoother.paused(true);
      return () => { smoother.kill(); smoother = null; };
    });
  }
  const scrollToEl = (el, smooth = true) => {
    if (smoother) smoother.scrollTo(el, smooth && !reduce, 'top top');
    else el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
  };
  const pauseScroll = () => { document.body.classList.add('paused'); if (smoother) smoother.paused(true); };
  const resumeScroll = () => { if (menuOpen || overlayOpen()) return; document.body.classList.remove('paused'); if (smoother && !locked) smoother.paused(false); };

  /* ---------------- scroll lock (intro) ---------------- */
  const lock = () => { locked = true; document.body.classList.add('lock'); if (smoother) smoother.paused(true); };
  const unlock = () => { locked = false; document.body.classList.remove('lock'); if (smoother && !menuOpen && !overlayOpen()) smoother.paused(false); };
  window.addEventListener('error', () => { try { finishIntro(); unlock(); } catch (e) {} });

  /* ---------------- intro (home only): the four signs, the emblem, the wordmark, the flight to the nav ---------------- */
  // plays on every visit; only history navigation (back/forward) skips it
  const introSeen = (() => { try { const n = performance.getEntriesByType('navigation')[0]; return !!n && n.type === 'back_forward' && sessionStorage.getItem('elementa-intro') === '1'; } catch (e) { return false; } })();
  let introDone = false, introStarted = false, introTl = null, watchdog = null;
  const heroState = { reveal: null };
  function finishIntro() {
    if (introDone) return; introDone = true; clearTimeout(watchdog);
    if (introTl) { introTl.kill(); introTl = null; }
    try { sessionStorage.setItem('elementa-intro', '1'); } catch (e) {}
    html.classList.remove('intro-on'); if (intro) intro.hidden = true;
    inertAll(false); nav.classList.add('is-on');
    unlock();
    if (heroState.reveal) heroState.reveal.play();
    const id = decodeURIComponent(location.hash.slice(1)); const target = id && document.getElementById(id);
    const skipHadFocus = document.activeElement === $('.intro-skip') || document.activeElement === document.body;
    if (intro && skipHadFocus) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
    requestAnimationFrame(() => { if (hasGsap) ScrollTrigger.refresh(); if (target) requestAnimationFrame(() => scrollToEl(target, false)); });
  }
  function runIntro() {
    if (!intro || introSeen || !hasGsap) { finishIntro(); return; }
    introStarted = true; lock(); inertAll(true); html.classList.add('intro-on');
    $('.intro-skip').addEventListener('click', finishIntro);
    $('.intro-skip').focus({ preventScroll: true });
    watchdog = setTimeout(finishIntro, 12000);
    const svg = $('.intro-svg');
    const sun = $('.sign-sun', svg), fire = $('.sign-fire', svg), tree = $('.sign-tree', svg), water = $('.sign-water', svg);
    const oval = $('.oval-draw', svg), ovalStroke = $('.oval-stroke', svg), rays = $$('.sun-strokes line', svg);
    const emblem = $('.emblem-final', svg), wordmark = $('.wordmark-final', svg), tagline = $('.tagline-final', svg), wmClip = $('.wm-clip-rect', svg);
    if (reduce) {   // finished logo, briefly, then the page
      gsap.set(wmClip, { attr: { width: 4600 } }); gsap.set([emblem, wordmark, tagline], { opacity: 1 });
      setTimeout(finishIntro, 1400); return;
    }
    const BOX = { sun: [1851, 325, 3142, 1340], fire: [2075, 648, 2918, 1487], tree: [2262, 895, 2731, 1735], water: [1857, 1520, 3136, 2125] };
    const SC = { x: 2500, y: 1925 }, SOLO = 2300;
    const geo = k => { const [x0, y0, x1, y1] = BOX[k]; const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; return { cx, cy, s: SOLO / Math.max(x1 - x0, y1 - y0), dx: SC.x - cx, dy: SC.y - cy }; };
    const G = { sun: geo('sun'), fire: geo('fire'), tree: geo('tree'), water: geo('water') };
    const solo = (el, g) => ({ svgOrigin: `${g.cx} ${g.cy}`, x: g.dx, y: g.dy, scale: g.s });
    const staging = { x: 0, y: 0, scale: 0.9, opacity: 0.22, duration: 0.6, ease: 'power2.inOut' };
    gsap.set(sun, solo(sun, G.sun)); gsap.set(fire, solo(fire, G.fire)); gsap.set(tree, solo(tree, G.tree)); gsap.set(water, solo(water, G.water));
    gsap.set(rays, { drawSVG: '0%' }); gsap.set(ovalStroke, { drawSVG: '50% 50%' }); gsap.set(wmClip, { attr: { width: 0 } });
    const flight = (group, target, cx, cy) => {
      let m = null;
      const measure = () => {
        if (m) return m;
        const k = svg.getBoundingClientRect().width / 4700;
        const cur = group.getBoundingClientRect(), tgt = target.getBoundingClientRect();
        return (m = { x: ((tgt.left + tgt.width / 2) - (cur.left + cur.width / 2)) / k, y: ((tgt.top + tgt.height / 2) - (cur.top + cur.height / 2)) / k, scale: tgt.width / cur.width });
      };
      return { svgOrigin: `${cx} ${cy}`, x: () => measure().x, y: () => measure().y, scale: () => measure().scale, duration: 0.8, ease: 'power3.inOut' };
    };
    const fE = flight(emblem, $('.nav-emblem'), 2496.5, 1187), fW = flight(wordmark, $('.nav-wordmark'), 2497, 2867);
    introTl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: finishIntro })
      .set(sun, { opacity: 1 }, 0)
      .to(rays, { drawSVG: '100%', duration: 0.5, stagger: { each: 0.012, from: 'center' }, ease: 'power2.out' }, 0.05)
      .to(sun, staging, 0.7)
      .fromTo(fire, { opacity: 0, scale: G.fire.s * 0.92 }, { opacity: 1, scale: G.fire.s, duration: 0.55 }, 0.75)
      .to(fire, staging, 1.4)
      .fromTo(tree, { opacity: 0, scale: G.tree.s * 0.92 }, { opacity: 1, scale: G.tree.s, duration: 0.55 }, 1.45)
      .to(tree, staging, 2.1)
      .set(water, { opacity: 1 }, 2.15)
      .fromTo($$('.wave', water), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.09 }, 2.15)
      .to(water, { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.0, ease: 'power3.inOut' }, 2.8)
      .to($('.wave-extra', water), { opacity: 0, duration: 0.5 }, 2.8)
      .to([sun, fire, tree], { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.inOut', stagger: 0.06 }, 2.85)
      .set(oval, { opacity: 1 }, 2.95)
      .to(ovalStroke, { drawSVG: '0% 100%', duration: 1.0 }, 2.95)
      .set([sun, fire, tree, water, oval], { opacity: 0 }, 4.0)
      .set(emblem, { opacity: 1 }, 4.0)
      .set(wordmark, { opacity: 1 }, 4.02)
      .to(wmClip, { attr: { width: 4600 }, duration: 0.65, ease: 'power2.out' }, 4.05)
      .fromTo(tagline, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45 }, 4.3)
      .to(tagline, { opacity: 0, duration: 0.3 }, 4.7)
      .to(emblem, fE, 4.7)
      .to(wordmark, fW, 4.7)
      .call(() => nav.classList.add('is-on'), null, 5.15)
      .to(intro, { autoAlpha: 0, duration: 0.35 }, 5.2);
  }

  /* ---------------- navigation, menu, anchors ---------------- */
  const hamburger = $('.hamburger'), menu = $('#menu');
  let menuOpener = null;
  const focusables = root => $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', root).filter(el => el.offsetParent !== null);
  const trapTab = (root, e) => {
    if (e.key !== 'Tab') return; const f = focusables(root); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  };
  function openMenu() {
    if (menuOpen) return; menuOpen = true; menuOpener = document.activeElement;
    menu.hidden = false; requestAnimationFrame(() => menu.classList.add('active'));
    hamburger.setAttribute('aria-expanded', 'true'); inertAll(true); pauseScroll();
    focusables(menu)[0].focus();
  }
  function closeMenu() {
    if (!menuOpen) return; menuOpen = false;
    menu.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false');
    setTimeout(() => { menu.hidden = true; }, reduce ? 0 : 350);
    inertAll(false); resumeScroll();
    (menuOpener && menuOpener.focus ? menuOpener : hamburger).focus();
  }
  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  menu.addEventListener('keydown', e => trapTab(menu, e));
  matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeLightbox(); closeTour(); } });
  $$('.lang').forEach(b => b.addEventListener('click', () => { if (mm) { mm.revert(); mm = null; } lang = lang === 'fr' ? 'en' : 'fr'; applyLang(); rebuildScroll(); }));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1)); const target = id && document.getElementById(id); if (!target) return;
    e.preventDefault(); closeMenu(); closeTour(); scrollToEl(target);
    // pinned sections lose focus as soon as they get it (ScrollTrigger re-styles them), so fall back to their inner stage
    target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
    if (document.activeElement !== target && target.firstElementChild) { const inner = target.firstElementChild; inner.setAttribute('tabindex', '-1'); inner.focus({ preventScroll: true }); }
    try { history.pushState(null, '', '#' + id); } catch (err) {}
  });
  // the navigation turns solid once the page has scrolled past its first pixels
  if (hasGsap) ScrollTrigger.create({ start: 60, end: 'max', onToggle: s => nav.classList.toggle('is-solid', s.isActive), onRefresh: s => nav.classList.toggle('is-solid', s.isActive) });

  /* ---------------- virtual tour: the filmed walkthrough in a dialog, with chapters ---------------- */
  const tour = $('#tour'), tv = $('.tour-video'), tourToggle = $('.tour-toggle'), tourBar = $('.tour-bar i'), tourChapters = $('.tour-chapters');
  const CAPS = [[0, 'hero.c0'], [4, 'hero.c1'], [9, 'hero.c2'], [11.7, 'hero.c3'], [14.3, 'hero.c4'], [19.5, 'hero.c5'], [24.5, 'hero.c6'], [30.5, 'hero.c7'], [35, 'hero.c8'], [46.5, 'hero.c9'], [49.5, 'hero.c11'], [54.5, 'hero.c10']];
  let tourOpener = null, tourChapter = -1;
  function buildChapters() {
    if (!tourChapters) return;
    tourChapters.innerHTML = CAPS.map((c, i) => `<li><button type="button" data-t="${c[0]}" data-i="${i}">${t(c[1])}</button></li>`).join('');
  }
  function setChapter(i) { if (i === tourChapter) return; tourChapter = i; $$('button', tourChapters).forEach(b => b.classList.toggle('is-on', +b.dataset.i === i)); }
  function openTour(chapter, opener) {
    if (!tour) return; tourOpener = opener || document.activeElement;
    buildChapters(); tour.hidden = false; inertAll(true); pauseScroll();
    const start = CAPS[Math.max(0, Math.min(CAPS.length - 1, chapter || 0))][0];
    const go = () => { try { tv.currentTime = start; } catch (e) {} tv.play().catch(() => {}); };
    if (tv.readyState >= 1) go(); else tv.addEventListener('loadedmetadata', go, { once: true });
    $('.tour-close').focus();
  }
  function closeTour() {
    if (!tour || tour.hidden) return; tv.pause(); tour.hidden = true; inertAll(false); resumeScroll();
    if (tourOpener && tourOpener.focus) tourOpener.focus();
  }
  if (tour) {
    $$('.tour-open').forEach(b => b.addEventListener('click', () => openTour(+b.dataset.tourChapter || 0, b)));
    $('.tour-close').addEventListener('click', closeTour);
    tour.addEventListener('click', e => { if (e.target === tour) closeTour(); });
    tour.addEventListener('keydown', e => trapTab(tour, e));
    tourToggle.addEventListener('click', () => tv.paused ? tv.play().catch(() => {}) : tv.pause());
    tv.addEventListener('click', () => tv.paused ? tv.play().catch(() => {}) : tv.pause());
    const syncToggle = () => { const playing = !tv.paused; tour.classList.toggle('is-playing', playing); tourToggle.setAttribute('aria-pressed', String(playing)); $('.tour-toggle-label').textContent = t(playing ? 'tour.pause' : 'tour.play'); };
    tv.addEventListener('play', syncToggle); tv.addEventListener('pause', syncToggle); tv.addEventListener('ended', syncToggle);
    tv.addEventListener('timeupdate', () => { const d = tv.duration || 0; if (tourBar && d) tourBar.style.width = (tv.currentTime / d * 100).toFixed(2) + '%'; let i = 0; while (i + 1 < CAPS.length && CAPS[i + 1][0] <= tv.currentTime) i++; setChapter(i); });
    tv.addEventListener('error', () => { $('.tour-unavailable').hidden = false; tourToggle.hidden = true; });
    tourChapters.addEventListener('click', e => { const b = e.target.closest('button[data-t]'); if (!b) return; try { tv.currentTime = +b.dataset.t; } catch (err) {} tv.play().catch(() => {}); });
  }

  /* ---------------- scroll storytelling (home: pinned story + chapters; everywhere: reveals; rebuilt per breakpoint and language) ---------------- */
  let mm = null; const buildState = { bp: null };
  function rebuildScroll() { if (!hasGsap) return; if (mm) mm.revert(); mm = buildScroll(); requestAnimationFrame(() => ScrollTrigger.refresh()); }
  function buildScroll() {
    const ctxMM = gsap.matchMedia();
    ctxMM.add({ desktop: '(min-width: 1025px)', mobile: '(max-width: 1024px)' }, ctx => {
      const mobile = ctx.conditions.mobile; const splits = []; const vh = () => window.innerHeight;
      const bp = mobile ? 'm' : 'd';                              // a real breakpoint change never leaves the page locked (programmatic rebuilds keep the intro running)
      if (buildState.bp && buildState.bp !== bp && introStarted && !introDone) finishIntro();
      buildState.bp = bp;
      if (!anim) return;
      const once = (trigger, start = 'top 85%') => ({ trigger, start, once: true });
      /* hero (home): the photograph settles in after the intro, then drifts and recedes as the page scrolls */
      if (hero) {
        const heroTitle = new SplitText('.hero-title', { type: 'words,chars', charsClass: 'char' }); splits.push(heroTitle);
        gsap.set(heroTitle.words, { overflow: 'hidden', display: 'inline-block', verticalAlign: 'top' });
        heroState.reveal = gsap.timeline({ paused: true });
        if (!introDone) heroState.reveal.fromTo('.hero-media', { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'power3.out' }, 0);
        heroState.reveal.from(heroTitle.chars, { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.012, ease: 'power3.out' }, 0.35)
          .from(['.hero-kicker', '.hero-lead', '.hero-links', '.hero-scroll'], { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0.7);
        if (introDone) heroState.reveal.play();
        gsap.fromTo('.hero-photo', { yPercent: 0, scale: 1 }, { yPercent: 16, scale: mobile ? 1.04 : 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
        gsap.to('.hero-bar', { autoAlpha: 0, y: -40, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: '55% top', scrub: true, invalidateOnRefresh: true } });
      }
      /* everywhere: images uncover through a mask and drift inside it; headings rise line by line; groups fade up */
      $$('.reveal-clip').forEach(fig => {
        const img = $('img', fig); if (!img) return;
        gsap.fromTo(fig, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: once(fig, 'top 88%') });
        gsap.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'power3.out', scrollTrigger: once(fig, 'top 88%') });
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      $$('[data-split]').filter(el => !el.closest('.hero, .story, .chapters')).forEach(el => {
        const s = new SplitText(el, { type: 'lines', linesClass: 'line' }); splits.push(s);
        gsap.set(s.lines, { overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em' });
        const inner = s.lines.map(l => { const w = document.createElement('span'); w.style.display = 'block'; while (l.firstChild) w.appendChild(l.firstChild); l.appendChild(w); return w; });
        gsap.from(inner, { yPercent: 110, duration: 1, stagger: 0.09, ease: 'power4.out', scrollTrigger: once(el, 'top 88%') });
      });
      $$('.page-lead, .prose > p, .pull-quote, .section-head .section-body, .split-copy > :not([data-split]), .arch-copy > :not([data-split]), .room-copy > :not([data-split]), .event-copy > :not([data-split]), .next-inner > :not([data-split]), .contact-card, .plan-list > div, .faq-item, .partners-list li, .soon-card, .stay-col, .avail-inner > :not([data-split]), .early-copy > :not([data-split]), .early-form, .equip-grid .feature-group, .story-cta, .intro-copy > :not([data-split]), .intro-media, .fact, .chapter-card').forEach(el => {
        gsap.from(el, { y: 26, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: once(el, 'top 90%') });
      });
      if ($('.gallery-grid')) gsap.from('.gallery-item', { y: 26, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', scrollTrigger: once('.gallery-grid') });
      return () => { splits.forEach(s => s.revert()); };
    });
    return ctxMM;
  }

  /* ---------------- gallery lightbox (home) ---------------- */
  const lb = $('#lightbox'), lbImg = $('.lb-img'), lbCap = $('.lb-cap'), lbStatus = $('.lb-status');
  const items = $$('.gallery-item'); let lbIndex = 0, lbOpener = null;
  const photos = items.map(b => { const img = $('img', b); return { src: img.getAttribute('srcset').split(',').pop().trim().split(' ')[0], cap: () => $('.gallery-cap', b).textContent }; });
  function showLb(i) { lbIndex = (i + photos.length) % photos.length; const p = photos[lbIndex]; lbImg.src = p.src; lbImg.alt = p.cap(); lbCap.textContent = p.cap(); lbStatus.textContent = `${lbIndex + 1} ${t('ga.of')} ${photos.length}. ${p.cap()}`; }
  function openLightbox(i, opener) { lbOpener = opener; showLb(i); lb.hidden = false; inertAll(true); pauseScroll(); $('.lb-close').focus(); }
  function closeLightbox() { if (!lb || lb.hidden) return; lb.hidden = true; inertAll(false); resumeScroll(); if (lbOpener && lbOpener.focus) lbOpener.focus(); }
  if (lb) {
    items.forEach((b, i) => b.addEventListener('click', () => openLightbox(i, b)));
    $('.lb-close').addEventListener('click', closeLightbox); $('.lb-prev').addEventListener('click', () => showLb(lbIndex - 1)); $('.lb-next').addEventListener('click', () => showLb(lbIndex + 1));
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') showLb(lbIndex + 1); if (e.key === 'ArrowLeft') showLb(lbIndex - 1); trapTab(lb, e); });
  }

  /* ---------------- forms: availability request and early-access list (mailto to the address in the client copy; no fake confirmation) ---------------- */
  const CONTACT = 'info@elementa-experiences.com';
  const mark = (f, bad, errId) => { f.classList.toggle('bad', bad); if (bad) { f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', errId); } else { f.removeAttribute('aria-invalid'); f.removeAttribute('aria-describedby'); } };
  const form = $('#enquiry');
  if (form) {
    const err = $('.f-error', form), done = $('.f-done', form), again = $('.f-done-link', form);
    const pad = n => String(n).padStart(2, '0'), d0 = new Date(), today = `${d0.getFullYear()}-${pad(d0.getMonth() + 1)}-${pad(d0.getDate())}`;
    form.arrivee.min = today; form.depart.min = today;
    form.arrivee.addEventListener('change', () => { form.depart.min = form.arrivee.value || today; });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const a = form.arrivee.value, d = form.depart.value, name = form.nom.value.trim();
      const ok = a && d && d > a && name.length > 1;
      mark(form.arrivee, !a, 'f-error'); mark(form.depart, !d || !(d > a), 'f-error'); mark(form.nom, name.length < 2, 'f-error');
      err.hidden = ok; if (!ok) { const b = $('.bad', form); if (b) b.focus(); return; }
      const fill = { in: a, out: d, guests: form.personnes.value, name, msg: form.message.value.trim() };
      const body = t('fm.body').replace(/\{(in|out|guests|name|msg)\}/g, (_, k) => fill[k]);
      const mailto = `mailto:${CONTACT}?subject=${encodeURIComponent(t('fm.subject'))}&body=${encodeURIComponent(body)}`;
      again.href = mailto; done.hidden = false; window.location.href = mailto;
    });
  }
  const earlyForm = $('#early-form');
  if (earlyForm) {
    const err = $('.f-error', earlyForm), done = $('.f-done', earlyForm), again = $('.f-done-link', earlyForm);
    earlyForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = earlyForm.courriel.value.trim(); const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      mark(earlyForm.courriel, !ok, 'ea-error'); err.hidden = ok; if (!ok) { earlyForm.courriel.focus(); return; }
      const sel = earlyForm.occasion; const occasion = sel.options[sel.selectedIndex].textContent;
      const body = t('ea.body.mail').replace('{email}', email).replace('{occasion}', occasion);
      const mailto = `mailto:${CONTACT}?subject=${encodeURIComponent(t('ea.subject'))}&body=${encodeURIComponent(body)}`;
      again.href = mailto; done.hidden = false; window.location.href = mailto;
    });
  }

  /* ---------------- boot ---------------- */
  if (!hasGsap) { nav.classList.add('is-on'); html.classList.add('no-anim'); return; }
  if (!introSeen && !reduce && intro) lock();
  const start = () => {
    try { rebuildScroll(); } catch (e) { console.error(e); }
    try { runIntro(); } catch (e) { console.error(e); finishIntro(); }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(start));
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.__el = { get smoother() { return smoother; }, get introDone() { return introDone; }, get locked() { return locked; }, get lang() { return lang; }, heroState, finishIntro, rebuildScroll, openTour, closeTour };
})();
