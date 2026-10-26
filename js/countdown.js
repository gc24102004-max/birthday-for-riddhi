/* =====================================================================
   countdown.js — glass countdown cards, then (the moment it reaches zero)
   the birthday reveal. Texts come from COUNTDOWN and REVEAL in data.js.
   ===================================================================== */
(function () {
  "use strict";
  var grid = document.getElementById("cdGrid");
  if (!grid || !window.RB) return;
  var RB = window.RB;
  var body = document.body;
  var range = RB.birthRange();
  var timer = null, revealed = false;

  document.getElementById("cdDate").textContent = COUNTDOWN.date;
  document.getElementById("cdLine").textContent = COUNTDOWN.line;

  var nums = [];
  COUNTDOWN.labels.forEach(function (label) {
    var card = RB.el("div", "cd-card");
    var n = RB.el("span", "cd-num");
    n.appendChild(RB.el("span", "", "0"));
    card.appendChild(n);
    card.appendChild(RB.el("span", "cd-label", label));
    grid.appendChild(card);
    nums.push(n);
  });

  function setNum(el, v) {
    if (el.getAttribute("data-v") === v) return;
    var first = el.getAttribute("data-v") === null;
    el.setAttribute("data-v", v);
    if (first) { el.firstChild.textContent = v; return; }
    var old = el.firstChild;
    var fresh = RB.el("span", RB.reducedMotion() ? "" : "in", v);
    el.appendChild(fresh);
    if (RB.reducedMotion()) { el.removeChild(old); return; }
    old.className = "out";
    setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 500);
  }
  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function tick() {
    if (!range) return;
    var now = RB.now();
    if (now >= range.start) { startReveal(); return; }
    var total = Math.max(0, Math.floor((range.start - now) / 1000));
    setNum(nums[0], String(Math.floor(total / 86400)));
    setNum(nums[1], pad(Math.floor((total % 86400) / 3600)));
    setNum(nums[2], pad(Math.floor((total % 3600) / 60)));
    setNum(nums[3], pad(total % 60));
  }

  /* ------------------------------------------------ birthday reveal */
  function startReveal() {
    if (revealed) return;
    revealed = true;
    clearInterval(timer);
    RB.music.refresh();            // switch to the birthday song
    var ov = RB.el("div", "reveal");
    ov.setAttribute("role", "region");
    ov.setAttribute("aria-label", "Birthday");
    var stack = RB.el("div", "r-stack");
    ov.appendChild(stack);
    body.appendChild(ov);

    var day = RB.el("div", "r-day", REVEAL.day);
    var month = RB.el("div", "r-item r-month", REVEAL.month);
    var name = RB.el("div", "r-item r-name", REVEAL.name);
    var wish = RB.el("p", "r-item r-wish", REVEAL.wish);
    var line = RB.el("p", "r-item r-line", REVEAL.line);
    var open = RB.el("a", "btn-glow pulse r-item", REVEAL.button);
    open.href = RB.fileOf("childhood");

    if (RB.reducedMotion()) {
      [day, month, name, wish, line, open].forEach(function (n) { stack.appendChild(n); });
      RB.music.setLevel(1, 500);
      return;
    }
    var seq = [
      { ms: 900, fn: function () {} },
      { ms: 2400, fn: function () { stack.appendChild(day); } },
      { ms: 2000, fn: function () { stack.appendChild(month); } },
      { ms: 3000, fn: function () { stack.appendChild(name); RB.music.setLevel(0.9, 2500); } },
      { ms: 1100, fn: function () { stack.style.transition = "opacity 0.9s ease"; stack.style.opacity = "0"; } },
      { ms: 3000, fn: function () { stack.textContent = ""; stack.style.opacity = "1"; stack.appendChild(wish); RB.music.setLevel(1, 2500); } },
      { ms: 3200, fn: function () { stack.appendChild(line); } },
      { ms: 0, fn: function () { stack.appendChild(open); } },
    ];
    var rp = Math.max(RB.pace, 0.7);  // the reveal stays a little dramatic
    seq.forEach(function (x) { x.ms = Math.round(x.ms * rp); });
    var i = 0, t = null;
    function run() {
      if (i >= seq.length) return;
      var s = seq[i++];
      s.fn();
      if (s.ms > 0) t = setTimeout(run, s.ms);
    }
    ov.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) return;
      clearTimeout(t);
      run();                       // tap = jump to the next moment
    });
    run();
  }

  /* ------------------------------------------------------ test tools */
  if (!LOCK_UNTIL_BIRTHDAY || RB.helpers) {
    var host = document.getElementById("cdTest");
    function p2(n) { return n < 10 ? "0" + n : String(n); }
    function iso(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()) + "T" + p2(d.getHours()) + ":" + p2(d.getMinutes()) + ":" + p2(d.getSeconds()); }
    if (range && host) {
      var panel = RB.el("div", "test-panel");
      panel.appendChild(RB.el("p", "", LOCK_UNTIL_BIRTHDAY ? "Test panel (sirf aapke computer par):" : "TEST MODE (lock band hai, final me LOCK_UNTIL_BIRTHDAY = true karna):"));
      var ul = RB.el("ul");
      var items = [
        ["Countdown ke last 15 second", "countdown.html?now=" + encodeURIComponent(iso(new Date(range.start.getTime() - 15000)))],
        ["Birthday shuru (reveal dekho)", "countdown.html?now=" + encodeURIComponent(iso(new Date(range.start.getTime() + 1000)))],
        ["Asli time par wapas", "countdown.html?now=off"],
      ];
      if (!LOCK_UNTIL_BIRTHDAY) items.unshift(["Countdown skip karke seedha aage", RB.fileOf("childhood")]);
      items.forEach(function (x) {
        var li = document.createElement("li");
        var a = RB.el("a", "", x[0]);
        a.href = x[1];
        li.appendChild(a);
        ul.appendChild(li);
      });
      panel.appendChild(ul);
      host.appendChild(panel);
    }
  }

  tick();
  if (!revealed) timer = setInterval(tick, 1000);
})();
