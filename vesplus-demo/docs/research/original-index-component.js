// pages/index component from https://www.vesplus.co.kr/_nuxt/BMRAm2b8.js (minified, line breaks added)
const k1={class:"home"},Q1={class:"content-wrapper"},j1={class:"title-animation-texts"},nd={class:"title-wrapper"},ed={class:"description"},td={class:"image-animation-group"},rd={class:"pre-text-wrapper second"},id={class:"pre-text-center-wrapper"},ad={class:"pre-text-right"},ud={class:"animation-btn-wrapper"},od={class:"portfolios"},sd=["src","alt"],fd={class:"info-wrapper"},ld={class:"info"},cd={class:"constructor"},pd={class:"title"},hd={class:"location"},dd={class:"indicator"},gd={class:"news-list-wrapper"},vd={class:"news-list"},_d={class:"news-thumbnail"},md=["src","alt"],wd={class:"news-info"},xd={class:"more"},Ld={__name:"index",async setup(yt){let j,s;
const{$http:zi,$gsap:tn,$scrollTrigger:Zi,$scrollSmoother:cn,$gsapHelper:Dn,$motionPathPlugin:At,$bus:ze}=w1(),_r=x1();
y1({title:"베스플러스 | 목표는 완벽한 분양 시장을 만드는 것입니다",ogTitle:"베스플러스 | 목표는 완벽한 분양 시장을 만드는 것입니다",ogDescription:"목표는 막연히 잘 파는 것이 아닙니다. 완벽한 분양 시장을 만드는 것입니다. 철저한 교육을 바탕으로 양성된 전문가들에 움직이는 분양 시장을 만들기 위해 베스플러스는 분양 영업의 체계화에 나섰고, 독보적인 분양 성과로 증명하였습니다",description:"목표는 막연히 잘 파는 것이 아닙니다. 완벽한 분양 시장을 만드는 것입니다. 철저한 교육을 바탕으로 양성된 전문가들에 움직이는 분양 시장을 만들기 위해 베스플러스는 분양 영업의 체계화에 나섰고, 독보적인 분양 성과로 증명하였습니다",keywords:"베스플러스, 분양상담사, 부동산컨설팅, 분양대행, 부동산개발/투자, 부동산 마케팅",image:""});
const ne=["for a perfect real estate market","fo a perfect real estate market","f a perfect real estate market"," a perfect real estate market","c a perfect real estate market","cr a perfect real estate market","cre a perfect real estate market","crea a perfect real estate market","creat a perfect real estate market","create a perfect real estate market","creates a perfect real estate market"];
let pn=null;
const{data:Ze,error:he}=([j,s]=Ni(()=>Ki("main-page",({$config:q})=>$fetch(`${q.public.baseURL}/pages/main`))),j=await j,s(),j),{data:qn,error:Ye}=([j,s]=Ni(()=>Ki("portfolios-featured",({$config:q})=>$fetch(`${q.public.baseURL}/featured/portfolios`))),j=await j,s(),j),{data:hn,error:de}=([j,s]=Ni(()=>Ki("news-featured",({$config:q})=>$fetch(`${q.public.baseURL}/featured/news`))),j=await j,s(),j),Re=qi({frame:0}),
bn=qi(null),ee=qi(null);
return A1(()=>{window.scrollTo({top:0,left:0,behavior:"instant"}),
document.body.classList.add("lock"),T1(()=>{ze.event("scrollTop"),pn=tn.matchMedia(),pn.add("(min-width: 1025px)",()=>{tn.set(".loading",{display:"none"});
const q=new Dn.splitText(".title-first, .title-second",{type:"chars",charsClass:"char"}),
O=new Dn.splitText(".script-second",{type:"chars",charsClass:"char"}),
Y=new Dn.splitText(".pre-text-center-wrapper .p",{type:"chars",linesClass:"char"}),
N=new Dn.splitText(".image-animation-group .animation-btn span",{type:"chars",linesClass:"char"}),
Kn=document.querySelector(".text-rail .logo"),Xe=document.querySelector(".text-rail"),Ve=document.querySelector(".logo-home"),ge=At.getRelativePosition(Kn,Ve,[.5,1],[.5,0]),dn=tn.utils.toArray(".text-train"),Ce=tn.timeline()
  .fromTo(dn[0],{yPercent:0},{yPercent:-100,ease:"none",duration:1,delay:.5})
  .fromTo(dn[1],{yPercent:100},{yPercent:0,ease:"none",duration:1,delay:.5},"-=1.5")
  .fromTo(dn[2],{yPercent:100},{yPercent:0,ease:"none",duration:1,delay:.5})
  .to(dn[1],{yPercent:-100,ease:"none",duration:1,delay:.5},"-=1.5")
  .to(Re.value,{frame:ne.length-1,snap:"frame",duration:1,ease:"none"})
  .to(".title-wrapper .description",{opacity:1,height:0,duration:1,ease:"none"})
  .to(Xe,{x:"+="+ge.x,y:"+="+ge.y,duration:1,ease:"none"})
  .to(".text-train.main .logo",{width:"8.698vw",duration:1,ease:"none"},"-=1")
  .fromTo("nav",{autoAlpha:0},{autoAlpha:1,duration:.5,ease:"power2.inOut"})
  .to(".title-wrapper",{autoAlpha:0,duration:.25,ease:"power2.inOut"},"-=.5")
  .fromTo(".title-bottom",{height:0},{height:"50vh",duration:.5,ease:"power2.in",onComplete:()=>{document.body.classList.remove("lock")}},"-=.5")
  .fromTo(q.chars,{yPercent:100},{yPercent:0,duration:.5,ease:"power2.inOut",stagger:.025},"label-1")
  .fromTo(O.chars,{yPercent:100},{yPercent:0,duration:.5,ease:"power2.inOut",stagger:.025},"label-1")
  .fromTo(".images .image",{yPercent:100,opacity:0},{yPercent:0,opacity:1,duration:.5,ease:"power2.inOut",stagger:.025},"label-1")
  .from(".scroll-indicator",{opacity:0,duration:.5,ease:"power2.inOut"},"label-1"),Oe=tn.timeline({scrollTrigger:{trigger:".content-wrapper",start:"top top",end:"1200% bottom",scrub:1,pin:!0,toggleActions:"play none none none",invalidateOnRefresh:!0}})
  .to(".title-bottom .images",{x:"-=41.51vw",duration:1,ease:"none",delay:.5})
  .to(".title-bottom .images .image:nth-child(1)",{yPercent:100,duration:1,opacity:0,ease:"none",delay:.5},"-=1.5")
  .to(".title-bottom .images",{x:"-=41.51vw",duration:1,ease:"none",delay:.5})
  .to(".title-bottom .images .image:nth-child(2)",{yPercent:100,duration:1,opacity:0,ease:"none",delay:.5},"-=1.5")
  .to(".title-bottom .images",{x:"-=41.51vw",duration:1,ease:"none",delay:.5})
  .to(".title-bottom .images .image:nth-child(3)",{yPercent:100,duration:1,opacity:0,ease:"none",delay:.5},"-=1.5")
  .to(".title-bottom .images",{x:"-=41.51vw",duration:1,ease:"none",delay:.5},"title-disappear")
  .to(".title-bottom .images .image:nth-child(4)",{yPercent:100,duration:1,opacity:0,ease:"none",delay:.5},"title-disappear")
  .to(q.chars,{yPercent:100,duration:.5,ease:"power2.inOut",stagger:.025},"title-disappear")
  .to(O.chars,{yPercent:100,duration:.5,ease:"power2.inOut",stagger:.025},"title-disappear")
  .to(".text-train.main",{yPercent:100,duration:.5,ease:"power2.inOut"},"title-disappear")
  .to(".title-animation-texts",{opacity:0,duration:.5,ease:"power2.inOut"},"title-disappear")
  .fromTo(".image-animation-group",{opacity:0},{opacity:1,duration:1,ease:"none"},"title-disappear")
  .fromTo(".image-grid-group .image-wrapper",{y:window.innerHeight,rotationX:-70,transformOrigin:"50% 0%",z:-900,autoAlpha:0},{duration:1,stagger:{amount:.4,from:"random",grid:[3,3]},y:0,z:0,rotationX:0,autoAlpha:1,ease:"sin"})
  .fromTo(".pre-text-wrapper.first",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"})
  .fromTo(".opacity-text",{autoAlpha:0,color:"#FFF"},{autoAlpha:1,color:"#B19876",duration:1,ease:"none"})
  .to(".pre-text-wrapper.first",{autoAlpha:0,delay:2,duration:1,ease:"none"})
  .fromTo(".after-image-wrapper",{xPercent:100},{xPercent:0,duration:1,stagger:.5,ease:"power2.inOut"},"scene.image-convert")
  .fromTo(".after-image-wrapper img",{xPercent:-100},{xPercent:0,stagger:.5,duration:1,ease:"power2.inOut"},"scene.image-convert")
  .fromTo(".image-grid-group",{transform:"scale3d(.4, .4, 1)"},{transform:"scale3d(1,1, 1)",duration:1,ease:"none"})
  .fromTo(".pre-text-wrapper.second",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"})
  .fromTo(Y.chars,{yPercent:100},{yPercent:0,duration:1,ease:"power2.inOut",stagger:.025})
  .fromTo(N.chars,{yPercent:100},{yPercent:0,duration:1,ease:"power2.inOut",stagger:.025})
  .fromTo(".image-animation-group .animation-btn .svg-border rect",{drawSVG:"0%"},{drawSVG:"100%",duration:1,ease:"power2.inOut"})
  .to(Y.chars,{autoAlpha:0,duration:1,ease:"power2.inOut"},"a-1")
  .to(".pre-text-wrapper.second",{opacity:0,duration:1,ease:"none"},"a-1")
  .fromTo(".image-animation-group .after-image-wrapper img",{autoAlpha:1},{autoAlpha:0,duration:1,ease:"none"},"a-1")
  .fromTo(".image-animation-group .image-wrapper",{border:"1px solid #111"},{border:"1px solid #838383",duration:1,ease:"none"},"a-1")
  .to(".image-grid-group",{width:"100%",height:"100vh",transform:"scale3d(1,1, 1)",immediateRender:!1,duration:1,ease:"none"})
  .to(".image-grid-group .image-wrapper",{stagger:{amount:.4,from:"random",grid:[3,3]},xPercent:(W,An)=>W%3===0?102:W%3===2?-102:0,yPercent:W=>W<3?103:W>5?-103:0,duration:1,ease:"none"},"scene.card-shuffle")
  .fromTo(".info-wrapper",{autoAlpha:0},{autoAlpha:1,duration:.25,ease:"none"})
  .to(".info-wrapper .info-group",{width:"24%",height:"24%",duration:1,ease:"power2.inOut"})
  .fromTo(".info-wrapper .info-group:nth-child(1)",{top:"50%",yPercent:-50,xPercent:-50,left:"50%"},{top:"50%",yPercent:-50,left:"0.8%",xPercent:0,duration:1,ease:"power2.inOut"},"scene.card-order")
  .fromTo(".info-wrapper .info-group:nth-child(2)",{top:"50%",yPercent:-50,xPercent:-50,left:"50%"},{top:"50%",yPercent:-50,left:"25.6%",xPercent:0,duration:1,ease:"power2.inOut"},"scene.card-order")
  .fromTo(".info-wrapper .info-group:nth-child(3)",{top:"50%",yPercent:-50,xPercent:-50,left:"50%"},{top:"50%",yPercent:-50,left:"50.4%",xPercent:0,duration:1,ease:"power2.inOut"},"scene.card-order")
  .fromTo(".info-wrapper .info-group:nth-child(4)",{top:"50%",yPercent:-50,xPercent:-50,left:"50%"},{top:"50%",yPercent:-50,left:"75.2%",xPercent:0,duration:1,ease:"power2.inOut"},"scene.card-order")
  .fromTo(".info-wrapper .info-group .info-title",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"})
  .fromTo(".info-wrapper .info-group .info-val",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"},"-=1")
  .fromTo(".info-wrapper .wrapper-title",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"},"-=1")
  .to(".value.anima-increment",{textContent:W=>Ze.value[W].value,duration:1,snap:{textContent:1}})
  .set(".image-animation-group",{zIndex:2})
  .fromTo(".portfolio-wrapper",{yPercent:100},{yPercent:0,duration:1,ease:"none",delay:W=>W*1.5+.5},"portfolios")
  .fromTo(".portfolio-wrapper .portfolio",{yPercent:-100},{yPercent:0,duration:1,ease:"none",delay:W=>W*1.5+.5},"portfolios");
return()=>{document.body.classList.remove("lock"),Ce.kill(),dn.forEach(W=>{tn.killTweensOf(W)}),
Oe.kill()}}),
pn.add("(max-width: 1024px)",()=>{tn.set(".loading",{display:"none"});
const q=new Dn.splitText(".title-first, .title-second",{type:"chars",charsClass:"char"}),
O=new Dn.splitText(".script-second .line",{type:"chars",charsClass:"char"}),
Y=new Dn.splitText(".pre-text-center-wrapper .p",{type:"chars",linesClass:"char"}),
N=new Dn.splitText(".image-animation-group .animation-btn span",{type:"chars",linesClass:"char"}),
Kn=document.querySelector(".text-rail .logo"),Xe=document.querySelector(".text-rail"),Ve=document.querySelector(".logo-home"),ge=At.getRelativePosition(Kn,Ve,[.5,1],[.5,0]),dn=tn.utils.toArray(".text-train"),Ce=tn.timeline()
  .fromTo(dn[0],{yPercent:0},{yPercent:-100,ease:"none",duration:1,delay:.5})
  .fromTo(dn[1],{yPercent:100},{yPercent:0,ease:"none",duration:1,delay:.5},"-=1.5")
  .fromTo(dn[2],{yPercent:100},{yPercent:0,ease:"none",duration:1,delay:.5})
  .to(dn[1],{yPercent:-100,ease:"none",duration:1,delay:.5},"-=1.5")
  .to(Re.value,{frame:ne.length-1,snap:"frame",duration:1,ease:"none"})
  .to(".title-animation-texts .description",{opacity:1,height:0,duration:1,ease:"none"})
  .to(Xe,{x:"+="+ge.x,y:"+="+ge.y,duration:1,ease:"none"})
  .to(".text-train.main .logo",{width:"22.4vw",duration:1,ease:"none"},"-=1")
  .fromTo("nav",{autoAlpha:0},{autoAlpha:1,duration:.5,ease:"power2.inOut"})
  .to(".title-wrapper",{autoAlpha:0,duration:.25,ease:"power2.inOut"},"-=.5")
  .fromTo(".title-bottom",{height:0},{height:"60dvh",duration:.5,ease:"power2.in",onComplete:()=>{document.body.classList.remove("lock")}},"-=.5")
  .fromTo(q.chars,{yPercent:100},{yPercent:0,duration:.5,ease:"power2.inOut",stagger:.025},"label-1")
  .fromTo(O.chars,{yPercent:100},{yPercent:0,duration:.5,ease:"power2.inOut",stagger:.025},"label-1")
  .fromTo(".images .image",{yPercent:100,opacity:0},{yPercent:0,opacity:1,duration:.5,ease:"power2.inOut",stagger:.025},"label-1")
  .from(".scroll-indicator",{opacity:0,duration:.5,ease:"power2.inOut"},"label-1"),Oe=tn.timeline({scrollTrigger:{trigger:".content-wrapper",start:"top top",end:"1600% bottom",scrub:1,pin:!0,toggleActions:"play none none none",invalidateOnRefresh:!0}})
  .to(".title-bottom .images",{x:"-=113.87vw",duration:1,ease:"none",delay:.5})
  .to(".title-bottom .images .image:nth-child(1)",{yPercent:100,duration:1,opacity:0,ease:"none",delay:.5},"-=1.5")
  .to(".title-bottom .images",{x:"-=113.87vw",duration:1,ease:"none",delay:.5})
  .to(".title-bottom .images .image:nth-child(2)",{yPercent:100,duration:1,opacity:0,ease:"none",delay:.5},"-=1.5")
  .to(".title-bottom .images",{x:"-=113.87vw",duration:1,ease:"none",delay:.5})
  .to(".title-bottom .images .image:nth-child(3)",{yPercent:100,duration:1,opacity:0,ease:"none",delay:.5},"-=1.5")
  .to(".title-bottom .images",{x:"-=113.87vw",duration:1,ease:"none",delay:.5},"title-disappear")
  .to(".title-bottom .images .image:nth-child(4)",{yPercent:100,duration:1,opacity:0,ease:"none",delay:.5},"title-disappear")
  .to(q.chars,{yPercent:100,duration:.5,ease:"power2.inOut",stagger:.025},"title-disappear")
  .to(O.chars,{yPercent:100,duration:.5,ease:"power2.inOut",stagger:.025},"title-disappear")
  .to(".text-train.main",{yPercent:100,duration:.5,ease:"power2.inOut"},"title-disappear")
  .to(".title-animation-texts",{opacity:0,duration:.5,ease:"power2.inOut"},"title-disappear")
  .fromTo(".image-animation-group",{opacity:0},{opacity:1,duration:1,ease:"none"},"title-disappear")
  .fromTo(".image-grid-group .image-wrapper",{y:window.innerHeight,rotationX:-70,transformOrigin:"50% 0%",z:-900,autoAlpha:0},{duration:1,stagger:{amount:.4,from:"random",grid:[3,3]},y:0,z:0,rotationX:0,autoAlpha:1,ease:"sin"})
  .fromTo(".pre-text-wrapper.first",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"})
  .fromTo(".opacity-text",{autoAlpha:0,color:"#FFF"},{color:"#B19876",autoAlpha:1,duration:1,ease:"none"})
  .to(".pre-text-wrapper.first",{autoAlpha:0,duration:1,ease:"none"})
  .fromTo(".after-image-wrapper",{xPercent:100},{xPercent:0,duration:1,stagger:.5,ease:"power2.inOut"},"scene.image-convert")
  .fromTo(".after-image-wrapper img",{xPercent:-100},{xPercent:0,stagger:.5,duration:1,ease:"power2.inOut"},"scene.image-convert")
  .fromTo(".image-grid-group",{transform:"scale3d(.4, .4, 1)"},{transform:"scale3d(1,1, 1)",duration:1,ease:"none"})
  .fromTo(".pre-text-wrapper.second",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"})
  .fromTo(Y.chars,{yPercent:100},{yPercent:0,duration:1,ease:"power2.inOut",stagger:.025})
  .fromTo(N.chars,{yPercent:100},{yPercent:0,duration:1,ease:"power2.inOut",stagger:.025})
  .fromTo(".image-animation-group .animation-btn .svg-border rect",{drawSVG:"0%"},{drawSVG:"100%",duration:1,ease:"power2.inOut"})
  .to(Y.chars,{autoAlpha:0,duration:1,ease:"power2.inOut"},"a-1")
  .to(".pre-text-wrapper.second",{opacity:0,duration:1,ease:"none"},"a-1")
  .fromTo(".image-animation-group .after-image-wrapper img",{autoAlpha:1},{autoAlpha:0,duration:1,ease:"none"},"a-1")
  .fromTo(".image-animation-group .image-wrapper",{border:"1px solid #111"},{border:"1px solid #838383",duration:1,ease:"none"},"a-1")
  .to(".image-grid-group",{transform:"scale3d(1,1, 1)",immediateRender:!1,duration:1,ease:"none"})
  .to(".image-grid-group .image-wrapper",{stagger:{amount:.4,from:"random",grid:[3,3]},xPercent:(W,An)=>W%3===0?104:W%3===2?-104:0,yPercent:W=>W<3?104:W>5?-104:0,duration:1,ease:"none"},"scene.card-shuffle")
  .fromTo(".info-wrapper",{autoAlpha:0},{autoAlpha:1,duration:.25,ease:"none"})
  .to(".info-wrapper .info-group",{width:"80%",height:"18%",duration:1,ease:"power2.inOut"})
  .fromTo(".info-wrapper .info-group:nth-child(1)",{bottom:"50%",yPercent:50,xPercent:-50,left:"50%"},{bottom:"68%",yPercent:0,xPercent:-50,left:"50%",duration:1,ease:"power2.inOut"},"scene.card-order")
  .fromTo(".info-wrapper .info-group:nth-child(2)",{bottom:"50%",yPercent:50,xPercent:-50,left:"50%"},{bottom:"47%",yPercent:0,xPercent:-50,left:"50%",duration:1,ease:"power2.inOut"},"scene.card-order")
  .fromTo(".info-wrapper .info-group:nth-child(3)",{bottom:"50%",yPercent:50,xPercent:-50,left:"50%"},{bottom:"26%",yPercent:0,xPercent:-50,left:"50%",duration:1,ease:"power2.inOut"},"scene.card-order")
  .fromTo(".info-wrapper .info-group:nth-child(4)",{bottom:"50%",yPercent:50,xPercent:-50,left:"50%"},{bottom:"5%",yPercent:0,xPercent:-50,left:"50%",duration:1,ease:"power2.inOut"},"scene.card-order")
  .fromTo(".info-wrapper .info-group .info-title",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"})
  .fromTo(".info-wrapper .info-group .info-val",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"},"-=1")
  .fromTo(".info-wrapper .wrapper-title",{autoAlpha:0},{autoAlpha:1,duration:1,ease:"none"},"-=1")
  .to(".value.anima-increment",{textContent:W=>Ze.value[W].value,duration:1,snap:{textContent:1}})
  .set(".image-animation-group",{zIndex:2});
return ee.value.forEach((W,An)=>{Oe.fromTo(W,{yPercent:100},{yPercent:0,duration:2,ease:"none",delay:1},"portfolios-"+An)
  .fromTo(W.querySelector(".portfolio"),{yPercent:-100},{yPercent:0,duration:2,ease:"none",delay:1},"portfolios-"+An)}),
()=>{document.body.classList.remove("lock"),Ce.kill(),dn.forEach(W=>{tn.killTweensOf(W)}),
Oe.kill()}})})}),
L1(()=>{pn?.revert(),document.body.classList.remove("lock")}),
(q,O)=>{const Y=P1("RouterLink");
return mt(),gr(Gi,null,[O[12]||(O[12]=pe('<div class="loading"><div class="loading-wrapper"><div class="loading-content"><div class="loading-title text-center"> Challenges </div><div class="desc"> for a Perfect Sale Market </div></div></div></div>',1)),S("main",k1,[S("div",Q1,[S("div",j1,[S("div",nd,[O[1]||(O[1]=pe('<div class="text-rail"><div class="text-train first"> Challenges </div><div class="text-train second"> Innovation </div><div class="text-train main"><svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 126 18" fill="none"><path d="M25.6484 14.3408V10.4239H35.8084V7.11972H25.6484V3.45634H36.0375V0H21.0542V17.7972H36.1393V14.3408H25.6484Z" fill="white"></path><path d="M38.0479 14.2394H47.9533C49.1793 14.2394 49.2302 13.4535 49.2302 13.0183C49.2302 12.4099 48.9247 11.8986 47.8515 11.569L40.8562 9.48592C38.5315 8.80141 37.8442 6.99296 37.8442 4.50423C37.8485 1.82958 39.0193 0 41.9803 0H53.0057V3.55775H43.7663C43.1003 3.55775 42.5148 3.81127 42.5148 4.72817C42.5148 5.41268 42.8712 5.89859 43.9444 6.22817L50.2228 8.05775C52.8784 8.82254 53.9262 10.1408 53.9262 13.0648C53.9262 15.9887 52.8784 17.793 49.841 17.793H38.0479V14.231V14.2394Z" fill="white"></path><path d="M89.9123 14.2394H79.5191V0H74.9248V17.7972H89.9123V14.2394Z" fill="white"></path><path d="M110.126 14.2394H120.031C121.257 14.2394 121.308 13.4535 121.308 13.0183C121.308 12.4099 121.003 11.8986 119.929 11.569L112.938 9.48592C110.614 8.80141 109.926 6.99296 109.926 4.50423C109.922 1.82958 111.097 0 114.054 0H125.079V3.55775H115.84C115.174 3.55775 114.588 3.81127 114.588 4.72817C114.588 5.41268 114.945 5.89859 116.018 6.22817L122.296 8.05775C124.952 8.82254 126 10.1408 126 13.0648C126 15.9887 124.952 17.793 121.915 17.793H110.121V14.231L110.126 14.2394Z" fill="white"></path><path d="M107.899 0H103.305V14.4423H95.8511V0H91.2568V14.4845C91.2568 16.4239 92.8392 18 94.7863 18H107.899V0Z" fill="white"></path><path d="M15.1614 0L10.0327 14.2099L4.89968 0H0L7.21589 17.7972H12.8155L20.0654 0H15.1614Z" fill="white"></path><path d="M63.0215 8.54366V12.1056H70.3816C71.8324 12.1056 73.0075 10.9352 73.0075 9.49014V2.61549C73.0075 1.17042 71.8324 0 70.3816 0H55.9795V17.7972H60.5737V3.56197H67.9339C68.1417 3.56197 68.3072 3.73099 68.3072 3.9338V8.17183C68.3072 8.37887 68.1375 8.54366 67.9339 8.54366H63.0172H63.0215Z" fill="white"></path></svg></div></div>',1)),S("div",ed,Pe(ne[wt(Re).frame]),1)]),O[2]||(O[2]=pe('<div class="title-top"><div class="title-first"> WE CREATE THE PERFECT </div><div class="title-second"> REAL ESTATE MARKET </div></div><div class="title-bottom"><div class="script-second"><div class="line"> A LEADING CONSULTING FIRM  </div>  <br class="only-mobile"><div class="line"> FOR SALES </div></div><div class="image-rail"><div class="images"><div class="image"><div class="image-wrapper"><img src="'+C1+'" alt="image"></div><div class="image-title-wrapper"><div class="image-title"> 신광교 클라우드 시티 </div><div class="image-desc"> 경기도 용인시 기흥구 영덕동 774 외 9개필지 </div></div></div><div class="image"><div class="image-wrapper"><img src="'+O1+'" alt="image"></div><div class="image-title-wrapper"><div class="image-title"> 검단역 금강펜테리움 더시글로 코벤트워크 </div><div class="image-desc"> 인천광역시 서구 당하동 검단신도시 RC3블록 </div></div></div><div class="image"><div class="image-wrapper"><img src="'+S1+'" alt="image"></div><div class="image-title-wrapper"><div class="image-title"> 힐스테이트 고덕 어반그로브 </div><div class="image-desc"> 경기도 평택시 평택 고덕국제화지구 EBC-1 블록 </div></div></div><div class="image"><div class="image-wrapper"><img src="'+b1+'" alt="image"></div><div class="image-title-wrapper"><div class="image-title"> 서울숲 아이파크 리버포레 </div><div class="image-desc"> 서울특별시 성동구 성수동1가 670-27번지 일원 </div></div></div></div><div class="scroll-indicator"> ( SCROLL FOR MORE ) </div></div></div>',2))]),S("div",td,[O[6]||(O[6]=pe('<div class="image-grid-group"><div class="image-wrapper"><img src="'+E1+'" alt=""><div class="after-image-wrapper"><img src="'+I1+'" alt=""></div></div><div class="image-wrapper"><img src="'+U1+'" alt=""><div class="after-image-wrapper"><img src="'+B1+'" alt=""></div></div><div class="image-wrapper"><img src="'+M1+'" alt=""><div class="after-image-wrapper"><img src="'+W1+'" alt=""></div></div><div class="image-wrapper"><img src="'+F1+'" alt=""><div class="after-image-wrapper"><img src="'+D1+'" alt=""></div></div><div class="image-wrapper"><img src="'+H1+'" alt=""><div class="after-image-wrapper"><img src="'+N1+'" alt=""></div></div><div class="image-wrapper"><img src="'+G1+'" alt=""><div class="after-image-wrapper"><img src="'+$1+'" alt=""></div></div><div class="image-wrapper"><img src="'+q1+'" alt=""><div class="after-image-wrapper"><img src="'+K1+'" alt=""></div></div><div class="image-wrapper"><img src="'+z1+'" alt=""><div class="after-image-wrapper"><img src="'+Z1+'" alt=""></div></div><div class="image-wrapper"><img src="'+Y1+'" alt=""><div class="after-image-wrapper"><img src="'+X1+'" alt=""></div></div></div><div class="pre-text-wrapper first"><div class="pre-text-center-wrapper"><div class="opacity-text-animation"> 아직 분양 시장은 <span class="opacity-text">완벽</span>하지 않습니다 </div></div></div>',2)),S("div",rd,[S("div",id,[O[5]||(O[5]=pe('<div class="pre-text-left"><div class="p"> 목표는 </div><div class="p"> 막연히 잘 파는 것이 아닙니다 </div><div class="p"><span class="text-primary">완벽한 분양 시장</span>을 만드는 것입니다 </div></div>',1)),S("div",ad,[O[4]||(O[4]=pe('<div class="p-group"><div class="p"> 대한민국에서 </div><div class="p"> 가장 값비싼 물건을 판매하는 일임에도 불구하고 </div><div class="p"> 정확한 체계에 따른 영업을 하는 전문가는 찾아볼 수 없었습니다 </div></div><div class="p-group"><div class="p"> 철저한 교육을 바탕으로 </div><div class="p"> 양성된 전문가들에 움직이는 분양 시장을 만들기 위해 </div><div class="p"> 베스플러스는 분양 영업의 체계화에 나섰고, </div><div class="p"> 독보적인 분양 성과로 증명하였습니다 </div></div>',2)),S("div",ud,[S("div",{class:"animation-btn",onClick:O[0]||(O[0]=N=>wt(_r).push("/about"))},[...O[3]||(O[3]=[pe('<span>완벽한 분양 시장 만들어 가는 과정 보기</span><svg class="plus" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 19" fill="none"><path d="M0 9.30469H19" stroke="white" stroke-width="2"></path><path d="M9.5 0L9.5 19" stroke="white" stroke-width="2"></path></svg><svg class="svg-border" viewBox="0 0 467 63" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="465" height="61" rx="30.5" stroke="white"></rect></svg>',3)])])])])])]),O[7]||(O[7]=pe('<div class="info-wrapper"><div class="info-group"><div class="info-title"> 분양대행 </div><div class="info-val"><div class="value-wrapper"><span class="value anima-increment" data-index="0"> 0 </span>건 </div><div class="value-desc"> 체계화된 분양 대행 시스템을 기반으로<br> 지속적인 성과를 쌓고 있습니다 </div></div></div><div class="info-group"><div class="info-title"> 마케팅 기획 </div><div class="info-val"><div class="value-wrapper"><span class="value anima-increment" data-index="1"> 0 </span>건 </div><div class="value-desc"> 각 분양 프로젝트의 특성에 맞춘 효과적인 전략을<br> 수립하여 목표 고객에게 최적화된 메시지를 전달합니다 </div></div></div><div class="info-group"><div class="info-title"> 매출 총액 </div><div class="info-val"><div class="value-wrapper"><span class="value anima-increment" data-index="2"> 0 </span>억+ </div><div class="value-desc"> 체계화된 분양 대행 시스템을 기반으로<br> 지속적인 성과를 쌓고 있습니다 </div></div></div><div class="info-group"><div class="info-title"> 영업이익 </div><div class="info-val"><div class="value-wrapper"><span class="value anima-increment" data-index="3"> 0 </span>억+ </div><div class="value-desc"> 뛰어난 분양대행 전략과 마케팅 기획으로<br> 꾸준한 영업이익 성장을 기록하고 있습니다 </div></div></div><div class="wrapper-title"><div class="p"> 베스플러스는 독자적인 체계를 통해 </div><div class="p"> 대한민국 최고의 분양대행사로 자리매김하고 있습니다 </div></div></div>',1))]),S("div",od,[(mt(!0),gr(Gi,null,Co(wt(qn),(N,Kn)=>(mt(),gr("div",{class:"portfolio-wrapper",key:N.id,ref_for:!0,ref_key:"refPortfolioWrappers",ref:ee},[S("div",{class:"portfolio",ref_for:!0,ref_key:"refPortfolios",ref:bn},[S("img",{class:"portfolio-thumbnail",src:N.thumbnail,alt:`${N.title}-thumbnail`},null,8,sd),S("div",fd,[S("div",ld,[S("div",cd,Pe(N.construction_company),1),S("div",pd,Pe(N.title),1),S("div",hd,Pe(N.location),1),Oo(Y,{to:`/portfolios/sales/${N.id}`,class:"btn-wrapper sm"},{default:$i(()=>[...O[8]||(O[8]=[S("div",{class:"btn"},[S("span",null,"자세히 보기"),S("svg",{class:"plus",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 19 19",fill:"none"},[S("path",{d:"M0 9.30469H19",stroke:"white","stroke-width":"2"}),
S("path",{d:"M9.5 0L9.5 19",stroke:"white","stroke-width":"2"})])],-1)])]),_:1},8,["to"])]),S("div",dd,[So(Pe((Kn+1).toString().padStart(2,0))+" ",1),O[9]||(O[9]=S("div",{class:"indicator-line"},null,-1)),So(" "+Pe(wt(qn).length.toString().padStart(2,0)),1)])])],512)]))),128))])]),S("div",gd,[O[11]||(O[11]=S("div",{class:"news-list-title"}," NEWS ",-1)),S("div",vd,[(mt(!0),gr(Gi,null,Co(wt(hn),N=>(mt(),R1(Y,{key:N.id,class:"news",to:`/pr-center/news/${N.id}`},{default:$i(()=>[S("div",_d,[S("img",{src:N.thumbnail,alt:`${N.title}-thumbnail`},null,8,md)]),S("div",wd,Pe(N.title),1)]),_:2},1032,["to"]))),128))]),S("div",xd,[Oo(Y,{to:"/pr-center/news",class:"btn-wrapper sm"},{default:$i(()=>[...O[10]||(O[10]=[S("div",{class:"btn"},[S("span",{class:"font-public"},"See more"),S("svg",{class:"plus",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 19 19",fill:"none"},[S("path",{d:"M0 9.30469H19",stroke:"white","stroke-width":"2"}),
S("path",{d:"M9.5 0L9.5 19",stroke:"white","stroke-width":"2"})])],-1)])]),_:1})])])])],64)}}};
export{Ld as default};

