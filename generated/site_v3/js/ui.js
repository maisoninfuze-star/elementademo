/* UI — language, navigation, supporting sections. */
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function splitWords(el) {
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

export function detectLang() {
  try { const s = localStorage.getItem('elementa-lang'); if (s) return s; } catch (e) {}
  return (navigator.language || 'fr').toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function applyCopy(lang, copy) {
  const t = copy[lang];
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach(el => {
    const v = t[el.dataset.i18n]; if (v == null) return;
    if (el.hasAttribute('data-split')) { el.dataset.raw = v; splitWords(el); gsap.set(el.querySelectorAll('.w>span'), { yPercent: el.dataset.shown === '1' ? 0 : 110 }); }
    else el.innerHTML = v;
  });
  $$('[data-i18n-list]').forEach(el => { const v = t[el.dataset.i18nList]; if (v) el.innerHTML = v.map(x => `<li>${x}</li>`).join(''); });
  const b = $('.lang'); b.textContent = t.lang; b.setAttribute('aria-label', t.langAria);
  try { localStorage.setItem('elementa-lang', lang); } catch (e) {}
}

export function buildNav(chapters, copy, lang, onSelect) {
  const nav = $('.pills'); nav.innerHTML = '';
  chapters.forEach(ch => {
    const a = document.createElement('a'); a.href = '#' + ch.id; a.dataset.id = ch.id; a.textContent = copy[lang].nav[ch.id];
    a.addEventListener('click', e => { e.preventDefault(); onSelect(ch); });
    nav.appendChild(a);
  });
}
export function setActivePill(id) { $$('.pills a').forEach(a => a.classList.toggle('active', a.dataset.id === id)); }

export function initSupporting({ reduce, coarse, small, scrollTo }) {
  /* section headlines */
  $$('.sec-title[data-split], .book-title[data-split]').forEach(el => {
    const words = $$('.w>span', el); gsap.set(words, { yPercent: reduce ? 0 : 110 });
    ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => { el.dataset.shown = '1'; gsap.to(words, { yPercent: 0, duration: 1.1, stagger: 0.04, ease: 'expo.out' }); } });
  });
  if (!reduce) $$('.sec-body, .amen, .book-body, .book-actions, .el-tile').forEach(el => gsap.from(el, { y: 32, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  $$('[data-reveal]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: () => el.classList.add('in') }));

  /* element tiles: video on hover, or when centred on touch screens */
  const tileOn = (el, on) => { el.classList.toggle('show', on); const v = $('video', el); if (!v) return; if (on) v.play().catch(() => {}); else v.pause(); };
  $$('.el-tile video').forEach(v => v.addEventListener('pause', () => { const t = v.closest('.el-tile'); if (t.classList.contains('show') && !v.ended) setTimeout(() => { if (t.classList.contains('show') && v.paused) v.play().catch(() => {}); }, 250); }));
  if (coarse) $$('.el-tile').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onToggle: s => tileOn(el, s.isActive) }));
  else $$('.el-tile').forEach(el => { el.addEventListener('pointerenter', () => tileOn(el, true)); el.addEventListener('pointerleave', () => tileOn(el, false)); el.addEventListener('focus', () => tileOn(el, true)); el.addEventListener('blur', () => tileOn(el, false)); });

  /* horizontal gallery (desktop); native snap scroller on small screens */
  if (!small && !reduce) {
    const track = $('.gallery-track'), bar = $('.gallery-bar i'), count = $('.gallery-count');
    const n = track.children.length - 1;
    gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true,
      onUpdate: s => { bar.style.transform = `scaleX(${s.progress})`; count.textContent = String(Math.min(n, Math.floor(s.progress * n) + 1)).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'); } } });
  }
  if (!reduce) $$('[data-parallax]').forEach(el => { const sp = parseFloat(el.dataset.parallax) || 0.2; gsap.fromTo(el, { yPercent: -sp * 40 }, { yPercent: sp * 40, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }); });

  /* anchors */
  $$('a[href^="#"]').forEach(a => { if (a.closest('.pills')) return; a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id.length < 2) return; const t = $(id); if (!t) return; e.preventDefault(); scrollTo(t); }); });
}
