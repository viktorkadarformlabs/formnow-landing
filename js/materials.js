/* Material cards — reveal the info overlay (blur + scrim + description/specs).
   Desktop: reveal is HOVER-ONLY (CSS, scoped to min-width:1024) — clicking never pins a card,
   so it can't get stuck, and only the one card under the cursor is ever active.
   Mobile (<=1023): tap the card or the + button to pin .is-open — but only ONE at a time;
   opening a card closes any other. The .is-open styles are mobile-only (see 08-materials.css). */
(function () {
  var mq = window.matchMedia('(max-width:1023px)');

  function setOpen(card, open) {
    card.classList.toggle('is-open', open);
    var plus = card.querySelector('.mat-card__plus');
    if (plus) {
      plus.setAttribute('aria-expanded', open ? 'true' : 'false');
      plus.setAttribute('aria-label', open ? 'Hide material details' : 'Show material details');
    }
  }

  function closeAll(except) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-mat].is-open'), function (c) {
      if (c !== except) setOpen(c, false);
    });
  }

  function toggle(card) {
    if (!mq.matches) return;                 // desktop = hover only, never pin
    var willOpen = !card.classList.contains('is-open');
    closeAll(card);                          // one at a time
    setOpen(card, willOpen);
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-mat]'), function (card) {
      var plus = card.querySelector('.mat-card__plus');
      if (plus) plus.addEventListener('click', function (e) { e.stopPropagation(); toggle(card); });
      card.addEventListener('click', function () { toggle(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggle(card); }
      });
    });
    // crossing to desktop: drop any pinned card so nothing is left stuck open
    var onChange = function (e) { if (!e.matches) closeAll(null); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
