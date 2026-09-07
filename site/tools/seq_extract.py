#!/usr/bin/env python3
"""Extract a scroll-scrub frame set from a clip: motion-equalised sampling, optional grade, optional reverse,
desktop + mobile sizes. Writes <out>/d/f_###.webp (desktop) and <out>/m/f_###.webp (mobile).
Usage: seq_extract.py <video> <out_dir> <n_frames> [--start S] [--end S] [--grade int|drone|none] [--reverse]
       [--dw 1280] [--mw 720] [--dq 62] [--mq 58]
"""
import argparse, glob, os, shutil, subprocess, sys, tempfile
import numpy as np
from PIL import Image
GRADES = {
  "int": "eq=contrast=1.42:saturation=1.28:brightness=-0.03:gamma=0.96,colorbalance=rs=0.04:gs=0.0:bs=-0.05:rm=0.03:gm=0.01:bm=-0.03:rh=0.05:gh=0.03:bh=-0.02,unsharp=3:3:0.4",
  "drone": "eq=contrast=1.12:saturation=1.1:brightness=-0.02,colorbalance=rs=0.02:bs=-0.03:rh=0.03:bh=-0.02",
  "none": None,
}
ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("out"); ap.add_argument("n", type=int)
ap.add_argument("--start", type=float, default=0); ap.add_argument("--end", type=float, default=None)
ap.add_argument("--grade", default="none"); ap.add_argument("--reverse", action="store_true")
ap.add_argument("--dw", type=int, default=1280); ap.add_argument("--mw", type=int, default=720)
ap.add_argument("--dq", type=int, default=62); ap.add_argument("--mq", type=int, default=58)
ap.add_argument("--xw", type=int, default=0); ap.add_argument("--xq", type=int, default=68)
a = ap.parse_args()
tmp = tempfile.mkdtemp()
vf = f"fps=24,scale={max(a.dw, a.xw)}:-2" + (f",{GRADES[a.grade]}" if GRADES.get(a.grade) else "")
seg = ["-ss", str(a.start)] + (["-to", str(a.end)] if a.end else [])
subprocess.run(["ffmpeg", "-v", "error", "-y", *seg, "-i", a.video, "-vf", vf, "-q:v", "2", f"{tmp}/%04d.jpg"], check=True)
files = sorted(glob.glob(f"{tmp}/*.jpg"))
small = [np.asarray(Image.open(f).convert("L").resize((160, 90)), dtype=np.float32) for f in files]
d = np.array([np.abs(small[i + 1] - small[i]).mean() for i in range(len(small) - 1)])
d = np.maximum(d, 0.15); d = np.minimum(d, np.median(d) * 2.5)
cum = np.concatenate([[0], np.cumsum(d)])
picks = [min(int(np.searchsorted(cum, t)), len(files) - 1) for t in np.linspace(0, cum[-1], a.n)]
if a.reverse: picks = picks[::-1]
for sub, w, q in ((("x", a.xw, a.xq),) if a.xw else ()) + (("d", a.dw, a.dq), ("m", a.mw, a.mq)):
    od = f"{a.out}/{sub}"; os.makedirs(od, exist_ok=True)
    for f in glob.glob(f"{od}/*.webp"): os.remove(f)
    for i, p in enumerate(picks, 1):
        im = Image.open(files[p]).convert("RGB")
        if im.width != w: im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(f"{od}/f_{i:03d}.webp", "WEBP", quality=q, method=5)
    size = sum(os.path.getsize(f) for f in glob.glob(f"{od}/*.webp")) / 1e6
    print(f"{os.path.basename(a.out)}/{sub}: {a.n} frames {w}px -> {size:.1f} MB")
shutil.rmtree(tmp)
