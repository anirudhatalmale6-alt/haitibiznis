#!/usr/bin/env python3
"""
Renders one 1200x630 link-preview card per ecosystem tab.

Why generated and not hand-made: WhatsApp and Facebook show this image, not
the page. Three tabs of the same brand have to look like a set, and the only
way to guarantee that is to draw them from one template.

Run:  python3 build/build_og.py     (from the repo root)
"""
import pathlib, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets"

CARDS = [
    dict(slug="msouwout", name="MsouWout", logo="msouwout-logo-2026.png",
         a="#D21034", a2="#8E0A22", emoji="\U0001F6F5",
         tag="RIDES &amp; DELIVERY",
         head="Verified motos and cars<br>across <em>Haiti</em>",
         chips=["\U0001F6F5 Moto", "\U0001F697 Machin", "\U0001F4E6 Livrezon", "\U0001F69B Logistics"]),
    dict(slug="myplopplop", name="MyPlopPlop", logo="myplopplop-logo-new.png",
         a="#00209F", a2="#001566", emoji="\U0001F6D2",
         tag="ONLINE MARKETPLACE",
         head="Buy, sell and open<br>your own <em>store</em>",
         chips=["\U0001F3EA Boutik", "\U0001F4E6 Livrezon", "\U0001F30E Dyaspora", "\U0001F4B3 Peman"]),
    dict(slug="lajanmaker", name="LajanMaker", logo="lajanmaker-logo.png",
         a="#128A4A", a2="#0B5F33", emoji="\U0001F393",
         tag="LEARN • SELL • EARN",
         head="Training, digital products<br>and <em>commissions</em>",
         chips=["\U0001F4DA Fòmasyon", "\U0001F4B0 Komisyon", "\U0001F4F2 App la", "\U0001F680 Biznis"]),
]

TPL = """<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{font-family:'Plus Jakarta Sans',sans-serif;color:#fff;position:relative;display:flex;align-items:center;
  background:radial-gradient(820px 520px at 84% 14%,rgba(255,255,255,.16),transparent 62%),
             linear-gradient(155deg,{a} 0%,{a2} 100%)}}
.stripe{{position:absolute;top:0;left:0;right:0;height:9px;
  background:linear-gradient(90deg,#00209F 0 50%,#D21034 50% 100%)}}
.dots{{position:absolute;inset:0;opacity:.09;
  background-image:radial-gradient(#fff 1.4px,transparent 1.4px);background-size:34px 34px}}
.blob{{position:absolute;right:-110px;bottom:-150px;width:430px;height:430px;border-radius:50%;
  background:rgba(255,255,255,.08)}}
.wrap{{position:relative;padding:0 76px;display:flex;align-items:center;gap:56px;width:100%}}
.left{{flex:1;min-width:0}}
.brand{{display:flex;align-items:center;gap:18px;margin-bottom:26px}}
.brand img{{width:88px;height:88px;border-radius:24px;background:#fff;padding:9px;
  box-shadow:0 14px 34px rgba(0,0,0,.28)}}
.brand b{{font-size:2.5rem;font-weight:900;letter-spacing:-.02em}}
.tag{{display:inline-block;font-size:.86rem;font-weight:800;letter-spacing:.19em;
  background:rgba(255,255,255,.19);padding:9px 19px;border-radius:999px;margin-bottom:20px}}
h1{{font-family:'DM Serif Display',Georgia,serif;font-size:3.5rem;line-height:1.08;letter-spacing:-.01em}}
h1 em{{font-style:italic;color:#FFD84D}}
.chips{{display:flex;gap:11px;margin-top:32px;flex-wrap:wrap}}
.chip{{font-size:1rem;font-weight:700;padding:10px 19px;border-radius:999px;
  background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.26)}}
.emoji{{font-size:12rem;line-height:1;filter:drop-shadow(0 22px 44px rgba(0,0,0,.45))}}
.foot{{position:absolute;left:76px;bottom:38px;display:flex;align-items:center;gap:11px;
  font-size:1.05rem;font-weight:700;color:rgba(255,255,255,.72)}}
.foot img{{width:30px;height:30px;border-radius:8px}}
</style>
<div class="stripe"></div><div class="dots"></div><div class="blob"></div>
<div class="wrap">
  <div class="left">
    <div class="brand"><img src="{logo}"><b>{name}</b></div>
    <div class="tag">{tag}</div>
    <h1>{head}</h1>
    <div class="chips">{chips}</div>
  </div>
  <div class="emoji">{emoji}</div>
</div>
<div class="foot"><img src="{icon}"> haitibiznis.com/{slug}</div>
"""


def main():
    from playwright.sync_api import sync_playwright
    from PIL import Image
    import tempfile, os

    icon = (OUT / "haitibiznis-icon.png").as_uri()
    tmp = pathlib.Path(tempfile.mkdtemp())

    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
        for c in CARDS:
            html = TPL.format(
                a=c["a"], a2=c["a2"], name=c["name"], tag=c["tag"], head=c["head"],
                emoji=c["emoji"], slug=c["slug"], icon=icon,
                logo=(OUT / c["logo"]).as_uri(),
                chips="".join('<div class="chip">%s</div>' % x for x in c["chips"]),
            )
            f = tmp / (c["slug"] + ".html")
            f.write_text(html, encoding="utf-8")
            pg.goto(f.as_uri())
            pg.wait_for_timeout(2200)
            png = tmp / (c["slug"] + ".png")
            pg.screenshot(path=str(png))
            # WhatsApp refuses preview images much over ~300KB, so save as JPEG
            dst = OUT / ("og-tab-%s.jpg" % c["slug"])
            Image.open(png).convert("RGB").save(dst, quality=88, optimize=True)
            print("wrote assets/og-tab-%s.jpg  %d bytes" % (c["slug"], os.path.getsize(dst)))
        b.close()


if __name__ == "__main__":
    main()
