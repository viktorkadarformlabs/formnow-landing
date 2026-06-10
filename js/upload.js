/* Prototype file-picker: clicking any upload affordance — the in-video drag-and-drop field, the
   sticky upload bar, or any "Upload …" CTA anywhere on the page — opens the native file picker
   (Finder). Files aren't processed; this just wires up the entry point for the prototype. */
(function () {
  function init() {
    var input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.stl,.obj,.step,.stp,.3mf,.iges,.igs,.form';
    input.style.display = 'none';
    input.setAttribute('aria-hidden', 'true');
    input.tabIndex = -1;
    document.body.appendChild(input);

    function openPicker() { input.value = ''; input.click(); }

    // One delegated listener: fire the picker for the drag-drop areas and any CTA labelled "Upload".
    document.addEventListener('click', function (e) {
      var t = e.target.closest('.hero__upload-box, .upload-bar__inner, [data-upload], button, .btn, a.btn');
      if (!t) return;
      var isArea = t.matches('.hero__upload-box, .upload-bar__inner, [data-upload]');
      var isUploadCta = /upload/i.test(t.textContent || '');
      if (isArea || isUploadCta) { e.preventDefault(); openPicker(); }
    });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
