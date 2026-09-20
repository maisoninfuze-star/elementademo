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
  const nav = $('.nav'), main = $('main'), footer = $('.site-footer'), early = $('.early'), hero = $('.hero');
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
  window.addEventListener('error', () => { try { parkHero('global-error'); } catch (e) {} });

  /* ---------------- hero film (home only): the approach flight plays once, parks on the balcony still, then the copy appears ---------------- */
  // plays on every visit; back/forward navigation, reduced motion, data-saver, refused autoplay, a scroll-away or « Passer » jump straight to the parked still
  const filmSeen = (() => { try { const n = performance.getEntriesByType('navigation')[0]; return !!n && n.type === 'back_forward' && sessionStorage.getItem('elementa-film') === '1'; } catch (e) { return false; } })();
  let parked = false, filmStarted = false, watchdog = null, parkReason = '';
  const heroState = { reveal: null };
  const film = $('.hero-film'), skipBtn = $('.hero-skip');
  function parkHero(reason) {
    if (parked) return; parked = true; parkReason = String(reason || 'unknown'); clearInterval(watchdog);
    try { sessionStorage.setItem('elementa-film', '1'); } catch (e) {}
    if (hero) hero.classList.add('is-parked');
    if (film) { try { film.pause(); } catch (e) {} }
    if (skipBtn) skipBtn.hidden = true;
    if (heroState.reveal) { heroState.reveal.play(); setTimeout(() => { if (heroState.reveal && heroState.reveal.progress() < 1) heroState.reveal.progress(1); }, 2600); }
    const id = decodeURIComponent(location.hash.slice(1)); const target = id && document.getElementById(id);
    requestAnimationFrame(() => { if (hasGsap) ScrollTrigger.refresh(); if (target) requestAnimationFrame(() => scrollToEl(target, false)); });
  }
  const finishIntro = parkHero;                                   // kept as an alias for the public API and the error handler
  function runHeroFilm() {
    if (!film || !hero) { parkHero('no-film'); return; }
    const saveData = !!(navigator.connection && navigator.connection.saveData);
    if (filmSeen || reduce || saveData || !anim) { parkHero(filmSeen ? 'seen' : reduce ? 'reduce' : saveData ? 'save-data' : 'no-anim'); return; }
    filmStarted = true;
    if (document.visibilityState === 'hidden') {                  // background tab: start the flight when the visitor actually looks
      document.addEventListener('visibilitychange', function onVis() { if (document.visibilityState === 'visible') { document.removeEventListener('visibilitychange', onVis); if (!parked) beginFilm(); } });
      return;
    }
    beginFilm();
  }
  function beginFilm() {
    hero.classList.add('is-playing');
    film.src = (isMobile() && film.dataset.srcMobile) || film.dataset.src;
    film.muted = true; film.defaultMuted = true; film.playsInline = true;
    film.addEventListener('ended', () => parkHero('ended'), { once: true });
    film.addEventListener('error', () => parkHero('video-error'), { once: true });
    // stall guard: park only if the film stops advancing for 10 s while the page is visible (a slow but moving download keeps playing); hard cap 60 s of visible time
    let lastT = 0, stalledFor = 0, visibleFor = 0;
    watchdog = setInterval(() => {
      if (parked) { clearInterval(watchdog); return; }
      if (document.visibilityState !== 'visible') return;
      visibleFor += 2.5;
      if (film.currentTime - lastT < 0.4) stalledFor += 2.5; else stalledFor = 0;
      lastT = film.currentTime;
      if (stalledFor >= 10) parkHero('stall'); else if (visibleFor >= 60) parkHero('watchdog');
    }, 2500);
    if (skipBtn) { skipBtn.hidden = false; skipBtn.addEventListener('click', () => parkHero('skip')); }
    const y0 = window.scrollY;                                   // baseline: a restored or anchored scroll position is not a scroll-away
    const onScroll = () => { if (Math.abs(window.scrollY - y0) > 40) { parkHero('scroll'); window.removeEventListener('scroll', onScroll); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    // play() can reject transiently (AbortError while the new source is still loading), so retry as the media becomes ready;
    // only a real policy block (NotAllowedError) or repeated failure parks the film
    let attempts = 0;
    const attempt = () => {
      if (parked) return; attempts++;
      const p = film.play();
      if (p && typeof p.catch === 'function') p.catch(err => {
        const name = err && err.name;
        if (name === 'NotAllowedError') parkHero('autoplay-refused');
        else if (attempts >= 3) parkHero('autoplay-failed:' + name);
      });
    };
    film.addEventListener('loadeddata', attempt, { once: true });
    film.addEventListener('canplaythrough', attempt, { once: true });
    attempt();
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
      buildState.bp = bp;
      if (!anim) return;
      const once = (trigger, start = 'top 85%') => ({ trigger, start, once: true });
      /* hero (home): the photograph settles in after the intro, then drifts and recedes as the page scrolls */
      if (hero) {
        const heroTitle = new SplitText('.hero-title', { type: 'words,chars', charsClass: 'char' }); splits.push(heroTitle);
        gsap.set(heroTitle.words, { overflow: 'hidden', display: 'inline-block', verticalAlign: 'top' });
        heroState.reveal = gsap.timeline({ paused: true });
        heroState.reveal.from(heroTitle.chars, { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.012, ease: 'power3.out' }, 0.35)
          .from(['.hero-kicker', '.hero-lead', '.hero-links', '.hero-scroll'], { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, 0.7);
        if (parked) heroState.reveal.progress(1);
        gsap.fromTo('.hero-media', { yPercent: 0, scale: 1 }, { yPercent: 16, scale: mobile ? 1.04 : 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
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
      return () => { splits.forEach(s => s.revert()); };
    });
    return ctxMM;
  }

  /* ---------------- carousel (Sainte-Béatrix gallery): the arrows page by one card; touch and trackpad use native snap scrolling ---------------- */
  $$('.carousel').forEach(car => {
    const track = $('.car-track', car), prev = $('.car-prev', car), next = $('.car-next', car); if (!track || !prev || !next) return;
    const step = () => { const c = $('.car-card', track); return c ? c.getBoundingClientRect().width + 16 : track.clientWidth * 0.8; };
    const update = () => { prev.disabled = track.scrollLeft <= 4; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); update();
  });

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
  if (!hasGsap) { nav.classList.add('is-on'); html.classList.add('no-anim'); parkHero('no-gsap'); return; }
  nav.classList.add('is-on');
  const start = () => {
    try { rebuildScroll(); } catch (e) { console.error(e); }
    try { runHeroFilm(); } catch (e) { console.error(e); parkHero('boot-error'); }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  let booted = false; const boot = () => { if (booted) return; booted = true; start(); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { requestAnimationFrame(boot); setTimeout(boot, 800); });
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.__el = { get smoother() { return smoother; }, get parked() { return parked; }, get parkReason() { return parkReason; }, get locked() { return locked; }, get lang() { return lang; }, heroState, finishIntro, rebuildScroll, openTour, closeTour };
})();
