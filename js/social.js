/* ============================================================
   HaitiBiznis - the shared social bar
   ------------------------------------------------------------
   The brief: ONE main HaitiBiznis account per platform, and the
   same links everywhere instead of a different set per brand.

   So the handles live here and nowhere else. Thirty-one pages
   pull from this file; changing a handle is a one-line edit,
   not a thirty-one-file sweep that will be half-finished.

   Drop <div data-social-bar></div> where the icons belong, and
   include:  <script src="js/social.js" defer></script>
   (use ../js/social.js from a subfolder)

   A handle left null renders NOTHING. That is on purpose - an
   icon that lands on "this account doesn't exist" costs more
   trust than a missing icon, and it is HaitiBiznis's name on it.
   Checked 1 Sep 2026: tiktok.com/@haitibiznis does not exist;
   Facebook and Instagram both sit behind a login wall so the
   handle cannot be confirmed from outside.
   ============================================================ */
(function () {
  'use strict';

  var SOCIAL = {
    facebook:  null,     /* e.g. 'https://www.facebook.com/HaitiBiznis' */
    instagram: null,     /* e.g. 'https://www.instagram.com/haitibiznis' */
    tiktok:    null      /* e.g. 'https://www.tiktok.com/@haitibiznis'  */
  };
  var WHATSAPP = '50946859702';               /* +509 4685 9702 */
  var CONTACT  = 'contact@haitibiznis.com';

  var ICONS = {
    facebook: 'M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
    instagram: null,   /* drawn below - it needs more than one shape */
    tiktok: null
  };

  function svg(name) {
    var open = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
               'stroke-linecap="round" stroke-linejoin="round">';
    if (name === 'facebook') return open + '<path d="' + ICONS.facebook + '"/></svg>';
    if (name === 'instagram') return open +
      '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>' +
      '<circle cx="17.5" cy="6.5" r="1.2"/></svg>';
    return open + '<path d="M16 3v9.2a4.3 4.3 0 1 1-3.3-4.2"/>' +
      '<path d="M16 3a5.2 5.2 0 0 0 5 4.1"/></svg>';
  }

  var LABEL = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok' };

  function css() {
    if (document.getElementById('hbSocialCss')) return;
    var s = document.createElement('style');
    s.id = 'hbSocialCss';
    s.textContent =
      '.hb-social{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px;align-items:center}' +
      '.hb-social a{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;' +
        'background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.20);' +
        'color:inherit;transition:background .15s ease,transform .15s ease}' +
      '.hb-social a:hover{background:rgba(255,255,255,.22);transform:translateY(-2px)}' +
      '.hb-social a svg{width:19px;height:19px}' +
      /* grid+place-items centres a single icon, but the WhatsApp pill has an
         emoji AND a word - as a grid they stack and the word gets clipped. */
      '.hb-social a.hb-wa{display:flex;flex-direction:row;align-items:center;' +
        'justify-content:center;width:auto;white-space:nowrap;padding:0 15px;gap:8px;' +
        'background:#25D366;border-color:#25D366;color:#fff;font-weight:700;font-size:.83rem}' +
      '.hb-social a.hb-wa:hover{background:#1FBE5B}' +
      /* the light-background variant, for pages whose footer is not dark */
      '.hb-social.on-light a{background:rgba(12,19,48,.05);border-color:rgba(12,19,48,.10)}' +
      '.hb-social.on-light a:hover{background:rgba(12,19,48,.10)}' +
      '.hb-social.on-light a.hb-wa{background:#25D366;border-color:#25D366;color:#fff}';
    document.head.appendChild(s);
  }

  /* Footers across this site are a mix of dark navy and plain white, and
     there are thirty of them. Rather than tag each page by hand, walk up to
     the first ancestor with a real background and read its brightness. */
  function onLight(el) {
    for (var n = el; n && n !== document.documentElement; n = n.parentElement) {
      var bg = getComputedStyle(n).backgroundColor || '';
      var m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?/);
      if (!m) continue;
      if (m[4] !== undefined && parseFloat(m[4]) < 0.5) continue;   /* see-through, keep walking */
      var lum = (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255;
      return lum > 0.6;
    }
    return true;   /* nothing decisive - assume a light page, which is the safer miss */
  }

  function build(host) {
    var bar = document.createElement('div');
    bar.className = 'hb-social' +
      ((host.hasAttribute('data-social-light') || onLight(host)) ? ' on-light' : '');

    /* Some of these footers are centred and some are left-aligned. Follow
       whatever the surrounding footer already does rather than picking one
       and looking wrong on half the site. */
    try {
      var ta = getComputedStyle(host.parentElement || host).textAlign;
      if (ta === 'center') bar.style.justifyContent = 'center';
      else if (ta === 'right' || ta === 'end') bar.style.justifyContent = 'flex-end';
    } catch (e) {}

    ['facebook', 'instagram', 'tiktok'].forEach(function (k) {
      if (!SOCIAL[k]) return;
      var a = document.createElement('a');
      a.href = SOCIAL[k];
      a.target = '_blank';
      a.rel = 'noopener';
      a.title = LABEL[k];
      a.setAttribute('aria-label', LABEL[k]);
      a.innerHTML = svg(k);
      bar.appendChild(a);
    });

    /* WhatsApp is the one channel that is confirmed working, so it always
       shows - a visitor is never left with no way to reach anybody. */
    var wa = document.createElement('a');
    wa.className = 'hb-wa';
    wa.href = 'https://wa.me/' + WHATSAPP +
              '?text=' + encodeURIComponent('Bonjou HaitiBiznis!');
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.innerHTML = '<span>&#128172;</span><span>WhatsApp</span>';
    bar.appendChild(wa);

    host.appendChild(bar);
  }

  function mount() {
    var hosts = document.querySelectorAll('[data-social-bar]');
    if (!hosts.length) return;
    css();
    Array.prototype.forEach.call(hosts, function (h) {
      if (h.querySelector('.hb-social')) return;
      /* Most footers wrap their content in a padded container; a few do not,
         and there the bar ends up flush against the left edge of the screen.
         Move into the container when there is one, otherwise pad it. */
      var p = h.parentElement;
      if (p && p.tagName === 'FOOTER') {
        var inner = p.querySelector('.wrap,.container,.footer-top,.footer-inner,.eco-footer-inner');
        if (inner && inner !== h && !inner.contains(h)) inner.appendChild(h);
        else h.style.padding = '0 18px';
      }
      build(h);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else { mount(); }

  window.HB_SOCIAL = SOCIAL;      /* so a page can read the handles if it needs to */
  window.HB_CONTACT = CONTACT;
})();
