// Headless QA: screenshots + functional checks at desktop and phone sizes.
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = __dirname + '/shots';
const URL = process.env.URL || 'http://localhost:8642/?v=qa';
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch();
  const report = {};
  for (const vp of [{ name: 'desktop', width: 1440, height: 900, dpr: 2 }, { name: 'phone390', width: 390, height: 844, dpr: 3, mobile: true }, { name: 'phone360', width: 360, height: 780, dpr: 2, mobile: true }]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, locale: 'fr-CA' });
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    const failed = []; page.on('requestfailed', r => failed.push(r.url()));
    const t0 = Date.now();
    await page.goto(URL, { waitUntil: 'load' });
    const loadMs = Date.now() - t0;
    await sleep(2500);
    const r = { loadMs, errors, failed: failed.slice(0, 10) };
    r.overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    r.height = await page.evaluate(() => document.documentElement.scrollHeight);
    r.heroTextVisible = await page.evaluate(() => { const el = document.querySelector('.hero-inner'); const cs = getComputedStyle(el); return cs.opacity !== '0' && el.getBoundingClientRect().bottom <= innerHeight; });
    r.ctaInViewport = await page.evaluate(() => { const b = document.querySelector('.hero-actions .btn'); const rc = b.getBoundingClientRect(); return rc.top >= 0 && rc.bottom <= innerHeight; });
    await page.screenshot({ path: `${OUT}/${vp.name}-01-hero.jpg`, quality: 70 });
    const go = async (y) => { await page.evaluate(y => window.scrollTo(0, y), y); await sleep(1400); };
    const sec = async id => page.evaluate(id => document.getElementById(id).getBoundingClientRect().top + window.scrollY, id);
    // hero mid
    await go(await page.evaluate(() => (document.querySelector('.chapter-hero').offsetHeight - innerHeight) * 0.5)); await page.screenshot({ path: `${OUT}/${vp.name}-02-hero-mid.jpg`, quality: 70 });
    // falls chapter mid
    await go(await page.evaluate(() => { const c = document.getElementById('terrain'); return c.offsetTop + (c.offsetHeight - innerHeight) * 0.5; })); await page.screenshot({ path: `${OUT}/${vp.name}-03-falls.jpg`, quality: 70 });
    r.fallsTextOpacity = await page.evaluate(() => getComputedStyle(document.querySelector('#terrain .ch-inner')).opacity);
    // enter transition: start, mid, end
    const en = await page.evaluate(() => { const e = document.querySelector('.enter'); return { top: e.offsetTop, len: e.offsetHeight - innerHeight }; });
    await go(en.top + en.len * 0.15); await page.screenshot({ path: `${OUT}/${vp.name}-04-enter-a.jpg`, quality: 70 });
    await go(en.top + en.len * 0.42); await page.screenshot({ path: `${OUT}/${vp.name}-05-enter-b.jpg`, quality: 70 });
    await go(en.top + en.len * 0.8); await page.screenshot({ path: `${OUT}/${vp.name}-06-enter-c.jpg`, quality: 70 });
    r.enterTextOpacity = await page.evaluate(() => getComputedStyle(document.querySelector('.enter-text')).opacity);
    // live chapters
    const liveStates = [];
    for (const id of ['vivre-chambre', 'vivre-terrasse', 'vivre-toit']) { await go((await sec(id)) - vp.height * 0.15); liveStates.push(await page.evaluate(() => [...document.querySelectorAll('.live-img')].map(i => i.classList.contains('is-on') ? 1 : 0).join('') + ' ' + document.querySelector('.live-count b').textContent)); }
    r.liveStates = liveStates; await page.screenshot({ path: `${OUT}/${vp.name}-07-live.jpg`, quality: 70 });
    // elements
    await go((await sec('elements')) + 120); await page.screenshot({ path: `${OUT}/${vp.name}-08-elements.jpg`, quality: 70 });
    // gallery + controls
    await go((await sec('galerie')) + 40); await sleep(800); await page.screenshot({ path: `${OUT}/${vp.name}-09-gallery.jpg`, quality: 70 });
    const c0 = await page.evaluate(() => document.querySelector('.gallery-count b').textContent);
    await page.click('.gal-next'); await sleep(900); const c1 = await page.evaluate(() => document.querySelector('.gallery-count b').textContent);
    await page.click('.gal-next'); await sleep(900); const c2 = await page.evaluate(() => document.querySelector('.gallery-count b').textContent);
    await page.click('.gal-prev'); await sleep(900); const c3 = await page.evaluate(() => document.querySelector('.gallery-count b').textContent);
    r.galleryCounts = [c0, c1, c2, c3];
    r.galleryVisibleMatchesCount = await page.evaluate(() => { const figs = [...document.querySelectorAll('.gallery-track figure')]; const t = document.querySelector('.gallery-track').getBoundingClientRect(); const first = figs.findIndex(f => f.getBoundingClientRect().right > t.left + 10); return { firstVisible: first + 1, count: document.querySelector('.gallery-count b').textContent }; });
    await page.click('.gallery-track figure:nth-child(3)'); await sleep(500); r.lightbox = await page.evaluate(() => ({ open: !document.getElementById('lightbox').hidden, count: document.querySelector('.lb-count').textContent, cap: document.querySelector('.lb-cap').textContent }));
    await page.screenshot({ path: `${OUT}/${vp.name}-10-lightbox.jpg`, quality: 70 });
    await page.keyboard.press('Escape'); await sleep(300); r.lightboxClosed = await page.evaluate(() => document.getElementById('lightbox').hidden);
    // plan + map + form
    await go((await sec('ou')) + 40); await page.screenshot({ path: `${OUT}/${vp.name}-11-plan.jpg`, quality: 70 });
    await go((await sec('reserver')) + 40); await page.screenshot({ path: `${OUT}/${vp.name}-12-book.jpg`, quality: 70 });
    r.formControlsTouch = await page.evaluate(() => [...document.querySelectorAll('.enquiry input, .enquiry select, .enquiry button, .btn, .gal-btn, .lang, .menu-btn')].filter(el => getComputedStyle(el).display !== 'none').map(el => Math.round(el.getBoundingClientRect().height)).filter(h => h > 0 && h < 40).length);
    if (vp.mobile) {
      await go(0); await page.click('.menu-btn'); await sleep(400); r.menu = await page.evaluate(() => ({ open: !document.getElementById('menu').hidden, expanded: document.querySelector('.menu-btn').getAttribute('aria-expanded'), links: document.querySelectorAll('.menu-links a').length }));
      await page.screenshot({ path: `${OUT}/${vp.name}-13-menu.jpg`, quality: 70 });
      await page.click('.menu-links a[href="#galerie"]'); await sleep(1800); r.menuNav = await page.evaluate(() => ({ closed: document.getElementById('menu').hidden, y: Math.round(window.scrollY), galleryTop: document.getElementById('galerie').offsetTop }));
    }
    report[vp.name] = r; await ctx.close();
  }
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1));
  await browser.close();
})().catch(e => { console.error('QA ERROR', e); process.exit(1); });
