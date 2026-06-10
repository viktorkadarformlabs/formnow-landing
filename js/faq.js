/* FAQ accordion — click a question to toggle its answer. Only ONE open at a time:
   opening an item closes any other that's open. */
(function () {
  function init() {
    var items = document.querySelectorAll('[data-faq]');
    Array.prototype.forEach.call(document.querySelectorAll('[data-faq] .faq-item__q'), function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('[data-faq]');
        if (!item) return;
        var willOpen = !item.classList.contains('is-open');
        // close every other open item
        Array.prototype.forEach.call(items, function (other) {
          if (other !== item && other.classList.contains('is-open')) {
            other.classList.remove('is-open');
            var ob = other.querySelector('.faq-item__q');
            if (ob) ob.setAttribute('aria-expanded', 'false');
          }
        });
        item.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
