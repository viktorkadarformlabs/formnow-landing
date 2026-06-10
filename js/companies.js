/* Companies conveyor — duplicate the logo set once so the CSS marquee (-50%) loops seamlessly. */
(function () {
  function init() {
    document.querySelectorAll('.companies__track').forEach(function (track) {
      if (track.dataset.cloned) return;
      track.dataset.cloned = '1';
      Array.prototype.forEach.call([].slice.call(track.children), function (cell) {
        var clone = cell.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
