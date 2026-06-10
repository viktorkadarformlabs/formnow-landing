/* Secondary sticky upload bar reveal.
   The bar in the header appears only after the hero's drag-and-drop upload field
   (#hero-upload) scrolls up out of view (its bottom passes under the main nav),
   and hides again when it returns. Scroll-based for cross-environment reliability. */
(function () {
  function init() {
    var header = document.querySelector('.sticky-header');
    var el = document.getElementById('hero-upload');
    if (!header || !el) return;

    var NAV = 56;     // main nav height — the field "slips beneath" the nav at this point
    var DELAY = 72;   // …then wait another 72px of scroll before revealing the bar
    var ticking = false;

    function update() {
      ticking = false;
      var bottom = el.getBoundingClientRect().bottom;
      header.classList.toggle('is-upload-visible', bottom <= NAV - DELAY);
    }
    function onScroll() {
      if (!ticking) { ticking = true; (window.requestAnimationFrame || setTimeout)(update); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
