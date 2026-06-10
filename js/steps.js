/* Steps videos — ensure the three looping workflow clips start playing.
   They carry autoplay+muted+loop, but some environments hold muted autoplay until a
   gesture, so we nudge play() on load and again on the first scroll/interaction. */
(function () {
  function init() {
    var vids = Array.prototype.slice.call(document.querySelectorAll('.steps__video, .tech__video'));
    if (!vids.length) return;
    function go() { vids.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }); }
    go();
    ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, go, { passive: true, once: true });
    });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
