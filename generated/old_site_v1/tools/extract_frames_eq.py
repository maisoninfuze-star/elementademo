#!/usr/bin/env python3
"""Motion-equalised frame extraction: samples N frames so that each step carries the same amount of visual change.
Removes hover/stall passages and speed-ups when the sequence is scrubbed by scroll.
Usage: extract_frames_eq.py <video> <out_dir> <n_frames> [t_start] [t_end] [width=1440] [quality=74]
"""
import sys, os, glob, subprocess, tempfile, shutil
import numpy as np
from PIL import Image
video, out, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
t0 = float(sys.argv[4]) if len(sys.argv) > 4 else 0.0
t1 = float(sys.argv[5]) if len(sys.argv) > 5 and sys.argv[5] != "-" else None
width = int(sys.argv[6]) if len(sys.argv) > 6 else 1440
q = int(sys.argv[7]) if len(sys.argv) > 7 else 74
tmp = tempfile.mkdtemp()
seg = ["-ss", str(t0)] + (["-to", str(t1)] if t1 else [])
# 1) dense source frames (24 fps) at full working width
subprocess.run(["ffmpeg", "-v", "error", "-y", *seg, "-i", video, "-vf", f"fps=24,scale={width}:-2", "-q:v", "2", f"{tmp}/%04d.jpg"], check=True)
files = sorted(glob.glob(f"{tmp}/*.jpg"))
small = [np.asarray(Image.open(f).convert("L").resize((160, 90)), dtype=np.float32) for f in files]
d = np.array([np.abs(small[i + 1] - small[i]).mean() for i in range(len(small) - 1)])
d = np.maximum(d, 0.15)               # never zero: still passages still advance a little
d = np.minimum(d, np.median(d) * 2.5) # a jump cut is one step, not a hold
cum = np.concatenate([[0], np.cumsum(d)])
targets = np.linspace(0, cum[-1], n)
picks = [int(np.searchsorted(cum, t)) for t in targets]
picks = [min(p, len(files) - 1) for p in picks]
os.makedirs(out, exist_ok=True)
for f in glob.glob(f"{out}/*.webp"): os.remove(f)
for i, p in enumerate(picks, 1):
    Image.open(files[p]).convert("RGB").save(f"{out}/f_{i:03d}.webp", "WEBP", quality=q, method=5)
shutil.rmtree(tmp)
size = sum(os.path.getsize(f) for f in glob.glob(f"{out}/*.webp")) / 1e6
print(f"{os.path.basename(out)}: {n} frames from {len(files)} source frames, picks {picks[:6]}... -> {size:.1f} MB")
