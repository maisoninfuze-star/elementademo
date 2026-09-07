import fal_client, json, sys
out={}
for k,p in [("ref1","work/ref1_balcony.jpg"),("ref2","work/ref2_stove_tvup.jpg"),("ref3","work/ref3_tvdown.jpg")]:
    out[k]=fal_client.upload_file(p); print(k,out[k],flush=True)
json.dump(out,open("work/refs.json","w"),indent=1)
