"""Vectorise Logo_Elementa.png (5030x3849 master) into addressable SVG groups.

Output: assets/logo/elementa-logo.svg with, in master pixel coordinates:
  #g-oval       traced ring (fill)            #oval-stroke  centreline path (stroke, for DrawSVG)
  #g-sun        rays + two horizon lines      #sun-strokes  rays as <line> (stroke, for DrawSVG)
  #g-mountain   outer outline, legs, bridge   #g-leaf  pentagon + veins + stem (+ bridge, shared)
  #g-water      three wave rows (#g-wave1..3) #g-wave-extra 4th row for the standalone water sign
  #g-wordmark   ELEMENTA                      #g-tagline  Experiences
  #g-master     the whole logo traced in one piece (used for the final, exact state)
Run from vesplus-demo/: python3 tools/trace_logo.py
"""
import numpy as np, cv2, potrace, os
from PIL import Image

SRC = '../Logo_Elementa.png'
OUT = 'assets/logo/elementa-logo.svg'
a = np.array(Image.open(SRC))
ink = (a[..., 3] > 128) & (a[..., 0] < 128)
H, W = ink.shape
n, labels, stats, cent = cv2.connectedComponentsWithStats(ink.astype(np.uint8), connectivity=8)
comp = lambda i: labels == i
CX = 2496.5   # emblem axis of symmetry

# ---- component roles (ids from the connected-component pass, verified visually) ----
OVAL = 1
MERGED = 7            # mountain + leaf + stem + horizon + wave rows 1-2
WAVE3 = 22
RAYS = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
WORD = [26, 23, 27, 28, 29, 24, 25, 30]          # E L E M E N T A (left to right)
TAG = [31, 41, 33, 34, 35, 32, 42, 36, 37, 38, 39, 40]

def box(x0, y0, x1, y1):
    m = np.zeros_like(ink); m[y0:y1 + 1, x0:x1 + 1] = True; return m

merged = comp(MERGED)
# bridge (flat bar under the leaf), stem, horizon lines
bar = merged & box(2398, 1430, 2597, 1458)
stem = merged & box(2483, 1456, 2510, 1735)
horizon = merged & (box(0, 1315, 2122, 1345) | box(2871, 1315, W - 1, 1345))
# leaf pentagon (apex, corners, base) dilated by 12px
pent = np.zeros_like(ink, dtype=np.uint8)
cv2.fillPoly(pent, [np.array([[2496, 893], [2733, 1280], [2599, 1457], [2396, 1457], [2260, 1280]], np.int32)], 1)
pent = cv2.dilate(pent, np.ones((25, 25), np.uint8)).astype(bool)
leaf_only = merged & pent & ~bar
# wave rows: bands, minus the stem column except where the wave stroke itself crosses it
def wave_band(y0, y1):
    band = merged & box(0, y0, W - 1, y1)
    col = box(2483, y0, 2510, y1)
    side = band[:, 2470:2482].any(axis=1)              # rows where the wave stroke sits just left of the stem
    rows = np.where(side)[0]
    keep = np.zeros_like(ink); keep[rows.min() - 4: rows.max() + 3, 2483:2511] = True
    return band & (~col | keep)
wave1 = wave_band(1500, 1662)
wave2 = wave_band(1662, 1840)
wave3 = comp(WAVE3)
mountain = merged & ~leaf_only & ~stem & ~horizon & ~wave1 & ~wave2
leaf = leaf_only | stem | bar
sun = horizon.copy()
for i in RAYS: sun |= comp(i)
oval = comp(OVAL)
word = np.zeros_like(ink)
for i in WORD: word |= comp(i)
tag = np.zeros_like(ink)
for i in TAG: tag |= comp(i)
# extra (4th) wave row for the standalone water sign: wave 3 shifted down by one row pitch
def centroid_y(m): ys = np.where(m)[0]; return ys.mean()
pitch = centroid_y(wave3) - centroid_y(wave2)
wave_extra = np.zeros_like(ink); sh = int(round(pitch)); wave_extra[sh:, :] = wave3[:-sh, :]

# ---- tracing ----
def trace(mask):
    bm = potrace.Bitmap(~mask)   # pypotrace treats False as ink
    path = bm.trace(turdsize=4, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for curve in path:
        s = curve.start_point
        # skip the bounding frame potrace emits for the inverted canvas
        pts = [s] + [seg.end_point for seg in curve.segments]
        xs = [p.x for p in pts]; ys = [p.y for p in pts]
        if min(xs) <= 0.5 and max(xs) >= W - 0.5 and min(ys) <= 0.5 and max(ys) >= H - 0.5: continue
        d.append(f'M{s.x:.1f} {s.y:.1f}')
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f'L{seg.c.x:.1f} {seg.c.y:.1f}L{seg.end_point.x:.1f} {seg.end_point.y:.1f}')
            else:
                d.append(f'C{seg.c1.x:.1f} {seg.c1.y:.1f} {seg.c2.x:.1f} {seg.c2.y:.1f} {seg.end_point.x:.1f} {seg.end_point.y:.1f}')
        d.append('Z')
    return ''.join(d)

# rays as stroked lines (principal axis end points)
def line_of(mask):
    ys, xs = np.where(mask); pts = np.stack([xs, ys], 1).astype(float); c = pts.mean(0)
    u = np.linalg.svd(pts - c, full_matrices=False)[2][0]
    t = (pts - c) @ u; half = 9.5  # stroke radius, so the round caps end where the ink ends
    p0 = c + u * (t.min() + half); p1 = c + u * (t.max() - half)
    return p0, p1
ray_lines = [line_of(comp(i)) for i in RAYS] + [line_of(horizon & box(0, 0, int(CX), H)), line_of(horizon & box(int(CX), 0, W - 1, H))]
STROKE = 19

# oval centreline
cs, hier = cv2.findContours(oval.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
cs = sorted(cs, key=cv2.contourArea, reverse=True)
outer, inner = cs[0][:, 0, :].astype(float), cs[1][:, 0, :].astype(float)
step = max(1, len(outer) // 420)
mid = []
for p in outer[::step]:
    q = inner[np.argmin(((inner - p) ** 2).sum(1))]; mid.append((p + q) / 2)
ring_w = float(np.median([np.min(np.sqrt(((inner - p) ** 2).sum(1))) for p in outer[::step * 4]]))
oval_d = 'M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in mid) + 'Z'

groups = {
    'g-oval': trace(oval), 'g-sun': trace(sun), 'g-mountain': trace(mountain), 'g-leaf': trace(leaf),
    'g-wave1': trace(wave1), 'g-wave2': trace(wave2), 'g-wave3': trace(wave3), 'g-wave-extra': trace(wave_extra),
    'g-wordmark': trace(word), 'g-tagline': trace(tag), 'g-master': trace(ink), 'g-emblem': trace(ink & box(1600, 150, 3400, 2250)),
}
def bbox(m): ys, xs = np.where(m); return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())
emb = bbox(oval); wm = bbox(word); tg = bbox(tag)
os.makedirs('assets/logo', exist_ok=True)
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" data-emblem="{emb}" data-wordmark="{wm}" data-tagline="{tg}">']
svg.append('<defs>')
for k, d in groups.items():
    svg.append(f'<path id="p-{k[2:]}" fill-rule="nonzero" d="{d}"/>')
svg.append(f'<path id="p-oval-stroke" fill="none" stroke-width="{ring_w:.1f}" d="{oval_d}"/>')
svg.append('<g id="p-sun-strokes" fill="none" stroke-width="%d" stroke-linecap="round">' % STROKE + ''.join(f'<line x1="{p0[0]:.1f}" y1="{p0[1]:.1f}" x2="{p1[0]:.1f}" y2="{p1[1]:.1f}"/>' for p0, p1 in ray_lines) + '</g>')
svg.append('</defs>')
svg.append('</svg>')
open(OUT, 'w').write('\n'.join(svg))
print('wrote', OUT, os.path.getsize(OUT) // 1024, 'KB; ring stroke', round(ring_w, 1), 'row pitch', round(pitch, 1))
print('bboxes emblem', emb, 'wordmark', wm, 'tagline', tg)
for k, d in groups.items(): print(f'  {k}: {len(d)} chars')
# debug composite: each group in its own colour
dbg = np.full((H, W, 3), 255, np.uint8)
for m, col in [(oval, (0, 0, 0)), (sun, (220, 120, 0)), (mountain, (200, 0, 0)), (leaf_only, (0, 140, 0)), (bar, (0, 200, 200)), (stem, (0, 90, 0)), (wave1, (0, 0, 220)), (wave2, (60, 60, 255)), (wave3, (120, 120, 255)), (word, (80, 80, 80)), (tag, (150, 150, 150))]:
    dbg[m] = col
Image.fromarray(dbg[150:2250, 1600:3400]).resize((900, 1050)).save('/tmp/logo-groups.png')
print('debug /tmp/logo-groups.png')
