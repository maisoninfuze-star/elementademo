# Elementa · Rawdon — site

Cinematic scroll site for Elementa, a one-room cantilevered cabin in Rawdon, Québec. Static, no build step: serve the folder with any static server (`python3 -m http.server 8642 --directory site`) or deploy it as-is.

## Experience
One full-screen stage stays pinned for 5.5 viewport heights (5 on phones). Scrolling scrubs a continuous camera journey of 504 frames, in four chapters:

1. **Introduction** – the terrace at eye level (WOLFILMZ drone clip 0313)
2. **Discovery** – the camera rises over the roof (fal.ai bridge) and pulls out across the forest (clip 0325)
3. **Detail** – drops into the canopy (bridge), flies in through the window, past the porthole (clip 0335 reversed), into the slate shower (bridge + clip 0067), back to the porthole and ladder (bridge + clip 0088)
4. **Invitation** – up onto the rooftop (bridge) as night falls (fal.ai Kling, from a Seedream night edit of the real rooftop frame), with the booking CTA

Real clips come from the WOLFILMZ delivery (web previews, graded here with ffmpeg). Bridges are Kling v3 pro image-to-video runs that start on one clip's last frame and end on the next clip's first frame, so the camera never cuts.

## Structure
- `index.html` – markup; supporting sections (elements, photos, where, booking, footer) in FR with `data-i18n` keys
- `css/style.css` – tokens, layout, mobile rules, reduced-motion rules
- `js/config.js` – business details, palette, chapter windows, all copy (FR/EN). Edit copy here.
- `js/sequence.js` – generated: segments, frame count, progress→frame keyframes
- `js/loader.js` – `FrameStore`: staged preloading (opening frames first, then the rest), nearest-loaded-frame lookup
- `js/stage.js` – `Stage`: canvas cover-fit renderer, blends neighbouring frames, poster stays underneath until the first frame decodes
- `js/story.js` – `Story`: builds the four text blocks from config, GSAP entrance/exit choreography, active chapter
- `js/scroll.js` – Lenis (wheel only, touch stays native) + ScrollTrigger pinned progress
- `js/ui.js` – language switch, pill nav, supporting sections (tiles, gallery, reveals)
- `js/main.js` – boot; reduced-motion fallback renders four static poster sections instead of the stage
- `frames/d/<segment>/f_###.webp` (1280 px, desktop) and `frames/m/…` (720 px, phones)
- `assets/poster-*.jpg` – chapter posters (opening paint, reduced motion, fallback if frames fail); `assets/photos/` – graded WOLFILMZ previews for the gallery; `assets/gen/` – fal.ai seasonal visuals for the element tiles

## Rebuilding the sequence
Sources live outside the deployable folder in `../generated/`:
- `seq/<name>/{d,m}` – frame sets, made with `tools/seq_extract.py <clip> <out> <n> [--start --end --grade int|drone --reverse]` (motion-equalised sampling: every frame carries the same amount of visual change, so hovers and speed-ups disappear)
- `v3/*.mp4` – fal.ai bridge clips (`tools/fal_*.py` show the API calls; needs `FAL_KEY` and `pip install fal-client`)

Then `python3 tools/build_sequence.py` copies the segments into `frames/`, writes `js/sequence.js` and the posters. Chapter text windows are in `config.js` (`CHAPTERS`), the camera holds are the keyframes in `build_sequence.py`; keep them aligned.

## Accessibility and performance
Skip link past the sequence, keyboard-focusable pill nav and buttons with visible focus, `prefers-reduced-motion` → static chapters and normal scrolling, native touch scrolling, poster first paint, frames stream in behind (about 24 MB desktop, 11 MB phone), page still works if frames fail (posters).

## Open items
Real booking link (CTA is `mailto:` in `config.js`), Instagram handle, FR proofreading, final photo selection from the WOLFILMZ edits (the gallery uses graded RAW previews), Mapbox token if a nicer map is wanted.
