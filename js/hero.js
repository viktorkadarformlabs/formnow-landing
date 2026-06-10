/* First-load intro guard: `hero-intro` is set in <head> whenever the page loads at the top, which
   plays the nav slide-down + upload rise-up (CSS). If the page isn't actually at the top (e.g. a
   reload restored a scrolled position) or the user scrolls, cancel it so the nav + upload just
   appear. After the animations finish their end-state matches the default, so removing the class
   later is a no-op. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('hero-intro')) return;
  function cancel() { root.classList.remove('hero-intro'); }
  function atTop() { return (window.scrollY || window.pageYOffset || 0) <= 2; }
  if (!atTop()) { cancel(); return; }
  window.addEventListener('load', function () { if (!atTop()) cancel(); });
  // a scroll (user, or late scroll-restoration) cancels the intro
  window.addEventListener('scroll', function once() {
    cancel();
    window.removeEventListener('scroll', once);
  }, { passive: true });
})();

/* Hero ambient glow — keep the blurred ".hero__ambient" copy tightly synced to the real hero video.
   Two independent <video> decoders drift apart over time; a hard currentTime jump would be a visible
   pop. Instead we ease the drift to zero every animation frame by nudging the glow's playbackRate
   (glow ahead → play it a touch slower; behind → a touch faster). Only a large gap (a loop wrap or a
   tab-switch) triggers a hard re-seek. Result: the glow tracks the main video frame-for-frame. */
(function () {
  function init() {
    var main = document.querySelector('.hero__video');
    var glow = document.querySelector('.hero__ambient');
    if (!main || !glow) return;
    glow.muted = true;

    function correct() {
      if (!main.duration || main.paused || glow.paused) return;
      var drift = glow.currentTime - main.currentTime;            // + = glow ahead, − = behind
      if (Math.abs(drift) > 0.3) {                                // loop wrap / big desync → snap
        try { glow.currentTime = main.currentTime; } catch (e) {}
        glow.playbackRate = 1;
        return;
      }
      // ease toward 0: rate < 1 when ahead, > 1 when behind. Clamped so it stays imperceptible.
      glow.playbackRate = Math.max(0.85, Math.min(1.15, 1 - drift * 4));
    }

    var raf;
    function loop() { correct(); raf = requestAnimationFrame(loop); }

    function start() { var p = glow.play(); if (p && p.catch) p.catch(function () {}); if (!raf) loop(); }
    function stop() { glow.pause(); if (raf) { cancelAnimationFrame(raf); raf = 0; } }

    main.addEventListener('play', start);
    main.addEventListener('pause', stop);
    main.addEventListener('seeked', function () { try { glow.currentTime = main.currentTime; } catch (e) {} });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else if (!main.paused) start();
    });

    if (!main.paused) start();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
