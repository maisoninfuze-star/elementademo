#!/bin/bash
# usage: strip.sh <video> <outjpg> [n]
V="$1"; O="$2"; N="${3:-6}"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
T=$(mktemp -d)
python3 - "$V" "$D" "$N" "$T" <<'PY'
import sys,subprocess
v,d,n,t=sys.argv[1],float(sys.argv[2]),int(sys.argv[3]),sys.argv[4]
for i in range(n):
    ts=d*i/(n-1)
    ts=min(ts,d-0.05)
    subprocess.run(["ffmpeg","-v","error","-ss",f"{ts:.3f}","-i",v,"-frames:v","1","-vf","scale=440:-1",f"{t}/f{i:02d}.jpg","-y"],check=True)
PY
ffmpeg -v error -pattern_type glob -i "$T/f*.jpg" -filter_complex "tile=2x$(( (N+1)/2 )):margin=4:padding=4:color=white" -frames:v 1 "$O" -y
rm -rf "$T"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,nb_frames -show_entries format=duration -of default=nw=1 "$V"
