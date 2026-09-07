# Elementa · Rawdon — site

Static scroll site (no build step). Serve the folder: `python3 -m http.server 8642 --directory site`.

## Experience
Two pinned chapters scrubbed by scroll:

1. **Hero** – Inder's own edited film (`../0905.mov`, 16 s: aerial descent, golden-hour exterior, deck, bedroom, stove), trimmed just before its fade to black. The Elementa wordmark recedes as the film plays.
2. **Le terrain** – a Kling v3 glide over the Dorwin falls, with the closing text. A Kling bridge carries the camera from the stove shot out through the glass and over the forest to the falls (`../generated/v5/br_hero_falls.mp4`).

Then the supporting content: the four elements (fal.ai seasonal visuals on hover), photos (graded WOLFILMZ previews), where and amenities, booking (real rooftop at nightfall, fal.ai), footer. FR/EN toggle. Nav pills: Le refuge, Les éléments, Photos, Où.

The three clips were upscaled 2x to 4K with Topaz Proteus on fal.ai (`fal-ai/topaz/upscale/video`, masters in `../generated/v6/*_4k.mp4`); `assemble_v5.py` prefers those masters automatically and `--xw 2560` sets the Retina tier width.

Earlier chapter clips (orbit, room, roof, all Kling from WOLFILMZ stills) are still in `../generated/v5` if they are wanted back; `tools/assemble_v5.py` lists the chapters.

## Structure
- `index.html`, `css/style.css`, `js/app.js` – markup, styles, the whole engine (Lenis + GSAP ScrollTrigger, canvas frame player with blending, chapter text reveals, bridges, nav, gallery). Copy lives in `js/app.js` (`I18N`).
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
