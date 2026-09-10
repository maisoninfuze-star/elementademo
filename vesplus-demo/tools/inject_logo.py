"""Inject the traced logo (assets/logo/elementa-logo.svg) into index.html between the LOGO markers. Idempotent."""
import re
svg = open('assets/logo/elementa-logo.svg').read()
defs = re.search(r'<defs>(.*)</defs>', svg, re.S).group(1)
oval_stroke = re.search(r'<path id="p-oval-stroke"[^>]*/>', defs).group(0)
sun_strokes = re.search(r'<g id="p-sun-strokes".*?</g>', defs, re.S).group(0)
fills = defs.replace(oval_stroke, '').replace(sun_strokes, '')
block_defs = '<!-- LOGO_DEFS_START --><svg class="logo-defs" aria-hidden="true" focusable="false" width="0" height="0"><defs>' + fills + '</defs></svg><!-- LOGO_DEFS_END -->'
block_sun = '<!-- INTRO_SUN_START -->' + sun_strokes.replace('id="p-sun-strokes"', 'class="sun-strokes"') + '<!-- INTRO_SUN_END -->'
block_oval = '<!-- INTRO_OVAL_START -->' + oval_stroke.replace('id="p-oval-stroke"', 'class="oval-stroke"') + '<!-- INTRO_OVAL_END -->'
h = open('index.html', encoding='utf-8').read()
h = re.sub(r'<!-- LOGO_DEFS_START -->.*?<!-- LOGO_DEFS_END -->', lambda m: block_defs, h, flags=re.S)
h = re.sub(r'<!-- INTRO_SUN_START -->.*?<!-- INTRO_SUN_END -->', lambda m: block_sun, h, flags=re.S)
h = re.sub(r'<!-- INTRO_OVAL_START -->.*?<!-- INTRO_OVAL_END -->', lambda m: block_oval, h, flags=re.S)
open('index.html', 'w', encoding='utf-8').write(h)
print('injected defs', len(block_defs) // 1024, 'KB; sun lines', block_sun.count('<line'), '; oval', len(block_oval), 'chars')
