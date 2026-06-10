/* Form Now — theme controller.
   Default follows OS (prefers-color-scheme). The footer toggle overrides
   by setting <html data-theme="dark|light">; "System" clears the override.
   A tiny pre-paint snippet in <head> (injected by build.js) applies the
   saved override before first paint to avoid a flash. */
(function () {
  var KEY = 'fn-theme';
  var root = document.documentElement;

  var animTimer;
  function current() { return root.getAttribute('data-theme') || 'system'; }

  function set(mode) {
    // brief, page-wide uniform cross-fade so all elements switch together
    root.classList.add('theme-anim');
    clearTimeout(animTimer);
    animTimer = setTimeout(function () { root.classList.remove('theme-anim'); }, 320);

    if (mode === 'system') {
      localStorage.removeItem(KEY);
      root.removeAttribute('data-theme');
    } else {
      localStorage.setItem(KEY, mode);
      root.setAttribute('data-theme', mode);
    }
    sync();
  }

  function sync() {
    var cur = current();
    document.querySelectorAll('[data-theme-option]').forEach(function (el) {
      el.setAttribute('aria-pressed', String(el.dataset.themeOption === cur));
      el.classList.toggle('is-active', el.dataset.themeOption === cur);
    });
  }

  // Click delegation for any [data-theme-option] control (footer or temp dev widget).
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-option]');
    if (btn) { e.preventDefault(); set(btn.dataset.themeOption); }
  });

  document.addEventListener('DOMContentLoaded', sync);
  window.FNTheme = { set: set, current: current, sync: sync };
})();
