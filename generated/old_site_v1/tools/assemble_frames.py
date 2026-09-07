#!/usr/bin/env python3
"""Assemble site/frames from motion-equalised chapter sets (generated/frames_v2) and fal.ai bridge clips (generated/v2).
Usage: assemble_frames.py --hero real|seedance|kling --b1 seedance|none --b2 seedance|kling|none --b3 ... --b4 ... --ladderfix seedance|none
"""
import argparse, glob, os, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(os.path.dirname(ROOT), "generated", "v2")
V2 = os.path.join(os.path.dirname(ROOT), "generated", "frames_v2"); OUT = os.path.join(ROOT, "frames"); EQ = os.path.join(ROOT, "tools", "extract_frames_eq.py")
ap = argparse.ArgumentParser()
for k in ["hero", "b1", "b2", "b3", "b4", "ladderfix"]: ap.add_argument("--" + k, default="none")
a = ap.parse_args()
def eq(video, out, n, w=1440, q=72, t0=0, t1="-"):
    subprocess.run([sys.executable, EQ, video, out, str(n), str(t0), str(t1), str(w), str(q)], check=True)
def copy_seq(src_dirs, out):
    os.makedirs(out, exist_ok=True)
    for f in glob.glob(f"{out}/*.webp"): os.remove(f)
    i = 0
    for d in src_dirs:
        for f in sorted(glob.glob(f"{d}/*.webp")):
            i += 1; shutil.copy(f, f"{out}/f_{i:03d}.webp")
    return i
counts = {}
# hero
if a.hero == "real": counts["approach"] = copy_seq([f"{V2}/approach_real"], f"{OUT}/approach")
else:
    eq(f"{GEN}/hero_{a.hero}.mp4", f"{V2}/approach_{a.hero}", 96, 1200, 62); counts["approach"] = copy_seq([f"{V2}/approach_{a.hero}"], f"{OUT}/approach")
# bridges
for key, seq in [("b1", "approach"), ("b2", "exterior"), ("b3", "room"), ("b4", "ladder")]:
    choice = getattr(a, key); out = f"{OUT}/{seq}_bridge"
    if choice == "none":
        shutil.rmtree(out, ignore_errors=True); continue
    eq(f"{GEN}/{key}_{choice}.mp4", f"{V2}/{key}_{choice}", 48, 1440, 70); counts[f"{seq}_bridge"] = copy_seq([f"{V2}/{key}_{choice}"], out)
# chapters
counts["exterior"] = copy_seq([f"{V2}/exterior"], f"{OUT}/exterior")
counts["room"] = copy_seq([f"{V2}/room"], f"{OUT}/room")
counts["creek"] = copy_seq([f"{V2}/creek"], f"{OUT}/creek")
if a.ladderfix == "none": counts["ladder"] = copy_seq([f"{V2}/ladderA", f"{V2}/ladderB"], f"{OUT}/ladder")
elif a.ladderfix == "dissolve":
    # short dissolve across the jump cut in the source clip: 8 blended frames between A's last and B's first
    from PIL import Image
    A = sorted(glob.glob(f"{V2}/ladderA/*.webp"))[-1]; B = sorted(glob.glob(f"{V2}/ladderB/*.webp"))[0]
    ia, ib = Image.open(A).convert("RGB"), Image.open(B).convert("RGB").resize(Image.open(A).size)
    dd = f"{V2}/ladder_dissolve"; os.makedirs(dd, exist_ok=True)
    for f in glob.glob(f"{dd}/*.webp"): os.remove(f)
    for i in range(1, 9): Image.blend(ia, ib, i / 9).save(f"{dd}/f_{i:03d}.webp", "WEBP", quality=72, method=5)
    counts["ladder"] = copy_seq([f"{V2}/ladderA", dd, f"{V2}/ladderB"], f"{OUT}/ladder")
else:
    eq(f"{GEN}/ladderfix_{a.ladderfix}.mp4", f"{V2}/ladderfix_{a.ladderfix}", 36, 1440, 72)
    counts["ladder"] = copy_seq([f"{V2}/ladderA", f"{V2}/ladderfix_{a.ladderfix}", f"{V2}/ladderB"], f"{OUT}/ladder")
# patch index.html data-frames / data-bridge
html = open(f"{ROOT}/index.html").read()
import re
def patch(seq):
    global html
    m = re.search(r'(data-seq="%s" data-frames=")\d+(")( data-bridge="[^"]*" data-bridge-frames="\d+")?' % seq, html)
    assert m, seq
    bridge = f' data-bridge="{seq}_bridge" data-bridge-frames="{counts[seq + "_bridge"]}"' if f"{seq}_bridge" in counts else ""
    html = html[:m.start()] + f'{m.group(1)}{counts[seq]}{m.group(2)}{bridge}' + html[m.end():]
for seq in ["approach", "exterior", "room", "ladder", "creek"]: patch(seq)
open(f"{ROOT}/index.html", "w").write(html)
for k, v in counts.items(): print(f"{k}: {v} frames")
print("total", round(sum(os.path.getsize(f) for f in glob.glob(f"{OUT}/**/*.webp", recursive=True)) / 1e6, 1), "MB")
