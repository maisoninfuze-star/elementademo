"""Convert the downloaded originals into web-sized JPGs with stable names. Run from vesplus-demo/."""
import os, sys
from PIL import Image
SRC = 'assets/img'; OUT = 'assets/img'
BG = (17, 17, 17)
def conv(src, dst, max_w=None, q=86):
    im = Image.open(os.path.join(SRC, src))
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGB', im.size, BG); bg.paste(im, mask=im.split()[-1]); im = bg
    else: im = im.convert('RGB')
    if max_w and im.width > max_w: im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, dst), 'JPEG', quality=q, optimize=True, progressive=True)
    print(f"{dst}: {im.width}x{im.height} {os.path.getsize(os.path.join(OUT, dst))//1024}KB")
rail = ['_nuxt__titlePortfolio1.BTva3Lx0.png', '_nuxt__titlePortfolio2.DLOaI66u.png', '_nuxt__titlePortfolio3.BTmvxFLL.png', '_nuxt__titlePortfolio4.mXF_O0aO.png']
before = ['_nuxt__image%2025.CSz-HE3T.png', '_nuxt__image%2030.DhLlaLqY.png', '_nuxt__image%2034.D3AOf9f-.png', '_nuxt__image%2018.CzmY_AJM.png', '_nuxt__image%2033.DBusNuLA.png', '_nuxt__image%2032.CsRmKCeq.png', '_nuxt__image%2029.ClU1aca-.png', '_nuxt__image%2020.CDyHiFM5.png', '_nuxt__image%2028.B_JxohRT.png']
after = ['_nuxt__image%2046.Bvy31Oqm.png', '_nuxt__KakaoTalk_20241110_140614610%202.Dd3aVhSe.png', '_nuxt__KakaoTalk_20241105_170154185_01%201.3luHT51x.png', '_nuxt__KakaoTalk_20241110_142234997%202.DO4PjP9V.png', '_nuxt__KakaoTalk_20250206_180001453%202.z_Gl9D8-.png', '_nuxt__KakaoTalk_20241110_141039705%201.CvM7yfqJ.png', '_nuxt__image%2047.1udJTIj0.png', '_nuxt__KakaoTalk_20241107_170032747_13%201.u5bA_UgD.png', '_nuxt__SH1_5944%201.DmcBWTlV.png']
portfolios = ['cdn.vesplus.co.kr__portfolios__April2025__qEXJETd1dE7mrIi2FIiz.jpg', 'cdn.vesplus.co.kr__portfolios__April2025__b4KxRoJ4zWG4Cew7wknD.jpg', 'cdn.vesplus.co.kr__portfolios__April2025__6N345lVbuYoFtNWoRWVD.jpg']
news = ['cdn.vesplus.co.kr__news__April2025__5epYVQXzzrDNcNjdnHme.jpg', 'cdn.vesplus.co.kr__news__April2025__G2SkhKixXaMlMCl6C6tQ.jpg', 'cdn.vesplus.co.kr__news__July2025__Lie9V8TB8ujRW0XkG6Fl.png', 'cdn.vesplus.co.kr__news__May2026__N4GbdUOZVrya4a1euqbS.png']
for i, f in enumerate(rail, 1): conv(f, f'rail-{i}.jpg', q=88)
for i, f in enumerate(before, 1): conv(f, f'grid-before-{i}.jpg', q=88)
for i, f in enumerate(after, 1): conv(f, f'grid-after-{i}.jpg', q=85)
for i, f in enumerate(portfolios, 1): conv(f, f'portfolio-{i}.jpg', max_w=2560, q=84)
for i, f in enumerate(news, 1): conv(f, f'news-{i}.jpg', max_w=1600, q=85)
# move originals out of the deployable folder
os.makedirs('docs/research/originals', exist_ok=True)
for f in os.listdir(SRC):
    if f.startswith('_nuxt__') or f.startswith('cdn.vesplus'): os.replace(os.path.join(SRC, f), os.path.join('docs/research/originals', f))
