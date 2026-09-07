import fal_client, json, os, urllib.request, time, sys
A="/Users/inder/Claude/Projects/Rawdon/site/assets"
OUT=f"{A}/gen"
log=open(f"{OUT}/gen1.log","a")
def L(*a):
    print(*a, file=log, flush=True); print(*a, flush=True)
def up(name):
    url=fal_client.upload_file(f"{A}/{name}"); L("uploaded",name,url); return url
srcs={k:up(v) for k,v in {"drone":"e5769.jpg","below":"e5770.jpg","shower":"e5752.jpg","deck":"e5754.jpg","bedroom":"e5760.jpg","kitchen":"e5767.jpg","view":"p5761.jpg"}.items()}
json.dump(srcs, open(f"{OUT}/uploads.json","w"), indent=1)
STYLE=" Photorealistic, same building, same composition and camera angle, keep the architecture exactly identical (black cantilevered cabin, glass walls, rooftop terrace). Cinematic 35mm photography, subtle film grain, no text, no people."
shots={
 "fire_dusk": ("below", "Transform this photo into blue hour dusk: deep indigo sky through the trees, the cabin's glass walls glowing warm amber from inside, a thin plume of wood smoke from the roof, warm light spilling onto the rocks below."+STYLE),
 "water_rain": ("shower", "Make it a heavy rainy afternoon: rain streaks and droplets on the glass window, the pines outside soft and misty behind the wet glass, the slate walls darker and damp, moody grey-blue daylight."+STYLE),
 "air_dawn": ("deck", "Make it early dawn: thick low fog drifting through the forest, golden sunrise rays breaking through the mist and the tree trunks, dew on the glass railing, soft warm backlight."+STYLE),
 "earth_winter": ("drone", "Make it deep winter: the whole forest and the cabin roof covered in fresh snow, bare and evergreen trees dusted white, overcast pale sky, tracks in the snow, cold muted palette."+STYLE),
 "earth_autumn": ("drone", "Make it peak autumn in Quebec: the forest canopy in vivid red, orange and gold maple foliage around the black cabin, low golden late afternoon sunlight, long shadows."+STYLE),
 "fire_night_interior": ("bedroom", "Make it night: the windows now show a dark forest with a few stars, the room lit only by warm candle-like lamps and the glow of a small wood stove, deep shadows, cozy amber and black."+STYLE),
}
res={}
def run(name, src, prompt):
    for attempt in range(2):
        try:
            r=fal_client.subscribe("fal-ai/bytedance/seedream/v4.5/edit", arguments={"prompt":prompt,"image_urls":[srcs[src]],"image_size":{"width":2048,"height":1152},"num_images":2,"enable_safety_checker":False})
            urls=[im["url"] for im in r["images"]]
            for i,u in enumerate(urls):
                p=f"{OUT}/{name}_{i+1}.jpg"; urllib.request.urlretrieve(u,p); L("saved",p)
            res[name]=urls; return
        except Exception as e:
            L("ERR",name,attempt,repr(e)[:300]); time.sleep(5)
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(3) as ex:
    list(ex.map(lambda kv: run(kv[0],*kv[1]), shots.items()))
json.dump(res, open(f"{OUT}/gen1.json","w"), indent=1)
L("DONE gen1")
