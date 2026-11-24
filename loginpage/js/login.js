/* ISHARA — sign-in page behaviour (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var form = document.getElementById('signin-form');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var emailField = document.getElementById('email-field');
  var passwordField = document.getElementById('password-field');
  var alertBox = document.getElementById('form-alert');
  var submitBtn = document.getElementById('submit-btn');
  var toggle = document.getElementById('toggle-pw');
  var idleLabel = submitBtn.innerHTML;

  // Show / hide password
  toggle.addEventListener('click', function () {
    var show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Hide' : 'Show';
    toggle.setAttribute('aria-pressed', String(show));
  });

  function setError(field, input, hasError) {
    field.classList.toggle('field-error', hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  // Clear errors as the person corrects them
  email.addEventListener('input', function () { setError(emailField, email, false); alertBox.hidden = true; });
  password.addEventListener('input', function () { setError(passwordField, password, false); alertBox.hidden = true; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alertBox.hidden = true;

    var emailBad = !email.value.trim() || !email.validity.valid;
    var passBad = !password.value;
    setError(emailField, email, emailBad);
    setError(passwordField, password, passBad);

    if (emailBad) { email.focus(); return; }
    if (passBad) { password.focus(); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    // TODO: replace with your real sign-in request.
    // On success: redirect to the dashboard.
    // On failure: alertBox.hidden = false; and re-enable the button.
    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.innerHTML = idleLabel;
      alertBox.hidden = false;
    }, 900);
  });
})();
