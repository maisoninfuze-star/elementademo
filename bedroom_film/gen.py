import fal_client, json, sys, urllib.request, os
EP="fal-ai/bytedance/seedance/v1.5/pro/image-to-video"
B=os.path.dirname(os.path.abspath(__file__))
def run(name, prompt, image_url, end_image_url=None, duration="7", seed=None):
    args=dict(prompt=prompt, image_url=image_url, aspect_ratio="16:9",
              resolution="1080p", duration=duration, generate_audio=False,
              camera_fixed=False)
    if end_image_url: args["end_image_url"]=end_image_url
    if seed is not None: args["seed"]=seed
    print(f"[{name}] submitting...",flush=True)
    r=fal_client.subscribe(EP, arguments=args, with_logs=False)
    url=r["video"]["url"]; print(f"[{name}] {url}",flush=True)
    dst=f"{B}/work/{name}.mp4"; urllib.request.urlretrieve(url,dst)
    json.dump({"args":args,"result":r},open(f"{B}/work/{name}.json","w"),indent=1)
    print(f"[{name}] saved {dst} {os.path.getsize(dst)} bytes",flush=True)
    return dst
if __name__=="__main__":
    run(**json.load(open(sys.argv[1])))
