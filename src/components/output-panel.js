/* ══════════════════════════════════════
   H-ESDM+ | Output Panel Component
   ══════════════════════════════════════ */
'use strict';

var OutputPanel = (function () {
  function init() {
    var closeBtn = document.getElementById('outputClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        HESDMPipeline.close();
      });
    }
  }

  return { init: init };
}());