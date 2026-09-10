/* The event types, in every language Tikè Lakay speaks.
 *
 * WHY THIS FILE EXISTS
 *
 * The Academy director reported that she sets the page
 * to French, fills in an event, and the event type stays in Kreyòl -
 * "Konferans" where she expects "Conférence", "Fèt" where she expects "Fête".
 *
 * She was right, and the cause was two separate things:
 *
 *   1. The dropdown in create-event.html is twenty-nine hard-coded <option>
 *      elements with no data-i18n on any of them. Every other label on that
 *      page translates; this one list never did.
 *
 *   2. Worse, the label was FROZEN at creation. create-event.html looked the
 *      chosen type up in its own table and wrote the Kreyòl label onto the
 *      event as `typeLabel`, and every page from then on printed that string.
 *      So even after translating the dropdown, an event created in French
 *      would still have shown Kreyòl to an English reader - the language of
 *      whoever happened to create it, for everybody, for ever.
 *
 * So the type is translated HERE, at display time, from the stable `type` key.
 * typeLabel is kept only as the fallback for events created before this
 * existed.
 *
 * And the third case, which both she and the owner asked for in their own
 * words: an organiser who wants a type that is not on the list types their
 * own. That is `typeCustom`, and it is shown EXACTLY as written, in whatever
 * language it was written in, and never translated by anything here. A person
 * who typed their own words should see their own words.
 *
 * ⛔ The keys are the contract. They are written on every event ever created
 * and on the ?type= filter of every link anybody has shared. Never rename one.
 */
(function (root) {
  'use strict';

  /* Six of these - fèt-manman, fèt-papa, jmj, valentinn, nouvel-ane and spò -
     are offered by the dropdown but were missing from the styling table it
     looked them up in, so choosing "Fèt dè Mè" silently produced the generic
     grey "Lòt" card. Filled in here so the list and the styling cannot drift
     apart again: this file is now the only place either lives. */
  var TYPES = {
    'konferans':    { emoji: '🎤', gradient: 'linear-gradient(135deg,#0A1235,#00209F,#0A3ACC)', tagBg: 'rgba(0,32,159,.85)' },
    'party':        { emoji: '🎉', gradient: 'linear-gradient(135deg,#5a1a3a,#D21034,#FF4466)', tagBg: 'rgba(210,16,52,.85)' },
    'gala':         { emoji: '💝', gradient: 'linear-gradient(135deg,#1a3a1a,#D4A017,#E8B82E)', tagBg: 'rgba(212,160,23,.9)' },
    'seminè':       { emoji: '📚', gradient: 'linear-gradient(135deg,#1a2a4a,#2a4a8a,#4a7acc)', tagBg: 'rgba(42,74,138,.85)' },
    'maryaj':       { emoji: '💍', gradient: 'linear-gradient(135deg,#f5e6d0,#e8c9a0,#d4a870)', tagBg: 'rgba(180,140,80,.9)' },
    'legliz':       { emoji: '⛪', gradient: 'linear-gradient(135deg,#2a1a5a,#5a3a8a,#8a6abd)', tagBg: 'rgba(90,58,138,.85)' },
    'biznis':       { emoji: '💼', gradient: 'linear-gradient(135deg,#0a2a4a,#00209F,#D4A017)', tagBg: 'rgba(0,32,159,.85)' },
    'konsè':        { emoji: '🎵', gradient: 'linear-gradient(135deg,#1a0a3a,#4a1a8a,#8a3acc)', tagBg: 'rgba(74,26,138,.85)' },
    'fòmasyon':     { emoji: '🎓', gradient: 'linear-gradient(135deg,#0a3a2a,#1B8C3D,#2acc5a)', tagBg: 'rgba(27,140,61,.85)' },
    'kominyon':     { emoji: '🕊️', gradient: 'linear-gradient(135deg,#e8e0d0,#c0a880,#d4a870)', tagBg: 'rgba(180,140,80,.85)' },
    'batèm':        { emoji: '💧', gradient: 'linear-gradient(135deg,#d0e8f0,#80b0d0,#4a8ab0)', tagBg: 'rgba(74,138,176,.85)' },
    'gradyasyon':   { emoji: '🎓', gradient: 'linear-gradient(135deg,#0a2a4a,#1a4a8a,#2a6acc)', tagBg: 'rgba(26,74,138,.85)' },
    'bàl':          { emoji: '💃', gradient: 'linear-gradient(135deg,#3a0a3a,#8a2a8a,#cc4acc)', tagBg: 'rgba(138,42,138,.85)' },
    'fèt-manman':   { emoji: '🌸', gradient: 'linear-gradient(135deg,#5a1a3a,#cc4a7a,#f08ab0)', tagBg: 'rgba(204,74,122,.85)' },
    'fèt-papa':     { emoji: '👔', gradient: 'linear-gradient(135deg,#1a2a3a,#3a5a7a,#6a8aaa)', tagBg: 'rgba(58,90,122,.85)' },
    'jmj':          { emoji: '✝️', gradient: 'linear-gradient(135deg,#2a1a5a,#4a3a9a,#7a6acc)', tagBg: 'rgba(74,58,154,.85)' },
    'valentinn':    { emoji: '❤️', gradient: 'linear-gradient(135deg,#4a0a1a,#cc1a4a,#ff5a7a)', tagBg: 'rgba(204,26,74,.85)' },
    'nwèl':         { emoji: '🎄', gradient: 'linear-gradient(135deg,#0a2a0a,#D21034,#1B8C3D)', tagBg: 'rgba(27,140,61,.85)' },
    'nouvel-ane':   { emoji: '🎆', gradient: 'linear-gradient(135deg,#0a0a2a,#3a2a8a,#D4A017)', tagBg: 'rgba(58,42,138,.85)' },
    'foutbòl':      { emoji: '⚽', gradient: 'linear-gradient(135deg,#0a3a0a,#1B8C3D,#2acc5a)', tagBg: 'rgba(27,140,61,.85)' },
    'baskètbòl':    { emoji: '🏀', gradient: 'linear-gradient(135deg,#8a3a0a,#cc6a1a,#e8982a)', tagBg: 'rgba(204,106,26,.85)' },
    'volebòl':      { emoji: '🏐', gradient: 'linear-gradient(135deg,#2a3a5a,#4a6a9a,#6a8acc)', tagBg: 'rgba(74,106,154,.85)' },
    'tenis':        { emoji: '🎾', gradient: 'linear-gradient(135deg,#2a4a0a,#6a8a2a,#8aaa4a)', tagBg: 'rgba(106,138,42,.85)' },
    'badmintonn':   { emoji: '🏸', gradient: 'linear-gradient(135deg,#0a4a4a,#2a8a8a,#4abaaa)', tagBg: 'rgba(42,138,138,.85)' },
    'bòks':         { emoji: '🥊', gradient: 'linear-gradient(135deg,#4a0a0a,#8a1a1a,#cc2a2a)', tagBg: 'rgba(138,26,26,.85)' },
    'karate':       { emoji: '🥋', gradient: 'linear-gradient(135deg,#1a1a1a,#4a4a4a,#7a7a7a)', tagBg: 'rgba(74,74,74,.85)' },
    'spò':          { emoji: '🏆', gradient: 'linear-gradient(135deg,#0a2a2a,#1a6a6a,#2aaa9a)', tagBg: 'rgba(26,106,106,.85)' },
    'lòt':          { emoji: '📌', gradient: 'linear-gradient(135deg,#2a2a4a,#4a4a8a,#6a6abd)', tagBg: 'rgba(74,74,138,.85)' }
  };

  var LABELS = {
    ht: {
      'konferans': 'Konferans', 'party': 'Fèt / Party', 'gala': 'Gala / Kolèk',
      'seminè': 'Seminè', 'maryaj': 'Maryaj', 'legliz': 'Legliz', 'biznis': 'Biznis',
      'konsè': 'Konsè', 'fòmasyon': 'Fòmasyon / Workshop', 'kominyon': 'Premye Kominyon',
      'batèm': 'Batèm', 'gradyasyon': 'Gradyasyon', 'bàl': 'Bàl / Dans',
      'fèt-manman': 'Fèt dè Mè', 'fèt-papa': 'Fèt dè Pè', 'jmj': 'JMJ',
      'valentinn': 'Sen Valanten', 'nwèl': 'Nwèl', 'nouvel-ane': 'Nouvèl Ane',
      'foutbòl': 'Foutbòl', 'baskètbòl': 'Baskètbòl', 'volebòl': 'Volebòl',
      'tenis': 'Tenis', 'badmintonn': 'Badmintonn', 'bòks': 'Bòks',
      'karate': 'Karate / Judo', 'spò': 'Lòt Spò', 'lòt': 'Lòt'
    },
    fr: {
      'konferans': 'Conférence', 'party': 'Fête / Soirée', 'gala': 'Gala / Collecte',
      'seminè': 'Séminaire', 'maryaj': 'Mariage', 'legliz': 'Église', 'biznis': 'Affaires',
      'konsè': 'Concert', 'fòmasyon': 'Formation / Atelier', 'kominyon': 'Première Communion',
      'batèm': 'Baptême', 'gradyasyon': 'Remise de diplômes', 'bàl': 'Bal / Danse',
      'fèt-manman': 'Fête des Mères', 'fèt-papa': 'Fête des Pères', 'jmj': 'JMJ',
      'valentinn': 'Saint-Valentin', 'nwèl': 'Noël', 'nouvel-ane': 'Nouvel An',
      'foutbòl': 'Football', 'baskètbòl': 'Basketball', 'volebòl': 'Volleyball',
      'tenis': 'Tennis', 'badmintonn': 'Badminton', 'bòks': 'Boxe',
      'karate': 'Karaté / Judo', 'spò': 'Autre sport', 'lòt': 'Autre'
    },
    en: {
      'konferans': 'Conference', 'party': 'Party', 'gala': 'Gala / Fundraiser',
      'seminè': 'Seminar', 'maryaj': 'Wedding', 'legliz': 'Church', 'biznis': 'Business',
      'konsè': 'Concert', 'fòmasyon': 'Training / Workshop', 'kominyon': 'First Communion',
      'batèm': 'Baptism', 'gradyasyon': 'Graduation', 'bàl': 'Ball / Dance',
      'fèt-manman': "Mother's Day", 'fèt-papa': "Father's Day", 'jmj': 'World Youth Day',
      'valentinn': "Valentine's Day", 'nwèl': 'Christmas', 'nouvel-ane': 'New Year',
      'foutbòl': 'Football', 'baskètbòl': 'Basketball', 'volebòl': 'Volleyball',
      'tenis': 'Tennis', 'badmintonn': 'Badminton', 'bòks': 'Boxing',
      'karate': 'Karate / Judo', 'spò': 'Other sport', 'lòt': 'Other'
    },
    es: {
      'konferans': 'Conferencia', 'party': 'Fiesta', 'gala': 'Gala / Recaudación',
      'seminè': 'Seminario', 'maryaj': 'Boda', 'legliz': 'Iglesia', 'biznis': 'Negocios',
      'konsè': 'Concierto', 'fòmasyon': 'Formación / Taller', 'kominyon': 'Primera Comunión',
      'batèm': 'Bautizo', 'gradyasyon': 'Graduación', 'bàl': 'Baile',
      'fèt-manman': 'Día de la Madre', 'fèt-papa': 'Día del Padre', 'jmj': 'JMJ',
      'valentinn': 'San Valentín', 'nwèl': 'Navidad', 'nouvel-ane': 'Año Nuevo',
      'foutbòl': 'Fútbol', 'baskètbòl': 'Baloncesto', 'volebòl': 'Voleibol',
      'tenis': 'Tenis', 'badmintonn': 'Bádminton', 'bòks': 'Boxeo',
      'karate': 'Kárate / Judo', 'spò': 'Otro deporte', 'lòt': 'Otro'
    },
    pt: {
      'konferans': 'Conferência', 'party': 'Festa', 'gala': 'Gala / Arrecadação',
      'seminè': 'Seminário', 'maryaj': 'Casamento', 'legliz': 'Igreja', 'biznis': 'Negócios',
      'konsè': 'Concerto', 'fòmasyon': 'Formação / Workshop', 'kominyon': 'Primeira Comunhão',
      'batèm': 'Batismo', 'gradyasyon': 'Formatura', 'bàl': 'Baile / Dança',
      'fèt-manman': 'Dia das Mães', 'fèt-papa': 'Dia dos Pais', 'jmj': 'JMJ',
      'valentinn': 'Dia dos Namorados', 'nwèl': 'Natal', 'nouvel-ane': 'Ano Novo',
      'foutbòl': 'Futebol', 'baskètbòl': 'Basquete', 'volebòl': 'Vôlei',
      'tenis': 'Tênis', 'badmintonn': 'Badminton', 'bòks': 'Boxe',
      'karate': 'Karatê / Judô', 'spò': 'Outro esporte', 'lòt': 'Outro'
    }
  };

  /* The order the dropdown is built in. Kept here so the list and the labels
     cannot get out of step. */
  var ORDER = ['konferans', 'party', 'gala', 'seminè', 'maryaj', 'legliz', 'biznis',
    'konsè', 'fòmasyon', 'kominyon', 'batèm', 'gradyasyon', 'bàl', 'fèt-manman',
    'fèt-papa', 'jmj', 'valentinn', 'nwèl', 'nouvel-ane', 'foutbòl', 'baskètbòl',
    'volebòl', 'tenis', 'badmintonn', 'bòks', 'karate', 'spò', 'lòt'];

  function style(key) {
    return TYPES[key] || TYPES['lòt'];
  }

  /* What to print for this event's type, in this language.
   *
   * Order matters and it is the whole point of the file:
   *   1. What the organiser typed themselves wins over everything, untouched.
   *   2. Otherwise the key, translated.
   *   3. Otherwise whatever label the event was created with, for the events
   *      that predate this - better a Kreyòl label than a blank pill.
   */
  function label(ev, lang) {
    if (!ev) return '';
    var custom = (ev.typeCustom || '').trim();
    if (custom) return custom;
    var table = LABELS[lang] || LABELS.ht;
    var key = ev.type || 'lòt';
    return table[key] || (LABELS.ht[key]) || ev.typeLabel || key;
  }

  /* The emoji. A custom type has no emoji of its own, so it borrows the one
     for the key the organiser also picked, or the generic pin. */
  function emoji(ev) {
    if (!ev) return '📌';
    return ev.typeEmoji || style(ev.type).emoji;
  }

  function labelForKey(key, lang) {
    var table = LABELS[lang] || LABELS.ht;
    return table[key] || LABELS.ht[key] || key;
  }

  root.EventTypes = {
    TYPES: TYPES, LABELS: LABELS, ORDER: ORDER,
    style: style, label: label, emoji: emoji, labelForKey: labelForKey
  };
})(typeof window !== 'undefined' ? window : this);
