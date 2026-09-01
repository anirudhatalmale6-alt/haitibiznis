#!/usr/bin/env python3
"""
Builds the three HaitiBiznis ecosystem tabs:

    /eko/msouwout/     /eko/myplopplop/     /eko/lajanmaker/

One generator, because the whole point of the brief is that these three
pages are the SAME brand wearing three hats. Editing them by hand would
let them drift apart within a week, and the social handles have to live
in exactly one place or they will end up disagreeing with each other.

Run:  python3 build/build_tabs.py     (from the repo root)

NOTE on the /eko/ prefix. The obvious names were all taken by something
that is already in the wild:

  msouwout.html   - the "request a ride" screen; three pages link to it
  /lajanmaker/    - the target of the PRINTED QR code. It is a redirector
                    to /pos/, and its whole reason for existing is that the
                    flyers, cards and videos already handed out encode that
                    exact URL. It can never be repurposed.

Renaming a live URL to make room for a new one breaks whatever has already
been shared - and in the QR case, paper that cannot be recalled. So the
three tabs get their own namespace instead.
"""
import os
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# SOCIAL  -  one main HaitiBiznis account per platform, per the brief.
#
# A handle set to None renders NOTHING. That is deliberate: a social icon
# that leads to "this account doesn't exist" is worse than no icon, and it
# is the owner's brand that takes the hit, not mine.
#
# Checked 1 Sep 2026:
#   tiktok.com/@haitibiznis  ->  "Couldn't find this account"  (does not exist)
#   facebook / instagram     ->  both bounce to a login wall, so the handle
#                                cannot be confirmed from outside. Waiting on
#                                the real links rather than guessing a slug.
# ---------------------------------------------------------------------------
def _read_social():
    """Read the handles out of js/social.js.

    They are NOT duplicated here on purpose. The rest of the site gets its
    icons from that file at runtime; if this generator kept its own copy the
    two would disagree the first time only one of them was updated, and the
    tab pages would quietly be advertising a different Facebook page from
    every other footer on the site.
    """
    import re
    src = (ROOT / "js" / "social.js").read_text(encoding="utf-8")
    block = re.search(r"var SOCIAL = \{(.*?)\};", src, re.S)
    out = {"facebook": None, "instagram": None, "tiktok": None}
    if not block:
        raise SystemExit("js/social.js: could not find the SOCIAL block - refusing "
                         "to guess handles")
    for key in out:
        m = re.search(key + r"\s*:\s*(null|'([^']*)'|\"([^\"]*)\")", block.group(1))
        if m and m.group(1) != "null":
            out[key] = m.group(2) or m.group(3)
    wa = re.search(r"var WHATSAPP\s*=\s*'([^']+)'", src)
    ct = re.search(r"var CONTACT\s*=\s*'([^']+)'", src)
    return out, (wa.group(1) if wa else ""), (ct.group(1) if ct else "")


SOCIAL, WHATSAPP, CONTACT = _read_social()

SOCIAL_ICON = {
    "facebook": ('<path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>', "Facebook"),
    "instagram": ('<rect x="2" y="2" width="20" height="20" rx="5"/>'
                  '<circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2"/>', "Instagram"),
    "tiktok": ('<path d="M16 3v9.2a4.3 4.3 0 1 1-3.3-4.2"/><path d="M16 3a5.2 5.2 0 0 0 5 4.1"/>', "TikTok"),
}

# ---------------------------------------------------------------------------
# The three tabs. Every href below was fetched and returned 200 on 1 Sep 2026 -
# no invented slugs.
# ---------------------------------------------------------------------------
TABS = [
    {
        "slug": "msouwout",
        "emoji": "\U0001F6F5",           # scooter
        "name": "MsouWout",
        "logo": "msouwout-logo-2026.png",
        "accent": "#D21034", "accent2": "#8E0A22",
        "tag": {"ht": "Kous ak Livrezon", "fr": "Course et livraison", "en": "Rides & Delivery",
                "es": "Viajes y entregas", "pt": "Corridas e entregas"},
        "lede": {
            "ht": "Moto ak machin ki verifye, toupatou nan peyi a. Vwayaje an sekirite, oswa fè lajan kòm chofè.",
            "fr": "Motos et voitures vérifiées, partout dans le pays. Voyagez en sécurité, ou gagnez de l'argent comme chauffeur.",
            "en": "Verified motos and cars across the country. Travel safely, or earn as a driver.",
            "es": "Motos y autos verificados en todo el país. Viaja seguro, o gana como conductor.",
            "pt": "Motos e carros verificados em todo o país. Viaje com segurança, ou ganhe como motorista.",
        },
        "cards": [
            {"i": "\U0001F6F5", "href": "https://msouwout.com/",
             "t": {"ht": "Mande yon kous", "fr": "Demander une course", "en": "Request a ride",
                   "es": "Pedir un viaje", "pt": "Pedir uma corrida"},
             "d": {"ht": "Yon moto oswa yon machin nan de minit.",
                   "fr": "Une moto ou une voiture en deux minutes.",
                   "en": "A moto or a car in two minutes.",
                   "es": "Una moto o un auto en dos minutos.",
                   "pt": "Uma moto ou um carro em dois minutos."}},
            {"i": "\U0001F9D1‍\U0001F527", "href": "https://msouwout.com/driver-register.html",
             "t": {"ht": "Vin yon chofè", "fr": "Devenir chauffeur", "en": "Become a driver",
                   "es": "Hazte conductor", "pt": "Seja um motorista"},
             "d": {"ht": "Enskri moto oswa machin ou an epi kòmanse touche.",
                   "fr": "Inscrivez votre moto ou voiture et commencez à gagner.",
                   "en": "Register your moto or car and start earning.",
                   "es": "Registra tu moto o auto y empieza a ganar.",
                   "pt": "Cadastre sua moto ou carro e comece a ganhar."}},
            {"i": "\U0001F6E1️", "href": "https://msouwout.com/security.html",
             "t": {"ht": "Sekirite", "fr": "Sécurité", "en": "Safety", "es": "Seguridad", "pt": "Segurança"},
             "d": {"ht": "Ki jan nou verifye chofè yo epi ki jan pou w pwoteje tèt ou.",
                   "fr": "Comment nous vérifions les chauffeurs et comment vous protéger.",
                   "en": "How we verify drivers, and how to keep yourself safe.",
                   "es": "Cómo verificamos a los conductores y cómo protegerte.",
                   "pt": "Como verificamos os motoristas e como se proteger."}},
            {"i": "\U0001F69B", "href": "https://msouwout.com/logistics.html",
             "t": {"ht": "MsouWout Logistics", "fr": "MsouWout Logistics", "en": "MsouWout Logistics",
                   "es": "MsouWout Logistics", "pt": "MsouWout Logistics"},
             "d": {"ht": "Kamyon, kontenè, grue ak bato pou gwo chajman.",
                   "fr": "Camions, conteneurs, grues et bateaux pour le fret.",
                   "en": "Trucks, containers, cranes and boats for cargo.",
                   "es": "Camiones, contenedores, grúas y barcos para carga.",
                   "pt": "Caminhões, contêineres, guindastes e barcos para carga."}},
        ],
    },
    {
        "slug": "myplopplop",
        "emoji": "\U0001F6D2",
        "name": "MyPlopPlop",
        "logo": "myplopplop-logo-new.png",
        "accent": "#00209F", "accent2": "#001566",
        "tag": {"ht": "Mache an liy", "fr": "Marché en ligne", "en": "Online Marketplace",
                "es": "Mercado en línea", "pt": "Mercado online"},
        "lede": {
            "ht": "Achte, vann, epi louvri pwòp boutik ou an liy — ak livrezon nan tout peyi a.",
            "fr": "Achetez, vendez et ouvrez votre propre boutique en ligne — avec livraison dans tout le pays.",
            "en": "Buy, sell and open your own online store — with delivery across the country.",
            "es": "Compra, vende y abre tu propia tienda en línea — con entrega en todo el país.",
            "pt": "Compre, venda e abra sua própria loja online — com entrega em todo o país.",
        },
        "cards": [
            {"i": "\U0001F3EA", "href": "https://myplopplop.com/marketplace.html",
             "t": {"ht": "Mache a", "fr": "Le marché", "en": "The marketplace",
                   "es": "El mercado", "pt": "O mercado"},
             "d": {"ht": "Tout boutik yo nan yon sèl kote.",
                   "fr": "Toutes les boutiques au même endroit.",
                   "en": "Every store in one place.",
                   "es": "Todas las tiendas en un solo lugar.",
                   "pt": "Todas as lojas em um só lugar."}},
            {"i": "\U0001F4DD", "href": "https://myplopplop.com/merchant/register.html",
             "t": {"ht": "Louvri boutik ou", "fr": "Ouvrir votre boutique", "en": "Open your store",
                   "es": "Abre tu tienda", "pt": "Abra sua loja"},
             "d": {"ht": "Enskri kòm machann — boutik ou kreye menm lè a.",
                   "fr": "Inscrivez-vous comme marchand — votre boutique est créée aussitôt.",
                   "en": "Register as a merchant — your store is created right away.",
                   "es": "Regístrate como comerciante — tu tienda se crea de inmediato.",
                   "pt": "Cadastre-se como comerciante — sua loja é criada na hora."}},
            {"i": "\U0001F4E6", "href": "https://myplopplop.com/shop.html",
             "t": {"ht": "Achte ak livrezon", "fr": "Acheter et livraison", "en": "Shopping & delivery",
                   "es": "Compras y entrega", "pt": "Compras e entrega"},
             "d": {"ht": "Kòmande, peye, epi swiv livrezon an jouk devan pòt ou.",
                   "fr": "Commandez, payez et suivez la livraison jusqu'à votre porte.",
                   "en": "Order, pay, and track delivery to your door.",
                   "es": "Pide, paga y sigue la entrega hasta tu puerta.",
                   "pt": "Peça, pague e acompanhe a entrega até sua porta."}},
            {"i": "\U0001F30E", "href": "https://myplopplop.com/diaspora.html",
             "t": {"ht": "Dyaspora", "fr": "Diaspora", "en": "Diaspora", "es": "Diáspora", "pt": "Diáspora"},
             "d": {"ht": "Voye machandiz bay fanmi ou an Ayiti depi lòt bò dlo.",
                   "fr": "Envoyez des marchandises à votre famille en Haïti depuis l'étranger.",
                   "en": "Send goods to your family in Haiti from abroad.",
                   "es": "Envía productos a tu familia en Haití desde el extranjero.",
                   "pt": "Envie produtos para sua família no Haiti do exterior."}},
        ],
    },
    {
        "slug": "lajanmaker",
        "emoji": "\U0001F393",
        "name": "LajanMaker",
        "logo": "lajanmaker-logo.png",
        "accent": "#128A4A", "accent2": "#0B5F33",
        "tag": {"ht": "Aprann • Vann • Touche", "fr": "Apprendre • Vendre • Gagner",
                "en": "Learn • Sell • Earn", "es": "Aprende • Vende • Gana",
                "pt": "Aprenda • Venda • Ganhe"},
        "lede": {
            "ht": "Fòmasyon, pwodwi dijital ak komisyon — tout sa ou bezwen pou fè lajan ak ekosistèm nan.",
            "fr": "Formation, produits numériques et commissions — tout pour gagner avec l'écosystème.",
            "en": "Training, digital products and commissions — everything you need to earn with the ecosystem.",
            "es": "Formación, productos digitales y comisiones — todo para ganar con el ecosistema.",
            "pt": "Formação, produtos digitais e comissões — tudo para ganhar com o ecossistema.",
        },
        "cards": [
            {"i": "\U0001F4F2", "href": "https://haitibiznis.com/pos/",
             "t": {"ht": "Louvri LajanMaker", "fr": "Ouvrir LajanMaker", "en": "Open LajanMaker",
                   "es": "Abrir LajanMaker", "pt": "Abrir LajanMaker"},
             "d": {"ht": "Aplikasyon an — 7 jou gratis pou kòmanse.",
                   "fr": "L'application — 7 jours gratuits pour commencer.",
                   "en": "The app — 7 days free to get started.",
                   "es": "La aplicación — 7 días gratis para empezar.",
                   "pt": "O aplicativo — 7 dias grátis para começar."}},
            {"i": "\U0001F4B0", "href": "https://haitibiznis.com/koutye.html",
             "t": {"ht": "Parenaj Biznis", "fr": "Parenaj Biznis", "en": "Parenaj Biznis (Affiliate)",
                   "es": "Parenaj Biznis", "pt": "Parenaj Biznis"},
             "d": {"ht": "Envite moun, touche komisyon sou chak enskripsyon.",
                   "fr": "Parrainez, gagnez une commission sur chaque inscription.",
                   "en": "Refer people, earn a commission on every signup.",
                   "es": "Refiere personas, gana comisión por cada registro.",
                   "pt": "Indique pessoas, ganhe comissão a cada cadastro."}},
            {"i": "\U0001F4DA", "href": "https://haitibiznis.com/parenaj.html",
             "t": {"ht": "Fòmasyon", "fr": "Formation", "en": "Training", "es": "Formación", "pt": "Formação"},
             "d": {"ht": "Aprann kijan pou w enskri chofè ak machann, epi kijan pou w peye.",
                   "fr": "Apprenez à inscrire chauffeurs et marchands, et à être payé.",
                   "en": "Learn how to register drivers and merchants, and how you get paid.",
                   "es": "Aprende a registrar conductores y comerciantes, y cómo cobrar.",
                   "pt": "Aprenda a cadastrar motoristas e comerciantes, e como receber."}},
            {"i": "\U0001F680", "href": "https://48hoursready.com",
             "t": {"ht": "Louvri yon biznis", "fr": "Lancer une entreprise", "en": "Start a business",
                   "es": "Iniciar un negocio", "pt": "Abrir um negócio"},
             "d": {"ht": "48HoursReady: monte biznis ou an de jou.",
                   "fr": "48HoursReady : montez votre entreprise en deux jours.",
                   "en": "48HoursReady: set your business up in two days.",
                   "es": "48HoursReady: monta tu negocio en dos días.",
                   "pt": "48HoursReady: monte seu negócio em dois dias."}},
        ],
    },
]

UI = {
    "back":    {"ht": "Tounen nan HaitiBiznis", "fr": "Retour à HaitiBiznis", "en": "Back to HaitiBiznis",
                "es": "Volver a HaitiBiznis", "pt": "Voltar para HaitiBiznis"},
    "follow":  {"ht": "Swiv nou", "fr": "Suivez-nous", "en": "Follow us",
                "es": "Síguenos", "pt": "Siga-nos"},
    "follow_s": {"ht": "Yon sèl kont HaitiBiznis pou tout ekosistèm nan.",
                 "fr": "Un seul compte HaitiBiznis pour tout l'écosystème.",
                 "en": "One HaitiBiznis account for the whole ecosystem.",
                 "es": "Una sola cuenta HaitiBiznis para todo el ecosistema.",
                 "pt": "Uma única conta HaitiBiznis para todo o ecossistema."},
    "wa":      {"ht": "Ekri nou sou WhatsApp", "fr": "Écrivez-nous sur WhatsApp", "en": "Message us on WhatsApp",
                "es": "Escríbenos por WhatsApp", "pt": "Fale conosco no WhatsApp"},
    "other":   {"ht": "Lòt pati nan ekosistèm nan", "fr": "Ailleurs dans l'écosystème",
                "en": "Elsewhere in the ecosystem", "es": "En otras partes del ecosistema",
                "pt": "Em outras partes do ecossistema"},
    "soon":    {"ht": "Paj rezo sosyal yo ap konekte talè.",
                "fr": "Les pages de réseaux sociaux seront connectées bientôt.",
                "en": "The social pages are being connected.",
                "es": "Las páginas de redes sociales se conectarán pronto.",
                "pt": "As páginas de redes sociais serão conectadas em breve."},
}

LANGS = ["ht", "fr", "en", "es", "pt"]


def i18n_attr(key):
    """data-i18n hook + the Kreyol text as the default, matching the rest of the site."""
    return 'data-i18n="%s"' % key


def social_block(tab):
    """The follow bar. Renders only handles that are actually set."""
    links = []
    for k in ("facebook", "instagram", "tiktok"):
        url = SOCIAL.get(k)
        if not url:
            continue
        path, label = SOCIAL_ICON[k]
        links.append(
            '<a class="soc" href="%s" target="_blank" rel="noopener" aria-label="%s" title="%s">'
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
            'stroke-linecap="round" stroke-linejoin="round">%s</svg></a>' % (url, label, label, path)
        )

    icons = ('<div class="socrow">%s</div>' % "".join(links)) if links else \
            ('<p class="socsoon" %s>%s</p>' % (i18n_attr("soc_soon"), UI["soon"]["ht"]))

    wa_text = "Bonjou! Mwen soti sou paj %s nan HaitiBiznis." % tab["name"]
    return """
  <section class="social">
    <h2 class="soch" %s>%s</h2>
    <p class="socsub" %s>%s</p>
    %s
    <a class="wabtn" href="https://wa.me/%s?text=%s" target="_blank" rel="noopener">
      <span>&#128172;</span> <span %s>%s</span>
    </a>
    <a class="mailln" href="mailto:%s">%s</a>
  </section>""" % (
        i18n_attr("soc_follow"), UI["follow"]["ht"],
        i18n_attr("soc_sub"), UI["follow_s"]["ht"],
        icons,
        WHATSAPP, _urlq(wa_text),
        i18n_attr("soc_wa"), UI["wa"]["ht"],
        CONTACT, CONTACT,
    )


def _urlq(s):
    import urllib.parse
    return urllib.parse.quote(s)


def other_tabs(tab):
    out = []
    for o in TABS:
        if o["slug"] == tab["slug"]:
            continue
        out.append(
            '<a class="otab" href="../%s/" style="--a:%s">'
            '<span class="oe">%s</span><b>%s</b><span class="os">%s</span></a>'
            % (o["slug"], o["accent"], o["emoji"], o["name"], o["tag"]["ht"])
        )
    return "".join(out)


def cards(tab):
    out = []
    for c in tab["cards"]:
        ext = ' target="_blank" rel="noopener"' if c["href"].startswith("http") else ""
        out.append(
            '<a class="fcard" href="%s"%s>'
            '<span class="fi">%s</span>'
            '<span class="ft">%s</span>'
            '<span class="fd">%s</span>'
            '<span class="fg">&rarr;</span></a>'
            % (c["href"], ext, c["i"], c["t"]["ht"], c["d"]["ht"])
        )
    return "".join(out)


def i18n_js(tab):
    """One compact dict per page - same shape the rest of the site uses."""
    import json
    d = {}
    for L in LANGS:
        row = {
            "tab_tag": tab["tag"][L],
            "tab_lede": tab["lede"][L],
            "nav_back": UI["back"][L],
            "soc_follow": UI["follow"][L],
            "soc_sub": UI["follow_s"][L],
            "soc_wa": UI["wa"][L],
            "soc_soon": UI["soon"][L],
            "oth_h": UI["other"][L],
        }
        for n, c in enumerate(tab["cards"], 1):
            row["c%d_t" % n] = c["t"][L]
            row["c%d_d" % n] = c["d"][L]
        d[L] = row
    return json.dumps(d, ensure_ascii=False)


PAGE = """<!DOCTYPE html>
<html lang="ht">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="{accent}">
<title>{name} — HaitiBiznis</title>
<meta name="description" content="{lede_en}">
<meta property="og:title" content="{name} — {tag_en} | HaitiBiznis">
<meta property="og:description" content="{lede_en}">
<meta property="og:image" content="https://haitibiznis.com/assets/og-tab-{slug}.jpg?v=1">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://haitibiznis.com/eko/{slug}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="HaitiBiznis">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{name} — {tag_en} | HaitiBiznis">
<meta name="twitter:description" content="{lede_en}">
<meta name="twitter:image" content="https://haitibiznis.com/assets/og-tab-{slug}.jpg?v=1">
<link rel="canonical" href="https://haitibiznis.com/eko/{slug}/">
<link rel="icon" type="image/png" sizes="32x32" href="../../assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../../assets/favicon-16.png">
<link rel="apple-touch-icon" href="../../assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}}
:root{{
  --blue:#00209F;--red:#D21034;--gold:#D4A017;--green:#128A4A;
  --ink:#0C1330;--text:#1C2647;--muted:#6B769A;--line:#E7EBF5;--off:#F4F6FC;
  --body:'Plus Jakarta Sans',system-ui,sans-serif;
  --display:'DM Serif Display',Georgia,serif;
  --a:{accent};--a2:{accent2};
}}
html{{scroll-behavior:smooth}}
body{{font-family:var(--body);background:var(--off);color:var(--text);line-height:1.5;
  overflow-x:hidden;-webkit-font-smoothing:antialiased}}
a{{text-decoration:none;color:inherit}}
img{{max-width:100%;display:block}}
.wrap{{max-width:1080px;margin:0 auto;padding:0 18px}}
.flag-stripe{{height:5px;background:linear-gradient(90deg,var(--blue) 0 50%,var(--red) 50% 100%)}}

/* top bar */
.topbar{{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:40}}
.topbar-inner{{max-width:1080px;margin:0 auto;padding:11px 18px;display:flex;align-items:center;
  justify-content:space-between;gap:12px}}
.brand{{display:flex;align-items:center;gap:9px;font-weight:800;font-size:1.03rem;color:var(--ink)}}
.brand img{{width:29px;height:29px;border-radius:8px}}
.brand em{{font-style:normal;color:var(--red)}}
.lang{{display:flex;gap:2px;background:var(--off);border-radius:999px;padding:3px}}
.lang button{{border:0;background:transparent;font:inherit;font-size:.72rem;font-weight:700;
  color:var(--muted);padding:5px 8px;border-radius:999px;cursor:pointer}}
.lang button.on{{background:var(--a);color:#fff}}

/* hero */
.hero{{background:linear-gradient(155deg,var(--a) 0%,var(--a2) 100%);color:#fff;
  padding:40px 0 46px;position:relative;overflow:hidden}}
.hero::after{{content:'';position:absolute;right:-70px;bottom:-90px;width:280px;height:280px;
  border-radius:50%;background:rgba(255,255,255,.07)}}
.hero .wrap{{position:relative;z-index:1}}
.back{{display:inline-flex;align-items:center;gap:7px;font-size:.83rem;font-weight:700;
  color:rgba(255,255,255,.82);margin-bottom:22px}}
.back:hover{{color:#fff}}
.hlogo{{width:74px;height:74px;border-radius:20px;background:#fff;padding:8px;
  box-shadow:0 12px 30px rgba(0,0,0,.22);margin-bottom:16px}}
.hero h1{{font-family:var(--display);font-size:clamp(2.1rem,7vw,3rem);line-height:1.06;
  letter-spacing:-.01em;margin-bottom:6px}}
.htag{{display:inline-block;font-size:.76rem;font-weight:800;letter-spacing:.13em;
  text-transform:uppercase;color:#fff;background:rgba(255,255,255,.17);
  padding:6px 13px;border-radius:999px;margin-bottom:14px}}
.hlede{{font-size:1.03rem;color:rgba(255,255,255,.9);max-width:560px}}

/* feature cards */
.fgrid{{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin:-26px 0 0;
  position:relative;z-index:2}}
.fcard{{background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px 17px 16px;
  display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(12,19,48,.07);
  transition:transform .16s ease,box-shadow .16s ease}}
.fcard:hover{{transform:translateY(-3px);box-shadow:0 16px 40px rgba(12,19,48,.13)}}
.fi{{font-size:1.85rem;line-height:1;margin-bottom:11px}}
.ft{{font-weight:800;font-size:1.02rem;color:var(--ink);margin-bottom:5px}}
.fd{{font-size:.87rem;color:var(--muted);flex:1}}
.fg{{margin-top:12px;font-weight:800;color:var(--a);font-size:1.05rem}}

.sec{{padding:44px 0}}
.sech{{font-family:var(--display);font-size:1.6rem;color:var(--ink);margin-bottom:4px}}
.secs{{font-size:.92rem;color:var(--muted);margin-bottom:20px}}

/* social */
.social{{background:#fff;border:1px solid var(--line);border-radius:22px;
  padding:30px 22px;text-align:center;box-shadow:0 10px 30px rgba(12,19,48,.06)}}
.soch{{font-family:var(--display);font-size:1.55rem;color:var(--ink);margin-bottom:5px}}
.socsub{{font-size:.9rem;color:var(--muted);margin-bottom:20px}}
.socrow{{display:flex;justify-content:center;gap:12px;margin-bottom:20px}}
.soc{{width:50px;height:50px;border-radius:15px;display:grid;place-items:center;
  background:var(--off);border:1px solid var(--line);color:var(--ink);transition:.16s}}
.soc:hover{{background:var(--a);color:#fff;border-color:var(--a);transform:translateY(-2px)}}
.soc svg{{width:23px;height:23px}}
.socsoon{{font-size:.85rem;color:var(--muted);background:var(--off);border:1px dashed #C9D2E6;
  border-radius:12px;padding:12px 14px;margin-bottom:20px}}
.wabtn{{display:inline-flex;align-items:center;gap:9px;background:#25D366;color:#fff;
  font-weight:800;font-size:.96rem;padding:14px 24px;border-radius:999px;
  box-shadow:0 8px 22px rgba(37,211,102,.35)}}
.wabtn:hover{{filter:brightness(1.05)}}
.mailln{{display:block;margin-top:14px;font-size:.86rem;font-weight:600;color:var(--muted)}}
.mailln:hover{{color:var(--a)}}

/* other tabs */
.otabs{{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}}
.otab{{background:#fff;border:1px solid var(--line);border-left:4px solid var(--a);
  border-radius:16px;padding:17px;display:block;transition:.16s}}
.otab:hover{{transform:translateY(-2px);box-shadow:0 12px 30px rgba(12,19,48,.1)}}
.oe{{font-size:1.5rem;display:block;margin-bottom:7px}}
.otab b{{display:block;font-size:1rem;color:var(--ink);margin-bottom:2px}}
.os{{font-size:.82rem;color:var(--muted)}}

footer{{background:var(--ink);color:#fff;padding:30px 0;margin-top:14px}}
footer .wrap{{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between}}
.fbrand{{display:flex;align-items:center;gap:9px;font-weight:800}}
.fbrand img{{width:26px;height:26px;border-radius:7px}}
.fbrand em{{font-style:normal;color:#FF6B84}}
.fnote{{font-size:.8rem;color:rgba(255,255,255,.6)}}

@media(max-width:560px){{
  .fgrid{{grid-template-columns:1fr}}
  .otabs{{grid-template-columns:1fr}}
  .hero{{padding:30px 0 40px}}
}}
</style>
</head>
<body>

<div class="flag-stripe"></div>

<header class="topbar">
  <div class="topbar-inner">
    <a href="../../" class="brand">
      <img src="../../assets/haitibiznis-icon.png" alt="HaitiBiznis">
      <b>Haiti<em>Biznis</em></b>
    </a>
    <div class="lang" id="langBar">
      <button data-lang="ht" class="on">HT</button>
      <button data-lang="fr">FR</button>
      <button data-lang="en">EN</button>
      <button data-lang="es">ES</button>
      <button data-lang="pt">PT</button>
    </div>
  </div>
</header>

<section class="hero">
  <div class="wrap">
    <a class="back" href="../../"><span>&larr;</span> <span data-i18n="nav_back">{back_ht}</span></a>
    <img class="hlogo" src="../../assets/{logo}" alt="{name}">
    <span class="htag" data-i18n="tab_tag">{tag_ht}</span>
    <h1>{emoji} {name}</h1>
    <p class="hlede" data-i18n="tab_lede">{lede_ht}</p>
  </div>
</section>

<div class="wrap">
  <div class="fgrid">
{cards}
  </div>
</div>

<div class="wrap sec">
{social}
</div>

<div class="wrap sec" style="padding-top:0">
  <h2 class="sech" data-i18n="oth_h">{other_ht}</h2>
  <p class="secs">HaitiBiznis</p>
  <div class="otabs">
{otabs}
  </div>
</div>

<footer>
  <div class="wrap">
    <a class="fbrand" href="../../">
      <img src="../../assets/haitibiznis-icon.png" alt=""><span>Haiti<em>Biznis</em></span>
    </a>
    <div class="fnote">&copy; 2026 HaitiBiznis — {tag_en}</div>
  </div>
</footer>

<script>
/* i18n: same contract as the rest of the site - data-i18n keys, choice kept
   in localStorage so a language picked on one tab survives to the next */
var I18N = {i18n};
function applyLang(L){{
  if(!I18N[L]) L='ht';
  document.documentElement.lang = L;
  document.querySelectorAll('[data-i18n]').forEach(function(el){{
    var v = I18N[L][el.getAttribute('data-i18n')];
    if(v) el.textContent = v;
  }});
  /* the feature cards are numbered c1..c4 in source order */
  document.querySelectorAll('.fcard').forEach(function(card, i){{
    var t = I18N[L]['c'+(i+1)+'_t'], d = I18N[L]['c'+(i+1)+'_d'];
    if(t) card.querySelector('.ft').textContent = t;
    if(d) card.querySelector('.fd').textContent = d;
  }});
  document.querySelectorAll('#langBar button').forEach(function(b){{
    b.classList.toggle('on', b.dataset.lang === L);
  }});
  try{{ localStorage.setItem('hb_lang', L); }}catch(e){{}}
}}
document.getElementById('langBar').addEventListener('click', function(e){{
  var b = e.target.closest('button'); if(b) applyLang(b.dataset.lang);
}});
(function(){{
  var L = null;
  try{{ L = localStorage.getItem('hb_lang'); }}catch(e){{}}
  if(!L){{
    var n = (navigator.language||'').slice(0,2).toLowerCase();
    L = ({{fr:'fr',en:'en',es:'es',pt:'pt'}})[n] || 'ht';
  }}
  applyLang(L);
}})();
</script>
</body>
</html>
"""


def build():
    made = []
    for tab in TABS:
        out = ROOT / "eko" / tab["slug"]
        out.mkdir(parents=True, exist_ok=True)
        html = PAGE.format(
            slug=tab["slug"], name=tab["name"], emoji=tab["emoji"], logo=tab["logo"],
            accent=tab["accent"], accent2=tab["accent2"],
            tag_ht=tab["tag"]["ht"], tag_en=tab["tag"]["en"],
            lede_ht=tab["lede"]["ht"], lede_en=tab["lede"]["en"],
            back_ht=UI["back"]["ht"], other_ht=UI["other"]["ht"],
            cards=cards(tab), social=social_block(tab), otabs=other_tabs(tab),
            i18n=i18n_js(tab),
        )
        (out / "index.html").write_text(html, encoding="utf-8")
        made.append(str(out / "index.html"))
    return made


if __name__ == "__main__":
    for m in build():
        print("wrote", os.path.relpath(m, ROOT))
    live = [k for k, v in SOCIAL.items() if v]
    print("social handles wired:", live or "NONE YET (nothing dead is published)")
