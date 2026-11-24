(() => {
  'use strict';

  const form = document.getElementById('details-form');
  if (!form) return;

  form.noValidate = true; // we show our own accessible messages instead of browser bubbles

  const summary = form.querySelector('.error-summary');
  const fields = [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')];

  const errorEl = (el) => form.querySelector(`[data-error-for="${el.id}"]`);

  /* ---------- Validation rules: returns an error message or '' ---------- */
  function getError(el) {
    const value = el.value.trim();
    const d = el.dataset;

    if (el.required && !value) {
      return d.errorRequired || 'This field is required.';
    }
    if (!value) return '';

    if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return d.errorEmail || 'Enter a valid email address, like name@example.com.';
    }
    if (el.minLength > 0 && el.value.length < el.minLength) {
      return d.errorMin || `Enter at least ${el.minLength} characters.`;
    }
    if (el.type === 'number') {
      const n = Number(value);
      const min = el.min !== '' ? Number(el.min) : -Infinity;
      const max = el.max !== '' ? Number(el.max) : Infinity;
      if (Number.isNaN(n) || n < min || n > max) {
        return d.errorRange || `Enter a number between ${el.min} and ${el.max}.`;
      }
    }
    if (el.type === 'tel' && !/^[+\d][\d\s()-]{6,}$/.test(value)) {
      return d.errorTel || 'Enter a valid phone number.';
    }
    if (d.match) {
      const other = document.getElementById(d.match);
      if (other && other.value !== el.value) {
        return d.errorMatch || 'The values don\'t match.';
      }
    }
    return '';
  }

  /* ---------- Show / clear a single field's error ---------- */
  function showFieldError(el, message) {
    const err = errorEl(el);
    if (message) {
      el.setAttribute('aria-invalid', 'true');
      if (err) {
        err.textContent = message;
        err.hidden = false;
        err.id = err.id || `${el.id}-error`;
        // keep any existing describedby (e.g. password hint) and add the error
        const ids = new Set((el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
        ids.add(err.id);
        el.setAttribute('aria-describedby', [...ids].join(' '));
      }
    } else {
      el.removeAttribute('aria-invalid');
      if (err) {
        err.textContent = '';
        err.hidden = true;
        const ids = (el.getAttribute('aria-describedby') || '')
          .split(' ')
          .filter((id) => id && id !== err.id);
        ids.length
          ? el.setAttribute('aria-describedby', ids.join(' '))
          : el.removeAttribute('aria-describedby');
      }
    }
  }

  function validateField(el) {
    const message = getError(el);
    showFieldError(el, message);
    return message;
  }

  /* ---------- Error summary ---------- */
  function renderSummary(errors) {
    summary.replaceChildren();
    if (!errors.length) {
      summary.hidden = true;
      return;
    }
    const title = document.createElement('p');
    title.className = 'error-summary__title';
    title.textContent = errors.length === 1
      ? 'There is 1 problem with your details:'
      : `There are ${errors.length} problems with your details:`;

    const list = document.createElement('ul');
    errors.forEach(({ el, message }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${el.id}`;
      a.textContent = message;
      a.addEventListener('click', (e) => {
        e.preventDefault();
        el.focus();
      });
      li.appendChild(a);
      list.appendChild(li);
    });

    summary.append(title, list);
    summary.hidden = false;
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', (e) => {
    const errors = [];
    fields.forEach((el) => {
      const message = validateField(el);
      if (message) errors.push({ el, message });
    });

    if (errors.length) {
      e.preventDefault();
      renderSummary(errors);
      summary.focus();
      return;
    }

    renderSummary([]);
    // Valid: let the form post to register.php. Prevent double submits.
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Creating account…';
    }
  });

  // Restore the button if the user comes back via the browser's back button
  window.addEventListener('pageshow', () => {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Create account';
    }
  });

  /* ---------- Live validation ---------- */
  fields.forEach((el) => {
    // Validate when leaving a field (but not while the user is still typing)
    el.addEventListener('blur', () => {
      if (el.value !== '' || el.getAttribute('aria-invalid')) validateField(el);
    });

    // Once a field is flagged, clear the error as soon as it becomes valid
    const recheck = () => {
      if (el.getAttribute('aria-invalid') === 'true') validateField(el);
    };
    el.addEventListener('input', recheck);
    el.addEventListener('change', recheck);
  });

  // If the password changes, re-check the confirmation field
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  if (password && confirm) {
    password.addEventListener('input', () => {
      if (confirm.value) validateField(confirm);
    });
  }

  /* ---------- Show / hide password ---------- */
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    const input = document.getElementById(btn.getAttribute('aria-controls'));
    if (!input) return;

    btn.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'Hide' : 'Show';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
  });
})();