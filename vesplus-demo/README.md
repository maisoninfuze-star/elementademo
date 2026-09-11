# Elementa Experiences — /vesplus/ demo

Live: https://elementademo.vercel.app/vesplus/ (served from this folder by the root `vercel.json`: `/vesplus` redirects to `/vesplus/`, `/vesplus/(.*)` rewrites to `/vesplus-demo/$1`). Local: any static server with HTTP range support, e.g. `npx serve .` (Python's `http.server` cannot seek video).

This folder started as a clone of vesplus.co.kr (that extraction is kept under `docs/research` and `docs/design-references`) and was converted in place into an Elementa Experiences demo: same stack (plain HTML/CSS/JS with GSAP 3.13, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin, all self-hosted in `js/vendor`), same strongest interactions (intro logo flying into the navigation, pinned dimensional photo grid with colour wipes, outlined buttons, full-screen chapter reveals), Elementa identity and content. The root Elementa site in `../site` is untouched.

## Files

```
index.html            page (FR markup, EN/FR dictionary applied by the script); the logo vectors are injected between the LOGO markers
css/style.css         tokens (bg #0B0B0A, ivory #E9E4DA, brass #B08D57, forest #16201B), Instrument Serif + IBM Plex; plain flow by default, animated layout only under html.js-anim
js/app.js             intro assembly, hero film scrub, story/chapter timelines (gsap.matchMedia, rebuilt per breakpoint and language), nav/menu, lightbox, availability form
assets/logo/elementa-logo.svg   traced from ../Logo_Elementa.png by tools/trace_logo.py (groups: oval, sun, mountain, leaf, wave rows, wordmark, tagline, whole emblem, whole master)
assets/img/           Elementa photos (WOLFILMZ, web-sized, with -800 variants), favicons, og image
tools/trace_logo.py   vectoriser (needs numpy, opencv, pypotrace); tools/inject_logo.py rewrites the SVG into index.html (idempotent)
```

## Intro (about 5.5 s, once per session)

Sun (rays drawn) → fire/mountain → tree/leaf → water (four rows) → convergence into the emblem while the oval draws → the exact master emblem replaces the parts → wordmark wipe, "Experiences" → the emblem and wordmark fly into the compact navigation lockup. Each sign parks in its final position at reduced scale and opacity after its moment. The water sign's fourth row dissolves during convergence so the result matches the master. Skip button (focused on start), `sessionStorage` flag `elementa-intro`, reduced motion shows the finished logo for 1.4 s, a 12 s watchdog and the window error handler release the scroll lock, a breakpoint change during the intro ends it.

## Hero film

The approved walkthrough (`assets/film/`) comes from Inder's AI-upscaled export of 2026-09-11 (1360×2416 portrait container with the 16:9 footage letterboxed inside, 60 fps, 69 s; the original WhatsApp file was 464 px wide and looked soft). It is cropped to the footage (`crop=1360:766:0:830`) and encoded twice with `ffmpeg`: `walkthrough-720.mp4` (1280×720, H.264 high, CRF 25, 30 fps, keyframe every second, faststart, no audio, 22 MB) for ≥1025 px and `walkthrough-360.mp4` (720×406, CRF 26, keyframe every half second, 9 MB) for phones, plus `poster.jpg` (first frame). The hero is a title row (kicker, headline, the two buttons) with the film running edge to edge beneath it and filling the rest of the screen (`object-fit: cover`, centred a little above the middle), never under the navigation. A scene caption (`hero.c0`…`hero.c10`, keyed to seconds in `app.js`) and "Elementa · Rawdon" sit over the bottom of the film on a local gradient, with a brass progress line along its bottom edge. On phones the band is 16:10 at full width and a scene index below it lists the eleven captions with the current one highlighted.

Attributes on `<section class="hero">`: `data-video-src`, `data-video-src-mobile`, `data-poster`, `data-scroll-vh="8"` (desktop pin length in viewport heights, about 104 px of scroll per second of film at 900 px tall), `data-scroll-vh-mobile="5"`. Preview another same-origin film with `/vesplus/?video=assets/film/other.mp4`.

Behaviour: the hero pins after the intro, the scrubbed timeline progress maps to `currentTime` (clamped, seeks coalesced through `seeked` with a 600 ms guard, no seek for the same frame), scrolling up reverses, stopping lets the frame settle (scrub 0.6), autoplay never runs, the poster fades once metadata is in. If metadata never arrives or the file errors, the poster stays and a "Watch the experience" button inside the frame plays the film normally. Re-encode with `-movflags +faststart` and a short keyframe interval if the source changes; test on Safari/iPhone before launch.

## Sections

- `#retreat` (`.story`, pinned 4.4 viewports on desktop / 3.6 on phones): 9-photo grid flies in with the demo's rotationX reveal, "Outside the everyday." over it, colour wipes (grayscale → colour of the same photo), brand copy with the drawn-border button, then four verified stay features (no invented figures).
- `#spaces` (`.chapters`, pinned 3 / 2.6 viewports): the glass bedroom, the stove and rain shower, the terrace and roof, each with a gallery link.
- `#gallery`: six photos with a lightbox (Escape, arrows, focus trap, live status) and a link to the full gallery on the main site.
- `#location`: verified stay details, amenities, directions link (approximate coordinates).
- `#availability`: "Request availability" form → `mailto:hello@elementa.ca` with the request pre-filled; no booking engine, no fake confirmation.

## Verified tests (Playwright, Chromium)

Desktop 1440×900, tablet 1024×1366, phone 390×844: no console errors, no horizontal overflow, two pin spacers (three when a film is set). Intro frames every 0.35 s (each sign recognisable alone; final emblem is the traced master), skip mid-intro (lock released, nav shown, session flag), repeat visit (no replay), reduced motion (no pins, everything in flow), deep link `#location` after the intro, resize across 1024 px (timelines rebuilt, no lock), FR/EN switch (SplitText reverted and rebuilt, headings visible), hamburger (aria-expanded, focus into the menu, Escape returns focus), lightbox, form validation and mailto body, video scrub forward/reverse with a stand-in film (0 → 4.9 s → 0, no backlog after a 30-step burst), bad video source (poster + watch button, page usable), vendor scripts blocked (content visible, nav shown, no lock). Not yet tested: Safari/iPhone seeking with the real film.
