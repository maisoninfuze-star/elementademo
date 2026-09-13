# Elementa — Sainte-Béatrix demo (/beatrix/)

Live: https://elementademo.vercel.app/beatrix/ (root `vercel.json`: `/beatrix` redirects to `/beatrix/`, `/beatrix/(.*)` rewrites to `/beatrix-demo/$1`). Third, separate demo built on 2026-09-13 from the two September briefs (`Elementa-Website-Update-Claude-Prompt.md`, `Elementa-Claude-Second-Pass-Correction-Prompt.md`), the brand guide (`Elementa Expériences — Guide de marque.docx`, dated corrections win) and the old-site copy (`Elementa - Copywriting ancien site web.docx`, historical only). The root site (`../site`) and the `/vesplus/` demo are untouched.

Local: `npx serve -l 8645 beatrix-demo` (any static server with HTTP range support; `.claude/launch.json` has the `beatrix-demo` entry). Python's `http.server` cannot seek video.

## What it is

A normal-scroll editorial landing page (no GSAP, no ScrollSmoother, no pinning) with the cabin film kept as an optional immersive viewer:

- **Hero** ≈ one viewport: poster first (LCP), then a 10 s muted excerpt of Inder's 2026-09-11 film (rooftop terrace, 36.2–46.2 s) that loops with a soft dip, pauses off-screen / on hidden tab, visible pause control. French copy from the brief; `Planifier votre séjour` (availability request, no reservation engine), `Visiter la cabine` (opens the viewer), `Découvrir le lieu`.
- **Logo flourish** ≈ 1.5 s over the usable hero: the four signs appear (sun, mountain, leaf, waves), the oval settles, then the mark lifts away as the navigation lockup fades in. Once per tab session (`sessionStorage` `elementa3-intro`); reduced motion shows the finished mark immediately. Nothing is locked.
- **Sections** (ivory / charcoal / forest): Le lieu (facts strip + aerial still) · Votre cabine de montagne · three-detail tabs (Le feu / La vapeur / Le toit-terrasse, click + arrow keys + touch, first visible) · La Mentalité Elementa · Un lieu pensé avec les gens d'ici · Au rythme des saisons (copy only: summer photography is all we have) · eight-photo gallery with lightbox · Localisation (municipality only, no pin) · stay-planning form · footer.
- **Viewer** (`<dialog>` `#visite`): `Lecture guidée` plays `tour-1280.mp4` (`tour-720.mp4` on phones) with play/pause, slider, time, six chapters; `À votre rythme` scrolls a 720-frame WebP sequence on a canvas inside the dialog (bounded window of ±40 frames, cache released on close). One shared time; mode switches keep the scene; Escape / `Fermer la visite` stop media, restore scroll and focus; end card offers replay, cabin page, planning. Nothing is loaded before the guest opens it.
- **Pages**: `cabines.html` (photo sequence + amenities accordion `#equipements`), `mentalite.html`, `histoire.html` (site search, architecture, co-creation, founders' roles, project status: 4 now / phase 1 planned / long-term vision, occasions), `faq.html` (FAQPage JSON-LD), `galerie.html` (26 photos), `confidentialite.html`.
- **Languages**: French default on a first visit; EN/FR toggle persisted in `localStorage` `elementa3-lang` (or `?lang=en`); the switch keeps the hash, form values and open viewer.
- **Form**: dates, guests, name, email, optional note, separate marketing consent, privacy link; client validation with inline errors; `data-endpoint=""` → honest "not yet enabled" state (no mailto, no fake success). `?mock=ok` / `?mock=fail` exercise the loading / accepted / failed states.

## Files

```
src/pages/*.html      page templates (front matter + {{> partial}} includes + data-i18n keys)
src/partials/*.html   head, header (+ mobile menu dialog), footer, tour dialog, lightbox
src/i18n.json         every string, fr + en; the build injects the French text so the page is complete without JS
tools/build.py        assembles ./*.html and js/i18n.js; bumps nothing by itself — edit VERSION there when css/js change
css/style.css         tokens (charcoal #111310, ivory #F3F0E8, forest #303C32, stone, brass #B69A6C), Instrument Serif + IBM Plex Sans
js/app.js             i18n, header theme + active link, anchors/history, menu, hero video + flourish, reveals, tabs, lightbox, form, tour
assets/film/          hero-1600/960.mp4, hero-poster-*.jpg, tour-1280/720.mp4, still-*.jpg, frames/{d,m}/f_0001..0720.webp
assets/img/           WOLFILMZ photos (web sizes + -800), og.jpg, icons; assets/logo/elementa-logo.svg (traced master)
docs/CONTENT-DECISIONS.md   internal content decision log + release dependencies (not guest-facing)
```

Edit `src/` then run `python3 tools/build.py`; never edit the generated root HTML or `js/i18n.js` directly. Media is served with a one-year immutable cache: a new encode needs a new file name.

## Media

Source: `~/Downloads/kissan/0911.mov` (HEVC 4320×7672, footage crop `4320:2432:0:2638`, 62.47 s, silent). Hero excerpt: `-ss 36.2 -t 10`, x264 CRF 27/29. Tour: x264 CRF 25 (1280×720, keyframe every 1 s) / CRF 27 (720×406, every 0.5 s). Stills: JPEG q2 at 1920, q3 at 960. Frames: the 720-frame set built for the previous demo (Pillow WebP q74 desktop 1280×720, q70 phone 720×406).

Chapters (verified against the frames): L'arrivée 0 s · La cabine 9 s · Le foyer 11.7 s · La cuisine 14.3 s · La terrasse 31.5 s · Le bain vapeur 49.5 s. Twelve scene captions drive the caption line.

## Tests

`scratchpad/pw/qa.js <baseURL>` (Playwright, Chromium): 157 checks — first-visit French, banned strings, required copy, hero height, one-viewport reveal, no frames/tour mp4 on the homepage, ambient video + pause + offscreen pause, repeat visit, every header/footer/in-page link (position under the header, hash, active state), Back/Forward, direct hash, viewer (guided → chapter → manual → scroll → guided, end card, Escape restoring scroll + focus, reopen, planning from the viewer), tabs, lightbox, form (validation, mock fail/ok, unavailable state), language switch (hash + values kept, persisted), reduced motion, 390 / 768 px (menu, tour, gestures stay inside the viewer, no overflow), blocked media, no JavaScript, every sub-page.
