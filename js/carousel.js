/* Carousels:
   - Arrows scroll the target row by ~one card and toggle their disabled state at the ends.
   - Pagination dots are built dynamically (one per card) and rendered iOS-style: at most 3 dots
     stay full-size while the strip slides to keep the active page centred; dots toward the pages
     that aren't shown shrink to a medium/small "there's more" indicator. So 6 cards still read as
     ~3 dots that move as you scroll. Containers opt in via data-carousel-dots="<rowId>". */
(function () {
  var DOT = 8, GAP = 8, PITCH = DOT + GAP, FULL = 3, VIS = FULL + 2; // 3 full + a mid/small edge each side

  function init() {
    function scrollerFor(id) {
      var row = document.getElementById(id);
      return row ? { row: row, vp: row.parentElement } : null;
    }

    var dots = {}; // id -> { el, strip, count }

    function buildDots(id) {
      var s = scrollerFor(id); if (!s) return;
      var el = document.querySelector('[data-carousel-dots="' + id + '"]');
      if (!el) return;
      var count = s.row.children.length;
      if (count < 1) return;
      el.classList.add('cdots');
      el.textContent = '';
      var strip = document.createElement('div');
      strip.className = 'cdots__strip';
      for (var i = 0; i < count; i++) {
        var d = document.createElement('span');
        d.className = 'cdot';
        strip.appendChild(d);
      }
      el.appendChild(strip);
      dots[id] = { el: el, strip: strip, count: count };
    }

    function updateDots(id) {
      var info = dots[id]; if (!info) return;
      var s = scrollerFor(id); if (!s) return;
      var n = info.count;
      var maxScroll = s.vp.scrollWidth - s.vp.clientWidth;
      var frac = maxScroll > 1 ? s.vp.scrollLeft / maxScroll : 0;
      frac = Math.max(0, Math.min(1, frac));
      var current = Math.round(frac * (n - 1));                 // map full scroll range → every page
      var w = (n <= FULL) ? 0 : Math.max(0, Math.min(current - 1, n - FULL)); // window of FULL full dots

      var kids = info.strip.children;
      for (var i = 0; i < n; i++) {
        var dot = kids[i];
        dot.className = 'cdot';
        if (i === current) dot.classList.add('is-active');
        if (n > FULL) {
          var dl = i - w;                                       // 0..FULL-1 = full
          if (dl >= 0 && dl < FULL) { /* full */ }
          else if (dl === -1 || dl === FULL) dot.classList.add('cdot--mid');
          else if (dl === -2 || dl === FULL + 1) dot.classList.add('cdot--small');
          else dot.classList.add('cdot--hidden');
        }
      }

      var visSlots = (n <= FULL) ? n : VIS;
      var vpW = visSlots * DOT + (visSlots - 1) * GAP;
      info.el.style.width = vpW + 'px';
      // centre the full window: middle of [w .. w+FULL-1]
      var centerIdx = (n <= FULL) ? (n - 1) / 2 : (w + (FULL - 1) / 2);
      var tx = vpW / 2 - (centerIdx * PITCH + DOT / 2);
      info.strip.style.transform = 'translateX(' + tx + 'px)';
    }

    function updateArrows(id) {
      var s = scrollerFor(id); if (!s) return;
      var prev = document.querySelector('[data-carousel-prev="' + id + '"]');
      var next = document.querySelector('[data-carousel-next="' + id + '"]');
      var max = s.vp.scrollWidth - s.vp.clientWidth - 1;
      if (prev) prev.disabled = s.vp.scrollLeft <= 0;
      if (next) next.disabled = s.vp.scrollLeft >= max;
    }

    function update(id) { updateArrows(id); updateDots(id); }

    function step(id, dir) {
      var s = scrollerFor(id); if (!s) return;
      var card = s.row.children[0];
      var by = card ? card.getBoundingClientRect().width + GAP : s.vp.clientWidth * 0.8;
      s.vp.scrollBy({ left: dir * by, behavior: 'smooth' });
    }

    var ids = {};
    document.querySelectorAll('[data-carousel-prev],[data-carousel-next]').forEach(function (b) {
      var id = b.getAttribute('data-carousel-prev') || b.getAttribute('data-carousel-next');
      ids[id] = true;
      var dir = b.hasAttribute('data-carousel-prev') ? -1 : 1;
      b.addEventListener('click', function () { step(id, dir); });
    });
    document.querySelectorAll('[data-carousel-dots]').forEach(function (el) {
      ids[el.getAttribute('data-carousel-dots')] = true;
    });

    Object.keys(ids).forEach(function (id) {
      buildDots(id);
      var s = scrollerFor(id);
      if (s) s.vp.addEventListener('scroll', function () { update(id); }, { passive: true });
      update(id);
    });

    var rAF;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(function () { Object.keys(ids).forEach(update); });
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
