/* =====================================================================
   core.js — shared by every page: clock + test time, the lock, the top bar
   and chapter menu, stars, soft page transitions and the music.
   Text from data.js is only ever written with textContent (safe).
   ===================================================================== */
(function () {
  "use strict";
  if (typeof PAGES === "undefined") { console.error("js/data.js did not load."); return; }

  var RB = (window.RB = {});
  var body = document.body;
  var page = body.getAttribute("data-page") || "index";
  var cfg = PAGES[page] || {};

  /* ------------------------------------------------------------ helpers */
  RB.reducedMotion = function () {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  };
  RB.el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  };
  RB.src = function (p) { return encodeURI(p); };
  RB.page = page;
  RB.pace = typeof SETTINGS.pace === "number" ? Math.min(1.5, Math.max(0.25, SETTINGS.pace)) : 1;
  document.documentElement.style.setProperty("--pace", String(RB.pace));

  var host = location.hostname;
  var isLocal = location.protocol === "file:" || host === "" || host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  RB.helpers = SETTINGS.previewHelpers === "auto" ? isLocal : !!SETTINGS.previewHelpers;

  /* -------------------------------------------- clock (+ test clock) */
  // Open any page with ?now=2026-11-15T23:59:45 to pretend it is that moment
  // (the clock keeps ticking and is remembered in this browser tab).
  // ?now=off goes back to the real time.
  var OFFSET = (function () {
    var q = new URLSearchParams(location.search).get("now");
    try {
      if (q === "off" || q === "real") { sessionStorage.removeItem("rb_now_offset"); return 0; }
      if (q) {
        var t = new Date(q);
        if (!isNaN(t.getTime())) {
          var off = t.getTime() - Date.now();
          try { sessionStorage.setItem("rb_now_offset", String(off)); } catch (e) {}
          return off;
        }
      }
      var s = sessionStorage.getItem("rb_now_offset");
      return s ? Number(s) || 0 : 0;
    } catch (e) {
      var tt = q ? new Date(q) : null;
      return tt && !isNaN(tt.getTime()) ? tt.getTime() - Date.now() : 0;
    }
  })();
  RB.now = function () { return new Date(Date.now() + OFFSET); };

  RB.birthRange = function () {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(BIRTHDAY_DATE || "");
    if (!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = +m[3];
    var start = new Date(y, mo, d, 0, 0, 0, 0);
    if (isNaN(start.getTime()) || start.getMonth() !== mo || start.getDate() !== d) return null;
    return { start: start, end: new Date(y, mo, d + 1, 0, 0, 0, 0) };
  };
  RB.beforeBirthday = function () {
    var r = RB.birthRange();
    return !!r && RB.now() < r.start;
  };
  RB.locked = function () { return !!LOCK_UNTIL_BIRTHDAY && RB.beforeBirthday(); };

  RB.fileOf = function (key) { return (PAGES[key] || {}).file || "index.html"; };
  RB.nextFile = function (key) {
    var i = ORDER.indexOf(key);
    return i >= 0 && i < ORDER.length - 1 ? RB.fileOf(ORDER[i + 1]) : null;
  };

  /* --------------------------------------------------------------- lock */
  // FINAL MODE: before the birthday only the first two pages open.
  if (RB.locked() && page !== "index" && page !== "countdown") {
    location.replace("countdown.html");
    return;
  }

  /* ----------------------------------------------------------- body setup */
  body.classList.add("theme-" + (cfg.theme || "night"));
  if (cfg.quiet || cfg.chrome === false) body.classList.add("quiet-ui");
  var bd = RB.el("div", "backdrop");
  bd.setAttribute("aria-hidden", "true");
  body.insertBefore(bd, body.firstChild);

  /* -------------------------------------------------- soft transitions */
  RB.go = function (url, delay) {
    if (RB.reducedMotion()) { location.assign(url); return; }
    body.classList.add("is-leaving");
    setTimeout(function () { location.assign(url); }, delay || 620);
  };
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest ? e.target.closest("a[href]") : null;
    if (!a || a.target === "_blank" || a.hasAttribute("data-plain")) return;
    var href = a.getAttribute("href");
    if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(href)) return;
    if (a.origin && a.origin !== location.origin && location.protocol !== "file:") return;
    e.preventDefault();
    RB.go(a.href);
  });
  window.addEventListener("pageshow", function () { body.classList.remove("is-leaving", "entering"); });

  /* -------------------------------------------------------------- stars */
  function startStars() {
    var canvas = RB.el("canvas", "stars");
    canvas.setAttribute("aria-hidden", "true");
    body.insertBefore(canvas, bd.nextSibling);
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, stars = [], raf = 0;
    var still = RB.reducedMotion();
    function seed() {
      var n = Math.round((W * H) / (W < 600 ? 6500 : 9000));
      stars = [];
      for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: 0.4 + Math.random() * 1.2, v: 0.02 + Math.random() * 0.07, p: Math.random() * 6.28, tw: 0.4 + Math.random() * 1.3 });
    }
    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0);
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!still) { s.y -= s.v; if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; } }
        var a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 0.001 * s.tw + s.p));
        ctx.fillStyle = "rgba(255,236,214," + a.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
      }
    }
    function frame(t) { draw(t); raf = requestAnimationFrame(frame); }
    resize();
    window.addEventListener("resize", resize);
    if (!still) {
      raf = requestAnimationFrame(frame);
      document.addEventListener("visibilitychange", function () {
        cancelAnimationFrame(raf);
        if (!document.hidden) raf = requestAnimationFrame(frame);
      });
    }
  }
  if (cfg.stars) startStars();
  if (cfg.theme === "sukoon") body.insertBefore(RB.el("div", "glow"), bd.nextSibling);

  /* ----------------------------------------------------------- top bar */
  var tools = null;
  function buildChrome() {
    var bar = RB.el("header", "chrome");
    var ch = RB.el("div", "chapter");
    if (cfg.chapter) ch.appendChild(RB.el("span", "ch-num", cfg.chapter + " /"));
    if (cfg.title) ch.appendChild(RB.el("span", "ch-title", cfg.title));
    bar.appendChild(ch);
    tools = RB.el("div", "chrome-tools");
    bar.appendChild(tools);
    body.appendChild(bar);

    if (RB.locked() || cfg.chrome === false) return; // FINAL MODE before the birthday: no way to jump ahead
    var menuBtn = RB.el("button", "icon-btn", "\u2261");
    menuBtn.type = "button";
    menuBtn.setAttribute("aria-label", "Open chapters");
    menuBtn.setAttribute("aria-haspopup", "dialog");
    tools.appendChild(menuBtn);

    var menu = RB.el("nav", "menu");
    menu.hidden = true;
    menu.setAttribute("aria-label", "Chapters");
    var ol = RB.el("ol");
    ORDER.forEach(function (key) {
      var p = PAGES[key];
      var li = document.createElement("li");
      var a = RB.el("a");
      a.href = p.file;
      a.appendChild(RB.el("span", "n", p.chapter || "\u2022"));
      a.appendChild(RB.el("span", "t", p.title || (key === "end" ? "THE END" : key.toUpperCase())));
      if (key === page) a.setAttribute("aria-current", "page");
      li.appendChild(a);
      ol.appendChild(li);
    });
    var close = RB.el("button", "icon-btn menu-close", "\u2715");
    close.type = "button";
    close.setAttribute("aria-label", "Close chapters");
    menu.appendChild(close);
    menu.appendChild(ol);
    body.appendChild(menu);
    function setOpen(o) {
      menu.hidden = !o;
      menuBtn.setAttribute("aria-expanded", o ? "true" : "false");
      if (o) close.focus(); else menuBtn.focus();
    }
    menuBtn.addEventListener("click", function () { setOpen(true); });
    close.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) setOpen(false); });
  }
  buildChrome();

  /* -------------------------------------------------------------- music */
  // Two optional tracks (before / after the countdown). Browsers allow sound
  // only after a tap, so it starts on her first tap and then carries on from
  // the same position on every page. Each chapter has its own volume level.
  RB.music = { refresh: function () {}, setLevel: function () {}, fadeOut: function () {}, current: function () { return null; }, paused: function () { return true; } };

  function initMusic() {
    function clean(v) { return typeof v === "string" && v.trim() ? v.trim() : ""; }
    var trackBefore = clean(AUDIO.countdownTrack), trackAfter = clean(AUDIO.birthdayTrack);
    if ((!trackBefore && !trackAfter) || typeof Audio === "undefined") return;
    var vol = typeof AUDIO.volume === "number" ? Math.min(1, Math.max(0, AUDIO.volume)) : 0.8;
    var level = typeof cfg.level === "number" ? cfg.level : 0.6;
    var audio = new Audio();
    audio.loop = true; audio.preload = "auto"; audio.volume = 0;
    var failed = {}, current = null, pendingSeek = 0, btn = null, armed = false, phaseTimer = null, rampTimer = null;

    function readStore() { try { return JSON.parse(sessionStorage.getItem("rb_music") || "null") || {}; } catch (e) { return {}; } }
    function saveStore() { try { sessionStorage.setItem("rb_music", JSON.stringify({ path: current, t: audio.currentTime || 0 })); } catch (e) {} }
    function userPaused() { try { return sessionStorage.getItem("rb_music_paused") === "1"; } catch (e) { return false; } }
    function setUserPaused(v) { try { sessionStorage.setItem("rb_music_paused", v ? "1" : "0"); } catch (e) {} }
    function target() { return vol * level; }

    function wanted() {
      var list = RB.beforeBirthday() ? [trackBefore, trackAfter] : [trackAfter, trackBefore];
      for (var i = 0; i < list.length; i++) if (list[i] && !failed[list[i]]) return list[i];
      return null;
    }
    function updateBtn() {
      if (!btn) return;
      var on = !audio.paused;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-label", on ? "Pause music" : "Play music");
    }
    function ramp(to, ms, done) {
      clearInterval(rampTimer);
      var from = audio.volume, steps = Math.max(1, Math.round((ms || 800) / 50)), n = 0;
      rampTimer = setInterval(function () {
        n++;
        audio.volume = Math.min(1, Math.max(0, from + (to - from) * (n / steps)));
        if (n >= steps) { clearInterval(rampTimer); if (done) done(); }
      }, 50);
    }
    function disarm() { armed = false; ["click", "touchend", "keydown"].forEach(function (ev) { document.removeEventListener(ev, onGesture, true); }); }
    function onGesture(e) { if (btn && btn.contains(e.target)) return; disarm(); if (!userPaused()) tryPlay(); }
    function armGesture() { if (armed) return; armed = true; ["click", "touchend", "keydown"].forEach(function (ev) { document.addEventListener(ev, onGesture, true); }); }
    function tryPlay() {
      if (!current) return;
      audio.volume = 0;
      var p = audio.play();
      if (p && p.then) p.then(function () { ramp(target(), 1400); updateBtn(); }).catch(function () { if (current && !failed[current]) armGesture(); });
    }
    function apply(initial) {
      var w = wanted();
      if (!w) { audio.pause(); current = null; if (btn && btn.parentNode) btn.parentNode.removeChild(btn); btn = null; return; }
      if (w === current) return;
      var store = initial ? readStore() : {};
      pendingSeek = store.path === w ? store.t || 0 : 0;
      current = w; audio.src = w;
      if (!userPaused()) tryPlay();
    }
    function schedule() {
      clearTimeout(phaseTimer);
      var r = RB.birthRange(); if (!r) return;
      var ms = r.start - RB.now(); if (ms <= 0) return;
      phaseTimer = setTimeout(function () { apply(false); schedule(); }, Math.min(ms + 50, 2147483000));
    }
    function build() {
      if (btn || !tools) return;
      btn = RB.el("button", "icon-btn music-btn", "\u266A");
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Play music");
      tools.insertBefore(btn, tools.firstChild);
      btn.addEventListener("click", function () {
        if (audio.paused) { setUserPaused(false); tryPlay(); } else { setUserPaused(true); audio.pause(); }
        updateBtn();
      });
      updateBtn();
    }
    audio.addEventListener("loadedmetadata", function () {
      build();
      if (pendingSeek > 0 && isFinite(audio.duration) && pendingSeek < audio.duration) { try { audio.currentTime = pendingSeek; } catch (e) {} }
      pendingSeek = 0;
    });
    audio.addEventListener("play", updateBtn);
    audio.addEventListener("pause", updateBtn);
    audio.addEventListener("error", function () { if (current) failed[current] = true; current = null; apply(false); });
    window.addEventListener("pagehide", saveStore);
    document.addEventListener("visibilitychange", function () { if (document.hidden) saveStore(); });

    RB.music = {
      refresh: function () { apply(false); schedule(); },
      setLevel: function (l, ms) { level = Math.min(1, Math.max(0, l)); if (!audio.paused) ramp(target(), ms || 1500); },
      fadeOut: function (ms) { ramp(0, ms || 6000, function () { audio.pause(); setUserPaused(true); updateBtn(); }); },
      current: function () { return current; },
      paused: function () { return audio.paused; },
      level: function () { return level; },
      debug: function () {
        return { current: current, failed: failed, paused: audio.paused, volume: audio.volume, level: level, ready: audio.readyState, net: audio.networkState,
                 err: audio.error ? audio.error.code : 0, armed: armed, userPaused: userPaused(), tracks: [trackBefore, trackAfter], btn: !!btn };
      },
      playNow: function () { audio.volume = target(); return audio.play(); },
    };
    apply(true);
    schedule();
  }
  initMusic();

  /* ------------------------------------------- music check (?music=debug) */
  // Open any page with ?music=debug to see, on screen, why the music is or is
  // not playing (file found? format ok? waiting for a tap?).
  if (new URLSearchParams(location.search).get("music") === "debug") {
    var box = RB.el("div", "music-debug");
    box.style.cssText = "position:fixed;left:8px;right:8px;bottom:8px;z-index:200;max-height:62vh;overflow:auto;padding:12px 14px;border-radius:14px;background:rgba(0,0,0,.92);border:1px solid #e9c98f;color:#f7ebe0;font:12px/1.5 ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap";
    var out = RB.el("div"); box.appendChild(out);
    var tapBtn = RB.el("button", "", "Test play (tap me)");
    tapBtn.style.cssText = "margin-top:8px;min-height:44px;padding:0 16px;border-radius:999px;border:1px solid #e9c98f;background:#2a0a18;color:#f7ebe0;font:600 14px system-ui";
    var res = RB.el("div"); res.style.marginTop = "6px";
    box.appendChild(tapBtn); box.appendChild(res);
    document.body.appendChild(box);
    var files = {};
    [AUDIO.countdownTrack, AUDIO.birthdayTrack].forEach(function (u) {
      if (typeof u !== "string" || !u.trim()) { return; }
      files[u] = "checking...";
      if (location.protocol === "file:" || typeof fetch !== "function") { files[u] = "(cannot check from a local file)"; return; }
      fetch(u, { method: "HEAD" }).then(function (r) {
        var size = r.headers.get("content-length");
        files[u] = "HTTP " + r.status + " | " + (r.headers.get("content-type") || "no type") + (size ? " | " + Math.round(size / 1024) + " KB" : "");
      }).catch(function (e) { files[u] = "request failed: " + e.message; });
    });
    var ERR = { 0: "none", 1: "aborted", 2: "network error", 3: "decode error (file is damaged / wrong format)", 4: "file not found or format not supported" };
    function paint() {
      var d = RB.music.debug ? RB.music.debug() : null;
      var lines = ["MUSIC CHECK  (page: " + page + ")", "time phase: " + (RB.beforeBirthday() ? "BEFORE birthday -> countdown song" : "birthday started -> birthday song"), ""];
      Object.keys(files).forEach(function (u) { lines.push(u + "\n   -> " + files[u]); });
      if (!d) { lines.push("", "No song is set up (check AUDIO in js/data.js)."); }
      else {
        lines.push("", "song in use: " + (d.current || "none"));
        lines.push("playing: " + (d.paused ? "NO" : "YES") + "   volume: " + d.volume.toFixed(2) + "   level: " + d.level);
        lines.push("waiting for a tap: " + (d.armed ? "YES (tap anywhere once)" : "no") + "   music button shown: " + (d.btn ? "yes" : "no"));
        lines.push("paused by you earlier: " + (d.userPaused ? "YES (press the music button)" : "no"));
        lines.push("file error: " + ERR[d.err] + "   (readyState " + d.ready + ")");
        var bad = Object.keys(d.failed);
        if (bad.length) lines.push("FAILED to load: " + bad.join(", "));
      }
      out.textContent = lines.join("\n");
    }
    tapBtn.addEventListener("click", function () {
      if (!RB.music.playNow) { res.textContent = "No song is set up."; return; }
      var pr = RB.music.playNow();
      if (pr && pr.then) pr.then(function () { res.textContent = "play() worked. If you still hear nothing: check phone volume / silent switch."; })
        .catch(function (e) { res.textContent = "play() failed: " + e.name + " - " + e.message; });
    });
    paint();
    setInterval(paint, 800);
  }

  /* ------------------------------------------------------- opening page */
  var enter = document.getElementById("enter");
  if (enter) {
    document.querySelector(".hero-title").textContent = OPENING.title;
    document.querySelector(".hero-sub").textContent = OPENING.subtitle;
    enter.textContent = OPENING.button;
    enter.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      body.classList.add("entering");
      setTimeout(function () { location.assign(enter.href); }, RB.reducedMotion() ? 0 : 900);
    });
  }
})();
