/* ══════════════════════════════════════
   H-ESDM+ | DOI Manager Component
   ══════════════════════════════════════ */
'use strict';

var DOIManager = (function () {
  var _listEl = null;

  function _classifySource(val) {
    if (/^10\.\d{4,}\//.test(val)) return 'DOI';
    if (/pubmed|ncbi\.nlm\.nih\.gov/.test(val)) return 'PubMed';
    if (/clinicaltrials\.gov/.test(val)) return 'ClinicalTrials';
    if (/^https?:\/\//.test(val)) return 'URL';
    return 'ID';
  }

  function _esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  function _render() {
    if (!_listEl) return;
    var state = HESDMState.getState();
    _listEl.innerHTML = '';

    if (state.dois.length === 0) return;

    state.dois.forEach(function (doi, i) {
      var li = document.createElement('li');
      li.className = 'doi-tag';

      var type = _classifySource(doi);
      li.innerHTML =
        '<span class="doi-tag-type">' + type + '</span>' +
        '<span class="doi-tag-text" title="' + _esc(doi) + '">' + _esc(doi) + '</span>' +
        '<button type="button" class="doi-remove" data-index="' + i + '" aria-label="Remove ' + _esc(doi) + '">✕</button>';

      li.querySelector('.doi-remove').addEventListener('click', function () {
        HESDMState.removeDOI(i);
        _render();
      });

      _listEl.appendChild(li);
    });
  }

  function _add() {
    var input = document.getElementById('doiInput');
    if (!input) return;
    var val = input.value.trim();
    if (!val) return;

    var added = HESDMState.addDOI(val);
    if (added) {
      input.value = '';
      _render();
      input.focus();
    } else if (val) {
      // Duplicate — briefly highlight input
      input.style.borderColor = 'var(--c-coral)';
      setTimeout(function () { input.style.borderColor = ''; }, 800);
    }
  }

  function init() {
    _listEl = document.getElementById('doiList');

    var addBtn = document.getElementById('addDoiBtn');
    if (addBtn) {
      addBtn.addEventListener('click', _add);
    }

    var input = document.getElementById('doiInput');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          _add();
        }
      });
    }
  }

  return { init: init };
}());