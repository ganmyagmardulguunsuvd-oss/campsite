import urllib.parse,re
exec(open('gen.py').read().split('import base64')[0])
def uri(svg): return "url(\"data:image/svg+xml,"+urllib.parse.quote(re.sub(r'\s+',' ',svg),safe=" =:/,'-.()")+"\")"
def corner_t(color,tr):
    inner=corner(color).split('>',1)[1].rsplit('</svg>',1)[0]
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96"><g transform="{tr}">{inner}</g></svg>'
em_gold=emblem('#e6b955','#e6b955','#132a55')
em_soft=emblem('#c8962b','#c8962b','#fffaf0')
css=f"""
/* ===== Уламжлалт хээ угалз (өлзий, үүлэн хээ, булангийн угалз, угалзан хүрээ) — өөрсдөө зурсан SVG ===== */
:root{{
  --ulzii:{uri(em_gold)};
  --ulzii-soft:{uri(em_soft)};
  --corner-tr:{uri(corner_t('#d9b768','translate(96,0) scale(-1,1)'))};
  --corner-bl:{uri(corner_t('#d9b768','translate(0,96) scale(1,-1)'))};
  --ugalz:{uri(band('#c8962b'))};
  --ugalz-red:{uri(band('#e6b955','#b5262c'))};
}}
header .wrap::after{{content:'';position:absolute;right:10px;bottom:-14px;width:170px;height:144px;background:var(--ulzii) center/contain no-repeat;opacity:.9;pointer-events:none}}
header h1,header p,.byline{{position:relative;z-index:1;max-width:calc(100% - 190px)}}
@media(max-width:720px){{header .wrap::after{{width:96px;height:82px;right:4px;bottom:-10px;opacity:.35}}header h1,header p,.byline{{max-width:100%}}}}
main .card{{background-image:var(--corner-tr),var(--corner-bl);background-repeat:no-repeat;background-position:top 8px right 8px,bottom 8px left 8px;background-size:44px 44px}}
.opts{{border-top:none;position:relative;padding-top:22px}}
.opts::before{{content:'';position:absolute;left:0;right:0;top:0;height:20px;background:var(--ugalz) repeat-x center/auto 16px;opacity:.55}}
.modal-box::before{{background:var(--ugalz-red) repeat-x center/auto 14px;height:14px;opacity:1}}
.modal-box{{border-top:none;padding-top:30px}}
.site-foot .foot-copy{{position:relative;padding-top:64px}}
.site-foot .foot-copy::before{{content:'';position:absolute;left:50%;top:10px;transform:translateX(-50%);width:62px;height:52px;background:var(--ulzii) center/contain no-repeat;opacity:.8}}
.empty::before{{content:'';display:block;width:70px;height:60px;margin:0 auto 10px;background:var(--ulzii-soft) center/contain no-repeat;opacity:.45}}
"""
open('/tmp/hee/hee.css','w').write(css)
fav=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 80 80"><rect x="-40" y="-40" width="80" height="80" rx="16" fill="#132a55"/><g transform="scale(.82)">{ulzii("#e6b955",5,"#132a55")}</g></svg>'
open('/tmp/hee/fav.svg','w').write(fav)
