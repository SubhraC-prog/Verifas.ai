/* ══════════════════════════════════════
   H-ESDM+ | Main Page Initialiser
   ══════════════════════════════════════ */
'use strict';

(function () {
  function init() {
    // Init components
    HTASelector.init();
    ModelSelector.init();
    DOIManager.init();
    FileUpload.init();
    OutputPanel.init();
    HESDMValidation.attachRealTimeValidation();

    // Mobile menu
    var menuBtn = document.getElementById('mobileMenuBtn');
    var mobileNav = document.getElementById('mobileNav');
    if (menuBtn && mobileNav) {
      menuBtn.addEventListener('click', function () {
        var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        mobileNav.hidden = isOpen;
      });

      // Close on nav link click
      var mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
      mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          menuBtn.setAttribute('aria-expanded', 'false');
          mobileNav.hidden = true;
        });
      });
    }

    // Form submit
    var form = document.getElementById('hesdmForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var state = HESDMState.getState();
      var valid = HESDMValidation.validate(state);

      if (!valid) {
        // Scroll to first error
        var firstError = form.querySelector('.field-input.error, .field-select.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        } else {
          var htaError = document.getElementById('hta-error');
          if (htaError && htaError.textContent) {
            htaError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return;
      }

      var payload = HESDMState.getFormPayload(form);
      HESDMPipeline.start(payload);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());