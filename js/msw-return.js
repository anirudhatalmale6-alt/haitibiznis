/* "‹ Retounen sou MsouWout" — the way back for someone who came from MsouWout.
 *
 * Jeffery, 27 Oct ("OK LIVE 4"): the MsouWout home screen's 🎟️ EVÈNMAN button
 * opens Tikè Lakay. "Clicking it should open Tikè Lakay, with an easy return
 * to MsouWout." Same bar as MyPlopPlop's js/msw-return.js.
 *
 * MsouWout links here with ?from=msouwout. That is remembered for the tab
 * (sessionStorage), so the bar stays on every page she visits afterwards -
 * event, payment and back, the ticket - not just the first one. Someone who
 * opened Tikè Lakay directly never sees it.
 *
 * A normal block at the very top of <body>, not position:fixed: it scrolls away
 * with the page instead of sitting over the sticky headers and the bottom nav. */
(function () {
  'use strict';
  if (window.__tlMswReturn) return;
  window.__tlMswReturn = true;

  var KEY = 'tl_from_msouwout';
  try {
    if (/[?&]from=msouwout(&|$)/.test(location.search)) sessionStorage.setItem(KEY, '1');
    if (sessionStorage.getItem(KEY) !== '1') return;
  } catch (e) { return; }

  var TXT = { ht: 'Retounen sou MsouWout', fr: 'Retour à MsouWout', en: 'Back to MsouWout', es: 'Volver a MsouWout', pt: 'Voltar ao MsouWout' };
  var lang = 'ht';
  try { lang = localStorage.getItem('tl_lang') || 'ht'; } catch (e) {}

  function add() {
    if (document.getElementById('tlMswReturn')) return;
    var a = document.createElement('a');
    a.id = 'tlMswReturn';
    a.href = 'https://msouwout.com/';
    a.setAttribute('style',
      'display:flex;align-items:center;gap:8px;padding:9px 16px;background:#0A0E1A;color:#fff;' +
      'font:700 14px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-decoration:none;' +
      'border-bottom:3px solid #D21034;position:relative;z-index:1000');
    a.innerHTML = '<span style="font-size:20px;line-height:1">‹</span>' +
      '<span>🚕 ' + (TXT[lang] || TXT.ht) + '</span>';
    document.body.insertBefore(a, document.body.firstChild);
  }
  if (document.body) add();
  else document.addEventListener('DOMContentLoaded', add);
})();
