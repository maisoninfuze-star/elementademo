/* Elementa: business details, copy, palette and asset paths. Edit here, not in the modules. */

export const BRAND = {
  name: 'Elementa',
  place: 'Rawdon, Lanaudière',
  email: 'hello@elementa.ca',
  bookingUrl: 'mailto:hello@elementa.ca',
  instagram: '@elementa.rawdon',
  instagramUrl: 'https://instagram.com/elementa.rawdon',
  coords: '46.05° N, 73.71° O',
};

export const THEME = { bg: '#0B0B0A', ink: '#E9E4DA', mute: '#B8B2A6', accent: '#B08D57' };

/* Scroll story: four chapters over one pinned stage.
   window  = progress range (0..1 of the pinned travel) during which the chapter text is visible
   anchor  = progress the pill nav scrolls to */
export const CHAPTERS = [
  { id: 'intro',      window: [0.00, 0.17], anchor: 0.02 },
  { id: 'discovery',  window: [0.25, 0.43], anchor: 0.30 },
  { id: 'detail',     window: [0.52, 0.74], anchor: 0.58 },
  { id: 'invitation', window: [0.85, 1.00], anchor: 0.97, persist: true },
];

/* Pinned travel in viewport heights (the brief asks for 4 to 6). */
export const STORY_VH = 5.5;

export const ASSETS = {
  frames: 'frames',            // frames/<set>/<segment>/f_001.webp, set = d (desktop) | m (mobile)
  posters: { intro: 'assets/poster-intro.jpg', discovery: 'assets/poster-discovery.jpg', detail: 'assets/poster-detail.jpg', invitation: 'assets/poster-invitation.jpg' },
};

export const COPY = {
  fr: {
    'a11y.skip': 'Passer la séquence',
    'nav.book': 'Réserver', 'lang': 'EN', 'langAria': 'Switch to English',
    nav: { intro: 'Le refuge', discovery: 'La forêt', detail: 'Les matières', invitation: 'Séjour' },
    chapters: {
      intro:      { index: '01 / 04', eyebrow: 'Rawdon, Lanaudière', title: 'Une chambre noire, <em>suspendue dans la forêt.</em>', body: 'Elementa. Une seule pièce en porte-à-faux, vitrée sur deux côtés, à 1 h 15 de Montréal.', tags: ['Une pièce', 'Deux personnes', 'Toute l’année'] },
      discovery:  { index: '02 / 04', eyebrow: 'Un terrain boisé privé', title: 'Seule sur son roc, <em>ouverte sur les arbres.</em>', body: 'Personne à l’horizon. Un ruisseau en contrebas, les chutes Dorwin à dix minutes, le village juste après.', tags: ['Forêt privée', 'Ruisseau', 'Chutes Dorwin'] },
      detail:     { index: '03 / 04', eyebrow: 'Ardoise, laiton, verre, cèdre', title: 'Chaque matière <em>choisie pour durer.</em>', body: 'Une douche pluie taillée dans l’ardoise, un hublot sur les pins, une échelle de bois vers le toit, un lit king face à la forêt.', tags: ['Douche pluie', 'Hublot', 'Lit king'] },
      invitation: { index: '04 / 04', eyebrow: 'Réservez vos dates', title: 'Une nuit <em>dans la canopée.</em>', body: 'Le poêle sur le toit, plus d’étoiles que vous ne le pensiez. Une pièce, deux personnes, toute l’année.', cta: 'Réserver', cta2: 'Voir les photos' },
    },
    'el.title': 'Quatre éléments, <em>quatre saisons.</em>', 'el.body': 'Le refuge change avec ce qui l’entoure. Le feu du poêle en hiver, la pluie sur les vitres, la brume du matin, la neige sur le toit.',
    'el.air': 'Air', 'el.airc': 'La brume du matin sur la terrasse', 'el.fire': 'Feu', 'el.firec': 'Le poêle allumé, les vitres qui rougeoient', 'el.water': 'Eau', 'el.waterc': 'La pluie sur la longue fenêtre de la douche', 'el.earth': 'Terre', 'el.earthc': 'La neige sur le toit, la forêt en silence',
    'ga.label': 'Photos', 'ga.title': 'Ardoise, laiton, verre, cèdre.',
    'wh.title': 'Rawdon, <em>à 1 h 15 de Montréal.</em>', 'wh.body': 'Sur un terrain boisé privé de Lanaudière, à dix minutes des chutes Dorwin et du village. Autoroute 25, puis la 125 vers le nord.',
    'am.label': 'Commodités', 'am.list': ['Lit king', 'Terrasse sur le toit', 'Poêle à bois', 'Douche pluie', 'Cuisinette et espresso', 'Wi-Fi et télé', 'Planchers chauffants', 'Terrain boisé privé'],
    'bk.title': 'Une nuit <em>dans la canopée.</em>', 'bk.body': 'Une pièce, deux personnes, toute l’année. Écrivez-nous avec vos dates, nous répondons le jour même.', 'bk.cta': 'Réserver',
    'ft.credit': 'Images : WOLFILMZ', 'ft.top': 'Haut de page',
  },
  en: {
    'a11y.skip': 'Skip the sequence',
    'nav.book': 'Book', 'lang': 'FR', 'langAria': 'Passer au français',
    nav: { intro: 'The cabin', discovery: 'The forest', detail: 'Materials', invitation: 'Stay' },
    chapters: {
      intro:      { index: '01 / 04', eyebrow: 'Rawdon, Lanaudière', title: 'A black room, <em>suspended in the forest.</em>', body: 'Elementa. A single cantilevered room with glass on two sides, 1 h 15 from Montréal.', tags: ['One room', 'Two guests', 'Year round'] },
      discovery:  { index: '02 / 04', eyebrow: 'A private wooded lot', title: 'Alone on its rock, <em>open to the trees.</em>', body: 'Nobody in sight. A creek below, the Dorwin falls ten minutes away, the village just after.', tags: ['Private forest', 'Creek', 'Dorwin falls'] },
      detail:     { index: '03 / 04', eyebrow: 'Slate, brass, glass, cedar', title: 'Every material <em>chosen to last.</em>', body: 'A rain shower cut into slate, a porthole onto the pines, a wooden ladder to the roof, a king bed facing the forest.', tags: ['Rain shower', 'Porthole', 'King bed'] },
      invitation: { index: '04 / 04', eyebrow: 'Book your dates', title: 'A night <em>in the canopy.</em>', body: 'The stove on the roof, more stars than you expect. One room, two guests, all year.', cta: 'Book', cta2: 'See the photos' },
    },
    'el.title': 'Four elements, <em>four seasons.</em>', 'el.body': 'The cabin changes with what surrounds it. The stove in winter, rain on the glass, morning mist, snow on the roof.',
    'el.air': 'Air', 'el.airc': 'Morning mist on the terrace', 'el.fire': 'Fire', 'el.firec': 'The stove lit, the glass glowing', 'el.water': 'Water', 'el.waterc': 'Rain on the long shower window', 'el.earth': 'Earth', 'el.earthc': 'Snow on the roof, the forest silent',
    'ga.label': 'Photos', 'ga.title': 'Slate, brass, glass, cedar.',
    'wh.title': 'Rawdon, <em>1 h 15 from Montréal.</em>', 'wh.body': 'On a private wooded lot in Lanaudière, ten minutes from the Dorwin falls and the village. Highway 25, then the 125 north.',
    'am.label': 'Amenities', 'am.list': ['King bed', 'Rooftop terrace', 'Wood stove', 'Rain shower', 'Kitchenette and espresso', 'Wi-Fi and TV', 'Heated floors', 'Private wooded lot'],
    'bk.title': 'A night <em>in the canopy.</em>', 'bk.body': 'One room, two guests, all year. Write to us with your dates, we answer the same day.', 'bk.cta': 'Book',
    'ft.credit': 'Images: WOLFILMZ', 'ft.top': 'Back to top',
  },
};
