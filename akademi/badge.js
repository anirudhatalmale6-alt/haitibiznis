/* ===========================================================================
   THE AGENT BADGE AND CARD — ONE COPY, USED BY BOTH PAGES.

   Jeffery, 28 Sep: "Yes, please add badge re-issue to the SAME page so Jennifer
   can re-issue both certificate and badge without needing you. Keep it simple."

   Jennifer's message that started it: "Moun sa pat gentan pran badge AK carte
   lan... Koman m k fè poum pran yo pou yo?" — this person never got their badge
   and card; how do I get them for them?

   Until now this drawing code lived inside the EXAM page, so a badge only
   existed at the moment a student passed. If they closed the page before
   saving it, nobody could ever produce it again.

   ⛔ COPYING IT INTO THE RE-ISSUE PAGE WOULD HAVE BEEN THE EASY ANSWER AND THE
   WRONG ONE: two copies drift, and the day they drift is the day a re-issued
   badge stops matching the one the student was shown at the workshop. One
   file, both pages.

   It takes its labels rather than reading a page's own i18n, because the two
   pages do not share one. Everything else — the layout numbers, the colours,
   the six service tiles — is byte-for-byte what was in the exam page.
   =========================================================================== */

var NAVY = '#0B2E6F', RED = '#D21034', GOLD = '#E0A400', INK = '#152341';
var credAssets = { logo:null, qr:null, want:2, got:0 };
var credState = { name:'', id:'', date:'', phone:'', kind:'card' };

/* The four strings the artwork needs. A page sets these once; the default is
   Kreyol, which is what the workshop runs in. */
/* ⚠️ COPIED from the exam page's own Kreyol block, not written from memory.
   I first typed two of these from memory and the re-issued badge came out
   visibly different from the workshop's - same layout, different words along
   the bottom. Caught only by comparing the two IMAGES. */
var credLabels = {
  cred_title: 'Ajan Sètifye LajanMaker',
  cred_id:    'NIMEWO AJAN',
  cred_scan:  'Eskane pou konnen plis',
  cred_foot:  'Sètifye pa LajanMaker Academy · Yon pati nan HaitiBiznis Technologies'
};
function t(k){ return credLabels[k] || k; }

/* The photo, when the agent added one. Both pages set this; the re-issue page
   leaves it null, which is the no-photo layout Jeffery approved. */
var credPhoto = null;

/* The exam page has its own $() one-liner. This module must not depend on a
   page's helpers, so it carries the two lines it needs. */
function $(id){ return document.getElementById(id); }

function drawPhotoCircle(ctx, cx, cy, r){
  if (!credPhoto) return false;
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
  var iw = credPhoto.naturalWidth || credPhoto.width;
  var ih = credPhoto.naturalHeight || credPhoto.height;
  var sc = Math.max((r * 2) / iw, (r * 2) / ih);
  ctx.drawImage(credPhoto, cx - iw * sc / 2, cy - ih * sc / 2, iw * sc, ih * sc);
  ctx.restore();
  ctx.lineWidth = 10; ctx.strokeStyle = '#fff';
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = GOLD;
  ctx.beginPath(); ctx.arc(cx, cy, r + 6, 0, Math.PI * 2); ctx.stroke();
  return true;
}

function loadCredAssets(done){
  if (credAssets.got >= credAssets.want) return done();
  ['lm-logo.png', 'qr-lajanmaker.png'].forEach(function(src, i){
    var im = new Image();
    im.onload = function(){
      if (i === 0) credAssets.logo = im; else credAssets.qr = im;
      if (++credAssets.got >= credAssets.want) done();
    };
    /* If an asset will not load we still draw - a card without the logo
       beats a blank box, and the student has already passed. */
    im.onerror = function(){ if (++credAssets.got >= credAssets.want) done(); };
    im.src = src;
  });
}

function fitText(ctx, text, max, start, weight, family){
  var size = start;
  do {
    ctx.font = weight + ' ' + size + 'px ' + family;
    if (ctx.measureText(text).width <= max) break;
    size -= 2;
  } while (size > 12);
  return size;
}

function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCard(){
  var cv = $('cardCanvas'), ctx = cv.getContext('2d');
  var W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  /* Navy band down the left, red hairline - the platform's own colours
     rather than a generic card. */
  ctx.fillStyle = NAVY; ctx.fillRect(0, 0, 300, H);
  ctx.fillStyle = RED;  ctx.fillRect(300, 0, 9, H);

  if (credAssets.logo) ctx.drawImage(credAssets.logo, 66, 96, 168, 168);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = '800 34px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText('LajanMaker', 150, 322);
  ctx.fillStyle = GOLD;
  ctx.font = '800 17px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText('ACADEMY', 150, 350);
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  ctx.font = '600 15px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText('lajanmaker.com', 150, 512);

  ctx.textAlign = 'left';
  var x = 352;
  ctx.fillStyle = INK;
  fitText(ctx, credState.name, 460, 46, '800', 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif');
  ctx.fillText(credState.name, x, 150);

  ctx.fillStyle = RED;
  ctx.font = '800 20px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText(t('cred_title').toUpperCase(), x, 190);

  ctx.fillStyle = '#5A6B8A';
  ctx.font = '700 15px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText(t('cred_id'), x, 268);
  ctx.fillStyle = NAVY;
  ctx.font = '800 27px "SF Mono",Menlo,Consolas,monospace';
  ctx.fillText(credState.id, x, 302);

  ctx.fillStyle = '#5A6B8A';
  ctx.font = '700 15px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText(t('cred_since') + ' ' + credState.date, x, 348);

  if (credAssets.qr) ctx.drawImage(credAssets.qr, 792, 388, 176, 176);
  ctx.fillStyle = '#93A0B8';
  ctx.font = '600 13px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t('cred_scan'), 880, 583);
  return cv;
}

function drawBadge(){
  var cv = $('badgeCanvas'), ctx = cv.getContext('2d');
  var W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, 300);
  ctx.fillStyle = GOLD; ctx.fillRect(0, 300, W, 10);

  /* Lanyard slot, so it reads as a badge even before it is printed. */
  ctx.fillStyle = 'rgba(255,255,255,.28)';
  roundRect(ctx, W / 2 - 78, 44, 156, 26, 13); ctx.fill();

  if (credAssets.logo) ctx.drawImage(credAssets.logo, W / 2 - 66, 96, 132, 132);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = '800 30px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText('LajanMaker Academy', W / 2, 272);

  /* With a photo everything below has to move down to make room, so the two
     layouts are spelled out rather than nudged. ⛔ WITHOUT a photo the numbers
     are byte-for-byte the ones Jeffery approved - his design is not disturbed
     for an agent who has not added one. */
  var hasPhoto = drawPhotoCircle(ctx, W / 2, 372, 88);
  var L = hasPhoto
    ? { name:530, pill:560, pillTx:595, idLab:662, id:706, phone:746,
        qr:766, qrSize:190, scan:980, tiles:996, th:48, gap:8 }
    : { name:420, pill:452, pillTx:487, idLab:566, id:612, phone:656,
        qr:686, qrSize:244, scan:952, tiles:984, th:52, gap:10 };

  ctx.fillStyle = INK;
  fitText(ctx, credState.name, W - 120, 56, '800', 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif');
  ctx.fillText(credState.name, W / 2, L.name);

  ctx.fillStyle = RED;
  roundRect(ctx, W / 2 - 230, L.pill, 460, 52, 26); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = '800 22px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText(t('cred_title').toUpperCase(), W / 2, L.pillTx);

  ctx.fillStyle = '#5A6B8A';
  ctx.font = '700 17px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText(t('cred_id'), W / 2, L.idLab);
  ctx.fillStyle = NAVY;
  ctx.font = '800 36px "SF Mono",Menlo,Consolas,monospace';
  ctx.fillText(credState.id, W / 2, L.id);

  if (credState.phone){
    ctx.fillStyle = '#152341';
    ctx.font = '700 22px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
    ctx.fillText('\u260E  +509 ' + credState.phone, W / 2, L.phone);
  }

  if (credAssets.qr) ctx.drawImage(credAssets.qr, W / 2 - L.qrSize / 2, L.qr, L.qrSize, L.qrSize);
  ctx.fillStyle = '#93A0B8';
  ctx.font = '600 15px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText(t('cred_scan'), W / 2, L.scan);

  /* The six services an agent actually sells, in the platform's own colours.
     Straight from his badge design - it is what turns a name badge into a
     reason for the person opposite to ask a question. */
  var SVC = [['MsouWout', '#D21034'], ['MyPlopPlop', '#0057D9'], ['Tike Lakay', '#1B8C3D'],
             ['Academy', '#E07B00'], ['48HoursReady', '#6D28D9'], ['Sol', '#B8860B']];
  var tw = 280, th = L.th, gap = L.gap, x0 = (W - (tw * 3 + gap * 2)) / 2, y0 = L.tiles;
  ctx.font = '800 17px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  SVC.forEach(function(sv, i){
    var cx = x0 + (i % 3) * (tw + gap), cy = y0 + Math.floor(i / 3) * (th + gap);
    ctx.fillStyle = sv[1];
    roundRect(ctx, cx, cy, tw, th, 10); ctx.fill();
    ctx.fillStyle = '#fff';
    var sz = fitText(ctx, sv[0], tw - 18, 17, '800', 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif');
    ctx.fillText(sv[0], cx + tw / 2, cy + th / 2 + sz / 3);
  });

  ctx.fillStyle = NAVY; ctx.fillRect(0, H - 76, W, 76);
  ctx.fillStyle = '#fff';
  ctx.font = '700 17px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText(t('cred_foot'), W / 2, H - 44);
  ctx.fillStyle = 'rgba(255,255,255,.8)';
  ctx.font = '600 15px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
  ctx.fillText('lajanmaker.com', W / 2, H - 20);
  return cv;
}
