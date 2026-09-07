import { BRAND, CHAPTERS, COPY, ASSETS, STORY_VH } from './config.js';
import { SEQUENCE } from './sequence.js';
import { FrameStore } from './loader.js';
import { Stage } from './stage.js';
import { Story } from './story.js';
import { initScroll, pinProgress, progressToY } from './scroll.js';
import { $, $$, detectLang, applyCopy, buildNav, setActivePill, initSupporting } from './ui.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]reduce/.test(location.search);
const coarse = matchMedia('(pointer: coarse)').matches;
const small = matchMedia('(max-width: 767px)').matches;
if (reduce) document.documentElement.classList.add('reduce');
document.documentElement.style.setProperty('--story-vh', String(small ? Math.min(STORY_VH, 5) : STORY_VH));

let lang = detectLang();
const { lenis, scrollTo } = initScroll({ reduce });
const storyEl = $('#story');

/* ---- chapters ---- */
const story = new Story($('.chapters'), CHAPTERS, { reduce, onChange: id => { setActivePill(id); if (fallback) setPoster(id); } });
story.setCopy(COPY[lang], BRAND);
buildNav(CHAPTERS, COPY, lang, ch => scrollTo(progressToY(storyEl, ch.anchor)));
applyCopy(lang, COPY);
$('.lang').addEventListener('click', () => { lang = lang === 'fr' ? 'en' : 'fr'; applyCopy(lang, COPY); story.setCopy(COPY[lang], BRAND); $$('.pills a').forEach(a => { a.textContent = COPY[lang].nav[a.dataset.id]; }); ScrollTrigger.refresh(); });

/* ---- frames + stage ---- */
const set = window.innerWidth <= 820 ? 'm' : 'd';
const store = new FrameStore(SEQUENCE, set, ASSETS.frames);
const canvas = $('.stage-canvas'), poster = $('.stage-poster'), loadbar = $('.loadbar i');
let fallback = false;
const setPoster = id => { if (ASSETS.posters[id]) poster.src = ASSETS.posters[id]; };

if (reduce) {
  /* reduced motion: four static chapters with posters, normal scrolling */
  storyEl.hidden = true; const st = $('.story-static'); st.hidden = false;
  CHAPTERS.forEach(ch => {
    const sec = document.createElement('section'); sec.id = ch.id;
    sec.innerHTML = `<img src="${ASSETS.posters[ch.id]}" alt=""><div class="shade"></div><div class="wrap"></div>`;
    sec.querySelector('.wrap').appendChild(story.blocks[ch.id]); st.appendChild(sec);
    story.show(ch.id);
  });
  $$('.pills a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); scrollTo($('#' + a.dataset.id)); }, { capture: true }));
  $('.loadbar').classList.add('done');
} else {
  const stage = new Stage(canvas, store, SEQUENCE, poster);
  store.onProgress = p => { loadbar.style.transform = `scaleX(${p})`; };
  store.onFrame = () => stage.request();
  const firstCount = SEQUENCE.segments.slice(0, 2).reduce((a, s) => a + s.n, 0);
  store.run(store.plan(firstCount)).then(() => {
    $('.loadbar').classList.add('done');
    if (store.loaded === 0) { fallback = true; setPoster(story.active || 'intro'); }
  });
  pinProgress(storyEl, p => { stage.setProgress(p); story.update(p); });
  story.update(0);
  window.__el = { store, stage, story, lenis };
}

initSupporting({ reduce, coarse, small, scrollTo });
window.addEventListener('load', () => ScrollTrigger.refresh());
