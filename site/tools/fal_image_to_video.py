import fal_client, json, urllib.request, time
A="/Users/inder/Claude/Projects/Rawdon/site/assets"; OUT=f"{A}/gen"
log=open(f"{OUT}/gen2.log","a")
def L(*a): print(*a,file=log,flush=True); print(*a,flush=True)
STYLE=" Photorealistic, cinematic, stable architecture, no people, no text, no flicker."
shots={
 "fire_dolly": ("fire_dusk_1.jpg", "Very slow smooth cinematic dolly-in toward the glowing black cabin at blue hour, camera rising slightly, wood smoke drifting from the chimney, warm light flickering gently inside the glass, trees still."+STYLE),
 "earth_descent": ("earth_winter_2.jpg", "Slow aerial drone descent toward the snow-covered black cabin, gentle forward drift, light snow falling, soft winter overcast light, branches perfectly still."+STYLE),
 "air_mist": ("air_dawn_2.jpg", "Static tripod shot, only the fog drifting slowly through the trees and the sunrise rays shimmering, dew glinting on the glass railing, no camera movement."+STYLE),
 "water_rain": ("water_rain_2.jpg", "Static shot, rain streaming down the long slot window, droplets running on the glass, the pines outside swaying very slightly in the mist, steam from the rain shower head."+STYLE),
}
res={}
def run(name, f, prompt):
    url=fal_client.upload_file(f"{OUT}/{f}"); L("up",name,url)
    for attempt in range(2):
        try:
            r=fal_client.subscribe("fal-ai/bytedance/seedance/v1.5/pro/image-to-video", arguments={"prompt":prompt,"image_url":url,"resolution":"1080p","duration":"5","aspect_ratio":"16:9","generate_audio":False,"camera_fixed":False,"enable_safety_checker":False})
            v=r["video"]["url"]; p=f"{OUT}/{name}.mp4"; urllib.request.urlretrieve(v,p); L("saved",p); res[name]=v; return
        except Exception as e:
            L("ERR",name,attempt,repr(e)[:400]); time.sleep(8)
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(4) as ex: list(ex.map(lambda kv: run(kv[0],*kv[1]), shots.items()))
json.dump(res,open(f"{OUT}/gen2.json","w"),indent=1); L("DONE gen2")
