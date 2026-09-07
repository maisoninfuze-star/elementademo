#!/usr/bin/env bash
# Usage: tools/extract_frames.sh <video> <sequence-name> [fps=12] [width=1440] [quality=74]
# Writes site/frames/<name>/f_001.webp ... (needs ffmpeg + Pillow). Update data-frames in index.html afterwards.
set -euo pipefail
src="$1"; name="$2"; fps="${3:-12}"; w="${4:-1440}"; q="${5:-74}"
out="$(cd "$(dirname "$0")/.." && pwd)/frames/$name"; mkdir -p "$out"; rm -f "$out"/*
ffmpeg -v error -i "$src" -vf "fps=$fps,scale=$w:-2" -q:v 3 "$out/f_%03d.jpg"
python3 - "$out" "$q" <<'PY'
import sys, glob, os
from PIL import Image
out, q = sys.argv[1], int(sys.argv[2])
for f in sorted(glob.glob(f"{out}/*.jpg")):
    Image.open(f).convert("RGB").save(f[:-4] + ".webp", "WEBP", quality=q, method=5); os.remove(f)
print(len(glob.glob(f"{out}/*.webp")), "frames")
PY
