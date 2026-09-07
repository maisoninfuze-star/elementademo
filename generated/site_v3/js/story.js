/* Story — builds the chapter text blocks and choreographs them against scroll progress. */
import { splitWords } from './ui.js';

export class Story {
  constructor(container, chapters, opts = {}) {
    this.container = container; this.chapters = chapters; this.opts = opts;
    this.blocks = {}; this.state = {}; this.active = null; this.onChange = opts.onChange || (() => {});
    this.reduce = !!opts.reduce;
    chapters.forEach(ch => {
      const el = document.createElement('div');
      el.className = 'chapter'; el.dataset.id = ch.id; el.setAttribute('aria-hidden', 'true');
      container.appendChild(el); this.blocks[ch.id] = el; this.state[ch.id] = 'hidden';
    });
  }
  /* (re)render copy for a language; keeps visible chapters visible */
  setCopy(copy, brand) {
    this.chapters.forEach(ch => {
      const c = copy.chapters[ch.id], el = this.blocks[ch.id];
      const actions = c.cta ? `<div class="ch-actions"><a class="btn btn-primary" href="${brand.bookingUrl}">${c.cta}</a><a class="btn btn-ghost" href="#galerie">${c.cta2}</a></div>` : '';
      const tags = c.tags ? `<ul class="tags">${c.tags.map(t => `<li>${t}</li>`).join('')}</ul>` : '';
      el.innerHTML = `<div class="ch-meta"><span class="ch-index">${c.index}</span><span class="ch-eyebrow">${c.eyebrow}</span></div><h2 class="ch-title" data-split>${c.title}</h2><p class="ch-body">${c.body}</p>${tags}${actions}`;
      splitWords(el.querySelector('.ch-title'));
      this.buildTimeline(ch.id);
      if (this.state[ch.id] === 'shown') { this.tl[ch.id].progress(1); gsap.set(el, { opacity: 1, y: 0 }); }
    });
  }
  buildTimeline(id) {
    this.tl = this.tl || {};
    const el = this.blocks[id];
    const words = el.querySelectorAll('.ch-title .w>span');
    gsap.set(words, { yPercent: this.reduce ? 0 : 110 });
    const tl = gsap.timeline({ paused: true });
    if (this.reduce) { tl.set(el, { opacity: 1 }); this.tl[id] = tl; return; }
    tl.from(el.querySelector('.ch-meta'), { y: 14, opacity: 0, duration: 0.55, ease: 'power3.out' }, 0)
      .to(words, { yPercent: 0, duration: 0.95, stagger: 0.035, ease: 'expo.out' }, 0.05)
      .from(el.querySelector('.ch-body'), { y: 22, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.3)
      .from(el.querySelectorAll('.tags li, .ch-actions .btn'), { y: 12, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, 0.45);
    this.tl[id] = tl;
  }
  show(id) {
    if (this.state[id] === 'shown') return;
    this.state[id] = 'shown';
    const el = this.blocks[id]; el.classList.add('on'); el.setAttribute('aria-hidden', 'false');
    this.leave = this.leave || {};
    if (this.leave[id]) { this.leave[id].kill(); this.leave[id] = null; }
    gsap.set(el, { opacity: 1, y: 0 });
    this.tl[id].restart();
  }
  hide(id, dir) {
    if (this.state[id] === 'hidden') return;
    this.state[id] = 'hidden';
    const el = this.blocks[id]; el.classList.remove('on'); el.setAttribute('aria-hidden', 'true');
    this.tl[id].pause();
    if (this.reduce) { gsap.set(el, { opacity: 0 }); return; }
    this.leave = this.leave || {};
    this.leave[id] = gsap.to(el, { opacity: 0, y: dir < 0 ? 18 : -18, duration: 0.4, ease: 'power2.in', onComplete: () => { this.leave[id] = null; this.tl[id].progress(0).pause(); gsap.set(el, { y: 0 }); } });
  }
  update(p) {
    let current = null;
    this.chapters.forEach(ch => {
      const [a, b] = ch.window;
      const inside = ch.persist ? p >= a : (p >= a && p < b);
      if (inside) { current = ch.id; this.show(ch.id); }
      else this.hide(ch.id, p < a ? -1 : 1);
    });
    /* nav highlight: nearest chapter by anchor, so the gaps between windows still map to a pill */
    let nearest = this.chapters[0].id, best = Infinity;
    this.chapters.forEach(ch => { const d = Math.abs(p - (ch.anchor)); if (p >= ch.window[0] - 0.04 && d < best) { best = d; nearest = ch.id; } });
    if (nearest !== this.active) { this.active = nearest; this.onChange(nearest, current); }
  }
}
