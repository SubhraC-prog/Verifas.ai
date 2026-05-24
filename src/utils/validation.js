/* ══════════════════════════════════════
   H-ESDM+ | Form Validation
   ══════════════════════════════════════ */
'use strict';

var HESDMValidation = (function () {
  var REQUIRED_FIELDS = [
    { id: 'population',     label: 'Population (P)' },
    { id: 'intervention',   label: 'Intervention (I)' },
    { id: 'comparator',     label: 'Comparator (C)' },
    { id: 'outcome_primary',label: 'Primary Outcome (O)' },
  ];

  function clearError(fieldId) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + '-error');
    if (input) input.classList.remove('error');
    if (errorEl) errorEl.textContent = '';
  }

  function setError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + '-error');
    if (input) input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearHTAError() {
    var el = document.getElementById('hta-error');
    if (el) el.textContent = '';
  }

  function setHTAError(message) {
    var el = document.getElementById('hta-error');
    if (el) el.textContent = message;
  }

  function validate(state) {
    var valid = true;

    // Clear previous errors
    REQUIRED_FIELDS.forEach(function (f) { clearError(f.id); });
    clearHTAError();

    // Required PICO fields
    REQUIRED_FIELDS.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (!el || !el.value.trim()) {
        setError(f.id, f.label + ' is required.');
        valid = false;
      }
    });

    // At least one HTA
    if (state.selectedHTAs.length === 0) {
      setHTAError('Please select at least one target HTA agency.');
      valid = false;
    }

    return valid;
  }

  function attachRealTimeValidation() {
    REQUIRED_FIELDS.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (!el) return;
      el.addEventListener('blur', function () {
        if (!el.value.trim()) {
          setError(f.id, f.label + ' is required.');
        } else {
          clearError(f.id);
        }
      });
      el.addEventListener('input', function () {
        if (el.value.trim()) clearError(f.id);
      });
    });
  }

  return {
    validate: validate,
    clearError: clearError,
    setError: setError,
    attachRealTimeValidation: attachRealTimeValidation,
  };
}());