/* ============================================================
   Solace Auto Imports — motion-lite.js (defer-loaded)
   Progressive enhancement only. If this file fails to load or
   throws, the `mk-js` class is never applied (or reveals are
   force-shown), so no content ever stays hidden.
   ============================================================ */
(function () {
  'use strict';

  /* Flag JS availability FIRST — motion-lite.css only hides
     [data-mk-reveal] elements underneath html.mk-js. */
  try {
    document.documentElement.classList.add('mk-js');
  } catch (e) {
    return; /* ancient browser: CSS stays inert, page fully visible */
  }

  /* Failsafe: make every reveal target visible immediately. */
  function revealAll() {
    try {
      var all = document.querySelectorAll('[data-mk-reveal]');
      for (var i = 0; i < all.length; i++) {
        all[i].classList.add('mk-in');
      }
    } catch (e) { /* noop */ }
  }

  /* ---- Count-up: <el data-mk-count data-to="120" data-suffix="+">120+</el>
     Animates 0 → data-to over 1.6s (easeOutCubic), then restores the
     EXACT original markup text (which is also the no-JS fallback). */
  function runCount(el) {
    try {
      if (el.getAttribute('data-mk-counted')) return;
      el.setAttribute('data-mk-counted', '1');

      var original = el.textContent;
      var to = parseFloat(el.getAttribute('data-to'));
      if (!isFinite(to)) return;

      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      if (!isFinite(decimals) || decimals < 0 || decimals > 6) decimals = 0;

      var DURATION = 1600;
      var start = null;
      var raf = window.requestAnimationFrame
        ? window.requestAnimationFrame.bind(window)
        : function (fn) { return setTimeout(function () { fn(Date.now()); }, 16); };

      function frame(now) {
        try {
          if (start === null) start = now;
          var t = Math.min((now - start) / DURATION, 1);
          var eased = 1 - Math.pow(1 - t, 3); /* easeOutCubic */
          if (t < 1) {
            el.textContent = prefix + (to * eased).toFixed(decimals) + suffix;
            raf(frame);
          } else {
            el.textContent = original; /* final text EXACTLY matches markup */
          }
        } catch (e) {
          el.textContent = original;
        }
      }

      raf(frame);
    } catch (e) { /* leave the static text untouched */ }
  }

  function init() {
    try {
      var reveals = document.querySelectorAll('[data-mk-reveal]');
      var counts = document.querySelectorAll('[data-mk-count]');

      if (!('IntersectionObserver' in window)) {
        /* No observer support: show everything, keep static numbers. */
        revealAll();
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (!entry.isIntersecting) continue;
          var el = entry.target;
          el.classList.add('mk-in');
          if (el.hasAttribute('data-mk-count')) runCount(el);
          observer.unobserve(el);
        }
      }, { threshold: 0.15 });

      var i;
      for (i = 0; i < reveals.length; i++) observer.observe(reveals[i]);
      /* observe() is a no-op for elements already observed above */
      for (i = 0; i < counts.length; i++) observer.observe(counts[i]);
    } catch (e) {
      revealAll();
    }
  }

  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } catch (e) {
    revealAll();
  }
})();
