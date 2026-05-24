/* ══════════════════════════════════════
   H-ESDM+ | HTA Selector Component
   ══════════════════════════════════════ */
'use strict';

var HTASelector = (function () {
  function init() {
    var grid = document.getElementById('htaGrid');
    if (!grid) return;

    var buttons = grid.querySelectorAll('.hta-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-value');
        var isSelected = HESDMState.toggleHTA(value);
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });

      // Keyboard: Space toggles, Enter toggles
      btn.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  return { init: init };
}());