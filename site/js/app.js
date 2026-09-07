/* Elementa scroll site. Vanilla + GSAP ScrollTrigger + Lenis. No build step. */
(() => {
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = matchMedia('(max-width: 767px)').matches;

  /* ================= copy ================= */
  const I18N = {
    fr: {
      'meta.title': 'Elementa · Refuge d’architecture pour deux, Rawdon',
      'meta.desc': 'Elementa, un refuge d’architecture pour deux dans la forêt de Rawdon, Lanaudière. Une pièce vitrée, une terrasse sur le toit, à 1 h 15 de Montréal.',
      'a11y.skip': 'Passer la séquence d’ouverture', 'lang': 'EN', 'langAria': 'Switch to English', 'langAlt': 'English',
      'nav.refuge': 'Le refuge', 'nav.chambre': 'La chambre', 'nav.elements': 'Les éléments', 'nav.photos': 'Photos', 'nav.where': 'Séjour', 'nav.enquire': 'Nous écrire',
      'cta.enquire': 'Parler de votre séjour', 'cta.explore': 'Explorer le refuge',
      'hero.sub': 'Un refuge d’architecture pour deux, dans la forêt de Rawdon.', 'hero.m1': 'Une pièce · deux personnes', 'hero.m2': 'Rawdon, Lanaudière · 1 h 15 de Montréal',
      'ch5.label': 'Autour du refuge', 'ch5.title': 'Un autre rythme, <em>au cœur de la forêt.</em>', 'ch5.body': 'Un terrain boisé privé en Lanaudière. Les chutes Dorwin sont à dix minutes, le village juste après.', 'ch5.tags': ['Terrain boisé privé', 'Chutes Dorwin à 10 min', '1 h 15 de Montréal'],
      'en.label': 'La chambre', 'en.title': 'Se réveiller <em>au rythme de la forêt.</em>', 'en.body': 'Une seule pièce, vitrée sur deux côtés. Le lit fait face aux arbres, la terrasse s’ouvre juste derrière la vitre.',
      'lv1.title': 'S’éveiller <em>contre la vitre.</em>', 'lv1.body': 'Un lit king face à la forêt, un miroir rond, un plafond de cèdre tressé. Le matin, la lumière traverse les feuilles avant de vous atteindre.',
      'lv2.title': 'Ouvrir <em>sur la terrasse.</em>', 'lv2.body': 'La porte coulisse, la chambre continue dehors : deux chaises, une table basse, les pins à portée de main.',
      'lv3.title': 'Monter <em>sur le toit.</em>', 'lv3.body': 'Une échelle intérieure mène à la terrasse du toit : deux chaises longues, la cime des arbres et, le soir, plus d’étoiles que vous ne le pensiez.',
      'el.title': 'Quatre éléments, <em>quatre saisons.</em>', 'el.body': 'Le refuge change avec ce qui l’entoure : le feu du poêle en hiver, la pluie sur les vitres, la brume du matin, la neige sur le toit.',
      'el.air': 'Air', 'el.airc': 'La brume du matin sur la terrasse', 'el.fire': 'Feu', 'el.firec': 'Le poêle allumé, les vitres qui rougeoient', 'el.water': 'Eau', 'el.waterc': 'La pluie sur la longue fenêtre de la douche', 'el.earth': 'Terre', 'el.earthc': 'La neige sur le toit, la forêt en silence',
      'ga.title': 'Ardoise, laiton, <em>verre, cèdre.</em>', 'ga.prev': 'Photo précédente', 'ga.next': 'Photo suivante', 'lb.close': 'Fermer',
      'ga.c1': 'La chambre, le coin vitré et la terrasse', 'ga.c2': 'La chambre, le miroir rond et le fauteuil', 'ga.c3': 'Le hublot sur la façade noire', 'ga.c4': 'De l’intérieur vers la terrasse', 'ga.c5': 'La terrasse sur le toit', 'ga.c6': 'La douche et son hublot', 'ga.c7': 'La cuisine, le bois et le laiton', 'ga.c8': 'Détail de la terrasse', 'ga.c9': 'L’échelle vers le toit', 'ga.c10': 'La terrasse et la vue', 'ga.c11': 'La salle de bain', 'ga.c12': 'Le hublot, vu de l’intérieur',
      'alt.enter': 'Le lit, le coin vitré et la terrasse, avec la forêt derrière', 'alt.bedroom': 'La chambre, le miroir rond et le fauteuil sculptural', 'alt.terrace': 'La porte coulissante ouverte sur la terrasse et les fauteuils', 'alt.rooftop': 'La terrasse sur le toit, ses chaises longues et la cheminée du poêle',
      'alt.air': 'Le refuge au lever du jour, dans la brume', 'alt.fire': 'Le refuge au crépuscule, vitres allumées', 'alt.water': 'La pluie sur la fenêtre de la douche', 'alt.earth': 'Le refuge sous la neige, vu du ciel',
      'wh.title': 'Rawdon, <em>à 1 h 15 de Montréal.</em>', 'wh.body': 'Sur un terrain boisé privé de Lanaudière, à dix minutes des chutes Dorwin et du village. Autoroute 25, puis la 125 vers le nord.',
      'am.label': 'Commodités', 'am.list': ['Lit king', 'Terrasse sur le toit', 'Poêle à bois', 'Douche pluie', 'Cuisinette et espresso', 'Wi-Fi et télé', 'Planchers chauffants', 'Terrain boisé privé'],
      'kn.label': 'Bon à savoir', 'kn.list': ['Une seule pièce, pour deux personnes', 'Le toit se rejoint par une échelle intérieure', 'Stationnement sur place', 'Tarifs, arrivée et politiques : sur demande'],
      'mp.label': 'Où', 'mp.place': 'Rawdon, Lanaudière, Québec', 'mp.dir': 'Itinéraire', 'mp.show': 'Afficher la carte', 'mp.hide': 'Masquer la carte', 'mp.note': 'Position approximative. L’adresse exacte est envoyée avec la confirmation.', 'mp.iframe': 'Carte, Rawdon, Québec',
      'bk.title': 'Une nuit <em>dans la canopée.</em>', 'bk.body': 'Il n’y a pas encore de réservation en ligne. Dites-nous vos dates : nous répondons le jour même avec les disponibilités, le tarif et les modalités.',
      'fm.in': 'Arrivée', 'fm.out': 'Départ', 'fm.guests': 'Personnes', 'fm.name': 'Votre nom', 'fm.msg': 'Message', 'fm.msgph': 'Une question, une occasion, une demande particulière…', 'fm.err': 'Vérifiez les dates et votre nom.', 'fm.hint': 'Ouvre votre messagerie avec la demande préremplie.', 'fm.done': 'Merci. Votre demande s’ouvre dans votre messagerie : envoyez-la et nous répondons le jour même.', 'fm.again': 'Si rien ne s’est ouvert, cliquez ici.',
      'fm.subject': 'Demande de séjour · Elementa', 'fm.body': 'Bonjour,\n\nJ’aimerais séjourner à Elementa.\nArrivée : {in}\nDépart : {out}\nPersonnes : {guests}\nNom : {name}\n\n{msg}\n',
      'ft.credit': 'Images : WOLFILMZ', 'ft.top': 'Haut de page',
    },
    en: {
      'meta.title': 'Elementa · An architectural retreat for two, Rawdon',
      'meta.desc': 'Elementa, an architectural retreat for two in the Rawdon forest, Lanaudière. A glass room, a rooftop terrace, 1 h 15 from Montréal.',
      'a11y.skip': 'Skip the opening sequence', 'lang': 'FR', 'langAria': 'Passer au français', 'langAlt': 'Français',
      'nav.refuge': 'The cabin', 'nav.chambre': 'The room', 'nav.elements': 'The elements', 'nav.photos': 'Photos', 'nav.where': 'Your stay', 'nav.enquire': 'Enquire',
      'cta.enquire': 'Enquire about a stay', 'cta.explore': 'Explore the cabin',
      'hero.sub': 'An architectural retreat for two, in the Rawdon forest.', 'hero.m1': 'One room · two guests', 'hero.m2': 'Rawdon, Lanaudière · 1 h 15 from Montréal',
      'ch5.label': 'Around the cabin', 'ch5.title': 'A quieter rhythm, <em>surrounded by forest.</em>', 'ch5.body': 'A private wooded lot in Lanaudière. The Dorwin falls are ten minutes away, the village just after.', 'ch5.tags': ['Private wooded lot', 'Dorwin falls, 10 min', '1 h 15 from Montréal'],
      'en.label': 'The room', 'en.title': 'Wake <em>beside the forest.</em>', 'en.body': 'A single room with glass on two sides. The bed faces the trees, the terrace opens just past the glass.',
      'lv1.title': 'Wake <em>by the glass.</em>', 'lv1.body': 'A king bed facing the forest, a round mirror, a woven-cedar ceiling. In the morning the light comes through the leaves before it reaches you.',
      'lv2.title': 'Open <em>to the terrace.</em>', 'lv2.body': 'The door slides, the room continues outside: two chairs, a low table, the pines within reach.',
      'lv3.title': 'Rise <em>to the rooftop.</em>', 'lv3.body': 'An indoor ladder leads to the roof terrace: two loungers, the treetops and, at night, more stars than you expect.',
      'el.title': 'Four elements, <em>four seasons.</em>', 'el.body': 'The cabin changes with what surrounds it: the stove in winter, rain on the glass, morning mist, snow on the roof.',
      'el.air': 'Air', 'el.airc': 'Morning mist on the terrace', 'el.fire': 'Fire', 'el.firec': 'The stove lit, the glass glowing', 'el.water': 'Water', 'el.waterc': 'Rain on the long shower window', 'el.earth': 'Earth', 'el.earthc': 'Snow on the roof, the forest silent',
      'ga.title': 'Slate, brass, <em>glass, cedar.</em>', 'ga.prev': 'Previous photo', 'ga.next': 'Next photo', 'lb.close': 'Close',
      'ga.c1': 'The room, the glass corner and the terrace', 'ga.c2': 'The room, the round mirror and the chair', 'ga.c3': 'The porthole on the black facade', 'ga.c4': 'From inside to the terrace', 'ga.c5': 'The rooftop terrace', 'ga.c6': 'The shower and its porthole', 'ga.c7': 'The kitchen, wood and brass', 'ga.c8': 'Terrace detail', 'ga.c9': 'The ladder to the roof', 'ga.c10': 'The terrace and the view', 'ga.c11': 'The bathroom', 'ga.c12': 'The porthole, from inside',
      'alt.enter': 'The bed, the glass corner and the terrace, with the forest behind', 'alt.bedroom': 'The room, the round mirror and the sculptural chair', 'alt.terrace': 'The sliding door open onto the terrace and its chairs', 'alt.rooftop': 'The rooftop terrace, its loungers and the stove chimney',
      'alt.air': 'The cabin at dawn, in the mist', 'alt.fire': 'The cabin at dusk, glass lit from inside', 'alt.water': 'Rain on the shower window', 'alt.earth': 'The cabin under snow, seen from above',
      'wh.title': 'Rawdon, <em>1 h 15 from Montréal.</em>', 'wh.body': 'On a private wooded lot in Lanaudière, ten minutes from the Dorwin falls and the village. Highway 25, then the 125 north.',
      'am.label': 'Amenities', 'am.list': ['King bed', 'Rooftop terrace', 'Wood stove', 'Rain shower', 'Kitchenette and espresso', 'Wi-Fi and TV', 'Heated floors', 'Private wooded lot'],
      'kn.label': 'Good to know', 'kn.list': ['A single room, for two guests', 'The roof is reached by an indoor ladder', 'Parking on site', 'Rates, check-in and policies: on request'],
      'mp.label': 'Where', 'mp.place': 'Rawdon, Lanaudière, Québec', 'mp.dir': 'Directions', 'mp.show': 'Show the map', 'mp.hide': 'Hide the map', 'mp.note': 'Approximate position. The exact address comes with your confirmation.', 'mp.iframe': 'Map, Rawdon, Québec',
      'bk.title': 'A night <em>in the canopy.</em>', 'bk.body': 'There is no online booking yet. Tell us your dates: we answer the same day with availability, the rate and the details.',
      'fm.in': 'Arrival', 'fm.out': 'Departure', 'fm.guests': 'Guests', 'fm.name': 'Your name', 'fm.msg': 'Message', 'fm.msgph': 'A question, an occasion, a special request…', 'fm.err': 'Check the dates and your name.', 'fm.hint': 'Opens your email app with the request filled in.', 'fm.done': 'Thank you. Your request opens in your email app: send it and we answer the same day.', 'fm.again': 'If nothing opened, click here.',
      'fm.subject': 'Stay enquiry · Elementa', 'fm.body': 'Hello,\n\nI would like to stay at Elementa.\nArrival: {in}\nDeparture: {out}\nGuests: {guests}\nName: {name}\n\n{msg}\n',
      'ft.credit': 'Images: WOLFILMZ', 'ft.top': 'Back to top',
    }
  };
  const urlLang = new URLSearchParams(location.search).get('lang');
  let lang = (() => {
    if (urlLang === 'fr' || urlLang === 'en') return urlLang;
    try { const s = localStorage.getItem('elementa-lang'); if (s) return s; } catch (e) {}
    return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  })();
  const t = k => I18N[lang][k];

  function splitWords(el) {
    const html = el.dataset.raw != null ? el.dataset.raw : el.innerHTML;
    el.dataset.raw = html;
    const tmp = document.createElement('div'); tmp.innerHTML = html;
    const out = [];
    tmp.childNodes.forEach(n => {
      const isEm = n.nodeType === 1 && n.tagName === 'EM';
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { out.push(' '); return; }
        out.push(`<span class="w"><span>${isEm ? '<em>' + part + '</em>' : part}</span></span>`);
      });
    });
    el.innerHTML = out.join('');
  }
  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    const set = (sel, attr, v) => { const m = $(sel); if (m) m.setAttribute(attr, v); };
    set('meta[name="description"]', 'content', t('meta.desc'));
    set('meta[property="og:title"]', 'content', t('meta.title'));
    set('meta[property="og:description"]', 'content', t('meta.desc'));
    $$('[data-i18n]').forEach(el => {
      const v = t(el.dataset.i18n); if (v == null) return;
      if (el.hasAttribute('data-split')) { el.dataset.raw = v; splitWords(el); gsap.set(el.querySelectorAll('.w>span'), { yPercent: el.dataset.shown === '1' || reduce ? 0 : 110 }); }
      else el.innerHTML = v;
    });
    $$('[data-i18n-list]').forEach(el => { const v = t(el.dataset.i18nList); if (v) el.innerHTML = v.map(x => `<li>${x}</li>`).join(''); });
    $$('[data-i18n-alt]').forEach(el => { const v = t(el.dataset.i18nAlt); if (v) el.alt = v; });
    $$('[data-i18n-aria]').forEach(el => { const v = t(el.dataset.i18nAria); if (v) el.setAttribute('aria-label', v); });
    $$('[data-i18n-ph]').forEach(el => { const v = t(el.dataset.i18nPh); if (v) el.placeholder = v; });
    const b = $('.lang'); b.textContent = t('lang'); b.setAttribute('aria-label', t('langAria'));
    const b2 = $('.lang-alt'); if (b2) b2.textContent = t('langAlt');
    const mapFrame = $('.map-static iframe'); if (mapFrame) mapFrame.title = t('mp.iframe');
    try { localStorage.setItem('elementa-lang', lang); } catch (e) {}
  }
  const toggleLang = () => { lang = lang === 'fr' ? 'en' : 'fr'; applyLang(); ScrollTrigger.refresh(); };
  $('.lang').addEventListener('click', toggleLang);
  const langAlt = $('.lang-alt'); if (langAlt) langAlt.addEventListener('click', toggleLang);
  $$('[data-split]').forEach(splitWords);
  applyLang();

  /* ================= smooth scroll ================= */
  let lenis = null;
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.1, easing: x => Math.min(1, 1.001 - Math.pow(2, -10 * x)), smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = target => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2 || a.dataset.lightbox) return;
    const target = $(id); if (!target) return;
    e.preventDefault(); closeMenu(); scrollToEl(target);
    if (a.classList.contains('skip')) target.setAttribute('tabindex', '-1'), target.focus({ preventScroll: true });
  }));

  /* ================= mobile menu ================= */
  const menu = $('#menu'), menuBtn = $('.menu-btn');
  function openMenu() { menu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open'); if (lenis) lenis.stop(); $('.menu-links a').focus(); }
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); if (lenis) lenis.start(); menuBtn.focus(); }
  menuBtn.addEventListener('click', () => menu.hidden ? openMenu() : closeMenu());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeLightbox(); } });
  matchMedia('(min-width: 768px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  /* ================= frame sequences (hero + falls) ================= */
  const stage = document.createElement('div'); stage.className = 'stage'; stage.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas'); stage.appendChild(canvas);
  const shade = document.createElement('div'); shade.className = 'stage-shade'; stage.appendChild(shade);
  document.body.insertBefore(stage, $('#top'));
  const ctx = canvas.getContext('2d', { alpha: false });
  const FRAME_VER = document.body.dataset.frames || '1';
  const frameSet = window.innerWidth <= 820 ? 'm' : (window.innerWidth * (window.devicePixelRatio || 1) >= 2200 ? 'x' : 'd');
  const src = (seq, i) => `frames/${frameSet}/${seq}/f_${String(i).padStart(3, '0')}.webp?v=${FRAME_VER}`;
  const chapters = $$('.chapter').map((el, i) => ({ el, i, seq: el.dataset.seq, n: +el.dataset.frames, bseq: el.dataset.bridge || null, bn: +(el.dataset.bridgeFrames || 0), frames: [], bframes: [], loaded: 0 }));
  chapters.forEach(ch => {
    ch.idx = []; for (let i = 1; i <= ch.n; i++) ch.idx.push(i); ch.frames = new Array(ch.idx.length).fill(null);
    ch.bidx = []; if (ch.bseq) for (let i = 1; i <= ch.bn; i++) ch.bidx.push(i); ch.bframes = new Array(ch.bidx.length).fill(null);
  });
  const state = { i: 0, p: 0 };
  let needRender = false;
  function requestRender() { if (needRender) return; needRender = true; requestAnimationFrame(() => { needRender = false; render(); }); }
  function loadFrames(ch, which, bridge) {
    const arr = bridge ? ch.bframes : ch.frames, idx = bridge ? ch.bidx : ch.idx, seq = bridge ? ch.bseq : ch.seq;
    const list = which.filter(k => !arr[k]);
    if (!list.length) return Promise.resolve();
    return new Promise(res => {
      let done = 0, next = 0;
      const step = () => {
        if (next >= list.length) return;
        const k = list[next++]; const im = new Image(); im.decoding = 'async';
        im.onload = im.onerror = () => { done++; ch.loaded++; if (state.i === ch.i) requestRender(); if (done === list.length) res(); else step(); };
        im.src = src(seq, idx[k]); arr[k] = im;
      };
      for (let c = 0; c < 6; c++) step();
    });
  }
  const all = list => list.map((_, k) => k);
  const evens = ch => ch.idx.map((_, k) => k).filter(k => k % 2 === 0);
  const odds = ch => ch.idx.map((_, k) => k).filter(k => k % 2 === 1);
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
    requestRender();
  }
  window.addEventListener('resize', resize);
  const ready = im => im && im.complete && im.naturalWidth;
  function nearest(arr, k) {
    for (let j = k; j >= 0; j--) if (ready(arr[j])) return arr[j];
    for (let j = k + 1; j < arr.length; j++) if (ready(arr[j])) return arr[j];
    return null;
  }
  function drawImg(img, scale, alpha) {
    if (!img) return;
    const cw = canvas.width, chh = canvas.height;
    const s = Math.max(cw / img.naturalWidth, chh / img.naturalHeight) * scale;
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.globalAlpha = alpha; ctx.drawImage(img, (cw - dw) / 2, (chh - dh) / 2, dw, dh); ctx.globalAlpha = 1;
  }
  function drawSeq(arr, tt, scale, alpha) {
    const n = arr.length; if (!n) return false;
    const a = nearest(arr, Math.min(n - 1, Math.floor(clamp(tt) * (n - 1)))); if (!a) return false;
    drawImg(a, scale, alpha); return true;
  }
  const MAIN = 0.62, BR0 = 0.8, XF = 0.86;
  let stageOn = false;
  function render() {
    const ch = chapters[state.i]; if (!ch) return;
    const p = state.p, next = chapters[state.i + 1];
    ctx.fillStyle = '#0b0b0a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    let drew = false;
    if (ch.bseq && next) {
      if (p <= BR0) drew = drawSeq(ch.frames, p / MAIN, 1, 1);
      else {
        const x = (p - BR0) / (1 - BR0);
        if (ch.bframes.some(ready)) drew = drawSeq(ch.bframes, x, 1, 1);
        else { const e = x * x * (3 - 2 * x); drew = drawSeq(ch.frames, 1, 1, 1 - e); drawSeq(next.frames, 0, 1, e); }
      }
    } else if (p > XF && next) {
      const x = (p - XF) / (1 - XF), e = x * x * (3 - 2 * x);
      drew = drawSeq(ch.frames, 1, reduce ? 1 : 1 + 0.1 * e, 1 - e); drawSeq(next.frames, 0, reduce ? 1 : 1.05 - 0.05 * e, e);
    } else drew = drawSeq(ch.frames, Math.min(1, p / BR0), 1, 1);
    if (drew && !stageOn) { stageOn = true; stage.classList.add('on'); const po = $('.stage-poster'); if (po) po.classList.add('off'); }
  }
  chapters.forEach(ch => ScrollTrigger.create({ trigger: ch.el, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => { state.i = ch.i; state.p = s.progress; requestRender(); } }));
  ScrollTrigger.create({ trigger: '#cinema', start: 'top top', end: 'bottom top', onLeave: () => stage.classList.add('hidden'), onEnterBack: () => stage.classList.remove('hidden') });

  /* hero text: available immediately, recedes as the film plays */
  const hero = chapters[0];
  gsap.set('.hero-inner', { opacity: 1 });
  const heroTl = gsap.timeline({ paused: true })
    .to('.hero-inner', { y: -60, opacity: 0, transformOrigin: 'left bottom', ease: 'power2.in', duration: 1 }, 0)
    .to('.hero-meta', { opacity: 1, duration: 0.5, ease: 'none' }, 0.5);
  ScrollTrigger.create({ trigger: hero.el, start: 'top top', end: 'bottom bottom', scrub: 0.5, onUpdate: s => heroTl.progress(reduce ? (s.progress > 0.35 ? 1 : 0) : clamp(s.progress / 0.65)) });
  if (!reduce) gsap.from('.hero-inner', { y: 24, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.1 });

  /* falls chapter text */
  chapters.slice(1).forEach(ch => {
    const inner = $('.ch-inner', ch.el); if (!inner) return;
    const words = $$('.ch-title .w>span', inner);
    const tl = gsap.timeline({ paused: true });
    if (reduce) { gsap.set(inner, { opacity: 1 }); return; }
    gsap.set(words, { yPercent: 110 });
    tl.from($('.ch-index', inner), { y: 14, opacity: 0, duration: 0.5, ease: 'power3.out' }, 0)
      .to(words, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: 'expo.out' }, 0.05)
      .from($('.ch-body', inner), { y: 18, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.3)
      .from($$('.tags li', inner), { y: 10, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out' }, 0.45);
    let shown = false, leave = null;
    ScrollTrigger.create({
      trigger: ch.el, start: 'top top', end: 'bottom bottom',
      onUpdate: s => {
        const p = s.progress;
        if (p > 0.04 && p < 0.9 && !shown) { shown = true; if (leave) leave.kill(); gsap.set(inner, { opacity: 1, y: 0 }); tl.restart(); }
        else if ((p <= 0.04 || p >= 0.9) && shown) { shown = false; tl.pause(); leave = gsap.to(inner, { opacity: 0, y: p < 0.5 ? 14 : -14, duration: 0.35, ease: 'power2.in', onComplete: () => { tl.progress(0).pause(); gsap.set(inner, { y: 0 }); } }); }
      }
    });
  });

  /* ================= enter: round window opens onto the bedroom ================= */
  const enterPin = $('.enter-pin');
  // The porthole sits at (49 %, 52 %) of the facade photo; place the mask origin on it whatever the viewport crop.
  function positionWindow() {
    const out = $('.enter-out'), inner = $('.enter-in'); if (!out || !inner) return;
    const iw = out.naturalWidth || 2048, ih = out.naturalHeight || 1365, vw = enterPin.clientWidth, vh = enterPin.clientHeight;
    const pos = getComputedStyle(out).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    const s = Math.max(vw / iw, vh / ih), rw = iw * s, rh = ih * s;
    const ox = (vw - rw) * (isNaN(pos[0]) ? 0.5 : pos[0]), oy = (vh - rh) * (isNaN(pos[1]) ? 0.5 : pos[1]);
    inner.style.setProperty('--cx', Math.round(ox + 0.49 * rw) + 'px'); inner.style.setProperty('--cy', Math.round(oy + 0.52 * rh) + 'px');
  }
  if (enterPin) { positionWindow(); window.addEventListener('resize', positionWindow); const o = $('.enter-out'); if (o && !o.complete) o.addEventListener('load', positionWindow); }
  if (enterPin && !reduce) {
    const inner = $('.enter-in'), shadeEl = $('.enter-shade'), text = $('.enter-text');
    const words = $$('.ch-title .w>span', text); gsap.set(words, { yPercent: 110 });
    let textShown = false;
    ScrollTrigger.create({
      trigger: '.enter', start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: s => {
        const p = s.progress;
        const grow = clamp((p - 0.12) / 0.5);            // window circle grows over the middle of the pin
        const e = grow * grow * (3 - 2 * grow);
        inner.style.setProperty('--r', (7 + e * 140).toFixed(1) + '%');
        shadeEl.style.opacity = clamp((p - 0.45) / 0.2);
        if (p > 0.58 && !textShown) { textShown = true; gsap.to(text, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }); gsap.to(words, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: 'expo.out' }); }
        else if (p <= 0.5 && textShown) { textShown = false; gsap.to(text, { opacity: 0, y: 24, duration: 0.3 }); gsap.set(words, { yPercent: 110 }); }
      }
    });
  } else if (enterPin) { $('.enter-text').style.opacity = 1; }

  /* ================= live: sticky image column, three chapters ================= */
  const liveImgs = $$('.live-img'), liveItems = $$('.live-item'), liveCount = $('.live-count b');
  if (liveItems.length && !small) {
    liveItems.forEach((item, i) => ScrollTrigger.create({
      trigger: item, start: 'top 55%', end: 'bottom 55%',
      onToggle: s => { if (!s.isActive) return; liveImgs.forEach((im, k) => im.classList.toggle('is-on', k === i)); liveItems.forEach((it, k) => it.classList.toggle('dim', k !== i)); if (liveCount) liveCount.textContent = String(i + 1).padStart(2, '0'); }
    }));
  }
  if (!reduce) liveItems.forEach(item => gsap.from(item.children, { y: 22, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 75%', once: true } }));

  /* ================= nav active state ================= */
  const pills = $$('.pills a');
  const setActive = id => pills.forEach(a => a.classList.toggle('active', a.dataset.section === id));
  [['refuge', '#refuge', '#chambre'], ['chambre', '#chambre', '#elements'], ['elements', '#elements', '#galerie'], ['galerie', '#galerie', '#ou'], ['ou', '#ou', '.footer']].forEach(([id, start, endSel]) => {
    ScrollTrigger.create({ trigger: start, start: 'top 45%', endTrigger: endSel, end: 'top 45%', onToggle: s => { if (s.isActive) setActive(id); } });
  });
  gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });

  /* ================= section reveals (once, restrained) ================= */
  $$('.sec-title[data-split], .book-title[data-split]').forEach(el => {
    const words = $$('.w>span', el);
    if (reduce) { el.dataset.shown = '1'; gsap.set(words, { yPercent: 0 }); return; }
    gsap.set(words, { yPercent: 110 });
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => { el.dataset.shown = '1'; gsap.to(words, { yPercent: 0, duration: 0.7, stagger: 0.03, ease: 'expo.out' }); } });
  });
  const tileOn = (el, on) => { el.classList.toggle('show', on); const v = $('video', el); if (!v) return; if (on) v.play().catch(() => {}); else v.pause(); };
  $$('.el-tile video').forEach(v => v.addEventListener('pause', () => { const tile = v.closest('.el-tile'); if (tile.classList.contains('show') && !v.ended) setTimeout(() => { if (tile.classList.contains('show') && v.paused) v.play().catch(() => {}); }, 250); }));
  if (reduce) { /* stills only */ }
  else if (coarse) $$('.el-tile').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onToggle: s => tileOn(el, s.isActive) }));
  else $$('.el-tile').forEach(el => { el.addEventListener('pointerenter', () => tileOn(el, true)); el.addEventListener('pointerleave', () => tileOn(el, false)); el.addEventListener('focus', () => tileOn(el, true)); el.addEventListener('blur', () => tileOn(el, false)); });
  if (!reduce) $$('.sec-body, .plan-cols, .map-static, .book-body, .book-alt, .enquiry, .el-tile, .gallery-ctl').forEach(el => gsap.from(el, { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));

  /* ================= gallery: native scroller + controls + lightbox ================= */
  const track = $('.gallery-track'), figs = $$('.gallery-track figure'), count = $('.gallery-count b');
  const prevBtn = $('.gal-prev'), nextBtn = $('.gal-next');
  let current = 0;
  function galleryIndex() {
    const left = track.scrollLeft + 8; let best = 0;
    figs.forEach((f, i) => { if (f.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft) <= left + 2) best = i; });
    return best;
  }
  function updateGallery() {
    current = galleryIndex(); count.textContent = String(current + 1).padStart(2, '0');
    prevBtn.disabled = track.scrollLeft <= 2; nextBtn.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }
  const scrollToFig = i => { const f = figs[Math.max(0, Math.min(figs.length - 1, i))]; track.scrollTo({ left: f.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: reduce ? 'auto' : 'smooth' }); };
  prevBtn.addEventListener('click', () => scrollToFig(current - 1));
  nextBtn.addEventListener('click', () => scrollToFig(current + 1));
  track.addEventListener('scroll', () => requestAnimationFrame(updateGallery), { passive: true });
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); scrollToFig(current + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToFig(current - 1); } });
  // wheel over the track pans it horizontally (desktop); Lenis keeps the page still meanwhile
  track.addEventListener('wheel', e => { if (small || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; const atStart = track.scrollLeft <= 0 && e.deltaY < 0, atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1 && e.deltaY > 0; if (atStart || atEnd) return; e.preventDefault(); track.scrollLeft += e.deltaY; }, { passive: false });
  if (lenis) track.setAttribute('data-lenis-prevent-wheel', '');
  updateGallery();

  const lb = $('#lightbox'), lbImg = $('.lb-img'), lbCap = $('.lb-cap'), lbCount = $('.lb-count');
  let lbIndex = 0, lbOpener = null;
  const photos = figs.map(f => ({ src: $('img', f).getAttribute('src'), srcset: $('img', f).getAttribute('srcset'), cap: () => $('figcaption', f).textContent, alt: () => $('img', f).alt }));
  function showLb(i) {
    lbIndex = (i + photos.length) % photos.length; const p = photos[lbIndex];
    lbImg.src = p.src; lbImg.srcset = p.srcset || ''; lbImg.sizes = '100vw'; lbImg.alt = p.alt(); lbCap.textContent = p.cap();
    lbCount.textContent = `${String(lbIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  }
  function openLightbox(i, opener) {
    lbOpener = opener || document.activeElement; showLb(i); lb.hidden = false; document.body.classList.add('menu-open'); if (lenis) lenis.stop(); $('.lb-close').focus();
  }
  function closeLightbox() { if (lb.hidden) return; lb.hidden = true; document.body.classList.remove('menu-open'); if (lenis) lenis.start(); if (lbOpener && lbOpener.focus) lbOpener.focus(); }
  figs.forEach((f, i) => { f.setAttribute('tabindex', '0'); f.setAttribute('role', 'button'); f.addEventListener('click', () => openLightbox(i, f)); f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i, f); } }); });
  $$('[data-lightbox]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openLightbox(+el.dataset.lightbox, el); }));
  $('.lb-close').addEventListener('click', closeLightbox);
  $('.lb-prev').addEventListener('click', () => showLb(lbIndex - 1));
  $('.lb-next').addEventListener('click', () => showLb(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  lb.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') showLb(lbIndex + 1); if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
    if (e.key === 'Tab') { const f = $$('button', lb); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
  });
  let tx = null;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) showLb(lbIndex + (dx < 0 ? 1 : -1)); tx = null; });

  /* ================= map on demand ================= */
  const mapBox = $('#map'), mapBtn = $('.map-load'), mapCard = $('.map-card');
  if (mapBtn) mapBtn.addEventListener('click', () => {
    let f = $('iframe', mapBox);
    if (!f) {
      f = document.createElement('iframe'); f.title = t('mp.iframe'); f.loading = 'lazy'; f.referrerPolicy = 'no-referrer';
      f.src = 'https://www.openstreetmap.org/export/embed.html?bbox=-73.80%2C46.00%2C-73.62%2C46.10&layer=mapnik&marker=46.05%2C-73.71';
      mapBox.insertBefore(f, mapCard); mapCard.classList.add('gone'); mapBtn.textContent = t('mp.hide');
      const back = document.createElement('button'); back.type = 'button'; back.className = 'btn btn-ghost map-back'; back.textContent = t('mp.hide'); back.style.cssText = 'position:absolute;left:16px;bottom:16px;background:var(--ivory)';
      back.addEventListener('click', () => { f.remove(); back.remove(); mapCard.classList.remove('gone'); mapBtn.focus(); });
      mapBox.appendChild(back); back.focus();
    }
  });

  /* ================= enquiry form ================= */
  const form = $('#enquiry');
  if (form) {
    const err = $('.f-error', form), done = $('.f-done', form), again = $('.f-done-link', form);
    const today = new Date().toISOString().slice(0, 10);
    form.arrivee.min = today; form.depart.min = today;
    form.arrivee.addEventListener('change', () => { form.depart.min = form.arrivee.value || today; });
    let mailto = '';
    form.addEventListener('submit', e => {
      e.preventDefault();
      const a = form.arrivee.value, d = form.depart.value, name = form.nom.value.trim();
      const ok = a && d && d > a && name.length > 1;
      form.arrivee.classList.toggle('bad', !a); form.depart.classList.toggle('bad', !d || !(d > a)); form.nom.classList.toggle('bad', name.length < 2);
      err.hidden = ok; if (!ok) { $('.bad', form).focus(); return; }
      const body = t('fm.body').replace('{in}', a).replace('{out}', d).replace('{guests}', form.personnes.value).replace('{name}', name).replace('{msg}', form.message.value.trim());
      mailto = `mailto:hello@elementa.ca?subject=${encodeURIComponent(t('fm.subject'))}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto; done.hidden = false; again.href = mailto;
    });
  }

  /* ================= boot: frames stream in behind the poster ================= */
  resize();
  const heroFirst = hero.idx.map((_, k) => k).filter(k => k % 3 === 0);
  loadFrames(hero, heroFirst)
    .then(() => loadFrames(hero, all(hero.idx)))
    .then(() => hero.bseq ? loadFrames(hero, all(hero.bidx), true) : null)
    .then(() => chapters.slice(1).reduce((pr, ch) => pr.then(() => loadFrames(ch, evens(ch))).then(() => loadFrames(ch, odds(ch))), Promise.resolve()))
    .then(() => chapters.slice(1).reduce((pr, ch) => pr.then(() => ch.bseq ? loadFrames(ch, all(ch.bidx), true) : null), Promise.resolve()));
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.__el = { state, chapters, lenis };
})();
