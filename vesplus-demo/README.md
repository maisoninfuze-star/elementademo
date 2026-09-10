# vesplus.co.kr — demo clone

A static, dependency-free rebuild of the home page of https://www.vesplus.co.kr (베스플러스, a Korean real-estate sales agency) made as a motion/layout reference. It is meant to be re-skinned for Elementa afterwards; nothing here is Elementa content yet.

Live: https://elementademo.vercel.app/vesplus/ (served from this folder by the root `vercel.json` rewrites). Local: any static server, e.g. `python3 -m http.server 8643` in this folder.

## What it reproduces

- **Intro** (time-driven, scroll locked): Challenges → Innovation → VESPLUS wordmark, "for a perfect real estate market" retyped to "creates a perfect real estate market", the wordmark flies to the nav position and shrinks, the nav fades in, the title unfolds.
- **Pinned scroll story** (11 × viewport on desktop, 15 × on phones, scrub 1): title + horizontal project rail → title dissolves → 9-card photo grid flies in with 3D rotation → "아직 분양 시장은 완벽하지 않습니다" overlay → colour wipes over each card → grid scales up → manifesto text with a drawn button border → images fade to outlined cards that collapse to the centre → four stat cards spread out and count up → three portfolio slides with parallax reveal.
- **News** grid and **footer**, the desktop nav hover (brass plus icon rotates in), the phone hamburger menu (six bars → X, full-screen black menu, page scroll paused).
- Smooth scrolling with GSAP ScrollSmoother (smooth 1.75) on ≥1025px, native scrolling below.

All timings, eases, labels and CSS values are verbatim from the site's own bundle; see `docs/research/BEHAVIORS.md` and `docs/research/PAGE_TOPOLOGY.md`.

## Structure

```
index.html            generated once by tools/build_index.py from the extracted fragments, then edited directly
css/style.css         base (fonts, resets) + verbatim port of the site's layout, nav, home and footer stylesheets
js/app.js             intro + scroll timelines (desktop and phone variants), ScrollSmoother, hamburger, demo link handling
js/vendor/            GSAP 3.13 core, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin (self-hosted)
assets/img/           web-sized JPGs (rail-N, grid-before-N, grid-after-N, portfolio-N, news-N)
assets/fonts/         Public Sans 300/400/600/700 and Pretendard 400/500/600/700 as woff2 (Pretendard subset to the glyphs used)
tools/                prep_assets.py (image conversion) and build_index.py (HTML assembly)
docs/research/        recon output: DOM tree, request log, extracted fragments, pretty-printed original CSS, behaviours, topology
docs/design-references/  original screenshots and side-by-side comparison sheets (cmp-*.jpg)
```

## Not included

- The other routes (About, Portfolios, Careers, PR Center, Contact): links keep their original path in `data-route` but go nowhere.
- The privacy-policy modal and the portfolio page-transition overlay (not reachable from the home page).
- Google Analytics.
- The originals folder (`docs/research/originals`, 55 MB of source PNGs) and the downloaded bundles (`docs/research/raw`) are kept out of git.

## QA

`docs/design-references/cmp-desktop-*.jpg`, `cmp-mobile-*.jpg` and `cmp-intro-00.jpg` show the original (left) and the clone (right) at identical scroll positions (every 250px on desktop, 350px on a 390px phone) and at 0.4s intervals through the intro. The capture scripts live in the session scratchpad (`recon.js`, `steps.js`, `msteps.js`, `clone_steps.js`, `measure.js`).
