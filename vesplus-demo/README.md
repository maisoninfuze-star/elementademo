# Elementa Expériences — /vesplus/ demo

Live: https://elementademo.vercel.app/ — since 2026-09-19 this folder IS the main demo: the root `vercel.json` rewrites `/` and `/(.*)` to `/vesplus-demo/…`, and the old `/vesplus/…` URLs 301 to the root. The previous root site (`../site`, Rawdon) stays reachable at `/rawdon/`, the `/beatrix/` demo is unchanged. Local: use `python3 ../../ELementa/range_server.py 8266 .` (Range support — plain `python -m http.server` stalls the hero film).

This folder started as a clone of vesplus.co.kr (that extraction is kept under `docs/research` and `docs/design-references`) and was converted in place into an Elementa Expériences demo: same stack (plain HTML/CSS/JS with GSAP 3.13, ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, MotionPathPlugin, all self-hosted in `js/vendor`), same strongest interactions (intro logo flying into the navigation, pinned dimensional photo grid with colour wipes, outlined buttons, full-screen chapter reveals), Elementa identity and the client's content tree of September 2026 (Sainte-Béatrix). The root Elementa site in `../site` and the `/beatrix/` demo are untouched.

## Build

```
src/i18n.json          every string, fr + en (one key per string); French gets its narrow no-break spaces at build time
src/pages/*.html       body of each secondary page (first line: <!-- page: key=… --> names the meta.<key>.title/desc keys)
src/partials/          nav, menu, early-access band, footer, virtual-tour dialog — shared by every page
src/shell.html         head + layout wrapper for the secondary pages
tools/build.py         python3 tools/build.py → writes js/i18n.js, the 11 secondary pages, refreshes the shared regions of
                       index.html (between the NAV / MENU / EARLY / FOOTER / TOUR markers) and injects the French strings into
                       every data-i18n element. Bump VERSION there for the ?v= stamps. index.html itself is hand-authored.
tools/trace_logo.py    logo vectoriser (numpy, opencv, pypotrace); tools/inject_logo.py rewrites the SVG into index.html (INTRO_* markers inside `#intro` and the LOGO_DEFS block)
```

Never edit the generated root pages or `js/i18n.js` by hand.

## Pages (client tree)

- `index.html` — Accueil: logo intro (the four signs assemble, the emblem and wordmark fly into the nav) → hero film (approach flight → parked balcony still → « Entrer »), « Séjour haut de gamme » two-column block, black statement band with the four facts, « Le lieu / Les cabines / À l'étage » cards, localisation, disponibilités, liste d'accès anticipé, footer. (The photo gallery moved to the Sainte-Béatrix page on 2026-09-19.)
- `sainte-beatrix.html` — Le projet, Cabines de montagne, 0.0 L'architecture, Visite virtuelle (chambre, cuisine, à l'étage), Autres équipements, Une histoire qui commence. Also the photo gallery (`#galerie`): a full-width arrow carousel of 9 cards with captions beneath the photos (`.carousel`, native snap scrolling, no autoplay, no lightbox).
- `evenements.html` — retraite corporative, bien-être, créative, mariage d'exception (each → liste d'accès anticipé).
- `blogue.html` (articles à venir), `histoire.html`, `partenaires.html`, `contact.html`, `planifier.html` (with the availability form), `faq.html`, `actualites.html` (dossier de presse), `boutique.html` and `habitations.html` (placeholders, as in the client tree).
- Every page ends with the « Rester informé » band (email + occasion) and the footer (address 175, rue Panoramique, Sainte-Béatrix; Instagram/Facebook @elementa.experiences).

Contact addresses come from the client document: `info@elementa-experiences.com` (general, availability form, early-access list), `media@elementa-experiences.com` (media), `hamza@hamzamajdi.com` (press kit). Both forms open the visitor's email app with the request pre-filled; nothing pretends to send.

## Home page layout and motion (2026-09-18 — client feedback)

The layout follows the Scale.com reference the client supplied (full-bleed photo hero with a centred headline and a bottom-right scroll prompt, a pure-black statement band, flat 16 px-radius cards with 32 px padding, no shadows, 1280 px content width), with Elementa's own palette, typefaces and confirmed French copy. The pinned, scroll-scrubbed story and chapter sections were removed at the owner's request: content is now laid out in fixed blocks that are fully readable at rest, so nothing can be skipped by scrolling fast.

- Logo intro then hero film (every visit): the animated logo assembly (5.5 s, `#intro`, GSAP + DrawSVG, « Passer l’introduction » skips it, back/forward navigation skips it) plays first while the film buffers underneath; the flight takes off under the fading overlay. The approach flight is the client's 16 s drone shot played at 1.33× (12 s, `assets/film/hero-approach-1080-v2.mp4`, 720 p variant on phones; H.264 32 fps re-encodes of the HEVC master with every source frame kept, poster = first frame; the file names carry `-v2` because media is cached immutably). It autoplays muted, then **parks** on the balcony still (`assets/img/hero-approach-park*.jpg`, the film's last frame). Only then does the copy appear — « Loin du bruit, près de soi. », the lead, **« Entrer »** (opens the filmed walkthrough dialog) and « Réserver votre séjour ». « Passer » skips ahead; a scroll-away, back/forward navigation, reduced motion, data-saver, a missing GSAP or a refused autoplay all park immediately, so the text is never held back. The intro was dropped on 2026-09-19 and restored the same day at the owner's request (« make sure it shows first »); the nav appears when the logo lands in it. The parked hero keeps the slow drift and the copy recedes on scroll.
- `.intro-band` (« Séjour haut de gamme. »): two static columns — copy and CTA on the left, the cabin-on-stilts photograph in a 24 px-radius panel on the right.
- `.void-band`: pure #000, the emblem as line-work, « L'essentiel d'un séjour à Elementa. » and the four facts as flat cards.
- `.chapters-grid` (« Le lieu, les cabines, l'étage. »): three flat cards (photo, sign, kicker, title, copy, link) to the Sainte-Béatrix page.
- Everywhere: headings rise line by line through a mask once; blocks fade up once when they enter the viewport (`once: true`, no pin, no scrub). With the script off or reduced motion, everything is plain document flow and visible.

## Hero photograph

Source: the client's phone photo of the cabin on its stilts (2026-09-13). Pipeline in the session scratchpad: fal.ai `nano-banana-pro/edit` extended the 3:4 frame to 16:9 (forest continued on both sides, cabin untouched) and `topaz/upscale/image` doubled the portrait; a local grade (filmic curve, warm highlights / cool shadows, slight desaturation, bloom, vignette; Pillow + numpy) produced `hero-cabin-v1` (2400/1600/1000 px), `hero-cabin-v1-portrait` (4:5, 1100/700 px) and `cabin-stilts-v1` (3:4, 1400/800 px). An AI-relit variant (golden light) was generated but not used because it re-rendered parts of the building.

## Verified tests (Playwright, Chromium — `scratchpad/pw/site_smoke.js <baseURL>`)

Desktop 1440×900 and phone 390×844: no console errors, no 4xx, no horizontal overflow on any of the 12 pages; intro finishes in about 5.5 s, the film about 12 s later; the film picks the 720 p source on phones; virtual tour opens (autoplays after the click), chapters seek, Escape closes and restores focus, `main` is inert while open; nav CTA lands on the availability section; FR/EN switch rebuilds the split text and swaps titles, options and footer; both forms validate and build the mailto; hamburger menu (11 links, focus moved in); reduced motion (no pins, nav shown, no lock). Not yet tested: Safari/iPhone real device.

## Still to confirm with the client

Detailed directions / Google Maps link, the « Activités » section, the blog articles, the boutique and Elementa Habitations content, the full press release text, and the surface figures and brand names quoted from the content document (27 137,6 m², 860 pi², 62 %, 25 pieds, Stûv 360, Nespresso Vertuo, Aventi, up to 300 guests). The page keeps `noindex` until then.
