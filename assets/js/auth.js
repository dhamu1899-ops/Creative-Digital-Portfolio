/* =========================================================
   STACKLY — demo auth (front-end only, localStorage)
   Login only checks: required fields + valid email format.
   Signup stores the account and returns to the home page.
   ========================================================= */
(function () {
  const USERS_KEY = 'stackly_users';
  const SESSION_KEY = 'stackly_session';

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

  window.StackyAuth = {
    getSession() {
      try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
      catch (e) { return null; }
    },
    setSession(session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); },
    clearSession() { localStorage.removeItem(SESSION_KEY); },
    addUser(user) {
      const users = getUsers();
      users.push(user);
      saveUsers(users);
    },
    guard(requiredRole) {
      const session = this.getSession();
      if (!session || (requiredRole && session.role !== requiredRole)) {
        window.location.href = 'login.html';
        return null;
      }
      return session;
    },
    logout() {
      this.clearSession();
      window.location.href = 'index.html';
    }
  };
})();

document.addEventListener('DOMContentLoaded', () => {

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function nameFromEmail(email) {
    const local = email.split('@')[0].replace(/[._\-0-9]+/g, ' ').trim();
    if (!local) return 'there';
    return local.replace(/\b\w/g, c => c.toUpperCase());
  }

  /* ---------- Role tabs (login + signup) ---------- */
  const roleTabs = document.querySelectorAll('.role-tab');
  const roleInput = document.getElementById('roleInput');
  if (roleTabs.length) {
    roleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        roleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (roleInput) roleInput.value = tab.dataset.role;
      });
    });
  }

  /* ---------- Password visibility toggle ---------- */
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-field').querySelector('input');
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? 'Hide' : 'Show';
    });
  });

  /* ---------- Login form ----------
     Only checks that both fields are filled in and the email
     looks valid — it does not authenticate against an account.
     The role tab you pick decides which dashboard you land on. */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const role = roleInput ? roleInput.value : 'user';
      const errorBox = document.getElementById('loginError');

      if (!email || !password) {
        errorBox.textContent = 'Please fill in both email and password.';
        errorBox.classList.add('show');
        return;
      }
      if (!EMAIL_PATTERN.test(email)) {
        errorBox.textContent = 'Enter a valid email address.';
        errorBox.classList.add('show');
        return;
      }

      errorBox.classList.remove('show');
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.textContent = 'Logging in…'; submitBtn.disabled = true; }
      window.StackyAuth.setSession({ name: nameFromEmail(email), email, role });
      window.location.href = role === 'admin' ? 'dashboard-admin.html' : 'dashboard-user.html';
    });
  }

  /* ---------- Signup form ---------- */
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;
      const role = roleInput ? roleInput.value : 'user';
      const terms = document.getElementById('agreeTerms');
      const errorBox = document.getElementById('signupError');

      if (!name || !email || !password || !confirmPassword) {
        errorBox.textContent = 'Please fill in all required fields.';
        errorBox.classList.add('show');
        return;
      }
      if (!EMAIL_PATTERN.test(email)) {
        errorBox.textContent = 'Enter a valid email address.';
        errorBox.classList.add('show');
        return;
      }
      if (terms && !terms.checked) {
        errorBox.textContent = 'Please accept the Terms of Service to continue.';
        errorBox.classList.add('show');
        return;
      }
      if (password !== confirmPassword) {
        errorBox.textContent = 'Passwords do not match.';
        errorBox.classList.add('show');
        return;
      }

      errorBox.classList.remove('show');
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.textContent = 'Creating account…'; submitBtn.disabled = true; }
      window.StackyAuth.addUser({ name, email, password, role });
      window.location.href = 'index.html?signup=success';
    });
  }

});
