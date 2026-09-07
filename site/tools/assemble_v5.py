#!/usr/bin/env python3
"""All-fal.ai chapters: extract frames from generated/v5 clips (Kling), copy to frames/{d,m}, patch index.html.
Usage: assemble_v5.py [--bridges] [--dq 76] [--mq 66]"""
import glob, os, re, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(os.path.dirname(ROOT), "generated"); V5 = f"{GEN}/v5"; SEQ = f"{GEN}/seq5"; OUT = f"{ROOT}/frames"; EQ = f"{ROOT}/tools/seq_extract.py"
bridges = "--bridges" in sys.argv
dq = sys.argv[sys.argv.index("--dq") + 1] if "--dq" in sys.argv else "76"
mq = sys.argv[sys.argv.index("--mq") + 1] if "--mq" in sys.argv else "66"
chapters = [  # (chapter id, clip, frames, bridge clip)
    ("approach", "hero0905", 96, "br_hero_falls"),   # Inder's edited hero film (0905.mov), bridge out to the falls
    ("creek",    "ch5_falls", 84, None),
]
XW = sys.argv[sys.argv.index("--xw") + 1] if "--xw" in sys.argv else "1920"
def source(clip):
    """Prefer a Topaz-upscaled 4K master in generated/v6 when one exists."""
    up = f"{os.path.dirname(V5)}/v6/{clip}_4k.mp4"
    return up if os.path.exists(up) else f"{V5}/{clip}.mp4"
def extract(clip, n):
    if not glob.glob(f"{SEQ}/{clip}/d/*.webp"):
        subprocess.run([sys.executable, EQ, source(clip), f"{SEQ}/{clip}", str(n), "--grade", "none", "--dq", dq, "--mq", mq, "--xw", XW, "--xq", "66"], check=True)
def copy(clip, dst):
    os.makedirs(dst, exist_ok=True)
    for f in glob.glob(f"{dst}/*.webp"): os.remove(f)
    files = sorted(glob.glob(f"{SEQ}/{clip}/{os.path.basename(os.path.dirname(dst))}/*.webp"))
    for i, f in enumerate(files, 1): shutil.copy(f, f"{dst}/f_{i:03d}.webp")
    return len(files)
counts = {}
for sub in ("x", "d", "m"): shutil.rmtree(f"{OUT}/{sub}", ignore_errors=True)
for cid, clip, n, br in chapters:
    extract(clip, n)
    use_br = bridges and br and os.path.exists(f"{V5}/{br}.mp4")
    if use_br: extract(br, 48)
    for sub in ("x", "d", "m"):
        counts[cid] = copy(clip, f"{OUT}/{sub}/{cid}")
        if use_br: counts[cid + "_bridge"] = copy(br, f"{OUT}/{sub}/{cid}_bridge")
html = open(f"{ROOT}/index.html").read()
for cid, _, _, br in chapters:
    m = re.search(r'(data-seq="%s" data-frames=")\d+(")( data-bridge="[^"]*" data-bridge-frames="\d+")?' % cid, html); assert m, cid
    b = f' data-bridge="{cid}_bridge" data-bridge-frames="{counts[cid + "_bridge"]}"' if cid + "_bridge" in counts else ""
    html = html[:m.start()] + f'{m.group(1)}{counts[cid]}{m.group(2)}{b}' + html[m.end():]
import time
ver = time.strftime("%Y%m%d%H%M")
html = re.sub(r'<body( data-frames="[^"]*")?>', f'<body data-frames="{ver}">', html, count=1)
html = re.sub(r'<script src="js/app\.js(\?v=\d+)?"></script>', f'<script src="js/app.js?v={ver}"></script>', html)
open(f"{ROOT}/index.html", "w").write(html)
size = lambda sub: sum(os.path.getsize(f) for f in glob.glob(f"{OUT}/{sub}/**/*.webp", recursive=True)) / 1e6
print(counts); print(f"retina {size('x'):.1f} MB, desktop {size('d'):.1f} MB, mobile {size('m'):.1f} MB")
