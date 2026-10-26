/* =====================================================================
   letter.js — the final letter (letter.html). She scrolls down; each part
   appears slowly as it comes into view. Text comes from LETTER in data.js.
   ===================================================================== */
(function () {
  "use strict";
  var wrap = document.getElementById("letter");
  if (!wrap || !window.RB || typeof LETTER === "undefined") return;
  var RB = window.RB;
  var fx = [];

  function add(node, cls) { node.classList.add("fx"); if (cls) node.classList.add(cls); wrap.appendChild(node); fx.push(node); return node; }
  function polaroid(src, focus, cls, caption) {
    var fig = RB.el("figure", cls);
    var pic = RB.el("div", "pic");
    var img = document.createElement("img");
    img.alt = "Photo of " + HER_NAME;
    img.decoding = "async";
    img.loading = "lazy";
    img.style.objectPosition = focus || "50% 30%";
    img.onerror = function () { fig.hidden = true; };
    img.src = RB.src(src);
    pic.appendChild(img);
    fig.appendChild(pic);
    if (caption && caption.length) {
      var cap = RB.el("figcaption");
      caption.forEach(function (t) { cap.appendChild(RB.el("p", "", t)); });
      cap.style.padding = "12px 6px 6px";
      fig.appendChild(cap);
    }
    return fig;
  }

  add(RB.el("h1", "", LETTER.heading));
  add(RB.el("p", "scroll-hint", "scroll \u2193"));
  add(polaroid(LETTER.photo, LETTER.photoFocus, "letter-fig", LETTER.photoCaption));
  LETTER.paragraphs.forEach(function (t, i) { add(RB.el("p", "para" + (i === 0 ? " first" : ""), t)); });

  var end = RB.el("div", "letter-end");
  end.appendChild(RB.el("p", "bday", LETTER.birthday));
  LETTER.endingLines.forEach(function (t) { end.appendChild(RB.el("p", "line", t)); });
  add(end);
  add(polaroid(LETTER.finalPhoto, LETTER.finalPhotoFocus, "letter-final"));

  var cta = RB.el("a", "btn-glow pulse", LETTER.button);
  var next = RB.nextFile("letter");
  cta.href = next || "index.html";
  var ctaBox = RB.el("div");
  ctaBox.style.textAlign = "center";
  ctaBox.appendChild(cta);
  add(ctaBox);

  if (!("IntersectionObserver" in window) || RB.reducedMotion()) {
    fx.forEach(function (n) { n.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
    fx.forEach(function (n) { io.observe(n); });
  }
})();
