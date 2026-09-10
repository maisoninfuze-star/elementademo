# vesplus.co.kr — behaviours (extracted from the page bundle `_nuxt/BMRAm2b8.js` and the layout `_nuxt/vhtpTbsT.js`)

The site uses GSAP with ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin and MotionPathPlugin. All timing below is verbatim from the source.

## Smooth scroll
- `gsap.matchMedia("(min-width: 1025px)")` → `ScrollSmoother.create({ wrapper: .layout, content: .content, ignoreMobileResize: true, smooth: 1.75, effects: false, smoothTouch: false })`.
- ≤1024px: native scrolling, no smoother.
- `body.lock` / `body.paused` = `overflow:hidden; touch-action:none; height:100%!important`. Body is locked during the intro and while the mobile menu is open (`smoother.paused(true)` on desktop).
- On mount: `window.scrollTo(0,0)` instantly, `body.lock` added, `.loading` set to `display:none`.

## Intro timeline (autoplays once, desktop values; mobile differences in brackets)
Text splits: `.title-first, .title-second` → chars (`.char`); `.script-second` → chars [mobile: `.script-second .line`]; `.pre-text-center-wrapper .p` → chars; `.animation-btn span` → chars.
`rel = MotionPathPlugin.getRelativePosition(.text-rail .logo, .logo-home, [.5,1], [.5,0])`, trains = `.text-train` ×3.

```
tl.fromTo(train0,{yPercent:0},{yPercent:-100,ease:none,duration:1,delay:.5})
  .fromTo(train1,{yPercent:100},{yPercent:0,ease:none,duration:1,delay:.5},"-=1.5")
  .fromTo(train2,{yPercent:100},{yPercent:0,ease:none,duration:1,delay:.5})
  .to(train1,{yPercent:-100,ease:none,duration:1,delay:.5},"-=1.5")
  .to(frameObj,{frame:10,snap:"frame",duration:1,ease:none})            // description text steps through FRAMES[]
  .to(".title-wrapper .description",{opacity:1,height:0,duration:1,ease:none})
  .to(.text-rail,{x:"+="+rel.x,y:"+="+rel.y,duration:1,ease:none})
  .to(".text-train.main .logo",{width:"8.698vw" [22.4vw],duration:1,ease:none},"-=1")
  .fromTo("nav",{autoAlpha:0},{autoAlpha:1,duration:.5,ease:power2.inOut})
  .to(".title-wrapper",{autoAlpha:0,duration:.25,ease:power2.inOut},"-=.5")
  .fromTo(".title-bottom",{height:0},{height:"50vh" [60dvh],duration:.5,ease:power2.in,onComplete: body.lock removed},"-=.5")
  .fromTo(titleChars,{yPercent:100},{yPercent:0,duration:.5,ease:power2.inOut,stagger:.025},"label-1")
  .fromTo(scriptChars,{yPercent:100},{yPercent:0,duration:.5,ease:power2.inOut,stagger:.025},"label-1")
  .fromTo(".images .image",{yPercent:100,opacity:0},{yPercent:0,opacity:1,duration:.5,ease:power2.inOut,stagger:.025},"label-1")
  .from(".scroll-indicator",{opacity:0,duration:.5,ease:power2.inOut},"label-1")
```
FRAMES = "for a perfect real estate market", "fo a …", "f a …", " a …", "c a …", "cr a …", "cre a …", "crea a …", "creat a …", "create a …", "creates a perfect real estate market".

## Scroll timeline (pinned)
`scrollTrigger:{ trigger:".content-wrapper", start:"top top", end:"1200% bottom" [1600% bottom], scrub:1, pin:true, invalidateOnRefresh:true }` → pin distance 11×vh (desktop) / 15×vh (mobile).

```
.to(".title-bottom .images",{x:"-=41.51vw" [113.87vw],duration:1,ease:none,delay:.5})
.to(".title-bottom .images .image:nth-child(1)",{yPercent:100,opacity:0,duration:1,ease:none,delay:.5},"-=1.5")
  … same pair for :nth-child(2) and (3) …
.to(".title-bottom .images",{x:"-=41.51vw",duration:1,ease:none,delay:.5},"title-disappear")
.to(".title-bottom .images .image:nth-child(4)",{yPercent:100,opacity:0,duration:1,ease:none,delay:.5},"title-disappear")
.to(titleChars,{yPercent:100,duration:.5,ease:power2.inOut,stagger:.025},"title-disappear")
.to(scriptChars,{yPercent:100,duration:.5,ease:power2.inOut,stagger:.025},"title-disappear")
.to(".text-train.main",{yPercent:100,duration:.5,ease:power2.inOut},"title-disappear")
.to(".title-animation-texts",{opacity:0,duration:.5,ease:power2.inOut},"title-disappear")
.fromTo(".image-animation-group",{opacity:0},{opacity:1,duration:1,ease:none},"title-disappear")
.fromTo(".image-grid-group .image-wrapper",{y:innerHeight,rotationX:-70,transformOrigin:"50% 0%",z:-900,autoAlpha:0},{duration:1,stagger:{amount:.4,from:"random",grid:[3,3]},y:0,z:0,rotationX:0,autoAlpha:1,ease:"sin"})
.fromTo(".pre-text-wrapper.first",{autoAlpha:0},{autoAlpha:1,duration:1,ease:none})
.fromTo(".opacity-text",{autoAlpha:0,color:"#FFF"},{autoAlpha:1,color:"#B19876",duration:1,ease:none})
.to(".pre-text-wrapper.first",{autoAlpha:0,delay:2 [no delay on mobile],duration:1,ease:none})
.fromTo(".after-image-wrapper",{xPercent:100},{xPercent:0,duration:1,stagger:.5,ease:power2.inOut},"scene.image-convert")
.fromTo(".after-image-wrapper img",{xPercent:-100},{xPercent:0,stagger:.5,duration:1,ease:power2.inOut},"scene.image-convert")
.fromTo(".image-grid-group",{transform:"scale3d(.4,.4,1)"},{transform:"scale3d(1,1,1)",duration:1,ease:none})
.fromTo(".pre-text-wrapper.second",{autoAlpha:0},{autoAlpha:1,duration:1,ease:none})
.fromTo(preChars,{yPercent:100},{yPercent:0,duration:1,ease:power2.inOut,stagger:.025})
.fromTo(btnChars,{yPercent:100},{yPercent:0,duration:1,ease:power2.inOut,stagger:.025})
.fromTo(".animation-btn .svg-border rect",{drawSVG:"0%"},{drawSVG:"100%",duration:1,ease:power2.inOut})
.to(preChars,{autoAlpha:0,duration:1,ease:power2.inOut},"a-1")
.to(".pre-text-wrapper.second",{opacity:0,duration:1,ease:none},"a-1")
.fromTo(".after-image-wrapper img",{autoAlpha:1},{autoAlpha:0,duration:1,ease:none},"a-1")
.fromTo(".image-grid-group .image-wrapper",{border:"1px solid #111"},{border:"1px solid #838383",duration:1,ease:none},"a-1")
.to(".image-grid-group",{width:"100%",height:"100vh",transform:"scale3d(1,1,1)",immediateRender:false,duration:1,ease:none})   [mobile: transform only]
.to(".image-grid-group .image-wrapper",{stagger:{amount:.4,from:"random",grid:[3,3]},xPercent:i%3==0?102:i%3==2?-102:0,yPercent:i<3?103:i>5?-103:0,duration:1,ease:none},"scene.card-shuffle")   [mobile ±104]
.fromTo(".info-wrapper",{autoAlpha:0},{autoAlpha:1,duration:.25,ease:none})
.to(".info-wrapper .info-group",{width:"24%",height:"24%",duration:1,ease:power2.inOut})     [mobile width 80%, height 18%]
.fromTo(".info-group:nth-child(n)",{top:"50%",yPercent:-50,xPercent:-50,left:"50%"},{top:"50%",yPercent:-50,left:0.8%/25.6%/50.4%/75.2%,xPercent:0,duration:1,ease:power2.inOut},"scene.card-order")
      [mobile: from bottom:50%,yPercent:50,xPercent:-50,left:50% → bottom 68%/47%/26%/5%, yPercent 0, xPercent -50]
.fromTo(".info-group .info-title",{autoAlpha:0},{autoAlpha:1,duration:1,ease:none})
.fromTo(".info-group .info-val",{autoAlpha:0},{autoAlpha:1,duration:1,ease:none},"-=1")
.fromTo(".info-wrapper .wrapper-title",{autoAlpha:0},{autoAlpha:1,duration:1,ease:none},"-=1")
.to(".value.anima-increment",{textContent:i=>VALUES[i],duration:1,snap:{textContent:1}})      VALUES = 25, 19, 5600, 200
.set(".image-animation-group",{zIndex:2})
desktop: .fromTo(".portfolio-wrapper",{yPercent:100},{yPercent:0,duration:1,ease:none,delay:i=>i*1.5+.5},"portfolios")
         .fromTo(".portfolio-wrapper .portfolio",{yPercent:-100},{yPercent:0,duration:1,ease:none,delay:i=>i*1.5+.5},"portfolios")
mobile:  per wrapper i: .fromTo(wrapper,{yPercent:100},{yPercent:0,duration:2,ease:none,delay:1},"portfolios-i").fromTo(.portfolio,{yPercent:-100},{yPercent:0,duration:2,ease:none,delay:1},"portfolios-i")
```

## Hover / click
- Nav links: `transition all .3s`; on hover or `.router-link-active` the 13×13 plus icon (brass #B19876) fades in (`opacity 0 → 1`) and rotates 90°. Text stays white 1.042vw / 700.
- `.btn` ("자세히 보기", "See more"): border 1px white, radius 26.042vw, padding 1.042vw 3.125vw (`.sm`: .625vw 3.125vw); on hover the plus icon translates .3125vw and scales 1.1 (`transition transform .3s`).
- `.animation-btn` (manifesto CTA): no border colour change; the rounded rect border is drawn by DrawSVG during the scroll timeline; click → /about.
- Hamburger (≤1024px): 6 spans → X (rotate ±45°, middle bars slide out); `.route-list-menu` slides in from the right (`transform .3s`), body paused. Menu closes on route change.
- Footer links: no hover styles defined.

## Responsive
- Breakpoint 1024px for layout/nav/index; footer uses 1240px.
- ≤1024: nav padding 4.27vw, logo 22.133vw, route-list hidden, hamburger visible; title sizes 6.933vw / 8.533vw; rail cards 113.87×65.6vw; grid becomes flex-wrap 130vw tall with 32 % cards; stat cards stacked (80 % × 18 %); portfolios: thumbnail height auto, indicator absolute bottom-right; news cards 100 % wide with 51.47vw thumbnails; footer stacks left-aligned.
