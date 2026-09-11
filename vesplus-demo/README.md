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

## Intro (about 5.5 s, every visit)

Sun (rays drawn) → fire/mountain → tree/leaf → water (four rows) → convergence into the emblem while the oval draws → the exact master emblem replaces the parts → wordmark wipe, "Experiences" → the emblem and wordmark fly into the compact navigation lockup. Each sign parks in its final position at reduced scale and opacity after its moment. The water sign's fourth row dissolves during convergence so the result matches the master. Skip button (focused on start); plays on every visit, only back/forward history navigation skips it (`sessionStorage` flag `elementa-intro`); reduced motion shows the finished logo for 1.4 s, a 12 s watchdog and the window error handler release the scroll lock, a breakpoint change during the intro ends it.

## Hero film

Source: Inder's re-cut of 2026-09-11 (`~/Downloads/kissan/0911.mov`, HEVC 4320×7672 portrait container with the 16:9 footage letterboxed inside, 30 fps, 62.5 s). The footage is cropped with `crop=4320:2432:0:2638`. Earlier versions: the WhatsApp original (464 px wide) and its AI upscale (1360×2416, 69 s).

**Scrubbing uses a frame sequence, not the video.** `assets/film/frames2/d/f_0001..0720.webp` (1280×720, q74, 30 MB) for ≥1025 px and `frames2/m/` (720×406, q70, 16 MB) for phones, 720 frames ≈ 11.5 per second of film, extracted with `ffmpeg -hwaccel videotoolbox -vf "crop=4320:2432:0:2638,fps=720/62.466667,scale=1280:720"` to PNG and converted with Pillow (the frames of the previous film were removed). The page draws them on `canvas.hero-canvas`: the scroll position sets a target frame, a requestAnimationFrame loop eases the drawn frame towards it (so it settles when scrolling stops) and pre-decodes the frames around the current one; frame 0 loads first (the hero is ready in under a second), then every fourth frame, every second, then all. Seeking a video decodes from the previous keyframe on every scroll step, which is what made the earlier version stutter.

Fallback chain: if the first frame fails, the mp4 (`walkthrough-720-v3.mp4`, 720×406, 12 MB, keyframe every half second) is scrubbed through `currentTime` with coalesced seeks; if that fails too, the poster stays and "Watch the experience" plays the mp4 normally. `data-frames`, `data-frames-dir`, `data-duration`, `data-video-src`, `data-poster`, `data-scroll-vh="8"` (desktop, about 10 px of scroll per frame at 900 px tall) and `data-scroll-vh-mobile="5"` live on `<section class="hero">`. Video and image files are served with a one-year immutable cache, so a new film needs new file names. Layout (2026-09-11 redesign): the film fills the viewport under the navigation, the kicker + headline + "Skip exploration" sit over its lower-left corner and recede during the first 15 % of the scrub, the scene counter ("05 / 12"), caption and scroll hint sit lower-right; "Check availability" is in the navigation only. Phones: compact copy block with the CTA above a 16:10 band, caption over the band, scene index under it. When the intro releases, the film fades in with a slight settle before the headline characters rise.

## Sections

- `#retreat` (`.story`, pinned 4.4 viewports on desktop / 3.6 on phones): 9-photo grid flies in with the demo's rotationX reveal, "Outside the everyday." over it, colour wipes (grayscale → colour of the same photo), brand copy with the drawn-border button, then four verified stay features (no invented figures).
- `#spaces` (`.chapters`, pinned 3 / 2.6 viewports): the glass bedroom, the stove and rain shower, the terrace and roof, each with a gallery link.
- `#gallery`: six photos with a lightbox (Escape, arrows, focus trap, live status) and a link to the full gallery on the main site.
- `#location`: verified stay details, amenities, directions link (approximate coordinates).
- `#availability`: "Request availability" form → `mailto:hello@elementa.ca` with the request pre-filled; no booking engine, no fake confirmation.

## Verified tests (Playwright, Chromium)

Desktop 1440×900, tablet 1024×1366, phone 390×844: no console errors, no horizontal overflow, two pin spacers (three when a film is set). Intro frames every 0.35 s (each sign recognisable alone; final emblem is the traced master), skip mid-intro (lock released, nav shown, session flag), repeat visit (no replay), reduced motion (no pins, everything in flow), deep link `#location` after the intro, resize across 1024 px (timelines rebuilt, no lock), FR/EN switch (SplitText reverted and rebuilt, headings visible), hamburger (aria-expanded, focus into the menu, Escape returns focus), lightbox, form validation and mailto body, frame scrub forward/reverse (progress tracks a 40-step burst, settles, reverses), frames blocked → video scrub fallback, bad video source → poster + watch button, vendor scripts blocked (content visible, nav shown, no lock). Not yet tested: Safari/iPhone seeking with the real film.
