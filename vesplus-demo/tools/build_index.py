"""Assemble index.html from the extracted fragments (docs/research/fragments) with local asset paths. Run once; index.html is then edited directly."""
import re, os
F = 'docs/research/fragments'
rd = lambda n: open(os.path.join(F, n + '.html'), encoding='utf-8').read()
def routes(h):  # demo: internal routes have no pages → keep the path in data-route, neutralise the href
    return re.sub(r'href="(/[^"]*)"', lambda m: f'href="#" data-route="{m.group(1)}"', h)
nav = routes(rd('nav')).replace('<nav>', '<nav style="opacity:0;visibility:hidden">').replace(' aria-current="page"', '').replace(' class="router-link-active router-link-exact-active logo-home"', ' class="logo-home"')
menu = routes(rd('menu'))
grid = rd('image-grid-group')
srcs = re.findall(r'src="([^"]+)"', grid); assert len(srcs) == 18
for k, s in enumerate(srcs):
    grid = grid.replace(f'src="{s}"', f'src="assets/img/grid-{"before" if k % 2 == 0 else "after"}-{k // 2 + 1}.jpg"', 1)
portfolios = routes(rd('portfolios')).replace('<!--[-->', '').replace('<!--]-->', '')
for i, s in enumerate(re.findall(r'src="([^"]+)"', portfolios), 1): portfolios = portfolios.replace(f'src="{s}"', f'src="assets/img/portfolio-{i}.jpg"')
news = routes(rd('news')).replace('<!--[-->', '').replace('<!--]-->', '')
for i, s in enumerate(re.findall(r'src="([^"]+)"', news), 1): news = news.replace(f'src="{s}"', f'src="assets/img/news-{i}.jpg"')
footer = routes(rd('footer'))
plus = '<svg class="plus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19" fill="none"><path d="M0 9.30469H19" stroke="white" stroke-width="2"></path><path d="M9.5 0L9.5 19" stroke="white" stroke-width="2"></path></svg>'
logo_svg = re.search(r'<svg class="logo".*?</svg>', rd('title-wrapper'), re.S).group(0)
rail_cards = [('rail-1', '신광교 클라우드 시티', '경기도 용인시 기흥구 영덕동 774 외 9개필지'), ('rail-2', '검단역 금강펜테리움 더시글로 코벤트워크', '인천광역시 서구 당하동 검단신도시 RC3블록'), ('rail-3', '힐스테이트 고덕 어반그로브', '경기도 평택시 평택 고덕국제화지구 EBC-1 블록'), ('rail-4', '서울숲 아이파크 리버포레', '서울특별시 성동구 성수동1가 670-27번지 일원')]
rail = ''.join(f'<div class="image"><div class="image-wrapper"><img src="assets/img/{f}.jpg" alt="image"></div><div class="image-title-wrapper"><div class="image-title"> {t} </div><div class="image-desc"> {d} </div></div></div>' for f, t, d in rail_cards)
html = f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>베스플러스 | 목표는 완벽한 분양 시장을 만드는 것입니다</title>
<meta name="description" content="목표는 막연히 잘 파는 것이 아닙니다. 완벽한 분양 시장을 만드는 것입니다. 철저한 교육을 바탕으로 양성된 전문가들에 움직이는 분양 시장을 만들기 위해 베스플러스는 분양 영업의 체계화에 나섰고, 독보적인 분양 성과로 증명하였습니다">
<meta name="keywords" content="베스플러스, 분양상담사, 부동산컨설팅, 분양대행, 부동산개발/투자, 부동산 마케팅">
<meta property="og:title" content="베스플러스 | 목표는 완벽한 분양 시장을 만드는 것입니다">
<meta property="og:description" content="목표는 막연히 잘 파는 것이 아닙니다. 완벽한 분양 시장을 만드는 것입니다.">
<meta name="robots" content="noindex">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23111'/%3E%3Ctext x='16' y='22' font-family='Arial' font-size='18' font-weight='700' fill='%23fff' text-anchor='middle'%3EV%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="css/style.css">
</head>
<body class="skin--default">
<div class="layout">
{nav}
{menu}
<div class="content">
<div class="loading"><div class="loading-wrapper"><div class="loading-content"><div class="loading-title text-center"> Challenges </div><div class="desc"> for a Perfect Sale Market </div></div></div></div>
<main class="home">
<div class="content-wrapper">
<div class="title-animation-texts">
<div class="title-wrapper"><div class="text-rail"><div class="text-train first"> Challenges </div><div class="text-train second"> Innovation </div><div class="text-train main">{logo_svg}</div></div><div class="description">for a perfect real estate market</div></div>
<div class="title-top"><div class="title-first"> WE CREATE THE PERFECT </div><div class="title-second"> REAL ESTATE MARKET </div></div>
<div class="title-bottom"><div class="script-second"><div class="line"> A LEADING CONSULTING FIRM  </div>  <br class="only-mobile"><div class="line"> FOR SALES </div></div><div class="image-rail"><div class="images">{rail}</div><div class="scroll-indicator"> ( SCROLL FOR MORE ) </div></div></div>
</div>
<div class="image-animation-group">
{grid}
<div class="pre-text-wrapper first"><div class="pre-text-center-wrapper"><div class="opacity-text-animation"> 아직 분양 시장은 <span class="opacity-text">완벽</span>하지 않습니다 </div></div></div>
<div class="pre-text-wrapper second"><div class="pre-text-center-wrapper">
<div class="pre-text-left"><div class="p"> 목표는 </div><div class="p"> 막연히 잘 파는 것이 아닙니다 </div><div class="p"><span class="text-primary">완벽한 분양 시장</span>을 만드는 것입니다 </div></div>
<div class="pre-text-right">
<div class="p-group"><div class="p"> 대한민국에서 </div><div class="p"> 가장 값비싼 물건을 판매하는 일임에도 불구하고 </div><div class="p"> 정확한 체계에 따른 영업을 하는 전문가는 찾아볼 수 없었습니다 </div></div>
<div class="p-group"><div class="p"> 철저한 교육을 바탕으로 </div><div class="p"> 양성된 전문가들에 움직이는 분양 시장을 만들기 위해 </div><div class="p"> 베스플러스는 분양 영업의 체계화에 나섰고, </div><div class="p"> 독보적인 분양 성과로 증명하였습니다 </div></div>
<div class="animation-btn-wrapper"><a class="animation-btn" href="#" data-route="/about"><span>완벽한 분양 시장 만들어 가는 과정 보기</span>{plus}<svg class="svg-border" viewBox="0 0 467 63" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="465" height="61" rx="30.5" stroke="white"></rect></svg></a></div>
</div>
</div></div>
<div class="info-wrapper">
<div class="info-group"><div class="info-title"> 분양대행 </div><div class="info-val"><div class="value-wrapper"><span class="value anima-increment" data-index="0" data-value="25">0</span>건 </div><div class="value-desc"> 체계화된 분양 대행 시스템을 기반으로<br> 지속적인 성과를 쌓고 있습니다 </div></div></div>
<div class="info-group"><div class="info-title"> 마케팅 기획 </div><div class="info-val"><div class="value-wrapper"><span class="value anima-increment" data-index="1" data-value="19">0</span>건 </div><div class="value-desc"> 각 분양 프로젝트의 특성에 맞춘 효과적인 전략을<br> 수립하여 목표 고객에게 최적화된 메시지를 전달합니다 </div></div></div>
<div class="info-group"><div class="info-title"> 매출 총액 </div><div class="info-val"><div class="value-wrapper"><span class="value anima-increment" data-index="2" data-value="5600">0</span>억+ </div><div class="value-desc"> 체계화된 분양 대행 시스템을 기반으로<br> 지속적인 성과를 쌓고 있습니다 </div></div></div>
<div class="info-group"><div class="info-title"> 영업이익 </div><div class="info-val"><div class="value-wrapper"><span class="value anima-increment" data-index="3" data-value="200">0</span>억+ </div><div class="value-desc"> 뛰어난 분양대행 전략과 마케팅 기획으로<br> 꾸준한 영업이익 성장을 기록하고 있습니다 </div></div></div>
<div class="wrapper-title"><div class="p"> 베스플러스는 독자적인 체계를 통해 </div><div class="p"> 대한민국 최고의 분양대행사로 자리매김하고 있습니다 </div></div>
</div>
</div>
{portfolios}
</div>
{news}
</main>
{footer}
</div>
</div>
<script src="js/vendor/gsap.min.js"></script>
<script src="js/vendor/ScrollTrigger.min.js"></script>
<script src="js/vendor/ScrollSmoother.min.js"></script>
<script src="js/vendor/SplitText.min.js"></script>
<script src="js/vendor/DrawSVGPlugin.min.js"></script>
<script src="js/vendor/MotionPathPlugin.min.js"></script>
<script src="js/app.js"></script>
</body>
</html>
'''
open('index.html', 'w', encoding='utf-8').write(html)
print('index.html', len(html), 'chars')
