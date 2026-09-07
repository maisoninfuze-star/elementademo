#!/usr/bin/env python3
"""Assemble frames/{d,m}/<chapter>[ _bridge ] for the five-chapter site from generated/seq and generated/v4 bridges,
and patch index.html data-frames / data-bridge. Usage: assemble_v4.py [--no-b4]"""
import glob, os, re, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEN = os.path.join(os.path.dirname(ROOT), "generated"); SEQ = f"{GEN}/seq"; OUT = f"{ROOT}/frames"; EQ = f"{ROOT}/tools/seq_extract.py"
nob4 = "--no-b4" in sys.argv; nobr = "--no-bridges" in sys.argv
chapters = [
    ("approach", ["approach2"], "B1_orbit"),
    ("exterior", ["exterior2"], "B2_enter"),
    ("room",     ["room2"], "B3_porthole"),
    ("ladder",   ["ladder", "E_rooftop", "rooftop2"], None if nob4 else "B4_falls"),
    ("creek",    ["falls"], None),
]
if nobr: chapters = [(n, s, None) for n, s, _ in chapters]
for b in {c[2] for c in chapters if c[2]}:
    if not glob.glob(f"{SEQ}/{b}/d/*.webp"):
        subprocess.run([sys.executable, EQ, f"{GEN}/v4/{b}.mp4", f"{SEQ}/{b}", "40", "--grade", "none"], check=True)
def build(dst, srcs, sub):
    os.makedirs(dst, exist_ok=True)
    for f in glob.glob(f"{dst}/*.webp"): os.remove(f)
    i = 0
    for s in srcs:
        files = sorted(glob.glob(f"{SEQ}/{s}/{sub}/*.webp")); assert files, f"missing {s}/{sub}"
        for f in files: i += 1; shutil.copy(f, f"{dst}/f_{i:03d}.webp")
    return i
counts = {}
for sub in ("d", "m"): shutil.rmtree(f"{OUT}/{sub}", ignore_errors=True)
for name, srcs, bridge in chapters:
    for sub in ("d", "m"):
        counts[name] = build(f"{OUT}/{sub}/{name}", srcs, sub)
        if bridge: counts[name + "_bridge"] = build(f"{OUT}/{sub}/{name}_bridge", [bridge], sub)
html = open(f"{ROOT}/index.html").read()
for name, _, bridge in chapters:
    m = re.search(r'(data-seq="%s" data-frames=")\d+(")( data-bridge="[^"]*" data-bridge-frames="\d+")?' % name, html); assert m, name
    b = f' data-bridge="{name}_bridge" data-bridge-frames="{counts[name + "_bridge"]}"' if bridge else ""
    html = html[:m.start()] + f'{m.group(1)}{counts[name]}{m.group(2)}{b}' + html[m.end():]
open(f"{ROOT}/index.html", "w").write(html)
size = lambda sub: sum(os.path.getsize(f) for f in glob.glob(f"{OUT}/{sub}/**/*.webp", recursive=True)) / 1e6
print(counts); print(f"desktop {size('d'):.1f} MB, mobile {size('m'):.1f} MB")
