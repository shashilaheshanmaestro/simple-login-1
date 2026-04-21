'use strict';

// ── Demo credentials (front-end only) ───────────
const DEMO = { email: 'user@example.com', password: 'Password1' };

// ── DOM refs ─────────────────────────────────────
const form         = document.getElementById('loginForm');
const emailInput   = document.getElementById('email');
const passwordInput= document.getElementById('password');
const emailGroup   = document.getElementById('emailGroup');
const passwordGroup= document.getElementById('passwordGroup');
const emailError   = document.getElementById('emailError');
const passwordError= document.getElementById('passwordError');
const submitBtn    = document.getElementById('submitBtn');
const btnText      = submitBtn.querySelector('.btn-text');
const btnSpinner   = submitBtn.querySelector('.btn-spinner');
const successAlert = document.getElementById('successAlert');
const togglePw     = document.getElementById('togglePw');
const eyeIcon      = document.getElementById('eyeIcon');

// ── Helpers ───────────────────────────────────────
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function setFieldState(group, errorEl, state, message = '') {
  group.classList.remove('error', 'success');
  errorEl.textContent = message;
  if (state === 'error')   group.classList.add('error');
  if (state === 'success') group.classList.add('success');
}

function validateEmail() {
  const val = emailInput.value.trim();
  if (!val) {
    setFieldState(emailGroup, emailError, 'error', 'Email is required.');
    return false;
  }
  if (!isValidEmail(val)) {
    setFieldState(emailGroup, emailError, 'error', 'Enter a valid email address.');
    return false;
  }
  setFieldState(emailGroup, emailError, 'success');
  return true;
}

function validatePassword() {
  const val = passwordInput.value;
  if (!val) {
    setFieldState(passwordGroup, passwordError, 'error', 'Password is required.');
    return false;
  }
  if (val.length < 8) {
    setFieldState(passwordGroup, passwordError, 'error', 'Password must be at least 8 characters.');
    return false;
  }
  setFieldState(passwordGroup, passwordError, 'success');
  return true;
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnText.textContent = loading ? 'Signing in…' : 'Sign in';
  btnSpinner.classList.toggle('hidden', !loading);
}

// ── Password visibility toggle ────────────────────
togglePw.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';

  // Swap icon between eye / eye-off
  eyeIcon.innerHTML = isPassword
    ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
       <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
       <line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
       <circle cx="12" cy="12" r="3"/>`;
});

// ── Real-time validation ──────────────────────────
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

emailInput.addEventListener('input', () => {
  if (emailGroup.classList.contains('error')) validateEmail();
});
passwordInput.addEventListener('input', () => {
  if (passwordGroup.classList.contains('error')) validatePassword();
});

// ── Form submit ───────────────────────────────────
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailOk    = validateEmail();
  const passwordOk = validatePassword();
  if (!emailOk || !passwordOk) return;

  setLoading(true);
  successAlert.classList.add('hidden');

  // Simulate network request
  await new Promise(r => setTimeout(r, 1200));

  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  if (email === DEMO.email && password === DEMO.password) {
    // Success path
    successAlert.classList.remove('hidden');
    form.reset();
    [emailGroup, passwordGroup].forEach(g => g.classList.remove('error', 'success'));
  } else {
    // Credential mismatch
    setFieldState(emailGroup,    emailError,    'error', ' ');
    setFieldState(passwordGroup, passwordError, 'error',
      'Invalid email or password. Try user@example.com / Password1');
  }

  setLoading(false);
});
