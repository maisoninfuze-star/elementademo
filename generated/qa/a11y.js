// Keyboard / focus / language checks after the QA fixes.
const { chromium } = require('playwright');
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(); const out = {};
  // desktop keyboard
  let p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('http://localhost:8642/?v=a11y&lang=fr'); await sleep(2500);
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); // skip, brand
  for (let i = 0; i < 4; i++) await p.keyboard.press('Tab'); // pills -> Photos
  const pillName = await p.evaluate(() => document.activeElement.textContent);
  await p.keyboard.press('Enter'); await sleep(1800);
  const afterEnter = await p.evaluate(() => ({ focus: document.activeElement.id || document.activeElement.className, y: Math.round(scrollY) }));
  for (let i = 0; i < 4; i++) await p.keyboard.press('Tab');
  out.desktopTabAfterPhotos = { pillName, afterEnter, ...(await p.evaluate(() => ({ focus: document.activeElement.className || document.activeElement.tagName, y: Math.round(scrollY), heroCtaVisible: getComputedStyle(document.querySelector('.hero-inner')).visibility }))) };
  // hero cta at 75% of hero -> visibility hidden?
  await p.evaluate(() => window.scrollTo(0, (document.querySelector('.chapter-hero').offsetHeight - innerHeight) * 0.75)); await sleep(1500);
  out.heroInnerVisibility = await p.evaluate(() => getComputedStyle(document.querySelector('.hero-inner')).visibility);
  // language toggle keeps headings visible
  await p.evaluate(() => window.scrollTo(0, document.getElementById('elements').getBoundingClientRect().top + scrollY + 100)); await sleep(1500);
  await p.click('.lang'); await sleep(1200);
  out.langToggle = await p.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, elTitleWordsVisible: [...document.querySelectorAll('#elements .sec-title .w>span')].every(s => { const m = getComputedStyle(s).transform; return m === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(m); }), brandAria: document.querySelector('.brand').getAttribute('aria-label'), coords: document.querySelector('.map-coords').textContent, roomAria: document.getElementById('chambre').getAttribute('aria-label'), langBtnLang: document.querySelector('.lang').lang }));
  // terrain title after toggling: scroll into the falls chapter
  await p.evaluate(() => { const c = document.getElementById('terrain'); window.scrollTo(0, c.getBoundingClientRect().top + scrollY + (c.offsetHeight - innerHeight) * 0.5); }); await sleep(2000);
  out.fallsTitleAfterToggle = await p.evaluate(() => ({ opacity: getComputedStyle(document.querySelector('#terrain .ch-inner')).opacity, words: [...document.querySelectorAll('#terrain .ch-title .w>span')].map(s => getComputedStyle(s).transform).filter(m => m !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(m)).length }));
  // gallery
  await p.evaluate(() => window.scrollTo(0, document.getElementById('galerie').getBoundingClientRect().top + scrollY + 40)); await sleep(1200);
  out.galleryStart = await p.evaluate(() => ({ scrollLeft: document.querySelector('.gallery-track').scrollLeft, count: document.querySelector('.gallery-count b').textContent, prevOff: document.querySelector('.gal-prev').getAttribute('aria-disabled') }));
  for (let i = 0; i < 12; i++) { const off = await p.getAttribute('.gal-next', 'aria-disabled'); if (off === 'true') { out.nextOffAfterClicks = i; break; } await p.click('.gal-next'); await sleep(450); }
  out.galleryEnd = await p.evaluate(() => ({ count: document.querySelector('.gallery-count b').textContent, nextOff: document.querySelector('.gal-next').getAttribute('aria-disabled') }));
  // form $ in name
  await p.evaluate(() => window.scrollTo(0, document.getElementById('reserver').getBoundingClientRect().top + scrollY)); await sleep(800);
  await p.fill('input[name=arrivee]', '2026-10-10'); await p.fill('input[name=depart]', '2026-10-12'); await p.fill('input[name=nom]', 'A$1 Test'); await p.fill('textarea[name=message]', 'Hi $& there');
  await p.evaluate(() => { window.__loc = null; const f = document.getElementById('enquiry'); f.addEventListener('submit', () => { setTimeout(() => { window.__loc = document.querySelector('.f-done-link').href; }, 50); }); });
  await p.evaluate(() => document.getElementById('enquiry').requestSubmit()); await sleep(300);
  out.mailtoBody = decodeURIComponent((await p.evaluate(() => window.__loc || '')).split('body=')[1] || '').replace(/\n/g, ' | ');
  out.desktopErrors = errs; await p.close();
  // mobile menu trap
  p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await p.goto('http://localhost:8642/?v=a11y2&lang=fr'); await sleep(2500);
  await p.click('.menu-btn'); await sleep(400);
  const seq = [];
  for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); seq.push(await p.evaluate(() => (document.activeElement.textContent || document.activeElement.className).trim().slice(0, 18))); }
  out.menuTabSequence = seq; out.menuStillOpen = await p.evaluate(() => !document.getElementById('menu').hidden && document.querySelector('main').inert === true);
  out.menuScrollable = await p.evaluate(() => { const m = document.getElementById('menu'); return { overflowY: getComputedStyle(m).overflowY, innerH: m.scrollHeight, vh: innerHeight }; });
  await p.keyboard.press('Escape'); await sleep(300);
  out.inputFont = await p.evaluate(() => getComputedStyle(document.querySelector('.enquiry input')).fontSize);
  await p.close();
  // reduced motion
  p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }); await p.goto('http://localhost:8642/?v=rm&lang=fr'); await sleep(2500);
  out.reduced = await p.evaluate(() => ({ stage: !!document.querySelector('.stage'), posterVisible: getComputedStyle(document.querySelector('.stage-poster')).opacity, enterTextVisible: getComputedStyle(document.querySelector('.enter-text')).visibility + '/' + getComputedStyle(document.querySelector('.enter-text')).opacity, heroMeta: getComputedStyle(document.querySelector('.hero-meta')).opacity, height: document.documentElement.scrollHeight }));
  await p.close(); await b.close();
  console.log(JSON.stringify(out, null, 1));
})().catch(e => { console.error('A11Y ERROR', e); process.exit(1); });
