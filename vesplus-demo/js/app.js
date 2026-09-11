/* Elementa Experiences — /vesplus/ demo behaviour.
   Converted in place from the vesplus.co.kr clone: same stack (GSAP 3.13 core, ScrollTrigger, ScrollSmoother, SplitText,
   DrawSVGPlugin, MotionPathPlugin, all self-hosted in js/vendor), same structural ideas (intro logo flying into the nav,
   pinned dimensional photo grid with colour wipes, outlined buttons, full-screen chapter reveals), Elementa content.
   Sections have their own ScrollTriggers; the timed intro is separate from every scroll timeline. */
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
  const nav = $('.nav'), main = $('main'), footer = $('.site-footer'), intro = $('#intro');
  const isMobile = () => matchMedia('(max-width: 1024px)').matches;

  /* ---------------- copy (FR / EN) ---------------- */
  const NB = ' ', NBSP = ' ';   // narrow no-break space before : ; ! ? and inside "1 h 15"
  const fr = s => s.replace(/ ([:;!?])/g, NB + '$1').replace(/(\d) h (\d)/g, `$1${NBSP}h${NBSP}$2`).replace(/(\d) min\b/g, `$1${NBSP}min`);
  const I18N = {
    fr: {
      'meta.title': 'Elementa Experiences · Refuge d’architecture pour deux, Rawdon',
      'meta.desc': fr('Elementa Experiences, un refuge d’architecture pour deux dans la forêt de Rawdon, Lanaudière. Une pièce vitrée, une terrasse sur le toit, à 1 h 15 de Montréal.'),
      'a11y.skipContent': 'Aller au contenu', 'a11y.brand': 'Elementa Experiences, retour au début', 'a11y.mainNav': 'Navigation principale', 'a11y.menu': 'Menu', 'a11y.intro': 'Séquence d’ouverture', 'a11y.skipIntro': 'Passer l’introduction', 'a11y.retreat': 'Le refuge', 'a11y.spaces': 'Les espaces', 'a11y.gallery': 'Galerie', 'a11y.stay': 'Séjour et localisation', 'a11y.availability': 'Disponibilités',
      'lang': 'EN', 'langAria': 'Switch to English', 'langAlt': 'English',
      'nav.retreat': 'Le refuge', 'nav.spaces': 'Les espaces', 'nav.gallery': 'Galerie', 'nav.location': 'Localisation', 'cta.availability': 'Vérifier les disponibilités',
      'hero.frameAria': 'Visite filmée du refuge, contrôlée par le défilement', 'hero.c0': 'Au-dessus de la forêt', 'hero.c1': 'La terrasse', 'hero.c2': 'La chambre', 'hero.c3': 'Le poêle', 'hero.c4': 'La cuisinette', 'hero.c5': 'Le miroir rond', 'hero.c6': 'L’échelle', 'hero.c7': 'Vers la terrasse', 'hero.c8': 'Le toit', 'hero.c9': 'Le refuge', 'hero.c10': 'La douche',
      'hero.kicker': 'Découvrir Elementa.', 'hero.title': 'Une échappée façonnée par les <em>éléments</em>.', 'hero.skip': 'Passer l’exploration', 'hero.scroll': 'Défilez pour explorer', 'hero.watch': 'Voir l’expérience',
      'story.first': 'Hors du quotidien.', 'story.title': 'Un refuge en forêt où une architecture pensée vous rapproche du paysage.',
      'story.body1': 'Une seule pièce, vitrée sur deux côtés, en porte-à-faux sur un terrain boisé privé de Rawdon, dans Lanaudière. Le lit fait face aux arbres, la terrasse s’ouvre juste derrière la vitre, une échelle intérieure mène au toit.',
      'story.body2': 'Ardoise, laiton, verre et cèdre. Un poêle à bois pour l’hiver, une douche pluie avec sa longue fenêtre sur la forêt, une terrasse sur le toit pour le soir.', 'story.cta': 'Voir les espaces',
      'feat.title': 'L’essentiel d’un séjour à Elementa.', 'feat.1t': 'Une pièce, pour deux', 'feat.1d': 'Vitrée sur deux côtés, un lit king face à la forêt, un plafond de cèdre tressé.', 'feat.2t': 'Feu et douche pluie', 'feat.2d': 'Un poêle à bois, des planchers chauffants, une longue fenêtre dans la douche.', 'feat.3t': 'Terrasse sur le toit', 'feat.3d': 'Par une échelle intérieure, deux chaises longues au-dessus des arbres.', 'feat.4t': 'Terrain boisé privé', 'feat.4d': fr('Rawdon, Lanaudière, à 1 h 15 de Montréal. Les chutes Dorwin à dix minutes.'),
      'ch.1k': '01 · La chambre', 'ch.1t': 'La chambre de verre', 'ch.1c': 'Un lit king face à la forêt, un miroir rond, un plafond de cèdre tressé. La lumière traverse les feuilles avant de vous atteindre.', 'ch.1alt': 'La chambre, le lit face à la forêt derrière la vitre',
      'ch.2k': '02 · Feu, pluie et vapeur', 'ch.2t': 'Le poêle, la douche pluie', 'ch.2c': 'Le poêle à bois pour les soirs d’hiver, la douche pluie et sa longue fenêtre sur les arbres, les planchers chauffants sous les pieds.', 'ch.2alt': 'Le poêle à bois allumé',
      'ch.3k': '03 · Terrasse et toit', 'ch.3t': 'La terrasse, puis le toit', 'ch.3c': fr('La porte coulisse sur la terrasse et ses deux chaises. Une échelle intérieure monte au toit : deux chaises longues, la cime des arbres, le ciel du soir.'), 'ch.3alt': 'La terrasse sur le toit, ses chaises longues et la cheminée du poêle', 'ch.link': 'Voir la galerie',
      'ga.kicker': 'Galerie', 'ga.title': 'Ardoise, laiton, <em>verre, cèdre.</em>', 'ga.all': 'Toutes les photos', 'ga.prev': 'Photo précédente', 'ga.next': 'Photo suivante', 'ga.of': 'sur', 'lb.close': 'Fermer', 'lb.dialog': 'Photo en plein écran',
      'ga.c1': 'La chambre, le coin vitré et la terrasse', 'ga.c2': 'Le hublot sur la façade noire', 'ga.c3': 'La cuisinette, le bois et le laiton', 'ga.c4': 'Détail de la terrasse', 'ga.c5': 'L’échelle vers le toit', 'ga.c6': 'Une chaise longue sur le toit',
      'wh.kicker': 'Où', 'wh.title': fr('Rawdon, <em>à 1 h 15 de Montréal.</em>'), 'wh.body': 'Sur un terrain boisé privé de Lanaudière, à dix minutes des chutes Dorwin et du village. Autoroute 25, puis la 125 vers le nord. L’adresse exacte est envoyée avec la confirmation.', 'wh.place': 'Rawdon, Lanaudière, Québec', 'wh.coords': '46,05° N, 73,71° O', 'wh.dir': 'Itinéraire',
      'am.label': 'Commodités', 'am.list': ['Lit king', 'Terrasse sur le toit', 'Poêle à bois', 'Douche pluie', 'Cuisinette et espresso', 'Wi-Fi et télé', 'Planchers chauffants', 'Terrain boisé privé'],
      'kn.label': 'Bon à savoir', 'kn.list': ['Une seule pièce, pour deux personnes', 'Le toit se rejoint par une échelle intérieure', 'Stationnement sur place', fr('Tarifs, arrivée et politiques : sur demande')],
      'bk.kicker': 'Disponibilités', 'bk.title': 'Une nuit <em>dans la canopée.</em>', 'bk.body': fr('Il n’y a pas encore de réservation en ligne. Dites-nous vos dates : nous répondons le jour même avec les disponibilités, le tarif et les modalités.'),
      'fm.in': 'Arrivée', 'fm.out': 'Départ', 'fm.guests': 'Personnes', 'fm.name': 'Votre nom', 'fm.msg': 'Message', 'fm.msgph': 'Une question, une occasion, une demande particulière…', 'fm.err': 'Vérifiez les dates et votre nom.', 'fm.submit': 'Demander les disponibilités', 'fm.hint': 'Ouvre votre messagerie avec la demande préremplie, adressée à hello@elementa.ca.', 'fm.done': fr('Votre demande s’ouvre dans votre messagerie : envoyez-la et nous répondons le jour même.'), 'fm.again': 'Si rien ne s’est ouvert, cliquez ici.',
      'fm.subject': 'Demande de disponibilités · Elementa Experiences', 'fm.body': fr('Bonjour,\n\nJ’aimerais connaître les disponibilités d’Elementa.\nArrivée : {in}\nDépart : {out}\nPersonnes : {guests}\nNom : {name}\n\n{msg}\n'),
      'ft.credit': fr('Images : WOLFILMZ'), 'ft.place': 'Rawdon, Lanaudière, Québec',
    },
    en: {
      'meta.title': 'Elementa Experiences · An architectural retreat for two, Rawdon',
      'meta.desc': 'Elementa Experiences, an architectural retreat for two in the Rawdon forest, Lanaudière. A glass room, a rooftop terrace, 75 minutes from Montréal.',
      'a11y.skipContent': 'Skip to content', 'a11y.brand': 'Elementa Experiences, back to the top', 'a11y.mainNav': 'Main navigation', 'a11y.menu': 'Menu', 'a11y.intro': 'Opening sequence', 'a11y.skipIntro': 'Skip intro', 'a11y.retreat': 'The retreat', 'a11y.spaces': 'The spaces', 'a11y.gallery': 'Gallery', 'a11y.stay': 'Your stay and location', 'a11y.availability': 'Availability',
      'lang': 'FR', 'langAria': 'Passer au français', 'langAlt': 'Français',
      'nav.retreat': 'The Retreat', 'nav.spaces': 'The Spaces', 'nav.gallery': 'Gallery', 'nav.location': 'Location', 'cta.availability': 'Check availability',
      'hero.frameAria': 'Filmed walk through the cabin, controlled by scrolling', 'hero.c0': 'Above the forest', 'hero.c1': 'The terrace', 'hero.c2': 'The room', 'hero.c3': 'The stove', 'hero.c4': 'The kitchen', 'hero.c5': 'The round mirror', 'hero.c6': 'The ladder', 'hero.c7': 'Out to the terrace', 'hero.c8': 'The rooftop', 'hero.c9': 'The cabin', 'hero.c10': 'The shower',
      'hero.kicker': 'Discover Elementa.', 'hero.title': 'An escape shaped by the <em>elements</em>.', 'hero.skip': 'Skip exploration', 'hero.scroll': 'Scroll to explore', 'hero.watch': 'Watch the experience',
      'story.first': 'Outside the everyday.', 'story.title': 'A forest retreat where thoughtful architecture brings you closer to the landscape.',
      'story.body1': 'One room, glazed on two sides, cantilevered over a private wooded lot in Rawdon, Lanaudière. The bed faces the trees, the terrace opens just past the glass, and an indoor ladder leads to the roof.',
      'story.body2': 'Slate, brass, glass and cedar. A wood stove for winter, a rain shower with a long window onto the forest, and a rooftop terrace for the evening.', 'story.cta': 'See the spaces',
      'feat.title': 'The essentials of a stay at Elementa.', 'feat.1t': 'One room, for two', 'feat.1d': 'Glass on two sides, a king bed facing the forest, a woven-cedar ceiling.', 'feat.2t': 'Fire and rain shower', 'feat.2d': 'A wood stove, heated floors, a long window in the shower.', 'feat.3t': 'Rooftop terrace', 'feat.3d': 'Reached by an indoor ladder, two loungers above the trees.', 'feat.4t': 'Private wooded lot', 'feat.4d': 'Rawdon, Lanaudière, 75 minutes from Montréal. Dorwin Falls ten minutes away.',
      'ch.1k': '01 · The room', 'ch.1t': 'The glass bedroom', 'ch.1c': 'A king bed facing the forest, a round mirror, a woven-cedar ceiling. The light comes through the leaves before it reaches you.', 'ch.1alt': 'The room, the bed facing the forest behind the glass',
      'ch.2k': '02 · Fire, rainfall and steam', 'ch.2t': 'The stove, the rain shower', 'ch.2c': 'The wood stove for winter evenings, the rain shower with its long window onto the trees, heated floors underfoot.', 'ch.2alt': 'The wood stove, lit',
      'ch.3k': '03 · Terrace and rooftop', 'ch.3t': 'The terrace, then the roof', 'ch.3c': 'The door slides onto the terrace and its two chairs. An indoor ladder climbs to the roof: two loungers, the treetops, the evening sky.', 'ch.3alt': 'The rooftop terrace, its loungers and the stove chimney', 'ch.link': 'See the gallery',
      'ga.kicker': 'Gallery', 'ga.title': 'Slate, brass, <em>glass, cedar.</em>', 'ga.all': 'All photos', 'ga.prev': 'Previous photo', 'ga.next': 'Next photo', 'ga.of': 'of', 'lb.close': 'Close', 'lb.dialog': 'Full-size photo',
      'ga.c1': 'The room, the glass corner and the terrace', 'ga.c2': 'The porthole on the black facade', 'ga.c3': 'The kitchenette, wood and brass', 'ga.c4': 'Terrace detail', 'ga.c5': 'The ladder to the roof', 'ga.c6': 'A lounger on the roof',
      'wh.kicker': 'Where', 'wh.title': 'Rawdon, <em>75 minutes from Montréal.</em>', 'wh.body': 'On a private wooded lot in Lanaudière, ten minutes from Dorwin Falls and the village. Highway 25, then the 125 north. The exact address comes with your confirmation.', 'wh.place': 'Rawdon, Lanaudière, Québec', 'wh.coords': '46.05° N, 73.71° W', 'wh.dir': 'Directions',
      'am.label': 'Amenities', 'am.list': ['King bed', 'Rooftop terrace', 'Wood stove', 'Rain shower', 'Kitchenette and espresso', 'Wi-Fi and TV', 'Heated floors', 'Private wooded lot'],
      'kn.label': 'Good to know', 'kn.list': ['A single room, for two guests', 'The roof is reached by an indoor ladder', 'Parking on site', 'Rates, check-in and policies: on request'],
      'bk.kicker': 'Availability', 'bk.title': 'A night <em>in the canopy.</em>', 'bk.body': 'There is no online booking yet. Tell us your dates: we answer the same day with availability, the rate and the details.',
      'fm.in': 'Arrival', 'fm.out': 'Departure', 'fm.guests': 'Guests', 'fm.name': 'Your name', 'fm.msg': 'Message', 'fm.msgph': 'A question, an occasion, a special request…', 'fm.err': 'Check the dates and your name.', 'fm.submit': 'Request availability', 'fm.hint': 'Opens your email app with the request filled in, addressed to hello@elementa.ca.', 'fm.done': 'Your request opens in your email app: send it and we answer the same day.', 'fm.again': 'If nothing opened, click here.',
      'fm.subject': 'Availability request · Elementa Experiences', 'fm.body': 'Hello,\n\nI would like to know Elementa’s availability.\nArrival: {in}\nDeparture: {out}\nGuests: {guests}\nName: {name}\n\n{msg}\n',
      'ft.credit': 'Images: WOLFILMZ', 'ft.place': 'Rawdon, Lanaudière, Québec',
    }
  };
  const urlLang = new URLSearchParams(location.search).get('lang');
  let lang = (() => {
    if (urlLang === 'fr' || urlLang === 'en') return urlLang;
    try { const s = localStorage.getItem('elementa-lang'); if (s === 'fr' || s === 'en') return s; } catch (e) {}
    return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  })();
  const t = k => I18N[lang][k];
  function applyLang() {
    html.lang = lang; document.title = t('meta.title');
    const set = (sel, attr, v) => { const m = $(sel); if (m) m.setAttribute(attr, v); };
    set('meta[name="description"]', 'content', t('meta.desc')); set('meta[property="og:title"]', 'content', t('meta.title')); set('meta[property="og:description"]', 'content', t('meta.desc'));
    set('meta[property="og:locale"]', 'content', lang === 'fr' ? 'fr_CA' : 'en_CA'); set('meta[property="og:locale:alternate"]', 'content', lang === 'fr' ? 'en_CA' : 'fr_CA');
    $$('[data-i18n]').forEach(el => { const v = t(el.dataset.i18n); if (v != null) el.innerHTML = v; });
    $$('[data-i18n-list]').forEach(el => { const v = t(el.dataset.i18nList); if (v) el.innerHTML = v.map(x => `<li>${x}</li>`).join(''); });
    $$('[data-i18n-alt]').forEach(el => { const v = t(el.dataset.i18nAlt); if (v) el.alt = v; });
    $$('[data-i18n-aria]').forEach(el => { const v = t(el.dataset.i18nAria); if (v) el.setAttribute('aria-label', v); });
    $$('[data-i18n-ph]').forEach(el => { const v = t(el.dataset.i18nPh); if (v) el.placeholder = v; });
    const other = lang === 'fr' ? 'en' : 'fr';
    $$('.lang').forEach(b => { b.textContent = b.classList.contains('lang-alt') || b.classList.contains('lang-foot') ? t('langAlt') : t('lang'); b.setAttribute('aria-label', t('langAria')); b.lang = other; });
    try { localStorage.setItem('elementa-lang', lang); } catch (e) {}
  }
  applyLang();

  /* ---------------- smooth scroll (desktop) ---------------- */
  let smoother = null, locked = false, menuOpen = false;
  if (anim && window.ScrollSmoother) {
    gsap.matchMedia().add('(min-width: 1025px)', () => {
      smoother = ScrollSmoother.create({ wrapper: '.layout', content: '.content', smooth: 1.75, effects: false, smoothTouch: false, ignoreMobileResize: true });
      if (locked) smoother.paused(true);
      return () => { smoother.kill(); smoother = null; };
    });
  }
  const scrollToEl = (el, smooth = true) => {
    if (smoother) smoother.scrollTo(el, smooth && !reduce, 'top top');
    else el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
  };

  /* ---------------- scroll lock (intro, menu) ---------------- */
  const lock = () => { locked = true; document.body.classList.add('lock'); if (smoother) smoother.paused(true); };
  const unlock = () => { locked = false; document.body.classList.remove('lock'); if (smoother && !menuOpen) smoother.paused(false); };
  window.addEventListener('error', () => { try { finishIntro(); unlock(); } catch (e) {} });

  /* ---------------- intro: the four signs, then the emblem, then the wordmark, then the flight to the nav ---------------- */
  const introSeen = (() => { try { return sessionStorage.getItem('elementa-intro') === '1'; } catch (e) { return false; } })();
  let introDone = false, introStarted = false, introTl = null, watchdog = null;
  function finishIntro() {
    if (introDone) return; introDone = true; clearTimeout(watchdog);
    if (introTl) { introTl.kill(); introTl = null; }
    try { sessionStorage.setItem('elementa-intro', '1'); } catch (e) {}
    html.classList.remove('intro-on'); if (intro) intro.hidden = true;
    main.inert = false; footer.inert = false; nav.classList.add('is-on');
    unlock();
    if (heroState.reveal) heroState.reveal.play();
    const id = decodeURIComponent(location.hash.slice(1)); const target = id && document.getElementById(id);
    const skipHadFocus = document.activeElement === $('.intro-skip') || document.activeElement === document.body;
    if (skipHadFocus) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
    requestAnimationFrame(() => { if (hasGsap) ScrollTrigger.refresh(); if (target) requestAnimationFrame(() => scrollToEl(target, false)); });
  }
  function runIntro() {
    if (!intro || introSeen || !hasGsap) { finishIntro(); return; }
    introStarted = true; lock(); main.inert = true; footer.inert = true; html.classList.add('intro-on');
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
    // master-unit geometry of each sign (from the traced groups) and the stage centre of the 4700x3650 viewBox
    const BOX = { sun: [1851, 325, 3142, 1340], fire: [2075, 648, 2918, 1487], tree: [2262, 895, 2731, 1735], water: [1857, 1520, 3136, 2125] };
    const SC = { x: 2500, y: 1925 }, SOLO = 2300;
    const geo = k => { const [x0, y0, x1, y1] = BOX[k]; const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; return { cx, cy, s: SOLO / Math.max(x1 - x0, y1 - y0), dx: SC.x - cx, dy: SC.y - cy }; };
    const G = { sun: geo('sun'), fire: geo('fire'), tree: geo('tree'), water: geo('water') };
    const solo = (el, g) => ({ svgOrigin: `${g.cx} ${g.cy}`, x: g.dx, y: g.dy, scale: g.s });
    const staging = { x: 0, y: 0, scale: 0.9, opacity: 0.22, duration: 0.6, ease: 'power2.inOut' };
    gsap.set(sun, solo(sun, G.sun)); gsap.set(fire, solo(fire, G.fire)); gsap.set(tree, solo(tree, G.tree)); gsap.set(water, solo(water, G.water));
    gsap.set(rays, { drawSVG: '0%' }); gsap.set(ovalStroke, { drawSVG: '50% 50%' }); gsap.set(wmClip, { attr: { width: 0 } });
    // flight to the nav slots: measured when the tween starts (function-based values), in intro-svg user units
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
      // 0.0–0.7 the sun, alone, drawn ray by ray
      .set(sun, { opacity: 1 }, 0)
      .to(rays, { drawSVG: '100%', duration: 0.5, stagger: { each: 0.012, from: 'center' }, ease: 'power2.out' }, 0.05)
      // 0.7–1.4 fire / mountain
      .to(sun, staging, 0.7)
      .fromTo(fire, { opacity: 0, scale: G.fire.s * 0.92 }, { opacity: 1, scale: G.fire.s, duration: 0.55 }, 0.75)
      // 1.4–2.1 tree / leaf
      .to(fire, staging, 1.4)
      .fromTo(tree, { opacity: 0, scale: G.tree.s * 0.92 }, { opacity: 1, scale: G.tree.s, duration: 0.55 }, 1.45)
      // 2.1–2.8 water, four rows in the standalone sign
      .to(tree, staging, 2.1)
      .set(water, { opacity: 1 }, 2.15)
      .fromTo($$('.wave', water), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.09 }, 2.15)
      // 2.8–4.0 convergence: everything settles into the emblem, the fourth row resolves away, the outline draws around them
      .to(water, { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.0, ease: 'power3.inOut' }, 2.8)
      .to($('.wave-extra', water), { opacity: 0, duration: 0.5 }, 2.8)
      .to([sun, fire, tree], { scale: 1, opacity: 1, duration: 1.0, ease: 'power3.inOut', stagger: 0.06 }, 2.85)
      .set(oval, { opacity: 1 }, 2.95)
      .to(ovalStroke, { drawSVG: '0% 100%', duration: 1.0 }, 2.95)
      // 4.0 exact master emblem replaces the assembled parts (identical geometry, traced from the supplied artwork)
      .set([sun, fire, tree, water, oval], { opacity: 0 }, 4.0)
      .set(emblem, { opacity: 1 }, 4.0)
      // 4.0–4.7 the wordmark, then "Experiences"
      .set(wordmark, { opacity: 1 }, 4.02)
      .to(wmClip, { attr: { width: 4600 }, duration: 0.65, ease: 'power2.out' }, 4.05)
      .fromTo(tagline, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45 }, 4.3)
      // 4.7–5.5 flight to the compact navigation logo
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
    hamburger.setAttribute('aria-expanded', 'true'); main.inert = true; footer.inert = true;
    document.body.classList.add('paused'); if (smoother) smoother.paused(true);
    focusables(menu)[0].focus();
  }
  function closeMenu() {
    if (!menuOpen) return; menuOpen = false;
    menu.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false');
    setTimeout(() => { menu.hidden = true; }, reduce ? 0 : 350);
    main.inert = false; footer.inert = false;
    document.body.classList.remove('paused'); if (smoother && !locked) smoother.paused(false);
    (menuOpener && menuOpener.focus ? menuOpener : hamburger).focus();
  }
  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  menu.addEventListener('keydown', e => trapTab(menu, e));
  matchMedia('(min-width: 1025px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeLightbox(); } });
  /* language switch: revert the split text first, then swap the copy, then rebuild the timelines on the new text */
  $$('.lang').forEach(b => b.addEventListener('click', () => { if (mm) { mm.revert(); mm = null; } lang = lang === 'fr' ? 'en' : 'fr'; applyLang(); rebuildScroll(); }));
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1)); const target = id && document.getElementById(id); if (!target) return;
    e.preventDefault(); closeMenu(); scrollToEl(target);
    // pinned sections lose focus as soon as they get it (ScrollTrigger re-styles them), so fall back to their inner stage
    target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
    if (document.activeElement !== target && target.firstElementChild) { const inner = target.firstElementChild; inner.setAttribute('tabindex', '-1'); inner.focus({ preventScroll: true }); }
    try { history.pushState(null, '', '#' + id); } catch (err) {}
  });

  /* ---------------- hero: scroll-controlled walkthrough ----------------
     Primary: a WebP frame sequence drawn on a canvas (instant random access in both directions, eased towards the
     scroll position so the frame settles when scrolling stops). Fallback: the mp4 scrubbed through currentTime, then a
     "watch" button that plays it normally. Nothing autoplays. */
  const hero = $('.hero'), video = $('.hero-video'), poster = $('.hero-poster'), watch = $('.hero-watch'), canvas = $('.hero-canvas');
  const heroState = { duration: +hero.dataset.duration || 0, ready: false, failed: false, mode: null };
  function setupHeroMedia() {
    if (hero.dataset.poster) poster.style.backgroundImage = `url("${hero.dataset.poster}")`;
    if (!anim) { hero.classList.add('no-video'); return; }
    if (!setupFrames()) setupVideoMedia();
  }
  function setupFrames() {
    const dir = hero.dataset.framesDir, total = +hero.dataset.frames;
    if (!dir || !total || !canvas) return false;
    const tier = isMobile() ? 'm' : 'd';
    const ctx = canvas.getContext('2d', { alpha: false });
    const imgs = new Array(total).fill(null), loaded = new Array(total).fill(false);
    let target = 0, cur = 0, drawn = -1, raf = 0, failedFirst = false;
    const src = i => `${dir}/${tier}/f_${String(i + 1).padStart(4, '0')}.webp`;
    const nearest = i => { for (let d = 0; d < total; d++) { if (i - d >= 0 && loaded[i - d]) return imgs[i - d]; if (i + d < total && loaded[i + d]) return imgs[i + d]; } return null; };
    const draw = () => {
      const img = nearest(Math.round(cur)); if (!img) return;
      const cw = canvas.width, ch = canvas.height, s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight), dw = img.naturalWidth * s, dh = img.naturalHeight * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) * 0.45, dw, dh);
      if (!poster.classList.contains('is-off')) poster.classList.add('is-off');
    };
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, isMobile() ? 1.5 : 2); const r = canvas.parentElement.getBoundingClientRect(); canvas.width = Math.max(2, Math.round(r.width * dpr)); canvas.height = Math.max(2, Math.round(r.height * dpr)); drawn = -1; draw(); };
    const decodeAround = i => { for (let k = Math.max(0, i - 10); k <= Math.min(total - 1, i + 24); k++) { const im = imgs[k]; if (im && loaded[k] && im.decode && !im.__dec) { im.__dec = true; im.decode().catch(() => {}); } } };
    const tick = () => {
      const diff = target - cur; cur = Math.abs(diff) < 0.04 ? target : cur + diff * 0.22;
      const i = Math.round(cur); if (i !== drawn) { drawn = i; draw(); decodeAround(i); }
      raf = Math.abs(target - cur) > 0.01 ? requestAnimationFrame(tick) : 0;
    };
    const load = (list, concurrency) => new Promise(res => {
      let next = 0, done = 0; const pending = list.filter(i => !imgs[i]); if (!pending.length) return res();
      const step = () => {
        if (next >= pending.length) return; const i = pending[next++]; const im = new Image(); im.decoding = 'async';
        const fin = ok => { if (ok) { loaded[i] = true; if (Math.abs(i - Math.round(cur)) < 2 || drawn < 0) { drawn = -1; if (!raf) raf = requestAnimationFrame(tick); } } if (++done === pending.length) res(); step(); };
        im.onload = () => fin(true); im.onerror = () => { if (i === 0) failedFirst = true; fin(false); }; im.src = src(i); imgs[i] = im;
      };
      for (let c = 0; c < concurrency; c++) step();
    });
    heroState.mode = 'frames';
    heroState.seekTo = p => { target = Math.max(0, Math.min(total - 1, p * (total - 1))); if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('resize', resize); resize();
    const all = Array.from({ length: total }, (_, i) => i);
    load([0], 1).then(() => {
      if (failedFirst) { heroState.mode = null; window.removeEventListener('resize', resize); setupVideoMedia(); return; }
      heroState.ready = true; rebuildScroll();
      return load(all.filter(i => i % 4 === 0), 6).then(() => load(all.filter(i => i % 2 === 0), 6)).then(() => load(all, 6));
    });
    return true;
  }
  function setupVideoMedia() {
    const qv = new URLSearchParams(location.search).get('video');
    const src = (qv && !qv.includes('//') ? qv : null) || (isMobile() && hero.dataset.videoSrcMobile) || hero.dataset.videoSrc;
    if (!src) { hero.classList.add('no-video'); return; }
    if (canvas) canvas.hidden = true;
    let pending = null, seeking = false, guard = null;
    const applySeek = () => {
      if (pending == null || seeking) return;
      const time = pending; pending = null;
      if (Math.abs(video.currentTime - time) < 0.02) return;
      seeking = true; clearTimeout(guard); guard = setTimeout(() => { seeking = false; applySeek(); }, 600);
      try { video.currentTime = time; } catch (e) { seeking = false; }
    };
    video.addEventListener('seeked', () => { clearTimeout(guard); seeking = false; applySeek(); });
    heroState.mode = 'video';
    heroState.seekTo = p => { if (!heroState.duration) return; pending = Math.min(heroState.duration - 0.04, Math.max(0, p * heroState.duration)); if (!seeking) requestAnimationFrame(applySeek); };
    const timer = setTimeout(() => { if (!heroState.ready) fallback(); }, 8000);
    video.addEventListener('loadedmetadata', () => {
      clearTimeout(timer); heroState.duration = video.duration || heroState.duration; heroState.ready = heroState.duration > 0; video.pause();
      try { video.currentTime = 0.01; } catch (e) {}
      if (heroState.ready) { poster.classList.add('is-off'); rebuildScroll(); } else fallback();
    });
    video.addEventListener('error', fallback);
    function fallback() { clearTimeout(timer); if (heroState.failed) return; heroState.failed = true; heroState.ready = false; video.hidden = true; video.removeAttribute('src'); hero.classList.add('no-video'); watch.hidden = false; rebuildScroll(); }
    video.hidden = false; video.src = src; video.load();
  }
  watch.addEventListener('click', () => { const src = (isMobile() && hero.dataset.videoSrcMobile) || hero.dataset.videoSrc; if (canvas) canvas.hidden = true; poster.classList.add('is-off'); video.hidden = false; video.controls = true; video.muted = false; video.src = src; video.play().catch(() => {}); watch.hidden = true; });

  /* ---------------- scroll storytelling (each section pins itself; rebuilt per breakpoint and on language change) ---------------- */
  let mm = null;
  function rebuildScroll() { if (!hasGsap) return; if (mm) mm.revert(); mm = buildScroll(); requestAnimationFrame(() => ScrollTrigger.refresh()); }
  function buildScroll() {
    const ctxMM = gsap.matchMedia();
    ctxMM.add({ desktop: '(min-width: 1025px)', mobile: '(max-width: 1024px)' }, ctx => {
      const mobile = ctx.conditions.mobile; const splits = []; const vh = () => window.innerHeight;
      if (introStarted && !introDone) finishIntro();           // a breakpoint change never leaves the page locked
      // nav: active link + solid background once the film is behind us
      const links = $$('.route-list a');
      [['retreat', '.story', '.chapters'], ['spaces', '.chapters', '.gallery'], ['gallery', '.gallery', '.stay'], ['location', '.stay', '.site-footer']].forEach(([id, start, end]) => {
        ScrollTrigger.create({ trigger: start, start: 'top 50%', endTrigger: end, end: 'top 50%', onToggle: s => links.forEach(a => a.classList.toggle('active', s.isActive && a.getAttribute('href') === '#' + id)) });
      });
      ScrollTrigger.create({ trigger: '.story', start: 'top 80px', endTrigger: '.site-footer', end: 'bottom top', onToggle: s => nav.classList.toggle('is-solid', s.isActive) });
      if (!anim) return;
      // hero film: pinned, scrubbed, seeks coalesced; without a film the hero is a single screen
      const caption = $('.frame-caption'), bar = $('.frame-progress i');
      if (caption) caption.textContent = t('hero.c0');
      if (heroState.ready && heroState.seekTo) {
        const range = +(mobile ? hero.dataset.scrollVhMobile : hero.dataset.scrollVh) || 5;
        const CAPS = [[0, 'hero.c0'], [8, 'hero.c1'], [13, 'hero.c2'], [16, 'hero.c3'], [20, 'hero.c4'], [24, 'hero.c5'], [30, 'hero.c6'], [38, 'hero.c7'], [44, 'hero.c8'], [54, 'hero.c9'], [58, 'hero.c10']];
        let capIdx = -1;
        const scenes = $('.frame-scenes'); if (scenes) scenes.innerHTML = CAPS.map(cp => `<li>${t(cp[1])}</li>`).join('');
        // the timeline's own progress is the scrubbed (smoothed) one, so the frame settles when scrolling stops
        const heroTl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + vh() * range, pin: true, scrub: 0.6, invalidateOnRefresh: true }, onUpdate() {
          const p = this.progress(); heroState.seekTo(p);
          if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
          const sec = p * heroState.duration; let i = 0; while (i + 1 < CAPS.length && CAPS[i + 1][0] <= sec) i++;
          if (i !== capIdx && caption) { capIdx = i; caption.textContent = t(CAPS[i][1]); gsap.fromTo(caption, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, overwrite: true }); if (scenes) $$('li', scenes).forEach((li, k) => li.classList.toggle('is-on', k === i)); }
        } });
        heroTl.to('.frame-hint', { autoAlpha: 0, duration: 0.12, ease: 'none' }, 0.06).to({}, { duration: 0.82 });
      }
      const heroTitle = new SplitText('.hero-title', { type: 'words,chars', charsClass: 'char' }); splits.push(heroTitle);
      gsap.set(heroTitle.words, { overflow: 'hidden', display: 'inline-block', verticalAlign: 'top' });
      heroState.reveal = gsap.from(heroTitle.chars, { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.012, ease: 'power3.out', paused: true });
      if (introDone) heroState.reveal.play();
      // story: dimensional grid reveal → "Outside the everyday." → colour wipes → brand copy → stay features
      const first = new SplitText('.pre-text-wrapper.first .opacity-text-animation', { type: 'chars', charsClass: 'char' }); splits.push(first);
      const title = new SplitText('.pre-text-left .p', { type: 'lines,words', linesClass: 'line' }); splits.push(title);
      gsap.set('.pre-text-left .line', { overflow: 'hidden' });
      const story = gsap.timeline({ scrollTrigger: { trigger: '.story', start: 'top top', end: () => '+=' + vh() * (mobile ? 3.6 : 4.4), pin: true, scrub: 1, invalidateOnRefresh: true } })
        .fromTo('.image-grid-group .image-wrapper', { y: () => vh() * 0.55, rotationX: -62, transformOrigin: '50% 0%', z: -700, autoAlpha: 0.35 }, { y: 0, z: 0, rotationX: 0, autoAlpha: 1, duration: 0.9, ease: 'sine', stagger: { amount: 0.3, from: 'random', grid: [3, 3] } }, 0)
        .fromTo('.image-grid-group', { scale: 0.86 }, { scale: 1, duration: 1, ease: 'none' }, 0)
        .fromTo('.pre-text-wrapper.first', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 1.0)
        .fromTo(first.chars, { yPercent: 100 }, { yPercent: 0, duration: 0.6, stagger: 0.02, ease: 'power2.out' }, 1.05)
        .to('.pre-text-wrapper.first', { autoAlpha: 0, duration: 0.5 }, 2.0)
        .fromTo('.after-image-wrapper', { xPercent: 100 }, { xPercent: 0, duration: 0.8, stagger: 0.12, ease: 'power2.inOut' }, 2.1)
        .fromTo('.after-image-wrapper img', { xPercent: -100 }, { xPercent: 0, duration: 0.8, stagger: 0.12, ease: 'power2.inOut' }, 2.1)
        .fromTo('.pre-text-wrapper.second', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 3.5)
        .fromTo(title.words, { yPercent: 105 }, { yPercent: 0, duration: 0.7, stagger: 0.02, ease: 'power3.out' }, 3.55)
        .fromTo('.pre-text-right .p', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.15 }, 3.7)
        .fromTo('.animation-btn', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 3.95)
        .fromTo('.animation-btn .svg-border rect', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, 3.95)
        .to('.pre-text-wrapper.second', { autoAlpha: 0, duration: 0.5 }, 5.1)
        .to('.image-grid-group', { autoAlpha: 0, scale: 0.96, duration: 0.6 }, 5.1)
        .fromTo('.stay-features', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 5.4)
        .fromTo('.features-title', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 5.45)
        .fromTo('.stay-features .feature-group', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, 5.5)
        .to({}, { duration: 0.7 });
      // chapters: the demo's parallax slide reveal, three spaces
      const wrappers = $$('.portfolio-wrapper');
      const chapters = gsap.timeline({ scrollTrigger: { trigger: '.chapters', start: 'top top', end: () => '+=' + vh() * (mobile ? 2.6 : 3), pin: true, scrub: 1, invalidateOnRefresh: true } });
      wrappers.forEach((w, i) => {
        const info = $('.chapter-info .info', w);
        if (i === 0) { gsap.from(info, { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.chapters', start: 'top 60%', once: true } }); return; }
        const at = (i - 1) * 1.5 + 0.5;
        chapters.fromTo(w, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: 'none' }, at)
          .fromTo($('.portfolio', w), { yPercent: -100 }, { yPercent: 0, duration: 1, ease: 'none' }, at)
          .fromTo(info, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, at + 0.7);
      });
      chapters.to({}, { duration: 0.5 });
      // quieter sections: restrained entrances, once
      $$('.section-head, .stay-col, .avail-inner').forEach(el => gsap.from(el, { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
      gsap.from('.gallery-item', { y: 26, autoAlpha: 0, duration: 0.6, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '.gallery-grid', start: 'top 85%', once: true } });
      return () => { splits.forEach(s => s.revert()); };
    });
    return ctxMM;
  }

  /* ---------------- gallery lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('.lb-img'), lbCap = $('.lb-cap'), lbStatus = $('.lb-status');
  const items = $$('.gallery-item'); let lbIndex = 0, lbOpener = null;
  const photos = items.map(b => { const img = $('img', b); return { src: img.getAttribute('srcset').split(',').pop().trim().split(' ')[0], cap: () => $('.gallery-cap', b).textContent }; });
  function showLb(i) { lbIndex = (i + photos.length) % photos.length; const p = photos[lbIndex]; lbImg.src = p.src; lbImg.alt = p.cap(); lbCap.textContent = p.cap(); lbStatus.textContent = `${lbIndex + 1} ${t('ga.of')} ${photos.length}. ${p.cap()}`; }
  function openLightbox(i, opener) { lbOpener = opener; showLb(i); lb.hidden = false; main.inert = true; footer.inert = true; document.body.classList.add('paused'); if (smoother) smoother.paused(true); $('.lb-close').focus(); }
  function closeLightbox() { if (!lb || lb.hidden) return; lb.hidden = true; main.inert = false; footer.inert = false; document.body.classList.remove('paused'); if (smoother && !locked) smoother.paused(false); if (lbOpener && lbOpener.focus) lbOpener.focus(); }
  items.forEach((b, i) => b.addEventListener('click', () => openLightbox(i, b)));
  $('.lb-close').addEventListener('click', closeLightbox); $('.lb-prev').addEventListener('click', () => showLb(lbIndex - 1)); $('.lb-next').addEventListener('click', () => showLb(lbIndex + 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowRight') showLb(lbIndex + 1); if (e.key === 'ArrowLeft') showLb(lbIndex - 1); trapTab(lb, e); });

  /* ---------------- availability request (mailto to the verified address; no fake confirmation) ---------------- */
  const form = $('#enquiry');
  if (form) {
    const err = $('.f-error', form), done = $('.f-done', form), again = $('.f-done-link', form);
    const pad = n => String(n).padStart(2, '0'), d0 = new Date(), today = `${d0.getFullYear()}-${pad(d0.getMonth() + 1)}-${pad(d0.getDate())}`;
    form.arrivee.min = today; form.depart.min = today;
    form.arrivee.addEventListener('change', () => { form.depart.min = form.arrivee.value || today; });
    const mark = (f, bad) => { f.classList.toggle('bad', bad); if (bad) { f.setAttribute('aria-invalid', 'true'); f.setAttribute('aria-describedby', 'f-error'); } else { f.removeAttribute('aria-invalid'); f.removeAttribute('aria-describedby'); } };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const a = form.arrivee.value, d = form.depart.value, name = form.nom.value.trim();
      const ok = a && d && d > a && name.length > 1;
      mark(form.arrivee, !a); mark(form.depart, !d || !(d > a)); mark(form.nom, name.length < 2);
      err.hidden = ok; if (!ok) { const b = $('.bad', form); if (b) b.focus(); return; }
      const fill = { in: a, out: d, guests: form.personnes.value, name, msg: form.message.value.trim() };
      const body = t('fm.body').replace(/\{(in|out|guests|name|msg)\}/g, (_, k) => fill[k]);
      const mailto = `mailto:hello@elementa.ca?subject=${encodeURIComponent(t('fm.subject'))}&body=${encodeURIComponent(body)}`;
      again.href = mailto; done.hidden = false; window.location.href = mailto;
    });
  }

  /* ---------------- boot ---------------- */
  if (!hasGsap) { nav.classList.add('is-on'); html.classList.add('no-anim'); return; }
  if (!introSeen && !reduce && intro) lock();
  const start = () => {
    try { setupHeroMedia(); rebuildScroll(); } catch (e) { console.error(e); }
    try { runIntro(); } catch (e) { console.error(e); finishIntro(); }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(start));
  window.addEventListener('load', () => ScrollTrigger.refresh());
  window.__el = { get smoother() { return smoother; }, get introDone() { return introDone; }, get locked() { return locked; }, heroState, finishIntro, rebuildScroll };
})();
