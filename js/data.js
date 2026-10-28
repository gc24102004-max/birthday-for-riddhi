/* =====================================================================
   js/data.js  —  THE ONLY FILE YOU NEED TO EDIT  (v2 cinematic)
   ---------------------------------------------------------------------
   • Every message, every photo and every setting lives here.
   • Only change the text between the "quotes". Keep commas and brackets.
   • After saving, refresh the page. Gujarati / Hindi / English / emojis all work.
   • Photo files live in assets/images/ (same names as below).
   ===================================================================== */

const HER_NAME = "Riddhi";
const BIRTHDAY_DATE = "2026-11-16";        // YEAR-MONTH-DAY  (16 November 2026)

/* ---------------------------------------------------------------------
   LOCK  —  false = TESTING MODE (you can click through everything now)
            true  = FINAL MODE   (nothing opens until the countdown ends)
   When you are ready, change false to true, save, and upload this file.
   --------------------------------------------------------------------- */
const LOCK_UNTIL_BIRTHDAY = true;

/* ---------------------------------------------------------------------
   MUSIC (both optional, mp3 files in assets/audio/)
   countdownTrack  plays BEFORE the birthday
   birthdayTrack   starts by itself the moment the countdown ends
   The music starts on her first tap (phones do not allow sound before a tap)
   and then keeps playing page after page. The volume goes softer/louder for
   each chapter (see "level" below).
   --------------------------------------------------------------------- */
const AUDIO = {
  countdownTrack: "assets/audio/countdown-song.mp3",
  birthdayTrack: "assets/audio/birthday-song.mp3",
  volume: 0.8,
};

const SETTINGS = {
  previewHelpers: "auto", // "auto": test notes only on your own computer
  tryOtherExtensions: true,

  // SPEED of the whole story (text, photo changes, countdown reveal).
  //   1.0 = slow and dreamy      0.6 = comfortable (recommended)
  //   0.5 = fast                 0.4 = very fast
  // She can always tap to go faster. Reduced-motion visitors are not affected.
  pace: 0.6,
};

const IMG = "assets/images/";

/* ---------------------------------------------------------------------
   CHAPTER ORDER AND LOOK
   level = how loud the music is on that page (0 = silent, 1 = full)
   theme = night | wine | bright | minimal | sukoon
   --------------------------------------------------------------------- */
const ORDER = ["index", "countdown", "childhood", "message", "versions", "riddhaa", "favourite", "little", "sukhdukh", "sukoon", "confess", "always", "letter", "end"];

const PAGES = {
  index:     { file: "index.html",       chapter: "01", title: "THE BEGINNING",       theme: "night",   level: 0.55, stars: true, chrome: false },
  countdown: { file: "countdown.html",   chapter: "02", title: "THE WAIT",            theme: "bright",  level: 0.7,  stars: true },
  childhood: { file: "childhood.html",   chapter: "04", title: "WHERE IT BEGAN",      theme: "night",   level: 0.35 },
  message:   { file: "message.html",     chapter: "05", title: "ONE MESSAGE",         theme: "minimal", level: 0.5 },
  versions:  { file: "versions.html",    chapter: "06", title: "HER MANY VERSIONS",   theme: "night",   level: 0.8 },
  riddhaa:   { file: "riddhaa.html",     chapter: "08", title: "RIDDHAA",             theme: "wine",    level: 0.7 },
  favourite: { file: "favourite.html",   chapter: "09", title: "FAVOURITE",           theme: "minimal", level: 0.3, quiet: true },
  little:    { file: "little-things.html", chapter: "10", title: "LITTLE THINGS",     theme: "night",   level: 0.7 },
  sukhdukh:  { file: "sukh-dukh.html",   chapter: "11", title: "SUKH & DUKH",         theme: "minimal", level: 0.45 },
  sukoon:    { file: "sukoon.html",      chapter: "12", title: "MY SUKOON",           theme: "sukoon",  level: 0.4 },
  confess:   { file: "confess.html",     chapter: "13", title: "A CONFESSION",        theme: "night",   level: 0.5 },
  always:    { file: "always-us.html",   chapter: "14", title: "ALWAYS US",           theme: "night",   level: 0.6,  stars: true },
  letter:    { file: "letter.html",      chapter: "15", title: "FINAL LETTER",        theme: "minimal", level: 0.45 },
  end:       { file: "end.html",         chapter: "",   title: "",                    theme: "minimal", level: 0.4,  stars: true, chrome: false },
};

/* ---------------------------------------------------------------------
   01  OPENING PAGE  (index.html)
   --------------------------------------------------------------------- */
const OPENING = {
  title: "For Riddhaa…",
  subtitle: "એક નાની surprise… ફક્ત તારા માટે.",
  button: "Enter My Little World ✨",
};

/* ---------------------------------------------------------------------
   02  COUNTDOWN PAGE  +  03  BIRTHDAY REVEAL  (countdown.html)
   --------------------------------------------------------------------- */
const COUNTDOWN = {
  date: "16 • 11 • 2026",
  line: "Something special is waiting for you…",
  labels: ["DAYS", "HOURS", "MINUTES", "SECONDS"],
};

const REVEAL = {
  day: "16",
  month: "November",
  name: "RIDDHI",
  wish: "Happy Birthday, Riddhuuu! 🎂",
  line: "હા Baka… આજે આખો દિવસ તારો છે. 😂❤️",
  button: "Open Your Surprise →",
};

/* ---------------------------------------------------------------------
   THE STORY CHAPTERS
   A chapter is a list of "steps". Each step plays for a few seconds, then the
   next one starts. She can tap the right side to go forward, the left side to
   go back, or touch-and-hold to pause.

   Step kinds
     { type:"text",  lines:[ "line", {t:"line", cls:"big gold"} ], ms:5000 }
     { type:"photo", mode:"full|card|polaroid", src, focus, name, lines, ms }
     { type:"chain", words:[...], final:"…" }
   Optional on any step: wait:true (waits for a tap), level:0.3 (music volume),
   bg:{ src, blur:true } (background photo).
   Line styles (cls): big, huge, gold, small, hand, bubble
   focus = which part of the photo stays in view, e.g. "50% 25%" (top-centre)
   --------------------------------------------------------------------- */
const STORY = {

  /* 04 — CHILDHOOD */
  childhood: {
    steps: [
      { type: "photo", mode: "full", src: IMG + "welcome-photo.jpg", focus: "50% 40%", label: "Where it all began…", ms: 6500 },
      { type: "photo", mode: "full", src: IMG + "welcome-photo.jpg", focus: "50% 40%", ms: 16000,
        lines: ["આ હતી મારી રિદ્ધુની નાની દુનિયા…", "એ જ નિર્દોષ સ્મિત આજે પણ એટલું જ સુંદર લાગે છે.", "સમય બદલાયો, ઉંમર વધી… પણ આ સ્મિતની મીઠાશ ક્યાંય ગઈ નથી."] },
      { type: "text", bg: { src: IMG + "welcome-photo.jpg", focus: "50% 40%", blur: true }, ms: 6000,
        lines: [{ t: "પણ આ તો ફક્ત તારી story હતી…", cls: "big" }] },
      { type: "text", bg: { src: IMG + "welcome-photo.jpg", focus: "50% 40%", blur: true }, ms: 7000,
        lines: [{ t: "મારી story માં તું ક્યારે આવી?", cls: "big gold" }] },
    ],
  },

  /* 05 — ONE MESSAGE (text only) */
  message: {
    steps: [
      { type: "text", ms: 4200, lines: [{ t: "1 new message…", cls: "bubble" }] },
      { type: "text", ms: 5200, lines: [{ t: "એ વખતે મારી પાસે ખાસ કોઈ નહોતું…", cls: "big" }] },
      { type: "text", ms: 4600, lines: [{ t: "અને પછી એક message આવ્યો.", cls: "big" }] },
      { type: "text", ms: 5000, lines: [{ t: "બસ ત્યાંથી વાત શરૂ થઈ.", cls: "big gold" }] },
      { type: "text", ms: 12500, lines: ["ક્યારેક ખબર પણ નથી હોતી કે કોઈ એક નાનો મેસેજ આગળ જઈને કેટલી મોટી યાદોની શરૂઆત બની જશે.", "આપણી કહાની પણ બસ એક મેસેજથી જ શરૂ થઈ હતી…"] },
      { type: "text", ms: 13000, lines: ["પહેલા વાતો થતી હતી…", "પછી એ વાતોની રાહ જોવાવા લાગી.", "અને ખબર જ ના પડી કે તું ક્યારે મારી જિંદગીનો એક ખાસ ભાગ બની ગઈ."] },
      { type: "chain", words: ["વાતો", "હાસ્ય", "રોજની વાતો", "secrets", "sukh", "dukh"], final: "તું." },
    ],
  },

  /* 06 + 07 — HER MANY VERSIONS (the name changes with every photo) */
  versions: {
    steps: [
      { type: "photo", mode: "card", src: IMG + "memory-02.jpg", focus: "50% 25%", name: "Riddhi", ms: 11000,
        lines: ["દિવસો પસાર થતા ગયા, વાતો વધતી ગઈ…", "અને એક અજાણી વ્યક્તિ ક્યારે એટલી પોતાની બની ગઈ, એની ખબર જ ના પડી."] },
      { type: "photo", mode: "card", src: IMG + "memory-05.jpg", focus: "50% 25%", name: "Riddhaa", ms: 11000,
        lines: ["‘રિદ્ધા’…", "એક નામ છે, પણ મારી માટે એની સાથે કેટલીય વાતો, કેટલીય યાદો અને એક અલગ જ લાગણી જોડાયેલી છે."] },
      { type: "photo", mode: "card", src: IMG + "memory-01.jpg", focus: "50% 22%", name: "Riddhuuu", ms: 10000,
        lines: ["અને પછી આવે છે મારી ‘રિદ્ધુઉઉઉ’… 😄", "આ નામ બોલતાં જ જાણે વાતોમાં થોડું વધારે હસવું આવી જાય."] },
      { type: "photo", mode: "card", src: IMG + "memory-04.jpg", focus: "50% 28%", name: "BAKA 😂", nameCls: "bounce", ms: 13000,
        lines: ["અને હા… મારી Baka.", "જેને શબ્દોમાં સમજાવવી થોડી મુશ્કેલ છે,", "પણ દિલમાં એની જગ્યા સમજાવવી તો એથી પણ મુશ્કેલ છે."] },
    ],
  },

  /* 08 — RIDDHAA (traditional photos, burgundy and gold) */
  riddhaa: {
    steps: [
      { type: "photo", mode: "card", bgBlur: true, src: IMG + "memory-03.jpg", focus: "50% 45%", ms: 12000,
        lines: ["કેટલીક તસવીરો માત્ર સુંદર નથી હોતી…", "એમાં રહેલી વ્યક્તિ એને ખાસ બનાવી દે છે.", "આ પણ એવી જ એક યાદ છે."] },
      { type: "photo", mode: "card", bgBlur: true, src: IMG + "memory-07.jpg", focus: "50% 25%", ms: 11000,
        lines: ["આ પળમાં કંઈક અલગ જ વાત છે…", "સાદગી, સ્મિત અને તારી પોતાની એક અલગ જ સુંદરતા."] },
      { type: "photo", mode: "card", bgBlur: true, src: IMG + "memory-17.jpg", focus: "50% 35%", ms: 11500,
        lines: ["તારી સુંદરતા માત્ર દેખાવમાં નથી…", "તારી સાદગીમાં, તારા સ્મિતમાં અને તારી એ નાની નાની વાતોમાં છે."] },
      { type: "text", ms: 9500, lines: [{ t: "સાદગી.", cls: "big gold" }, { t: "Grace.", cls: "big gold" }, { t: "Riddhaa.", cls: "huge gold" }] },
    ],
  },

  /* 09 — FAVOURITE PHOTO (no buttons, just the photo) */
  favourite: {
    minimalUI: true,
    steps: [
      { type: "photo", mode: "full", src: IMG + "memory-08.jpg", focus: "50% 40%", ms: 6500, level: 0.3 },
      { type: "photo", mode: "full", src: IMG + "memory-08.jpg", focus: "50% 40%", ms: 5200, level: 0.2,
        lines: [{ t: "કેટલીક photos favourite નથી હોતી…", cls: "big" }] },
      { type: "photo", mode: "full", src: IMG + "memory-08.jpg", focus: "50% 40%", ms: 5200, level: 0.2,
        lines: [{ t: "એ વ્યક્તિ favourite હોય છે.", cls: "big gold" }] },
      { type: "photo", mode: "full", src: IMG + "memory-08.jpg", focus: "50% 40%", ms: 12000, level: 0.2,
        lines: [{ t: "એટલે photo favourite બની જાય છે. 🤍", cls: "big" }, "આ તસવીર કેમ favourite છે એ કદાચ શબ્દોમાં સમજાવી ના શકું…", "કદાચ કારણ એટલું જ છે કે તેમાં ‘તું’ છે."] },
    ],
  },

  /* 10 — LITTLE THINGS (floating Polaroids) */
  little: {
    steps: [
      { type: "text", ms: 4800, lines: [{ t: "Little things I remember…", cls: "big gold" }] },
      { type: "photo", mode: "polaroid", rot: -3, src: IMG + "memory-06.jpg", focus: "50% 30%", ms: 9000,
        lines: ["મોટી મોટી યાદો કરતાં ક્યારેક આવી નાની નાની પળો વધારે યાદ રહી જાય છે…"] },
      { type: "photo", mode: "polaroid", rot: 2.5, src: IMG + "memory-10.jpg", focus: "50% 55%", ms: 9500,
        lines: ["કોઈ ખાસ પ્રસંગની જરૂર નથી હોતી… તારી સાથેની એક સામાન્ય ક્ષણ પણ પછીથી એક સુંદર યાદ બની જાય છે."] },
      { type: "photo", mode: "polaroid", rot: -2, src: IMG + "memory-15.jpg", focus: "50% 30%", ms: 9000,
        lines: ["પણ આજે પાછળ વળીને જોઉં છું ત્યારે લાગે છે — આ જ તો આપણી યાદો છે."] },
      { type: "photo", mode: "polaroid", rot: 3, src: IMG + "memory-18.jpg", focus: "50% 55%", ms: 9000,
        lines: ["કારણ કે એમાં કોઈ દેખાવ નથી હોતો, બસ એક સાચી ક્ષણ હોય છે."] },
    ],
  },

  /* 11 — SUKH & DUKH (minimal) */
  sukhdukh: {
    steps: [
      { type: "photo", mode: "card", src: IMG + "memory-11.jpg", focus: "50% 40%", ms: 12500,
        lines: ["મારી ખુશીઓમાં તારો હિસ્સો રહ્યો છે…", "હસવાનું હોય, કંઈક સારું થયું હોય કે બસ મન ખુશ હોય —", "તારી સાથે એ ખુશી વહેંચવી હંમેશા વધારે સારી લાગી છે."] },
      { type: "photo", mode: "card", src: IMG + "memory-09.jpg", focus: "50% 55%", ms: 13500,
        lines: ["પણ આપણી વાત માત્ર ખુશીઓ સુધી નથી રહી…", "જ્યારે દિવસો સારા નહોતા, ત્યારે પણ વાતો થઈ, મનની વાતો શેર થઈ…", "અને કદાચ એ જ સાચી મિત્રતાની સુંદરતા છે."] },
      { type: "text", ms: 6000, lines: [{ t: "સુખ હોય કે દુઃખ…", cls: "big" }, { t: "બધું share કરીએ છીએ.", cls: "big gold" }] },
      { type: "text", ms: 7500, lines: ["બધું એકલા સહન કરવાને બદલે કોઈ સાથે વહેંચી શકાય,", "તો જીવન થોડું સરળ બની જાય છે."] },
      { type: "text", ms: 2500, lines: [] },
      { type: "text", ms: 5000, lines: [{ t: "ક્યારેક advice જોઈએ…", cls: "big" }] },
      { type: "text", ms: 5000, lines: [{ t: "ક્યારેક ફક્ત સાંભળનાર.", cls: "big" }] },
      { type: "text", ms: 6500, lines: [{ t: "અને ઘણી વાર… એ તું હોય છે.", cls: "big gold" }] },
    ],
  },

  /* 12 — MY SUKOON */
  sukoon: {
    steps: [
      { type: "photo", mode: "card", glow: true, src: IMG + "memory-13.jpg", focus: "50% 30%", ms: 14000,
        lines: ["દુનિયામાં ઘણા લોકો મળે છે…", "પણ દરેક વ્યક્તિ સુકૂન નથી બનતી."] },
      { type: "text", ms: 9000, lines: ["તારી સાથે વાત કરું ત્યારે", "અંદરનો શોર થોડો ઓછો થઈ જાય છે."] },
      { type: "text", ms: 8000, lines: [{ t: "MY SUKOON", cls: "huge gold" }, { t: "તું મારું Sukoon છે. 🤍", cls: "big" }] },
      { type: "text", ms: 12000, lines: ["તું મારી એ સુકૂન છે.", "તારી સાથે વાત કરું ત્યારે ઘણી બધી વસ્તુઓ થોડી સરળ લાગે છે.", "કદાચ એટલે જ તારી સાથેની આ જગ્યા મારા માટે હંમેશા ખાસ રહેશે."] },
    ],
  },

  /* 13 — LITTLE CONFESSION */
  confess: {
    steps: [
      { type: "text", wait: true, hint: "Tap", lines: [{ t: "Can I confess something?", cls: "big" }] },
      { type: "text", ms: 6500, lines: [{ t: "હા… ક્યારેક jealousy થાય છે. 😂", cls: "big" }] },
      { type: "text", ms: 6500, lines: ["ક્યારેક તું કોઈ બીજા સાથે બહુ close હોય ને,", "ત્યારે થોડીક jealousy થાય છે… 😅"] },
      { type: "text", ms: 7000, lines: [{ t: "કદાચ કારણ એટલું જ છે કે તું મારા માટે બહુ special છે.", cls: "big" }] },
      { type: "text", ms: 8500, lines: [{ t: "પણ તારી ખુશી હંમેશા મારી આ નાની jealousy કરતાં મોટી રહેશે. 🤍", cls: "big gold" }] },
    ],
  },

  /* 14 — ALWAYS US */
  always: {
    steps: [
      { type: "text", ms: 12000, lines: [{ t: "Life બદલાશે.", cls: "big" }, { t: "Time બદલાશે.", cls: "big" }, { t: "આપણે પણ બદલાઈશું.", cls: "big" }] },
      { type: "text", ms: 6500, lines: [{ t: "પણ આપણું ‘આપણે’ ના બદલાય.", cls: "big gold" }] },
      { type: "text", ms: 9500, lines: [{ t: "આજે જેમ…", cls: "big" }, { t: "કાલે પણ.", cls: "big" }] },
      { type: "text", ms: 9500, lines: [{ t: "અને જેટલું જીવન allow કરે…", cls: "big" }, { t: "એટલું હંમેશા સાથે. ♾️", cls: "big gold" }] },
      { type: "text", ms: 17000, lines: ["જીવનમાં સમય બદલાતો રહેશે, દિવસો બદલાતા રહેશે અને નવી નવી યાદો બનતી રહેશે.", "આપણે હસીએ, વાતો કરીએ, એકબીજાની વાત સાંભળીએ અને જીવનની નાની નાની ખુશીઓ વહેંચતા રહીએ.", "આપણી આ સુંદર મિત્રતા હંમેશા આવી જ ખાસ રહે. ❤️"] },
    ],
  },

  /* FINAL SCREEN */
  end: {
    steps: [
      { type: "text", ms: 7500, lines: [{ t: "From the person who is really lucky to have you.", cls: "big" }] },
      { type: "text", ms: 7000, fadeMusic: true, lines: [{ t: "Riddhi • 16.11.2026", cls: "small gold" }] },
      { type: "text", ms: 3000, lines: [] },
    ],
  },
};

/* ---------------------------------------------------------------------
   15  FINAL LETTER  (letter.html) — she scrolls down to read it
   --------------------------------------------------------------------- */
const LETTER = {
  heading: "One Last Thing, Riddhuuu…",
  photo: IMG + "letter-photo.jpg",
  photoFocus: "50% 40%",
  photoCaption: ["એક તસવીરમાં બે લોકો હોય છે…", "પણ એની અંદર ઘણી બધી વાતો, હાસ્ય અને યાદો છુપાયેલી હોય છે.", "આવી જ એક યાદ હંમેશા સાચવી રાખવાની છે."],
  paragraphs: [
    "રિદ્ધા…",
    "શરૂઆતમાં ખબર નહોતી કે એક મેસેજ ક્યાં લઈ જશે.",
    "આજે પાછળ વળીને જોઉં છું તો લાગે છે કે એ મેસેજ મારી જિંદગીની સૌથી સુંદર શરૂઆતમાંથી એક હતો.",
    "આપણે ખુશીઓ શેર કરી, દુઃખ શેર કર્યા, હસ્યા, વાતો કરી અને ઘણી બધી યાદો બનાવી.",
    "સમય બદલાય, જીવન બદલાય, પરિસ્થિતિ બદલાય…",
    "પણ મારી એક ઈચ્છા હંમેશા રહેશે કે આપણી આ સુંદર મિત્રતા એવી જ સાચી અને ખાસ રહે.",
    "હંમેશા ખુશ રહેજે, હસતી રહેજે…",
    "અને મારી જિંદગીની આ સુંદર યાદ બનીને હંમેશા એવી જ રહેજે.",
  ],
  birthday: "Happy Birthday, Riddhaa ❤️",
  endingLines: ["અને હા…", "મારી Baka જ રહેજે. 😂🫶"],
  finalPhoto: IMG + "final-photo.jpg",
  finalPhotoFocus: "50% 30%",
  button: "આગળ →",
};
