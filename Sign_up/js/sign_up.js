/* signup-combined.js — role step -> details step inside one card (no page change). */
(function () {
  'use strict';

  var TITLES = {
    customer:    'Your details',
    interpreter: 'Your details · Interpreter',
    provider:    'Your details · Service provider',
    teacher:     'Your details · Teacher'
  };

  var panelRoles   = document.getElementById('panel-roles');
  var panelDetails = document.getElementById('panel-details');
  var form         = document.getElementById('details-form');
  var roleInput    = document.getElementById('role-input');
  var title        = document.getElementById('step2-title');
  var summary      = form.querySelector('.error-summary');
  var groups       = form.querySelectorAll('.role-fields');

  /* ---------- Step switching (uses the URL hash so the browser Back button works) ---------- */
  function showRole(role) {
    if (!TITLES[role]) { showRoles(); return; }

    roleInput.value = role;
    title.textContent = TITLES[role];

    groups.forEach(function (g) {
      var on = g.dataset.role === role;
      g.hidden = !on;
      g.disabled = !on;            // disabled fields are skipped by validation AND not submitted
    });

    clearErrors();
    panelRoles.hidden = true;
    panelDetails.hidden = false;
    form.querySelector('.panel-body').scrollTop = 0;
    title.focus();
  }

  function showRoles() {
    panelDetails.hidden = true;
    panelRoles.hidden = false;
  }

  function route() { showRole(location.hash.replace('#', '')); }

  window.addEventListener('hashchange', route);
  route();                                   // supports opening sign_up.html#teacher directly

  document.getElementById('back-btn').addEventListener('click', function () {
    if (location.hash) {
      history.pushState('', document.title, location.pathname + location.search);
    }
    showRoles();
    var first = panelRoles.querySelector('.role-card');
    if (first) first.focus();
  });

  /* ---------- Show / hide password ---------- */
  form.querySelector('.password-toggle').addEventListener('click', function () {
    var input = document.getElementById('password');
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    this.textContent = show ? 'Hide' : 'Show';
    this.setAttribute('aria-pressed', String(show));
    this.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  /* ---------- Validation ---------- */
  function errorEl(field) { return form.querySelector('[data-error-for="' + field.id + '"]'); }

  function message(field) {
    var v = field.value.trim();
    if (field.required && !v) return field.dataset.errorRequired || 'This field is required.';
    if (field.minLength > 0 && v && v.length < field.minLength)
      return field.dataset.errorMin || 'Too short.';
    if (field.dataset.match && v !== document.getElementById(field.dataset.match).value)
      return field.dataset.errorMatch || 'Values do not match.';
    if (v && !field.checkValidity())
      return field.dataset.errorType || 'Check this value.';
    return '';
  }

  function setError(field, msg) {
    var p = errorEl(field);
    if (msg) { field.setAttribute('aria-invalid', 'true'); }
    else     { field.removeAttribute('aria-invalid'); }
    if (p) { p.textContent = msg; p.hidden = !msg; }
  }

  function clearErrors() {
    form.querySelectorAll('[aria-invalid]').forEach(function (f) { setError(f, ''); });
    summary.hidden = true; summary.innerHTML = '';
  }

  function activeFields() {
    return Array.prototype.filter.call(form.querySelectorAll('input:not([type=hidden]), select'),
      function (f) { return !f.matches(':disabled'); });
  }

  form.addEventListener('submit', function (e) {
    var bad = [];
    activeFields().forEach(function (f) {
      var msg = message(f);
      setError(f, msg);
      if (msg) bad.push(f);
    });

    if (bad.length) {
      e.preventDefault();
      summary.hidden = false;
      summary.textContent = bad.length === 1 ? 'Please fix 1 field below.' : 'Please fix ' + bad.length + ' fields below.';
      bad[0].focus();
      bad[0].scrollIntoView({ block: 'center' });
    }
  });

  // Clear a field's error as soon as the user fixes it
  form.addEventListener('input', function (e) {
    var f = e.target;
    if (f.getAttribute('aria-invalid') === 'true' && !message(f)) setError(f, '');
  });
  form.addEventListener('change', function (e) {
    var f = e.target;
    if (f.getAttribute('aria-invalid') === 'true' && !message(f)) setError(f, '');
  });
})();