# vesplus.co.kr — page topology (home)

Source: https://www.vesplus.co.kr (Nuxt 3 / Vue app). Captured 2026-09-09 at 1440×900 and 390×844.
Fonts: Public Sans (300/400/600/700, self-hosted OTF + Google Fonts) and Pretendard (400/500/600/700, self-hosted).
Palette: page #111, black #000, brass accent #B19876, border grey #838383, muted text #A0A0A0, white text.

## Layout shell (all viewports)

```
body                         (font-size 15px, overflow hidden while .lock / .paused)
└ div.layout                 (background #111, height 100%, z-index 1001) ← ScrollSmoother wrapper (≥1025px)
  ├ nav                      (fixed, top 0, padding 1.5625vw, mix-blend-mode difference, z 1001; starts opacity 0 / visibility hidden)
  │   a.logo-home svg        (VESPLUS wordmark, 8.698vw wide)
  │   div.route-list         (About · Portfolios · Careers · PR Center · Contact — hidden ≤1024px)
  │   div.hamburger          (6 spans, shown ≤1024px only, fixed right)
  ├ div.route-list-menu      (≤1024px full-screen black menu, translateX(100%) → 0 when .active)
  ├ div.content              ← ScrollSmoother content (transformed on desktop)
  │   ├ div.loading          (SSR splash placeholder, hidden by JS immediately)
  │   ├ main.home
  │   │   ├ div.pin-spacer > div.content-wrapper   (PINNED for 1100vh desktop / 1500vh mobile; spacer = 12×vh / 16×vh)
  │   │   │   ├ div.title-animation-texts (100vh)
  │   │   │   │   ├ div.title-wrapper (FIXED, full screen, #111, z 1003)  — intro: .text-rail (.text-train first/second/main[logo]) + .description
  │   │   │   │   ├ div.title-top (50vh)      — .title-first "WE CREATE THE PERFECT" (5.208vw) + .title-second "REAL ESTATE MARKET" (6.25vw brass)
  │   │   │   │   └ div.title-bottom (50vh)   — .script-second "A LEADING CONSULTING FIRM  FOR SALES" + .image-rail (.images × 4 cards 40.729×23.542vw) + .scroll-indicator "( SCROLL FOR MORE )"
  │   │   │   ├ div.image-animation-group (absolute, 100vh, opacity 0, z 4)
  │   │   │   │   ├ div.image-grid-group (3×3 grid, 250% × 250vh, perspective 1000) — 9 .image-wrapper, each: before img (B&W) + .after-image-wrapper > img (colour)
  │   │   │   │   ├ div.pre-text-wrapper.first  (rgba(0,0,0,.8) overlay) — "아직 분양 시장은 완벽하지 않습니다"
  │   │   │   │   ├ div.pre-text-wrapper.second — two-column manifesto (.pre-text-left / .pre-text-right) + .animation-btn "완벽한 분양 시장 만들어 가는 과정 보기 +" with drawn SVG border
  │   │   │   │   └ div.info-wrapper (#111) — 4 × .info-group stat cards (분양대행 25건 · 마케팅 기획 19건 · 매출 총액 5600억+ · 영업이익 200억+) + .wrapper-title
  │   │   │   └ div.portfolios (absolute bottom, 100vh, z 3) — 3 × .portfolio-wrapper > .portfolio (full-bleed thumbnail at 50 % brightness, constructor / title / location / "자세히 보기 +" button, indicator "01 — 03")
  │   │   └ div.news-list-wrapper (flow, padding 9.375vw 1.5625vw) — "NEWS" title, 4 × a.news (33 % wide, 17.604vw thumbnails), "See more +" button
  │   └ footer.p-content (1px #838383 top rule at 96.875 %, VESPLUS Inc. logo 17.344vw, 3 social circles, Sitemap links, Office / Contact / Fax / Email, copyright)
  ├ div#portfolioOverlay      (fixed page-transition overlay, unused on the home page → omitted)
  └ div.term-modal            (privacy-policy modal, not reachable from the home page → omitted)
```

Desktop page height: 12 227px = pin-spacer 10 800 (12 × 900) + news 1 119 + footer 308.
Mobile page height (390×844): 15 430px = pin-spacer 13 504 (16 × 844) + news + footer.

## Section order and interaction model

| # | Section | Model | Notes |
|---|---------|-------|-------|
| 0 | Intro (title-wrapper) | time-driven GSAP timeline, body locked | Challenges → Innovation → VESPLUS logo, description typewriter, logo flies to nav position, nav fades in, title-bottom unfolds |
| 1 | Title + image rail | scroll-driven (pinned timeline, scrub 1) | rail slides left 41.51vw per step, each card drops away; whole title fades at "title-disappear" |
| 2 | Image grid | scroll-driven | 9 cards fly in with rotationX -70 / z -900 (random stagger, grid 3×3); overlay text; colour wipes; grid scale .4 → 1 |
| 3 | Manifesto | scroll-driven | pre-text second chars rise, button border draws |
| 4 | Stats | scroll-driven | after-images fade, borders turn grey, grid collapses to 100 %/100vh, cards converge, info-wrapper fades in, 4 cards spread to 24 % wide, counters count up |
| 5 | Portfolios | scroll-driven | each wrapper slides up (yPercent 100 → 0) while its inner .portfolio slides down (−100 → 0) = parallax reveal; 3 slides |
| 6 | News | static flow | hover: none defined |
| 7 | Footer | static flow | |

## Z-order
title-wrapper 1003 > nav 1001 = layout 1001 > image-animation-group 4 (set to 2 after stats) > portfolios 3 > info-wrapper 3 > pre-text 2 > image-grid 1.
