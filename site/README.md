# Elementa · Rawdon — site

Static scroll site (no build step). Serve the folder: `python3 -m http.server 8642 --directory site`.

## Experience
Built to the 7 September 2026 audit and creative brief. Page order:

1. **Arrive** – Inder's hero film (`../0905.mov`) scrubbed by scroll under the Elementa wordmark; descriptor and both actions (enquire, explore) visible immediately over a sharp poster, no loader.
2. **Around the cabin** – Kling glide over the Dorwin falls, joined to the film by a Seedance pull-back bridge; copy names the falls as a nearby attraction.
3. **Enter** – the round window (WLF03425) opens as a circular mask onto the bedroom (WLF03302) as you scroll; static image and text under reduced motion.
4. **Live** – three compact chapters (wake by the glass, open to the terrace, rise to the rooftop) with a sticky image column on desktop and stacked images on phones.
5. **Elements** – Air / Fire / Water / Earth as real views of the property (terrace, stove, shower, facade); each card links to its own scene.
6. **Photos** – one canonical collection of 12 graded WOLFILMZ previews in a native horizontal scroller with previous/next, live count, captions, srcset, lightbox (keyboard, swipe, focus restore).
7. **Plan** – ivory section: amenities, verified practical notes, static location card with directions link and on-demand OpenStreetMap.
8. **Reserve** – honest enquiry form (dates, guests, name, message) that opens a prefilled email and shows an acknowledgement; email as the secondary route. Labelled "Parler de votre séjour" / "Enquire about a stay" until a booking provider exists.

Mobile: hamburger menu sheet (links, language, enquiry action), 44 px targets, native scrolling. Language switch updates copy, alt text, aria labels, placeholders, title and meta description (`?lang=fr|en` also works). Metadata: canonical, hreflang, Open Graph image, favicons, LodgingBusiness JSON-LD with verified facts only.

QA: `../generated/qa/qa.js` (Playwright) screenshots desktop 1440, phone 390 and 360 and checks hero actions, chapter toggles, gallery count vs visible photo, lightbox, menu, touch targets and horizontal overflow.

## Structure
- `index.html`, `css/style.css`, `js/app.js` – markup, styles, the whole engine (Lenis + GSAP ScrollTrigger, canvas frame player, window mask, live chapters, gallery + lightbox, menu, map, enquiry form). All FR/EN copy lives in `js/app.js` (`I18N`).
- `frames/x/` (1920 px, wide Retina screens), `frames/d/` (1280 px) and `frames/m/` (720 px, phones), one folder per chapter plus `<chapter>_bridge/` folders. `app.js` picks the set from viewport width and pixel ratio. `data-seq`, `data-frames`, `data-bridge`, `data-bridge-frames` on each `.chapter` in `index.html`.
- `assets/photos/` – gallery, `assets/gen/` – element tiles and the night rooftop, `assets/el-*.jpg` – brand element images.
- `tools/seq_extract.py` – clip → frame set (motion-equalised sampling, optional grade, reverse, desktop + mobile sizes)
- `tools/assemble_v5.py --bridges` – extracts `../generated/v5/*.mp4` (Kling shots and bridges) into `../generated/seq5`, copies them into `frames/` and patches `index.html`. Earlier assemblers (`assemble_v4.py`, real-footage chapters) are kept for reference.
- `tools/fal_*.py` – examples of the fal.ai calls used (needs `FAL_KEY`, `pip install fal-client`).

Chapter timing (in `app.js`): main frames over the first 62 % of a chapter, hold on the last frame while the text is read, bridge over the last 20 %.

## Sources (outside the deployable folder)
`../generated/v5` the Kling shots used now (`keys/` holds their first and last frames), `../generated/seq5` their frame sets, `../generated/seq` real-footage sets, `../generated/v3` and `v4` earlier bridges, `../generated/frames_v2` earlier phone-footage sets, `../generated/site_v3` the four-chapter pinned-stage variant, `../generated/old_site_v1` the first build. The WOLFILMZ album expires 2026-10-03: fetch the edited JPEGs from Wolf before then for the final gallery.

## Open items
Real booking link (`mailto:` for now), Instagram handle, FR proofreading, final photo selection, Mapbox token if wanted.
