import math
G='#c8962b'
def ulzii(stroke=G, w=4.2, outline='#132a55'):
    L=[-24,-8,8,24]; E=32; r=8
    d=[]
    for v in L:
        d.append(f"M{v} {-E}V{E}"); d.append(f"M{-E} {v}H{E}")
    # loops: pairs (-24,-8),(8,24) on each side
    for a,b in [(-24,-8),(8,24)]:
        c=(a+b)/2
        d.append(f"M{a} {-E}A{r} {r} 0 0 1 {b} {-E}")      # top (bulge up)
        d.append(f"M{a} {E}A{r} {r} 0 0 0 {b} {E}")        # bottom
        d.append(f"M{-E} {a}A{r} {r} 0 0 0 {-E} {b}")      # left
        d.append(f"M{E} {a}A{r} {r} 0 0 1 {E} {b}")        # right
    p=' '.join(d)
    return f'<g transform="rotate(45)" fill="none" stroke-linecap="round"><path d="{p}" stroke="{outline}" stroke-width="{w+2.6}"/><path d="{p}" stroke="{stroke}" stroke-width="{w}"/></g>'
def cloud_half():
    return ("M0 -10 C8 -22 26 -20 28 -6 C30 5 19 9 14 3 C10 -2 15 -8 20 -4 "
            "M28 -6 C36 -15 52 -9 50 3 C49 11 40 12 38 6 C36 1 41 -1 43 3 "
            "M50 3 C57 6 61 11 60 17")
def cloudpair(color):
    h=cloud_half()
    return (f'<g fill="none" stroke="{color}" stroke-width="4.2" stroke-linecap="round">'
            f'<path d="{h}"/><path transform="scale(-1,1)" d="{h}"/><path d="M-60 17H60"/></g>')
def emblem(color=G, knot=G, outline='#132a55'):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-66 -86 132 112" width="132" height="112">
<g transform="translate(0,-46) scale(.74)">{ulzii(knot,4.4,outline)}</g>
<g transform="translate(0,6)">{cloudpair(color)}</g></svg>'''
def corner(color=G):
    p=("M4 92V4H92 M11 92V11H92 "
       "M11 46 C30 46 46 30 46 11 "
       "M46 11 C46 34 70 40 72 27 C74 16 60 15 58 23 C57 29 64 30 65 25 "
       "M11 46 C34 46 40 70 27 72 C16 74 15 60 23 58 C29 57 30 64 25 65 "
       "M18 18 C32 18 32 32 24 32 C17 32 17 24 24 24 "
       "M72 27 C80 36 86 26 92 30 M27 72 C36 80 26 86 30 92")
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96"><path d="{p}" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def band(color=G, bg='none'):
    p=("M0 15 C8 15 10 4 18 4 C25 4 26 12 20 12 C16 12 16 8 19 8 "
       "M18 4 C28 4 30 15 40 15 "
       "M40 15 C48 15 50 4 58 4 M40 15 C32 15 30 26 22 26")
    p=("M0 14 C7 14 9 4 16 4 C23 4 23 12 18 12 C15 12 15 8 18 8 "
       "M16 4 C24 4 26 14 32 14 C38 14 40 4 48 4 "
       "M32 14 C25 14 25 6 30 6 C33 6 33 10 30 10")
    p=("M0 10 C6 10 8 3 14 3 C20 3 20 10 15 10 C12 10 12 6 15 6 "
       "M14 3 C22 3 22 17 30 17 C36 17 36 10 31 10 C28 10 28 14 31 14 "
       "M30 17 C38 17 40 10 48 10")
    r=f'<rect width="48" height="20" fill="{bg}"/>' if bg!='none' else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="48" height="20" viewBox="0 0 48 20">{r}<path d="{p}" fill="none" stroke="{color}" stroke-width="2.2" stroke-linecap="round"/></svg>'
import base64,urllib.parse
open('sheet.html','w').write(f'''<html><body style="background:#132a55;margin:20px;display:flex;flex-wrap:wrap;gap:30px;align-items:center">
<div>{emblem()}</div>
<div style="background:#fffaf0;padding:10px">{emblem('#b5262c','#c8962b')}</div>
<div style="background:#fffaf0;padding:10px">{corner()}</div>
<div style="width:300px;height:20px;background:#fffaf0 url('data:image/svg+xml,{urllib.parse.quote(band())}')"></div>
<div style="width:300px;height:20px;background-image:url('data:image/svg+xml,{urllib.parse.quote(band('#e6b955','#b5262c'))}')"></div>
</body></html>''')
