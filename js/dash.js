/* Even dashed borders. A fixed `stroke-dasharray: 4 4` rarely divides evenly into a rounded rect's
   perimeter, so the last dash before the path closes ends up longer than the rest. For each dashed
   rect we measure its total length and pick a dash size (= gap) that fits a whole number of
   dash+gap pairs, so every dash is identical. Recomputed on resize / layout changes. */
(function () {
  var TARGET = 8; // desired dash+gap pair length (≈ the Figma 4 / 4)

  function even(rect) {
    var L;
    try { L = rect.getTotalLength(); } catch (e) { return; }
    if (!L) return;
    var pairs = Math.max(1, Math.round(L / TARGET)); // whole number of dash+gap pairs around the path
    var seg = L / (pairs * 2);                        // dash length === gap length
    rect.style.strokeDasharray = seg.toFixed(3) + ' ' + seg.toFixed(3);
  }

  function init() {
    var rects = [].slice.call(document.querySelectorAll('.dashed-stroke rect'));
    if (!rects.length) return;
    var run = function () { rects.forEach(even); };
    run();
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(run);
      rects.forEach(function (r) { var host = r.closest('.dashed-stroke'); if (host) ro.observe(host); });
    }
    window.addEventListener('resize', run, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
