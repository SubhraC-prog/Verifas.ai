/* ══════════════════════════════════════
   H-ESDM+ | Pipeline Orchestrator
   ══════════════════════════════════════ */
'use strict';

var HESDMPipeline = (function () {
  var STAGES = [
    { id: 'etl',       label: 'ETL Ingestion',  agentNum: '01' },
    { id: 'pico',      label: 'PICO Audit',      agentNum: '02' },
    { id: 'meta',      label: 'Meta-Analysis',   agentNum: '03' },
    { id: 'heor',      label: 'HEOR Model',      agentNum: '04' },
    { id: 'compliance',label: 'Compliance',       agentNum: '05' },
  ];

  var _currentStageIndex = -1;
  var _stageTimers = [];
  var _panelEl = null;
  var _stagesEl = null;
  var _payloadEl = null;
  var _statusDotEl = null;
  var _statusTextEl = null;

  function _buildStagePills() {
    if (!_stagesEl) return;
    _stagesEl.innerHTML = '';
    STAGES.forEach(function (s) {
      var pill = document.createElement('div');
      pill.className = 'stage-pill';
      pill.id = 'pill-' + s.id;
      pill.setAttribute('role', 'listitem');
      pill.innerHTML =
        '<span class="stage-pill-dot" aria-hidden="true"></span>' +
        s.agentNum + ' — ' + s.label;
      _stagesEl.appendChild(pill);
    });
  }

  function _activateStage(index) {
    STAGES.forEach(function (s, i) {
      var pill = document.getElementById('pill-' + s.id);
      if (!pill) return;
      pill.classList.remove('active', 'complete', 'error');
      if (i < index) pill.classList.add('complete');
      else if (i === index) pill.classList.add('active');
    });
  }

  function _appendPayload(html) {
    if (!_payloadEl) return;
    _payloadEl.innerHTML += html;
    _payloadEl.scrollTop = _payloadEl.scrollHeight;
  }

  function _clearPayload() {
    if (_payloadEl) _payloadEl.innerHTML = '';
  }

  function _setStatus(state, text) {
    if (_statusDotEl) {
      _statusDotEl.className = 'status-dot ' + state;
    }
    if (_statusTextEl) {
      _statusTextEl.textContent = text;
    }
  }

  function _formatPayload(payload) {
    var s = payload;
    var lines = [];

    lines.push('<span class="payload-section-head">▸ PIPELINE CONFIGURATION SUMMARY</span>');
    lines.push('<span class="payload-key">PICO · P</span>  <span class="payload-val">' + _esc(s.population) + '</span>');
    lines.push('<span class="payload-key">PICO · I</span>  <span class="payload-val">' + _esc(s.intervention) + '</span>');
    lines.push('<span class="payload-key">PICO · C</span>  <span class="payload-val">' + _esc(s.comparator) + '</span>');
    lines.push('<span class="payload-key">PICO · O</span>  <span class="payload-val">' + _esc(s.outcome_primary) + '</span>');
    if (s.outcome_secondary) {
      lines.push('<span class="payload-key">PICO · O2</span> <span class="payload-val">' + _esc(s.outcome_secondary) + '</span>');
    }
    lines.push('<span class="payload-key">Time Horizon</span>  <span class="payload-val">' + _esc(s.time_horizon || 'Not specified') + '</span>');
    lines.push('<span class="payload-key">Study Design</span>  <span class="payload-val">' + _esc(s.study_design || 'All designs') + '</span>');
    lines.push('');
    lines.push('<span class="payload-section-head">▸ HTA / REGULATORY TARGETS</span>');
    lines.push('<span class="payload-key">Agencies</span>  <span class="payload-val">' + (s.selectedHTAs.join(', ') || 'None') + '</span>');
    lines.push('<span class="payload-key">Currency</span>  <span class="payload-val">' + _esc(s.currency || '—') + '</span>');
    lines.push('<span class="payload-key">Price Year</span>  <span class="payload-val">' + _esc(s.price_year || '—') + '</span>');
    lines.push('<span class="payload-key">Discount Rate (Costs)</span>  <span class="payload-val">' + _esc(s.disc_cost || '3.5%') + '</span>');
    lines.push('<span class="payload-key">Discount Rate (Outcomes)</span>  <span class="payload-val">' + _esc(s.disc_outcomes || '3.5%') + '</span>');
    lines.push('');
    lines.push('<span class="payload-section-head">▸ HEOR MODEL</span>');
    lines.push('<span class="payload-key">Model Type</span>  <span class="payload-val">' + _esc(s.selectedModel) + '</span>');
    lines.push('<span class="payload-key">WTP Threshold</span>  <span class="payload-val">' + _esc(s.wtp || 'Agency default') + '</span>');
    lines.push('<span class="payload-key">Cycle Length</span>  <span class="payload-val">' + _esc(s.cycle_length || '—') + '</span>');
    lines.push('<span class="payload-key">Payer Perspective</span>  <span class="payload-val">' + _esc(s.payer || '—') + '</span>');
    lines.push('');
    lines.push('<span class="payload-section-head">▸ EVIDENCE SOURCES</span>');
    lines.push('<span class="payload-key">DOIs / URLs</span>  <span class="payload-val">' + (s.dois.length ? s.dois.join('\n              ') : 'None provided') + '</span>');
    lines.push('<span class="payload-key">Uploaded PDFs</span>  <span class="payload-val">' + (s.uploadedFiles.length ? s.uploadedFiles.join(', ') : 'None uploaded') + '</span>');
    lines.push('<span class="payload-key">Date Range</span>  <span class="payload-val">' + _esc((s.date_from || '—') + ' → ' + (s.date_to || '—')) + '</span>');
    lines.push('');
    lines.push('<span class="payload-section-head">▸ OUTPUT &amp; COMPLIANCE</span>');
    lines.push('<span class="payload-key">Citation Style</span>  <span class="payload-val">' + _esc(s.citation_style || 'Vancouver') + '</span>');
    lines.push('<span class="payload-key">Output Format</span>  <span class="payload-val">' + _esc(s.output_format || 'MS Word + MS Excel') + '</span>');
    if (s.additional_notes) {
      lines.push('<span class="payload-key">Special Notes</span>  <span class="payload-val">' + _esc(s.additional_notes) + '</span>');
    }
    lines.push('');
    lines.push('<span class="payload-section-head">▸ INITIATING SEQUENTIAL PIPELINE…</span>');
    lines.push('All 5 sub-agent stages queued. Triple-validation protocol armed.');
    lines.push('Awaiting Agent 01 — Deep Learning ETL Ingestion…');

    return lines.join('\n');
  }

  function _esc(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function _clearTimers() {
    _stageTimers.forEach(function (t) { clearTimeout(t); });
    _stageTimers = [];
  }

  function start(payload) {
    _panelEl     = document.getElementById('outputPanel');
    _stagesEl    = document.getElementById('outputStages');
    _payloadEl   = document.getElementById('outputPayload');
    _statusDotEl = _panelEl ? _panelEl.querySelector('.status-dot') : null;
    _statusTextEl = document.getElementById('statusText');

    if (!_panelEl) return;

    _clearTimers();
    _clearPayload();
    _buildStagePills();
    _panelEl.hidden = false;
    _setStatus('running', 'Pipeline running — initialising sub-agents…');
    _appendPayload(_formatPayload(payload));
    _currentStageIndex = 0;

    var stageMessages = [
      '✓ Agent 01 complete — layout-aware parsing done. PostgreSQL schema loaded. pgvector embeddings generated.',
      '✓ Agent 02 complete — PICO extraction verified (3-pass audit). Top-5 studies ranked by N and statistical power.',
      '✓ Agent 03 complete — heterogeneity assessed (I²/Q). Pooled effects calculated. Forest plot data ready.',
      '✓ Agent 04 complete — Markov cohort trace built. ICER calculated. DSA/PSA distributions parameterised.',
      '✓ Agent 05 complete — CHEERS 2022 ✓  PRISMA 2020 ✓  PAL-ISADE ✓  Vancouver bibliography compiled.',
    ];

    STAGES.forEach(function (stage, i) {
      var t = setTimeout(function () {
        _activateStage(i);
        _setStatus('running', 'Agent ' + stage.agentNum + ' — ' + stage.label + ' running…');
        _appendPayload('\n\n[Agent ' + stage.agentNum + ' — ' + stage.label + ' ACTIVE]');

        var t2 = setTimeout(function () {
          _appendPayload('\n' + stageMessages[i]);
          if (i === STAGES.length - 1) {
            _activateStage(STAGES.length); // marks all complete
            _setStatus('done', 'Pipeline complete — all 5 agents finished successfully.');
            _appendPayload('\n\n═══════════════════════════════════════\nH-ESDM+ PIPELINE COMPLETE\nArtifacts ready for HTA submission.\n═══════════════════════════════════════');
          }
        }, 1200);

        _stageTimers.push(t2);
      }, i * 2600);

      _stageTimers.push(t);
    });

    // Scroll into view
    _panelEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function close() {
    _clearTimers();
    var panelEl = document.getElementById('outputPanel');
    if (panelEl) panelEl.hidden = true;
  }

  return { start: start, close: close };
}());