/* ══════════════════════════════════════
   H-ESDM+ | Model Selector Component
   ══════════════════════════════════════ */
'use strict';

var ModelSelector = (function () {
  function init() {
    var grid = document.getElementById('modelGrid');
    if (!grid) return;

    var cards = grid.querySelectorAll('.model-card');

    function selectCard(card) {
      cards.forEach(function (c) {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
      HESDMState.setModel(card.getAttribute('data-value'));
    }

    cards.forEach(function (card) {
      // Set default selection state
      if (card.classList.contains('selected')) {
        card.setAttribute('aria-pressed', 'true');
      }

      card.addEventListener('click', function () {
        selectCard(card);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          selectCard(card);
        }
      });
    });
  }

  return { init: init };
}());