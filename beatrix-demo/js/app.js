/* Elementa — Sainte-Béatrix demo. Plain JavaScript, no animation library.
   Everything here is progressive: the French page is complete without it.
   Modules: i18n, header (scrolled state, section theme, active link), anchors + history,
   mobile menu, hero ambient video + logo flourish, reveals, detail tabs, gallery lightbox,
   enquiry form, and the "Visiter la cabine" tour dialog (guided video / manual frame scrubbing). */
(function () {
  'use strict';
  const doc = document, root = doc.documentElement, body = doc.body;
  const $ = (s, c) => (c || doc).querySelector(s), $$ = (s, c) => Array.from((c || doc).querySelectorAll(s));
  const reduced = root.classList.contains('reduced');
  const phone = matchMedia('(max-width: 640px)');
  const DICT = window.ELEMENTA_I18N || { fr: {}, en: {} };
  const LANG_KEY = 'elementa3-lang', INTRO_KEY = 'elementa3-intro';
  let lang = 'fr';
  const t = (k) => (DICT[lang] && DICT[lang][k]) || DICT.fr[k] || k;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const stripTags = (s) => s.replace(/<[^>]+>/g, '');
  const navH = () => parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 72;

  /* ---------- i18n ---------- */
  function applyLang(next, persist) {
    lang = next === 'en' ? 'en' : 'fr';
    $$('[data-i18n]').forEach((el) => { const v = DICT[lang][el.dataset.i18n]; if (v != null) el.innerHTML = v; });
    $$('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split('|').forEach((pair) => {
        const i = pair.indexOf(':'); const attr = pair.slice(0, i), key = pair.slice(i + 1);
        const v = DICT[lang][key]; if (v != null) el.setAttribute(attr, stripTags(v));
      });
    });
    root.lang = lang;
    const page = body.dataset.page || 'home';
    doc.title = t(`meta.${page}.title`);
    const md = $('meta[name="description"]'); if (md) md.content = t(`meta.${page}.desc`);
    $$('.lang').forEach((b) => { b.lang = lang === 'fr' ? 'en' : 'fr'; });
    if (persist) { try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode */ } }
    doc.dispatchEvent(new CustomEvent('elementa:lang', { detail: lang }));
  }
  (function initLang() {
    let saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
    const q = new URLSearchParams(location.search).get('lang');
    const first = q || saved;
    if (first === 'en') applyLang('en', !!q); // French is the default for a first visit
  })();
  $$('.lang').forEach((b) => b.addEventListener('click', () => {
    applyLang(lang === 'fr' ? 'en' : 'fr', true);
    if (b.closest('dialog.menu')) closeMenu();
  }));

  /* ---------- header ---------- */
  const nav = $('#nav');
  const themed = $$('[data-theme]');
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = window.scrollY || 0;
      nav.classList.toggle('is-scrolled', y > 8 || body.dataset.page !== 'home');
      const probe = navH() / 2; let theme = 'dark';
      for (const s of themed) { const r = s.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) { theme = s.dataset.theme; break; } }
      nav.classList.toggle('on-light', theme === 'light');
      updateSticky();
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // active navigation link
  const navLinks = $$('.nav-links a[data-nav]');
  if (navLinks.length && 'IntersectionObserver' in window && body.dataset.page === 'home') {
    const map = new Map(); navLinks.forEach((a) => map.set(a.dataset.nav, a));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { navLinks.forEach((a) => a.removeAttribute('aria-current')); const a = map.get(e.target.id); if (a) a.setAttribute('aria-current', 'true'); } });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['cabine', 'experience', 'histoire', 'galerie'].forEach((id) => { const s = doc.getElementById(id); if (s) io.observe(s); });
    // sections between the linked ones clear the state
    const io2 = new IntersectionObserver((entries) => { entries.forEach((e) => { if (e.isIntersecting) navLinks.forEach((a) => a.removeAttribute('aria-current')); }); }, { rootMargin: '-45% 0px -50% 0px' });
    ['accueil', 'lieu', 'mentalite', 'saisons', 'localisation'].forEach((id) => { const s = doc.getElementById(id); if (s) io2.observe(s); });
  }

  /* ---------- anchors + history ---------- */
  function scrollToTarget(target, smooth) {
    target.scrollIntoView({ behavior: smooth && !reduced ? 'smooth' : 'auto', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
  function samePageTarget(a) {
    const href = a.getAttribute('href') || '';
    const m = href.match(/^(?:\.\/|index\.html)?#([\w-]+)$/);
    if (!m) return null;
    if (href.startsWith('./') && body.dataset.page !== 'home') return null;
    return doc.getElementById(m[1]) || (m[1] === 'top' ? body : null);
  }
  // The page owns scroll restoration: each history entry remembers where the guest was when they left it,
  // so Back/Forward return to that spot (or to the hash target when the entry was reached by a direct link).
  try { history.scrollRestoration = 'manual'; } catch (e) { /* ignore */ }
  doc.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const target = samePageTarget(a); if (!target) return;
    e.preventDefault();
    const inMenu = a.closest('dialog.menu'); if (inMenu) closeMenu();
    const inTour = a.closest('dialog.tour'); if (inTour) tour.close({ keepScroll: true });
    const hash = target === body ? '' : `#${target.id}`;
    if (location.hash !== hash) { history.replaceState({ y: window.scrollY }, ''); history.pushState({ y: null }, '', hash || location.pathname + location.search); }
    if (target === body) { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); const brand = $('.nav .brand'); if (brand) brand.focus({ preventScroll: true }); }
    else scrollToTarget(target, true);
  });
  window.addEventListener('popstate', (e) => {
    const y = e.state && e.state.y;
    const id = location.hash.slice(1);
    const target = id ? doc.getElementById(id) : null;
    if (typeof y === 'number') window.scrollTo(0, y); else if (target) scrollToTarget(target, false); else if (!id) window.scrollTo(0, 0);
  });
  window.addEventListener('pagehide', () => { try { history.replaceState({ y: window.scrollY }, ''); } catch (e) { /* ignore */ } });
  if (location.hash) { const target = doc.getElementById(location.hash.slice(1)); if (target) requestAnimationFrame(() => scrollToTarget(target, false)); }
  else if (history.state && typeof history.state.y === 'number') window.scrollTo(0, history.state.y);

  /* ---------- mobile menu ---------- */
  const menu = $('#menu'), menuBtn = $('.menu-btn');
  function openMenu() { if (!menu || menu.open) return; menu.showModal(); root.classList.add('dialog-open'); menuBtn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { if (!menu || !menu.open) return; menu.close(); root.classList.remove('dialog-open'); }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', openMenu);
    $('[data-menu-close]', menu).addEventListener('click', closeMenu);
    menu.addEventListener('close', () => { root.classList.remove('dialog-open'); menuBtn.setAttribute('aria-expanded', 'false'); });
    menu.addEventListener('click', (e) => { if (e.target === menu) closeMenu(); });
  }

  /* ---------- sticky mobile CTA ---------- */
  const sticky = $('.sticky-cta'), hero = $('.hero'), planForm = $('#planifier');
  function updateSticky() {
    if (!sticky || !hero) return;
    const h = hero.getBoundingClientRect(), p = planForm ? planForm.getBoundingClientRect() : null;
    const on = h.bottom < 0 && !(p && p.top < innerHeight && p.bottom > 0) && !root.classList.contains('dialog-open');
    sticky.classList.toggle('is-on', on); sticky.setAttribute('aria-hidden', on ? 'false' : 'true');
    const a = $('a', sticky); if (a) a.tabIndex = on ? 0 : -1;
  }

  /* ---------- hero: flourish + ambient video ---------- */
  if (hero) {
    let seen = false; try { seen = sessionStorage.getItem(INTRO_KEY) === '1'; } catch (e) { /* ignore */ }
    if (!seen && !reduced) {
      hero.classList.add('flourish-on');
      setTimeout(() => { hero.classList.add('flourish-out'); nav.classList.remove('intro-pending'); }, 1350);
      setTimeout(() => { hero.classList.remove('flourish-on'); hero.classList.add('flourish-done'); }, 1900);
      try { sessionStorage.setItem(INTRO_KEY, '1'); } catch (e) { /* ignore */ }
    } else { nav.classList.remove('intro-pending'); hero.classList.add('flourish-done'); }

    const video = $('.hero-video', hero), toggle = $('.media-toggle', hero);
    let userPaused = false, inView = true, started = false, failed = false;
    const saveData = navigator.connection && navigator.connection.saveData;
    function setToggle(paused) {
      if (!toggle || failed) return; toggle.hidden = false;
      toggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
      toggle.setAttribute('aria-label', t(paused ? 'hero.playAria' : 'hero.pauseAria'));
      const l = $('.label', toggle); if (l) l.textContent = t(paused ? 'hero.play' : 'hero.pause');
    }
    function tryPlay() {
      if (!video || userPaused || !inView || doc.hidden) return;
      const p = video.play(); if (p && p.catch) p.catch(() => setToggle(true));
    }
    function startVideo() {
      if (started || !video || saveData) return; started = true;
      video.src = phone.matches ? hero.dataset.heroVideoMobile : hero.dataset.heroVideo;
      video.hidden = false; video.preload = 'auto';
      video.addEventListener('playing', () => { video.classList.add('is-playing'); setToggle(false); });
      video.addEventListener('pause', () => setToggle(true));
      video.addEventListener('timeupdate', () => { if (video.duration) video.classList.toggle('is-dipping', video.duration - video.currentTime < 0.5 || video.currentTime < 0.15); });
      video.addEventListener('error', () => { failed = true; video.hidden = true; if (toggle) toggle.hidden = true; });
      tryPlay();
    }
    if (video) {
      if (reduced) { // static hero: the guest starts the loop deliberately
        setToggle(true); userPaused = true;
      } else if (doc.readyState === 'complete') setTimeout(startVideo, 200); else window.addEventListener('load', () => setTimeout(startVideo, 200));
      if (toggle) toggle.addEventListener('click', () => {
        if (!started) { userPaused = false; startVideo(); return; }
        if (video.paused) { userPaused = false; tryPlay(); } else { userPaused = true; video.pause(); }
      });
      if ('IntersectionObserver' in window) new IntersectionObserver((en) => { inView = en[0].isIntersecting; if (!started) return; if (!inView) video.pause(); else tryPlay(); }, { threshold: 0.05 }).observe(hero);
      doc.addEventListener('visibilitychange', () => { if (!started) return; if (doc.hidden) video.pause(); else tryPlay(); });
    }
    doc.addEventListener('elementa:lang', () => { if (video && started) setToggle(video.paused); else if (video && reduced) setToggle(true); });
  } else nav.classList.remove('intro-pending');

  /* ---------- reveals ---------- */
  (function reveals() {
    const els = $$('.reveal, .reveal-img');
    if (reduced || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  })();

  /* ---------- detail tabs ---------- */
  $$('[role="tablist"]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const media = list.closest('.details') && $$('.details-media img', list.closest('.details'));
    function select(tab, focus) {
      tabs.forEach((x) => { const on = x === tab; x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1; const p = doc.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = !on; });
      if (media) media.forEach((img, i) => img.classList.toggle('is-on', String(i) === tab.dataset.img));
      if (focus) tab.focus();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const k = e.key; let j = null;
        if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % tabs.length;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') j = 0; else if (k === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
  });

  /* ---------- gallery lightbox ---------- */
  (function lightbox() {
    const dlg = $('#lightbox'), grid = $('[data-gallery]'); if (!dlg || !grid) return;
    const items = $$('button[data-lb]', grid).map((b) => { const img = $('img', b); return { btn: b, src: img.currentSrc && img.currentSrc.includes('-800') ? img.src : img.src, alt: () => img.alt, w: img.width, h: img.height }; });
    const pic = $('.lightbox-img', dlg), cap = $('.lightbox-caption', dlg), count = $('.count', dlg);
    let i = 0, opener = null;
    function show(n) {
      i = (n + items.length) % items.length; const it = items[i];
      pic.src = it.src; pic.alt = it.alt(); cap.textContent = it.alt(); count.textContent = `${i + 1} / ${items.length}`;
      [i + 1, i - 1].forEach((k) => { const n2 = items[(k + items.length) % items.length]; const im = new Image(); im.src = n2.src; });
    }
    function open(n, btn) { opener = btn; show(n); dlg.showModal(); root.classList.add('dialog-open'); $('[data-lb-next]', dlg).focus(); }
    items.forEach((it, n) => it.btn.addEventListener('click', () => open(n, it.btn)));
    $('[data-lb-prev]', dlg).addEventListener('click', () => show(i - 1));
    $('[data-lb-next]', dlg).addEventListener('click', () => show(i + 1));
    $('[data-lb-close]', dlg).addEventListener('click', () => dlg.close());
    dlg.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { root.classList.remove('dialog-open'); pic.removeAttribute('src'); if (opener) opener.focus(); updateSticky(); });
    doc.addEventListener('elementa:lang', () => { if (dlg.open) cap.textContent = items[i].alt(); });
  })();

  /* ---------- enquiry form ---------- */
  (function enquiry() {
    const form = $('#enquiry'); if (!form) return;
    const status = $('.form-status', form), submit = $('button[type="submit"]', form);
    const fields = { arrival: $('#f-arrival'), departure: $('#f-departure'), guests: $('#f-guests'), name: $('#f-name'), email: $('#f-email') };
    const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    fields.arrival.min = iso(today()); fields.departure.min = iso(today());
    fields.arrival.addEventListener('change', () => { if (fields.arrival.value) { const d = new Date(fields.arrival.value + 'T00:00:00'); d.setDate(d.getDate() + 1); fields.departure.min = iso(d); } });
    function setErr(name, msg) {
      const el = fields[name], err = doc.getElementById(`e-${name}`);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) el.setAttribute('aria-describedby', `e-${name}`); else el.removeAttribute('aria-describedby');
      if (err) err.textContent = msg || '';
    }
    function validate() {
      const errs = {}; const v = (k) => (fields[k].value || '').trim();
      if (!v('arrival')) errs.arrival = t('f.e.required'); else if (new Date(v('arrival') + 'T00:00:00') < today()) errs.arrival = t('f.e.arrival');
      if (!v('departure')) errs.departure = t('f.e.required'); else if (v('arrival') && v('departure') <= v('arrival')) errs.departure = t('f.e.departure');
      if (!v('guests')) errs.guests = t('f.e.required');
      if (!v('name')) errs.name = t('f.e.required');
      if (!v('email')) errs.email = t('f.e.required'); else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'))) errs.email = t('f.e.email');
      Object.keys(fields).forEach((k) => setErr(k, errs[k]));
      return errs;
    }
    Object.keys(fields).forEach((k) => fields[k].addEventListener('input', () => { if (fields[k].getAttribute('aria-invalid') === 'true') validate(); }));
    function setStatus(kind, text) { status.className = 'form-status' + (kind ? ` is-${kind}` : ''); status.textContent = text; }
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) { setStatus('err', t('f.e.summary')); fields[Object.keys(errs)[0]].focus(); return; }
      const endpoint = form.dataset.endpoint, mock = new URLSearchParams(location.search).get('mock');
      if (!endpoint && !mock) { setStatus('err', t('f.unavailable')); status.focus && status.setAttribute('tabindex', '-1'); status.focus(); return; }
      const payload = Object.fromEntries(new FormData(form).entries()); payload.lang = lang;
      form.classList.add('is-busy'); submit.setAttribute('aria-disabled', 'true'); setStatus('', t('f.sending'));
      let ok = false;
      try {
        if (mock) { await new Promise((r) => setTimeout(r, 900)); ok = mock === 'ok'; }
        else { const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) }); ok = res.ok; }
      } catch (err) { ok = false; }
      form.classList.remove('is-busy'); submit.removeAttribute('aria-disabled');
      if (ok) { form.classList.add('is-done'); setStatus('ok', t('f.ok')); } else setStatus('err', t('f.fail'));
      status.setAttribute('tabindex', '-1'); status.focus();
    });
  })();

  /* ---------- tour dialog ---------- */
  const SCENES = [[0, 'tour.s1'], [4, 'tour.s2'], [9, 'tour.s3'], [11.7, 'tour.s4'], [14.3, 'tour.s5'], [19.5, 'tour.s6'], [24.5, 'tour.s7'], [30.5, 'tour.s8'], [35, 'tour.s9'], [46.5, 'tour.s10'], [49.5, 'tour.s11'], [54.5, 'tour.s12']];
  const tour = (function () {
    const dlg = $('#visite'); if (!dlg) return { close() {} };
    const video = $('.tour-video', dlg), canvas = $('.tour-canvas', dlg), ctx = canvas.getContext('2d', { alpha: false });
    const poster = $('.tour-poster', dlg), captionText = $('.tour-caption .text', dlg), captionNum = $('.tour-caption .num', dlg);
    const range = $('.tour-range', dlg), timeEl = $('.tour-time', dlg), playBtn = $('.tour-play', dlg);
    const chapters = $$('.tour-chapters button', dlg), modes = $$('.mode', dlg);
    const scroll = $('.tour-scroll', dlg), stage = $('.tour-stage', dlg), sticky = $('.tour-sticky', dlg);
    const endCard = $('.tour-end', dlg), big = $('.tour-big', dlg), unavailable = $('.tour-unavailable', dlg);
    const duration = parseFloat(dlg.dataset.duration) || 62.47, N = parseInt(dlg.dataset.frames, 10) || 720, dir = dlg.dataset.framesDir;
    const S = { open: false, mode: 'guided', t: 0, opener: null, scrollY: 0, scene: -1, raf: 0, drawn: -1, target: 0, cache: new Map(), loading: new Set(), lastDrawn: null, videoReady: false, videoFailed: false, wantPlay: false, ro: null };
    const frameSrc = (i) => `${dir}/${phone.matches ? 'm' : 'd'}/f_${String(i + 1).padStart(4, '0')}.webp`;

    function sizeStage() {
      const r = stage.getBoundingClientRect();
      dlg.style.setProperty('--stage-h', `${Math.round(r.height)}px`);
      dlg.style.setProperty('--track', `${phone.matches ? 600 : 800}%`);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(r.width * dpr), h = Math.round(r.height * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; S.lastDrawn = null; drawFrame(); }
    }
    function updateUI(source) {
      const p = S.t / duration;
      if (source !== 'range') range.value = Math.round(p * 1000);
      range.style.setProperty('--fill', `${(p * 100).toFixed(2)}%`);
      range.setAttribute('aria-valuetext', `${fmt(S.t)} / ${fmt(duration)}`);
      timeEl.textContent = `${fmt(S.t)} / ${fmt(duration)}`;
      let si = 0; while (si + 1 < SCENES.length && SCENES[si + 1][0] <= S.t + 0.05) si++;
      if (si !== S.scene) { S.scene = si; captionText.textContent = t(SCENES[si][1]); captionNum.textContent = `${String(si + 1).padStart(2, '0')} / ${String(SCENES.length).padStart(2, '0')}`; }
      let ci = 0; chapters.forEach((c, k) => { if (parseFloat(c.dataset.time) <= S.t + 0.05) ci = k; });
      chapters.forEach((c, k) => { if (k === ci) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current'); });
    }
    function setTime(sec, source) {
      S.t = clamp(sec, 0, duration);
      updateUI(source);
      if (S.mode === 'guided') {
        if (source !== 'video' && S.videoReady) { try { video.currentTime = S.t; } catch (e) { /* not seekable yet */ } }
      } else {
        if (source !== 'scroll') { const max = scroll.scrollHeight - scroll.clientHeight; scroll.scrollTo({ top: (S.t / duration) * max, behavior: source === 'chapter' && !reduced ? 'smooth' : 'auto' }); }
        S.target = Math.round((S.t / duration) * (N - 1)); requestWindow();
      }
      if (S.t < duration - 0.1 && !endCard.hidden) endCard.hidden = true;
    }
    /* --- frames (manual mode): bounded working set around the current position --- */
    function requestWindow() {
      const order = []; for (let d = 0; d <= 40; d++) { order.push(S.target + d); if (d) order.push(S.target - d); }
      for (const i of order) {
        if (S.loading.size >= 6) break;
        if (i < 0 || i >= N || S.cache.has(i) || S.loading.has(i)) continue;
        S.loading.add(i);
        const img = new Image(); img.decoding = 'async'; img.src = frameSrc(i);
        const done = () => { S.loading.delete(i); if (S.open && S.mode === 'manual') requestWindow(); };
        (img.decode ? img.decode() : Promise.resolve()).then(() => { S.cache.set(i, img); done(); }, () => { if (img.complete && img.naturalWidth) S.cache.set(i, img); done(); });
      }
      if (S.cache.size > 260) for (const k of Array.from(S.cache.keys())) { if (Math.abs(k - S.target) > 200) S.cache.delete(k); if (S.cache.size <= 220) break; }
    }
    function nearestLoaded(i) { if (S.cache.has(i)) return i; for (let d = 1; d <= 24; d++) { if (S.cache.has(i - d)) return i - d; if (S.cache.has(i + d)) return i + d; } return null; }
    function drawFrame() {
      const i = nearestLoaded(Math.round(S.drawn < 0 ? S.target : S.drawn)); if (i === null || i === S.lastDrawn) return;
      const img = S.cache.get(i), cw = canvas.width, ch = canvas.height, s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h); S.lastDrawn = i;
      if (!poster.classList.contains('is-off')) poster.classList.add('is-off');
    }
    function loop() {
      if (!S.open || S.mode !== 'manual') { S.raf = 0; return; }
      if (S.drawn < 0) S.drawn = S.target; else { const d = S.target - S.drawn; S.drawn = Math.abs(d) < 0.5 ? S.target : S.drawn + d * (reduced ? 1 : 0.22); }
      drawFrame(); S.raf = requestAnimationFrame(loop);
    }
    /* --- video (guided mode) --- */
    function ensureVideo() {
      if (video.getAttribute('src')) return;
      video.src = phone.matches ? dlg.dataset.videoMobile : dlg.dataset.video; video.preload = 'auto'; video.load();
    }
    video.addEventListener('loadedmetadata', () => { S.videoReady = true; if (Math.abs(video.currentTime - S.t) > 0.3) { try { video.currentTime = S.t; } catch (e) { /* ignore */ } } });
    video.addEventListener('timeupdate', () => { if (S.open && S.mode === 'guided' && !video.seeking) setTime(video.currentTime, 'video'); });
    video.addEventListener('playing', () => { poster.classList.add('is-off'); big.hidden = true; playBtn.setAttribute('aria-pressed', 'true'); playBtn.setAttribute('aria-label', t('tour.pause')); });
    video.addEventListener('pause', () => { playBtn.setAttribute('aria-pressed', 'false'); playBtn.setAttribute('aria-label', t('tour.play')); });
    video.addEventListener('ended', () => { setTime(duration, 'video'); endCard.hidden = false; $('[data-tour-replay]', dlg).focus(); });
    video.addEventListener('error', () => { if (!video.getAttribute('src')) return; S.videoFailed = true; if (S.mode === 'guided') { unavailable.hidden = false; big.hidden = true; } });
    function play() {
      if (S.videoFailed) return; S.wantPlay = true; ensureVideo();
      const p = video.play(); if (p && p.catch) p.catch(() => { big.hidden = false; });
    }
    function pause() { S.wantPlay = false; video.pause(); }
    /* --- modes --- */
    function setMode(mode) {
      if (mode === S.mode) return;
      modes.forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === mode ? 'true' : 'false'));
      if (mode === 'manual') {
        const wasPlaying = !video.paused && !video.ended; pause(); S.wasPlaying = wasPlaying;
        S.mode = 'manual'; dlg.classList.add('mode-manual'); big.hidden = true; unavailable.hidden = true;
        sizeStage(); S.drawn = -1; S.lastDrawn = null;
        requestAnimationFrame(() => { setTime(S.t, 'mode'); scroll.focus({ preventScroll: true }); if (!S.raf) S.raf = requestAnimationFrame(loop); });
      } else {
        S.mode = 'guided'; dlg.classList.remove('mode-manual'); if (S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; }
        setTime(S.t, 'mode');
        if (S.videoFailed) unavailable.hidden = false; else if (reduced && !S.wasPlaying) big.hidden = false; else play();
      }
    }
    scroll.addEventListener('scroll', () => { if (S.mode !== 'manual') return; const max = scroll.scrollHeight - scroll.clientHeight; if (max > 0) setTime((scroll.scrollTop / max) * duration, 'scroll'); }, { passive: true });
    modes.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
    let rangeRaf = 0;
    range.addEventListener('input', () => { if (rangeRaf) return; rangeRaf = requestAnimationFrame(() => { rangeRaf = 0; setTime((range.value / 1000) * duration, 'range'); }); });
    playBtn.addEventListener('click', () => { if (S.mode !== 'guided') return; if (video.paused || video.ended) { if (video.ended || S.t >= duration - 0.1) setTime(0, 'chapter'); play(); } else pause(); });
    $('[data-tour-start]', dlg).addEventListener('click', () => { big.hidden = true; play(); });
    $('[data-tour-replay]', dlg).addEventListener('click', () => { endCard.hidden = true; setTime(0, 'chapter'); if (S.mode === 'guided') play(); });
    chapters.forEach((c) => c.addEventListener('click', () => { endCard.hidden = true; setTime(parseFloat(c.dataset.time), 'chapter'); if (S.mode === 'guided' && (video.paused || video.ended) && !reduced) play(); }));
    /* --- open / close --- */
    function open(opener) {
      if (S.open) return; S.open = true; S.opener = opener || doc.activeElement; S.scrollY = window.scrollY;
      root.classList.add('dialog-open'); if (!reduced) root.classList.add('tour-reveal');
      dlg.showModal(); sizeStage();
      if (!S.ro && 'ResizeObserver' in window) { S.ro = new ResizeObserver(sizeStage); S.ro.observe(stage); }
      S.scene = -1; endCard.hidden = true; unavailable.hidden = S.videoFailed ? false : true;
      if (S.mode !== 'guided') { S.mode = 'guided'; dlg.classList.remove('mode-manual'); modes.forEach((b) => b.setAttribute('aria-pressed', b.dataset.mode === 'guided' ? 'true' : 'false')); }
      setTime(0, 'open'); updateSticky();
      if (reduced) { big.hidden = false; ensureVideo(); } else play();
      playBtn.focus({ preventScroll: true });
    }
    function cleanup() {
      S.open = false; pause(); if (S.raf) { cancelAnimationFrame(S.raf); S.raf = 0; }
      S.cache.clear(); S.loading.clear(); S.drawn = -1; S.lastDrawn = null; poster.classList.remove('is-off');
      root.classList.remove('dialog-open', 'tour-reveal'); updateSticky();
    }
    function close(opts) {
      if (!S.open) return; const keep = opts && opts.keepScroll;
      cleanup(); dlg.close();
      if (!keep) window.scrollTo(0, S.scrollY);
      if (S.opener && S.opener.focus && !keep) S.opener.focus({ preventScroll: true });
    }
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dlg.addEventListener('close', () => { if (S.open) cleanup(); });
    $$('[data-tour-close]', dlg).forEach((b) => b.addEventListener('click', () => close()));
    $$('[data-tour-open]').forEach((b) => b.addEventListener('click', () => open(b)));
    doc.addEventListener('elementa:lang', () => { S.scene = -1; if (S.open) updateUI('lang'); playBtn.setAttribute('aria-label', t(video.paused ? 'tour.play' : 'tour.pause')); });
    window.addEventListener('resize', () => { if (S.open) sizeStage(); });
    return { open, close };
  })();

  window.__el3 = { get lang() { return lang; }, tour };
})();
