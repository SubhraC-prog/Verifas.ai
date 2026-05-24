/* ══════════════════════════════════════
   H-ESDM+ | State Management
   ══════════════════════════════════════ */
'use strict';

var HESDMState = (function () {
  var _state = {
    dois: [],
    files: [],
    selectedHTAs: [],
    selectedModel: 'Markov',
  };

  function getState() {
    return JSON.parse(JSON.stringify(_state));
  }

  function addDOI(val) {
    var trimmed = val.trim();
    if (!trimmed) return false;
    if (_state.dois.indexOf(trimmed) !== -1) return false;
    _state.dois.push(trimmed);
    return true;
  }

  function removeDOI(index) {
    if (index >= 0 && index < _state.dois.length) {
      _state.dois.splice(index, 1);
      return true;
    }
    return false;
  }

  function addFiles(fileList) {
    var added = [];
    for (var i = 0; i < fileList.length; i++) {
      var f = fileList[i];
      var exists = _state.files.some(function (existing) {
        return existing.name === f.name && existing.size === f.size;
      });
      if (!exists) {
        _state.files.push({ name: f.name, size: f.size, file: f });
        added.push(f.name);
      }
    }
    return added;
  }

  function removeFile(index) {
    if (index >= 0 && index < _state.files.length) {
      _state.files.splice(index, 1);
      return true;
    }
    return false;
  }

  function toggleHTA(value) {
    var idx = _state.selectedHTAs.indexOf(value);
    if (idx === -1) {
      _state.selectedHTAs.push(value);
      return true;
    } else {
      _state.selectedHTAs.splice(idx, 1);
      return false;
    }
  }

  function setModel(value) {
    _state.selectedModel = value;
  }

  function getFormPayload(formEl) {
    var fd = new FormData(formEl);
    var payload = {};
    fd.forEach(function (val, key) {
      if (payload[key]) {
        if (!Array.isArray(payload[key])) payload[key] = [payload[key]];
        payload[key].push(val);
      } else {
        payload[key] = val;
      }
    });
    payload.dois = _state.dois.slice();
    payload.uploadedFiles = _state.files.map(function (f) { return f.name; });
    payload.selectedHTAs = _state.selectedHTAs.slice();
    payload.selectedModel = _state.selectedModel;
    return payload;
  }

  return {
    getState: getState,
    addDOI: addDOI,
    removeDOI: removeDOI,
    addFiles: addFiles,
    removeFile: removeFile,
    toggleHTA: toggleHTA,
    setModel: setModel,
    getFormPayload: getFormPayload,
  };
}());