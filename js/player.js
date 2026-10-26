/* =====================================================================
   player.js — plays a chapter from STORY (data.js), like story screens:
   • steps advance by themselves (slowly enough to read)
   • tap the right side = next, left side = back, swipe, or touch-and-hold = pause
   • keyboard: arrow keys / space, P = pause
   • for visitors who prefer reduced motion, nothing advances by itself
   All text is written with textContent (safe).
   ===================================================================== */
(function () {
  "use strict";
  var root = document.getElementById("player");
  if (!root || !window.RB || typeof STORY === "undefined") return;
  var RB = window.RB;
  var page = RB.page;
  var story = STORY[page];
  if (!story || !story.steps || !story.steps.length) return;

  var steps = story.steps;
  var reduced = RB.reducedMotion();
  var pace = RB.pace;
  var chainPace = Math.max(pace, 0.7);   // single words need a little more time
  root.style.setProperty("--stagger", (1.1 * pace).toFixed(2) + "s");
  root.style.setProperty("--base", (0.2 * pace).toFixed(2) + "s");
  var auto = !reduced;
  var idx = -1, token = 0, finished = false;
  var timer = null, remaining = 0, startedAt = 0, timed = false, ctaTimer = null;
  var userPaused = false, holdPaused = false;
  var nextFile = RB.nextFile(page);
  var bgKey = "", bgActive = 0;

  /* -------------------------------------------------------- skeleton */
  function makeBg() {
    var d = RB.el("div", "bg-layer");
    d.setAttribute("aria-hidden", "true");
    d.appendChild(document.createElement("img"));
    root.appendChild(d);
    return d;
  }
  var bgs = [makeBg(), makeBg()];
  var progress = RB.el("div", "progress");
  progress.setAttribute("aria-hidden", "true");
  var segs = steps.map(function () {
    var s = RB.el("span", "seg");
    s.appendChild(RB.el("span", "fill"));
    progress.appendChild(s);
    return s;
  });
  root.appendChild(progress);
  var stage = RB.el("div", "stage");
  stage.setAttribute("aria-live", "polite");
  root.appendChild(stage);

  var controls = RB.el("div", "controls");
  function ctl(label, text) {
    var b = RB.el("button", "icon-btn", text);
    b.type = "button";
    b.setAttribute("aria-label", label);
    controls.appendChild(b);
    return b;
  }
  var bPrev = ctl("Previous", "\u2039");
  var bPause = ctl("Pause", "\u275A\u275A");
  var bNext = ctl("Next", "\u203A");
  root.appendChild(controls);
  var ctaWrap = RB.el("div", "cta-wrap");
  ctaWrap.hidden = true;
  root.appendChild(ctaWrap);
  if (story.minimalUI) document.body.classList.add("quiet-ui");

  // warm the photos
  steps.forEach(function (s) { if (s.src) { var im = new Image(); im.src = RB.src(s.src); } if (s.bg && s.bg.src) { var im2 = new Image(); im2.src = RB.src(s.bg.src); } });

  /* ----------------------------------------------------- backgrounds */
  function setBg(spec) {
    var key = spec ? [spec.src, spec.focus || "", spec.blur ? 1 : 0, spec.zoom ? 1 : 0].join("|") : "";
    if (key === bgKey) return;
    bgKey = key;
    var old = bgs[bgActive];
    if (!spec) { old.classList.remove("on"); return; }
    var layer = bgs[1 - bgActive];
    var img = layer.firstChild;
    img.onerror = function () { layer.classList.remove("on"); };
    img.src = RB.src(spec.src);
    img.style.objectPosition = spec.focus || "50% 35%";
    layer.classList.toggle("blur", !!spec.blur);
    layer.classList.remove("zoom");
    void layer.offsetWidth;
    if (spec.zoom && !reduced) layer.classList.add("zoom");
    layer.classList.add("on");
    old.classList.remove("on");
    bgActive = 1 - bgActive;
  }

  /* ------------------------------------------------------ step content */
  function makeLines(arr, startAt, cls) {
    var box = RB.el("div", "lines" + (cls ? " " + cls : ""));
    (arr || []).forEach(function (l, k) {
      var text = typeof l === "string" ? l : l.t;
      var c = typeof l === "string" ? "" : l.cls || "";
      var p = RB.el("p", "line " + c, text);
      p.style.setProperty("--i", String(k + (startAt || 0)));
      box.appendChild(p);
    });
    return box;
  }

  function makeImg(step, wrap) {
    var img = document.createElement("img");
    img.alt = step.alt || "Photo of " + HER_NAME;
    img.decoding = "async";
    img.style.objectPosition = step.focus || "50% 30%";
    img.onerror = function () { if (img.parentNode) img.parentNode.removeChild(img); wrap.classList.add("missing"); };
    img.src = RB.src(step.src);
    wrap.appendChild(img);
    return img;
  }

  function calcMs(step) {
    if (step.type === "chain") return Math.round(((step.words || []).length * 1250 * chainPace) + 4200 * pace);
    var chars = 0;
    var lines = step.lines || [];
    lines.forEach(function (l) { chars += (typeof l === "string" ? l : l.t).length; });
    return Math.round((3200 + chars * 70 + lines.length * 1000) * pace);
  }

  function buildStep(step) {
    var el = RB.el("div", "step type-" + step.type);
    if (step.type === "photo") {
      el.classList.add("mode-" + (step.mode || "card"));
      if (step.mode === "full") {
        el.classList.add("is-full");
        var hasText = step.label || (step.lines && step.lines.length);
        if (hasText) {
          var g = RB.el("div", "glass");
          var base = 0;
          if (step.label) { var lab = RB.el("p", "label", step.label); lab.style.setProperty("--i", "0"); g.appendChild(lab); base = 1; }
          if (step.lines && step.lines.length) g.appendChild(makeLines(step.lines, base));
          el.appendChild(g);
        }
      } else if (step.mode === "polaroid") {
        var pol = RB.el("div", "polaroid");
        pol.style.setProperty("--rot", (step.rot || 0) + "deg");
        var pic = RB.el("div", "pic");
        pol.appendChild(pic);
        makeImg(step, pic);
        el.appendChild(pol);
        el.appendChild(makeLines((step.lines || []).map(function (t) { return typeof t === "string" ? { t: t, cls: "hand" } : t; }), 1, "card-lines"));
      } else {
        if (step.glow) el.classList.add("is-glow");
        var start = 0;
        if (step.name) {
          el.classList.add("has-name");
          var nt = RB.el("p", "name-tag" + (step.nameCls ? " " + step.nameCls : ""), step.name);
          nt.style.setProperty("--i", "0");
          el.appendChild(nt);
          start = 1;
        }
        var frame = RB.el("div", "card-frame");
        makeImg(step, frame);
        el.appendChild(frame);
        el.appendChild(makeLines(step.lines, start, "card-lines"));
      }
    } else if (step.type === "chain") {
      var chain = RB.el("div", "chain");
      (step.words || []).forEach(function (w, k) {
        var d = RB.el("div", "word", w);
        d.style.animationDelay = (k * 1.25 * chainPace).toFixed(2) + "s";
        d.style.animationDuration = (1.3 * chainPace).toFixed(2) + "s";
        chain.appendChild(d);
      });
      if (step.final) {
        var f = RB.el("div", "word final", step.final);
        f.style.animationDelay = ((step.words || []).length * 1.25 * chainPace).toFixed(2) + "s";
        chain.appendChild(f);
      }
      el.appendChild(chain);
    } else {
      el.appendChild(makeLines(step.lines, 0));
      if (step.wait) {
        var h = RB.el("p", "hint", step.hint || "Tap");
        h.style.setProperty("--i", String((step.lines || []).length + 1));
        el.appendChild(h);
      }
    }
    return el;
  }

  /* ----------------------------------------------------------- timing */
  function isPaused() { return userPaused || holdPaused || document.hidden; }
  function schedule(ms) {
    clearTimeout(timer);
    remaining = ms;
    startedAt = Date.now();
    timer = setTimeout(advance, ms);
  }
  function pauseTimer() {
    if (!timer) return;
    clearTimeout(timer);
    timer = null;
    remaining -= Date.now() - startedAt;
  }
  function resumeTimer() {
    if (timer || !timed || finished || remaining <= 0) return;
    startedAt = Date.now();
    timer = setTimeout(advance, remaining);
  }
  function applyPause() {
    var p = isPaused();
    root.classList.toggle("is-paused", p);
    if (p) pauseTimer(); else resumeTimer();
    bPause.textContent = userPaused ? "\u25B6" : "\u275A\u275A";
    bPause.setAttribute("aria-label", userPaused ? "Play" : "Pause");
  }

  function markProgress(n, running, ms) {
    segs.forEach(function (s, k) {
      s.className = "seg" + (k < n ? " done" : "");
      s.style.removeProperty("--dur");
    });
    var cur = segs[n];
    if (running) { cur.style.setProperty("--dur", ms + "ms"); cur.classList.add("run"); }
  }

  function showCta() {
    if (!ctaWrap.hidden) return;
    ctaWrap.hidden = false;
    if (nextFile) {
      var a = RB.el("a", "btn-glow pulse", story.cta || "Continue \u2192");
      a.href = nextFile;
      ctaWrap.appendChild(a);
    } else {
      var r = RB.el("a", "btn-glow btn-quiet", "Start again");
      r.href = "index.html";
      ctaWrap.appendChild(r);
    }
  }

  /* ------------------------------------------------------------- flow */
  function show(n) {
    idx = n;
    token++;
    clearTimeout(timer);
    timer = null;
    clearTimeout(ctaTimer);
    var step = steps[n];

    var old = stage.querySelector(".step:not(.is-leaving)");
    if (old) {
      if (reduced) { stage.removeChild(old); }
      else { old.classList.add("is-leaving"); setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 450); }
    }
    var el = buildStep(step);
    if (!reduced) el.classList.add("is-entering");
    stage.appendChild(el);

    var spec = step.bg || null;
    if (step.type === "photo") {
      if (step.mode === "full") spec = { src: step.src, focus: step.focus, zoom: true };
      else if (step.bgBlur) spec = { src: step.src, focus: step.focus, blur: true };
    }
    setBg(spec);
    root.classList.toggle("has-grain", step.type === "photo" && step.mode === "full");

    if (typeof step.level === "number") RB.music.setLevel(step.level, 2500);
    if (step.fadeMusic) RB.music.fadeOut(7000);

    var ms = step.wait ? 0 : step.ms ? Math.round(step.ms * pace) : calcMs(step);
    timed = auto && ms > 0;
    markProgress(n, timed, ms);
    if (timed) {
      schedule(ms);
      if (isPaused()) pauseTimer();
    }
    if (n === steps.length - 1) {
      ctaTimer = setTimeout(showCta, timed ? Math.min(ms, 3500) : 1200);
    }
    bPrev.disabled = n === 0;
    bPrev.style.opacity = n === 0 ? "0.35" : "";
  }

  function finish() {
    finished = true;
    clearTimeout(timer);
    timer = null;
    segs.forEach(function (s) { s.className = "seg done"; });
    showCta();
  }
  function advance() {
    if (idx >= steps.length - 1) { finish(); return; }
    show(idx + 1);
  }
  function next() { if (finished) return; advance(); }
  function prev() { if (idx > 0) { finished = false; show(idx - 1); } }

  /* ------------------------------------------------------ interaction */
  var down = null, holdT = null, holding = false;
  function interactive(t) { return !!(t.closest && t.closest("a, button, .menu")); }
  root.addEventListener("pointerdown", function (e) {
    if (interactive(e.target)) return;
    down = { x: e.clientX, y: e.clientY };
    holding = false;
    clearTimeout(holdT);
    holdT = setTimeout(function () { holding = true; holdPaused = true; applyPause(); }, 340);
  });
  function release(e) {
    if (!down) return;
    clearTimeout(holdT);
    var d = down;
    down = null;
    if (holding) { holding = false; holdPaused = false; applyPause(); return; }
    if (e.type === "pointercancel") return;
    var dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { if (dx < 0) next(); else prev(); return; }
    if (d.x < root.clientWidth * 0.3) prev(); else next();
  }
  root.addEventListener("dragstart", function (e) { e.preventDefault(); });
  root.addEventListener("contextmenu", function (e) { if (!interactive(e.target)) e.preventDefault(); });
  root.addEventListener("pointerup", release);
  root.addEventListener("pointercancel", release);
  bPrev.addEventListener("click", prev);
  bNext.addEventListener("click", next);
  bPause.addEventListener("click", function () { userPaused = !userPaused; applyPause(); });
  document.addEventListener("visibilitychange", applyPause);
  document.addEventListener("keydown", function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === "A" || tag === "BUTTON") { if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return; }
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "p" || e.key === "P") { userPaused = !userPaused; applyPause(); }
  });

  if (!auto) { bPause.hidden = true; }
  RB.player = { index: function () { return idx; }, count: steps.length, goto: function (n) { show(n); }, next: next, prev: prev };
  show(0);
})();
