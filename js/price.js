/* Price section interactions.
   - Topic tabs (Computer Case / Automotive Door / Miniature) swap the whole group: the media
     image + the 3 bulk-pricing cards. Content is duplicated for now — the card group is cloned
     from the markup in the section and each topic points at the same image (see TOPIC_IMG).
     Give each topic its own template/image later for real content.
   - Cards are selectable (click / Enter / Space) — selecting one highlights it and swaps the
     connected media image (per-card data-img; duplicated for now).
   - Autoplay advances the selection every 8s; the ring shows the 8s countdown. The timeline
     tile toggles play/pause. */
(function () {
  var DURATION = 8000;

  // Per-topic media image — duplicated for now; point each topic at its own image later.
  var IMG = '../assets/price-computer-case.png';
  var TOPIC_IMG = { 'computer-case': IMG, 'automotive-door': IMG, 'miniature': IMG };

  function init() {
    // Scope to the whole section so BOTH the desktop tabs (over the media) and the mobile tabs-row wire up.
    var root = document.querySelector('.price');
    if (!root) return;
    var cardsWrap = root.querySelector('[data-price-cards]');
    var img = root.querySelector('.price__img');
    var btn = root.querySelector('[data-autoplay]');
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-topic]'));
    if (!cardsWrap) return;

    // The initial 3-card group is the template cloned for every topic (duplicated content for now).
    var TEMPLATE = cardsWrap.innerHTML;

    var cards = [], idx = 0, paused = false, timer = null;

    function applyState() {
      if (!btn) return;
      btn.classList.toggle('is-paused', paused);
      btn.classList.toggle('is-playing', !paused);
      btn.setAttribute('aria-label', paused ? 'Resume autoplay' : 'Pause autoplay');
    }
    function restartRing() {
      if (!btn || paused) return;
      btn.classList.remove('is-playing'); void btn.offsetWidth; btn.classList.add('is-playing');
    }
    function schedule() { if (timer) clearTimeout(timer); if (!paused) timer = setTimeout(tick, DURATION); }
    function tick() { select(idx + 1); schedule(); }

    function select(i) {
      if (!cards.length) return;
      idx = (i + cards.length) % cards.length;
      cards.forEach(function (c, n) {
        c.classList.toggle('is-selected', n === idx);
        c.setAttribute('aria-pressed', n === idx ? 'true' : 'false');
      });
      var src = cards[idx].getAttribute('data-img');
      if (img && src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      restartRing();
    }

    function bindCards() {
      cards = Array.prototype.slice.call(cardsWrap.querySelectorAll('[data-price-card]'));
      cards.forEach(function (c, n) {
        c.classList.toggle('is-selected', n === 0);
        c.addEventListener('click', function () { select(n); schedule(); });
        c.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); select(n); schedule(); }
        });
      });
      idx = 0;
    }

    function showTopic(id) {
      tabs.forEach(function (t) {
        var on = t.getAttribute('data-topic') === id;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      if (img && TOPIC_IMG[id]) img.setAttribute('src', TOPIC_IMG[id]);
      cardsWrap.innerHTML = TEMPLATE;   // re-clone the group (duplicated content for now)
      bindCards();
      restartRing();
      schedule();
    }

    tabs.forEach(function (t) {
      t.addEventListener('click', function () { showTopic(t.getAttribute('data-topic')); });
    });
    if (btn) {
      btn.addEventListener('click', function () {
        paused = !paused;
        applyState();
        if (paused) { if (timer) clearTimeout(timer); } else { restartRing(); schedule(); }
      });
    }

    applyState();
    bindCards();   // bind the cards already in the markup (no flash on first paint)
    restartRing();
    schedule();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
