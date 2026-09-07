/* Elementa — scroll-driven site. Vanilla + GSAP ScrollTrigger + Lenis. */
(() => {
  gsap.registerPlugin(ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = matchMedia('(max-width: 767px)').matches;
  document.body.classList.add('is-loading');

  /* ---------- i18n ---------- */
  const I18N = {
    fr: {
      'nav.refuge': 'Le refuge', 'nav.pieces': 'Photos', 'nav.elements': 'Les éléments', 'nav.where': 'Où', 'nav.book': 'Réserver',
      'hero.sub': 'Une chambre noire, suspendue dans la forêt de Rawdon.', 'hero.m1': 'Une pièce · deux personnes', 'hero.m2': 'Lanaudière, à 1 h 15 de Montréal',
      'ch2.title': 'Une boîte noire, suspendue sur le roc.', 'ch2.body': 'Acier, ardoise, verre et cèdre. Une seule pièce en porte-à-faux, vitrée sur deux côtés, avec une terrasse sur le toit et la forêt en dessous.', 'ch2.tags': ['Acier', 'Ardoise', 'Verre', 'Cèdre'],
      'ch3.title': 'Dormir dans les arbres.', 'ch3.body': 'Vitrage du sol au plafond, un lit king face à la forêt et un plafond de cèdre tressé. Le matin, la lumière traverse les feuilles avant de vous atteindre.', 'ch3.tags': ['Lit king', 'Planchers chauffants', 'Douche pluie'],
      'ch4.title': 'En haut de l’échelle, les Laurentides.', 'ch4.body': 'Un hublot, une échelle de bois, puis le toit : un poêle, deux chaises longues et un garde-corps de verre. Le coucher du soleil sur les collines, puis les étoiles.', 'ch4.tags': ['Terrasse sur le toit', 'Poêle à bois'],
      'ch5.title': 'Vous ne verrez personne.', 'ch5.body': 'Un terrain boisé privé, un ruisseau, dix minutes des chutes Dorwin. Vous entendrez le vent et, à l’automne, les huards.', 'ch5.tags': ['Terrain privé', 'Ruisseau', 'Chutes Dorwin'],
      'el.title': 'Quatre éléments, <em>quatre saisons.</em>', 'el.body': 'Le refuge change avec ce qui l’entoure. Le feu du poêle en hiver, la pluie sur les vitres, la brume du matin, la neige sur le toit.',
      'el.air': 'Air', 'el.airc': 'La brume du matin sur la terrasse', 'el.fire': 'Feu', 'el.firec': 'Le poêle allumé, les vitres qui rougeoient', 'el.water': 'Eau', 'el.waterc': 'La pluie sur la longue fenêtre de la douche', 'el.earth': 'Terre', 'el.earthc': 'La neige sur le toit, la forêt en silence',
      'ga.label': 'Détails', 'ga.title': 'Ardoise, laiton, verre, cèdre.',
      'wh.title': 'Rawdon, <em>à 1 h 15 de Montréal.</em>', 'wh.body': 'Sur un terrain boisé privé de Lanaudière, à dix minutes des chutes Dorwin et du village. Autoroute 25, puis la 125 vers le nord.',
      'am.label': 'Commodités', 'am.list': ['Lit king', 'Terrasse sur le toit', 'Poêle à bois', 'Douche pluie', 'Cuisinette et espresso', 'Wi-Fi et télé', 'Planchers chauffants', 'Terrain boisé privé'],
      'bk.title': 'Une nuit <em>dans la canopée.</em>', 'bk.cta': 'Voir les disponibilités',
      'ft.credit': 'Images : WOLFILMZ', 'ft.top': 'Haut de page', 'lang': 'EN', 'langAria': 'Switch to English'
    },
    en: {
      'nav.refuge': 'The cabin', 'nav.pieces': 'Photos', 'nav.elements': 'The elements', 'nav.where': 'Where', 'nav.book': 'Book',
      'hero.sub': 'A black room, suspended in the Rawdon forest.', 'hero.m1': 'One room · two guests', 'hero.m2': 'Lanaudière, 1 h 15 from Montréal',
      'ch2.title': 'A black box, suspended over the rock.', 'ch2.body': 'Steel, slate, glass and cedar. A single cantilevered room with glass on two sides, a rooftop terrace above and the forest floor below.', 'ch2.tags': ['Steel', 'Slate', 'Glass', 'Cedar'],
      'ch3.title': 'Sleep inside the trees.', 'ch3.body': 'Floor-to-ceiling glass, a king bed facing the forest and a woven-cedar ceiling. In the morning the light comes through the leaves before it reaches you.', 'ch3.tags': ['King bed', 'Heated floors', 'Rain shower'],
      'ch4.title': 'Up the ladder, the Laurentians.', 'ch4.body': 'A porthole, a wooden ladder, then the roof: a stove, two loungers and a glass rail. Sunset over the hills, then the stars.', 'ch4.tags': ['Rooftop terrace', 'Wood stove'],
      'ch5.title': 'You will see nobody.', 'ch5.body': 'A private wooded lot, a creek, ten minutes from the Dorwin falls. You will hear the wind and, in autumn, the loons.', 'ch5.tags': ['Private lot', 'Creek', 'Dorwin falls'],
      'el.title': 'Four elements, <em>four seasons.</em>', 'el.body': 'The cabin changes with what surrounds it. The stove in winter, rain on the glass, morning mist, snow on the roof.',
      'el.air': 'Air', 'el.airc': 'Morning mist on the terrace', 'el.fire': 'Fire', 'el.firec': 'The stove lit, the glass glowing', 'el.water': 'Water', 'el.waterc': 'Rain on the long shower window', 'el.earth': 'Earth', 'el.earthc': 'Snow on the roof, the forest silent',
      'ga.label': 'Details', 'ga.title': 'Slate, brass, glass, cedar.',
      'wh.title': 'Rawdon, <em>1 h 15 from Montréal.</em>', 'wh.body': 'On a private wooded lot in Lanaudière, ten minutes from the Dorwin falls and the village. Highway 25, then the 125 north.',
      'am.label': 'Amenities', 'am.list': ['King bed', 'Rooftop terrace', 'Wood stove', 'Rain shower', 'Kitchenette and espresso', 'Wi-Fi and TV', 'Heated floors', 'Private wooded lot'],
      'bk.title': 'A night <em>in the canopy.</em>', 'bk.cta': 'Check availability',
      'ft.credit': 'Images: WOLFILMZ', 'ft.top': 'Back to top', 'lang': 'FR', 'langAria': 'Passer au français'
    }
  };
  let lang = (() => { try { const s = localStorage.getItem('elementa-lang'); if (s) return s; } catch (e) {} return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en'; })();

  function splitWords(el) {
    const html = el.dataset.raw != null ? el.dataset.raw : el.innerHTML;
    el.dataset.raw = html;
    // Split on spaces, keep <em> markup per word.
    const tmp = document.createElement('div'); tmp.innerHTML = html;
    const out = [];
    tmp.childNodes.forEach(n => {
      const isEm = n.nodeType === 1 && n.tagName === 'EM';
      const text = n.textContent;
      text.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { out.push(' '); return; }
        out.push(`<span class="w"><span>${isEm ? '<em>' + part + '</em>' : part}</span></span>`);
      });
    });
    el.innerHTML = out.join('');
  }
  function applyLang() {
    const t = I18N[lang];
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const v = t[el.dataset.i18n]; if (v == null) return;
      if (el.hasAttribute('data-split')) { el.dataset.raw = v; splitWords(el); gsap.set(el.querySelectorAll('.w>span'), { yPercent: el.dataset.shown === '1' ? 0 : 110 }); }
      else el.innerHTML = v;
    });
    $$('[data-i18n-list]').forEach(el => { const v = t[el.dataset.i18nList]; if (v) el.innerHTML = v.map(x => `<li>${x}</li>`).join(''); });
    const b = $('.lang'); b.textContent = t.lang; b.setAttribute('aria-label', t.langAria);
    $$('[data-cursor-text]').forEach(el => { if (el.classList.contains('book-cta')) el.dataset.cursorText = t['nav.book']; });
    try { localStorage.setItem('elementa-lang', lang); } catch (e) {}
    ScrollTrigger.refresh();
  }
  $('.lang').addEventListener('click', () => { lang = lang === 'fr' ? 'en' : 'fr'; applyLang(); });
  $$('[data-split]').forEach(splitWords);
  applyLang();

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return; const target = $(id); if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 }); else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- frame sequences ---------- */
  const canvas = $('#stage'), ctx = canvas.getContext('2d', { alpha: false });
  const stage = $('.stage');
  const chapters = $$('.chapter').map((el, i) => ({ el, i, seq: el.dataset.seq, n: +el.dataset.frames, bseq: el.dataset.bridge || null, bn: +(el.dataset.bridgeFrames || 0), frames: [], bframes: [], loaded: 0 }));
  const step = 1;
  const frameSet = window.innerWidth <= 820 ? 'm' : (window.innerWidth * (window.devicePixelRatio || 1) >= 2200 ? 'x' : 'd');   // 720px phones, 1280px, 1920px for wide Retina
  const FRAME_VER = document.body.dataset.frames || '1';   // set by tools/assemble_v5.py, busts the browser cache after a rebuild
  const src = (seq, i) => `frames/${frameSet}/${seq}/f_${String(i).padStart(3, '0')}.webp?v=${FRAME_VER}`;
  chapters.forEach(ch => {
    ch.idx = []; for (let i = 1; i <= ch.n; i += step) ch.idx.push(i); ch.frames = new Array(ch.idx.length).fill(null);
    ch.bidx = []; if (ch.bseq) { for (let i = 1; i <= ch.bn; i += step) ch.bidx.push(i); } ch.bframes = new Array(ch.bidx.length).fill(null);
  });

  function loadFrames(ch, which, onProgress, bridge) {
    const arr = bridge ? ch.bframes : ch.frames, idx = bridge ? ch.bidx : ch.idx, seq = bridge ? ch.bseq : ch.seq;
    const list = which.filter(k => !arr[k]);
    if (!list.length) return Promise.resolve();
    return new Promise(res => {
      let done = 0;
      list.forEach(k => {
        const im = new Image();
        im.onload = im.onerror = () => { done++; ch.loaded++; onProgress && onProgress(done / list.length); if (done === list.length) res(); if (state.i === ch.i) requestRender(); };
        im.src = src(seq, idx[k]);
        arr[k] = im;
      });
    });
  }
  const evens = ch => ch.idx.map((_, k) => k).filter(k => k % 2 === 0);
  const odds = ch => ch.idx.map((_, k) => k).filter(k => k % 2 === 1);
  const all = list => list.map((_, k) => k);

  const state = { i: 0, p: 0 };
  let needRender = false;
  function requestRender() { if (needRender) return; needRender = true; requestAnimationFrame(() => { needRender = false; render(); }); }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
    requestRender();
  }
  window.addEventListener('resize', resize);

  const ready = im => im && im.complete && im.naturalWidth;
  // Nearest loaded frame at or before index k (falls forward if nothing before it is loaded yet).
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
  // Draw position t (0..1) of a frame array, blending the two neighbouring frames so 12 fps reads as continuous motion.
  function drawSeq(arr, t, scale, alpha) {
    const n = arr.length; if (!n) return;
    const f = clamp(t) * (n - 1), i = Math.floor(f), frac = f - i;
    const a = nearest(arr, i); if (!a) return;
    drawImg(a, scale, alpha);   // no inter-frame blending: it doubles edges on fast moves
  }
  // Chapter timing: main frames play over [0, MAIN], hold on the last frame while the text is read,
  // then either the bridge sequence (if any) or a crossfade carries us into the next chapter.
  const MAIN = 0.62, BR0 = 0.8, XF = 0.86;
  function render() {
    const ch = chapters[state.i]; if (!ch) return;
    const p = state.p, next = chapters[state.i + 1];
    ctx.fillStyle = '#0b0b0a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (ch.bseq && next) {
      if (p <= BR0) drawSeq(ch.frames, p / MAIN, 1, 1);
      else {
        const x = (p - BR0) / (1 - BR0);
        if (ch.bframes.some(ready)) drawSeq(ch.bframes, x, 1, 1);
        else { const e = x * x * (3 - 2 * x); drawSeq(ch.frames, 1, 1, 1 - e); drawSeq(next.frames, 0, 1, e); }
      }
    } else if (p > XF && next) {
      const x = (p - XF) / (1 - XF), e = x * x * (3 - 2 * x);
      drawSeq(ch.frames, 1, reduce ? 1 : 1 + 0.12 * e, 1 - e);
      drawSeq(next.frames, 0, reduce ? 1 : 1.06 - 0.06 * e, e);
    } else {
      drawSeq(ch.frames, Math.min(1, p / BR0), 1, 1);
    }
  }

  /* ---------- chapter triggers ---------- */
  chapters.forEach(ch => {
    ScrollTrigger.create({
      trigger: ch.el, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: self => { state.i = ch.i; state.p = self.progress; requestRender(); }
    });
  });
  // hide the fixed stage once the cinema is scrolled past (content sections are opaque anyway)
  ScrollTrigger.create({ trigger: '#cinema', start: 'top top', end: 'bottom top', onLeave: () => stage.classList.add('hidden'), onEnterBack: () => stage.classList.remove('hidden') });

  // Hero: title recedes as the drone descends, meta row appears.
  const hero = chapters[0];
  const heroTl = gsap.timeline({ paused: true })
    .to('.hero-inner', { y: -70, scale: 0.92, opacity: 0, transformOrigin: 'left bottom', ease: 'power2.in', duration: 1 }, 0)
    .to('.hero-meta', { opacity: 1, duration: 0.5, ease: 'none' }, 0.45);
  ScrollTrigger.create({ trigger: hero.el, start: 'top top', end: 'bottom bottom', scrub: 0.6, onUpdate: s => heroTl.progress(reduce ? (s.progress > 0.3 ? 1 : 0) : clamp(s.progress / 0.7)) });
  gsap.from('.hero-inner', { y: 30, opacity: 0, duration: 1.4, ease: 'power3.out', delay: 0.15, paused: true, id: 'heroIn' });

  // Chapters 2..n: staggered entrance, reversed when leaving either way.
  chapters.slice(1).forEach(ch => {
    const inner = $('.ch-inner', ch.el);
    const words = $$('.ch-title .w>span', inner);
    const tl = gsap.timeline({ paused: true, onStart: () => { $('.ch-title', inner).dataset.shown = '1'; }, onReverseComplete: () => { $('.ch-title', inner).dataset.shown = '0'; } });
    tl.from($('.ch-index', inner), { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0)
      .to(words, { yPercent: 0, duration: 1.05, stagger: 0.035, ease: 'expo.out' }, 0.05)
      .from($('.ch-body', inner), { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.35)
      .from($$('.tags li', inner), { y: 14, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, 0.55);
    gsap.set(words, { yPercent: 110 });
    ch.tl = tl;
    ScrollTrigger.create({
      trigger: ch.el, start: 'top top', end: 'bottom bottom',
      onUpdate: s => { const p = s.progress; if (p > 0.04 && p < 0.78) { if (tl.reversed() || !tl.isActive() && tl.progress() === 0) tl.play(); } else { if (tl.progress() > 0) tl.reverse(); } },
      onLeave: () => tl.reverse(), onLeaveBack: () => tl.reverse()
    });
  });

  /* ---------- nav active state ---------- */
  const pills = $$('.pills a');
  const setActive = id => pills.forEach(a => a.classList.toggle('active', a.dataset.section === id));
  [['refuge', '#refuge', '#elements'], ['elements', '#elements', '#galerie'], ['galerie', '#galerie', '#ou'], ['ou', '#ou', '.footer']].forEach(([id, start, endSel]) => {
    ScrollTrigger.create({ trigger: start, start: 'top 45%', endTrigger: endSel, end: 'top 45%', onToggle: s => { if (s.isActive) setActive(id); } });
  });
  // "Le refuge" covers the whole cinema up to the rooms chapter; rooms covers the rest of the cinema.
  ScrollTrigger.create({ trigger: '.footer', start: 'top 80%', onEnter: () => setActive(''), onLeaveBack: () => setActive('ou') });

  /* ---------- page progress ---------- */
  gsap.to('.progress i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });

  /* ---------- section reveals ---------- */
  $$('.sec-title[data-split]').forEach(el => {
    const words = $$('.w>span', el); gsap.set(words, { yPercent: 110 });
    ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => { el.dataset.shown = '1'; gsap.to(words, { yPercent: 0, duration: 1.1, stagger: 0.04, ease: 'expo.out' }); } });
  });
  $$('.book-title[data-split]').forEach(el => {
    const words = $$('.w>span', el); gsap.set(words, { yPercent: 110 });
    ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => { el.dataset.shown = '1'; gsap.to(words, { yPercent: 0, duration: 1.2, stagger: 0.06, ease: 'expo.out' }); } });
  });
  $$('.sec-body, .amen, .book-cta, .book-links, .el-tile').forEach((el, k) => {
    gsap.from(el, { y: 36, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  $$('[data-reveal]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => el.classList.add('in') }));
  // Element tiles: on touch there is no hover, so swap to the photo when the tile is centred.
  const tileOn = (el, on) => { el.classList.toggle('show', on); const v = $('video', el); if (!v) return; if (on) { v.play().catch(() => {}); } else { v.pause(); } };
  // Some browsers pause offscreen or throttled videos on their own; resume while the tile is still active.
  $$('.el-tile video').forEach(v => v.addEventListener('pause', () => { const tile = v.closest('.el-tile'); if (tile.classList.contains('show') && !v.ended) setTimeout(() => { if (tile.classList.contains('show') && v.paused) v.play().catch(() => {}); }, 250); }));
  if (coarse) $$('.el-tile').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onToggle: s => tileOn(el, s.isActive) }));
  else $$('.el-tile').forEach(el => { el.addEventListener('pointerenter', () => tileOn(el, true)); el.addEventListener('pointerleave', () => tileOn(el, false)); });

  /* ---------- horizontal gallery ---------- */
  if (!small) {
    const track = $('.gallery-track'), bar = $('.gallery-bar i'), count = $('.gallery-count');
    const n = track.children.length - 1;
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.gallery', start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true,
        onUpdate: s => { bar.style.transform = `scaleX(${s.progress})`; count.textContent = String(Math.min(n, Math.floor(s.progress * n) + 1)).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'); }
      }
    });
  }

  /* ---------- parallax ---------- */
  if (!reduce) $$('[data-parallax]').forEach(el => {
    const sp = parseFloat(el.dataset.parallax) || 0.2;
    gsap.fromTo(el, { yPercent: -sp * 40 }, { yPercent: sp * 40, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* ---------- cursor + magnetic ---------- */
  if (!coarse && !reduce) {
    document.body.classList.add('has-cursor');
    const cur = $('.cursor'), label = $('.cursor-label');
    let mx = -100, my = -100, cx = -100, cy = -100, hover = null;
    window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
    $$('[data-magnetic]').forEach(m => {
      m.style.transition = 'transform .35s cubic-bezier(.2,.7,.1,1)';
      m.addEventListener('pointerenter', () => { hover = m; });
      m.addEventListener('pointerleave', () => { hover = null; m.style.transform = ''; });
    });
    $$('[data-cursor-text]').forEach(el => {
      el.addEventListener('pointerenter', () => { cur.classList.add('big'); label.textContent = el.dataset.cursorText || ''; });
      el.addEventListener('pointerleave', () => { cur.classList.remove('big'); label.textContent = ''; });
    });
    gsap.ticker.add(() => {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%) scale(${cur.classList.contains('big') ? 5 : 1})`;
      if (hover) { const r = hover.getBoundingClientRect(); const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2); hover.style.transform = `translate(${dx * 0.28}px,${dy * 0.28}px)`; }
    });
  }

  /* ---------- boot: load hero frames, then everything else ---------- */
  const loader = $('#loader'), bar = $('.loader-bar i'), pct = $('.loader-pct');
  resize();
  const heroFirst = hero.idx.map((_, k) => k).filter(k => k % 3 === 0);
  loadFrames(hero, heroFirst, p => { bar.style.transform = `scaleX(${p})`; pct.textContent = Math.round(p * 100); })
    .then(() => {
      requestRender();
      loader.classList.add('done'); document.body.classList.remove('is-loading');
      gsap.getById('heroIn').play();
      ScrollTrigger.refresh();
      // background: fill in the hero, then the other chapters in order
      return loadFrames(hero, hero.idx.map((_, k) => k)).then(() => hero.bseq ? loadFrames(hero, all(hero.bidx), null, true) : null);
    })
    .then(() => chapters.slice(1).reduce((pr, ch) => pr.then(() => loadFrames(ch, evens(ch))).then(() => loadFrames(ch, odds(ch))), Promise.resolve()))
    .then(() => chapters.reduce((pr, ch) => pr.then(() => ch.bseq ? loadFrames(ch, all(ch.bidx), null, true) : null), Promise.resolve()));

  window.__el = { state, chapters, lenis };
  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
