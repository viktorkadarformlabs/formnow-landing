/* Step / technology videos.
   - Technology clips just autoplay — they're always on screen.
   - The Steps carousel scrolls horizontally on mobile, so only the clip currently IN FOCUS plays;
     the others pause until scrolled into view. A clip counts as "in focus" when ≥60% of it is
     visible within the scroll viewport. On desktop all three tiles are fully visible, so all play.
   (Scroll-based rather than IntersectionObserver for cross-environment reliability. Re-evaluated on
   carousel scroll, page scroll, resize, and first interaction so muted-autoplay holds get retried.) */
(function () {
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  function init() {
    // Technology videos — always play (not inside a scroller)
    var tech = [].slice.call(document.querySelectorAll('.tech__video'));
    var nudge = function () { tech.forEach(play); };
    nudge();
    ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(function (e) {
      window.addEventListener(e, nudge, { passive: true, once: true });
    });

    // Steps carousel — play only the clip(s) ≥60% visible within the scroll viewport
    var viewport = document.querySelector('.steps__viewport');
    var vids = [].slice.call(document.querySelectorAll('.steps__video'));
    if (!vids.length) return;
    if (!viewport) { vids.forEach(play); return; }

    var ticking = false;
    function updateFocus() {
      ticking = false;
      var vp = viewport.getBoundingClientRect();
      vids.forEach(function (v) {
        var r = v.getBoundingClientRect();
        var visible = Math.max(0, Math.min(r.right, vp.right) - Math.max(r.left, vp.left));
        var ratio = r.width ? visible / r.width : 0;
        if (ratio >= 0.6) play(v); else v.pause();
      });
    }
    function schedule() {
      if (!ticking) { ticking = true; (window.requestAnimationFrame || setTimeout)(updateFocus); }
    }
    viewport.addEventListener('scroll', schedule, { passive: true }); // horizontal carousel scroll
    window.addEventListener('scroll', schedule, { passive: true });    // page scroll → re-eval as section enters view
    window.addEventListener('resize', schedule, { passive: true });
    vids.forEach(function (v) { v.addEventListener('loadeddata', schedule); }); // retry once a clip is ready
    // first user gesture — retries a muted-autoplay hold
    ['pointerdown', 'keydown', 'touchstart'].forEach(function (e) {
      window.addEventListener(e, updateFocus, { passive: true, once: true });
    });
    updateFocus();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
