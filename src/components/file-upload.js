/* ══════════════════════════════════════
   H-ESDM+ | File Upload Component
   ══════════════════════════════════════ */
'use strict';

var FileUpload = (function () {
  var _listEl = null;
  var _zoneEl = null;
  var _inputEl = null;

  function _formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

    if (state.files.length === 0) return;

    state.files.forEach(function (f, i) {
      var li = document.createElement('li');
      li.className = 'doi-tag';
      li.innerHTML =
        '<span class="doi-tag-type">PDF</span>' +
        '<span class="doi-tag-text" title="' + _esc(f.name) + '">' + _esc(f.name) + '</span>' +
        '<span style="font-size:0.65rem;color:var(--c-text-4);flex-shrink:0;">' + _formatSize(f.size) + '</span>' +
        '<button type="button" class="doi-remove" data-index="' + i + '" aria-label="Remove ' + _esc(f.name) + '">✕</button>';

      li.querySelector('.doi-remove').addEventListener('click', function () {
        HESDMState.removeFile(i);
        _render();
      });

      _listEl.appendChild(li);
    });
  }

  function _handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    // Filter PDFs only
    var pdfs = [];
    for (var i = 0; i < fileList.length; i++) {
      if (fileList[i].type === 'application/pdf' || fileList[i].name.toLowerCase().endsWith('.pdf')) {
        pdfs.push(fileList[i]);
      }
    }
    if (pdfs.length > 0) {
      HESDMState.addFiles(pdfs);
      _render();
    }
  }

  function init() {
    _listEl  = document.getElementById('fileList');
    _zoneEl  = document.getElementById('uploadZone');
    _inputEl = document.getElementById('pdfUpload');

    if (!_zoneEl || !_inputEl) return;

    // Click to open file dialog
    _zoneEl.addEventListener('click', function () {
      _inputEl.click();
    });

    // Keyboard activation
    _zoneEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        _inputEl.click();
      }
    });

    // File input change
    _inputEl.addEventListener('change', function () {
      _handleFiles(_inputEl.files);
      // Reset so same file can be re-added after removal
      _inputEl.value = '';
    });

    // Drag events
    _zoneEl.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _zoneEl.classList.add('drag-over');
    });

    _zoneEl.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _zoneEl.classList.remove('drag-over');
    });

    _zoneEl.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _zoneEl.classList.remove('drag-over');
      if (e.dataTransfer && e.dataTransfer.files) {
        _handleFiles(e.dataTransfer.files);
      }
    });
  }

  return { init: init };
}());