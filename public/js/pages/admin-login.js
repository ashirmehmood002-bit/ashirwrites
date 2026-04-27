/* public/js/pages/admin-login.js */
'use strict';

function renderAdminLogin() {
  document.title = 'Admin — Ashir Writes';
  // Hide public header/footer for admin area
  document.getElementById('site-header').style.display = 'none';
  document.querySelector('.site-footer').style.display = 'none';

  document.getElementById('main-content').innerHTML = `
    <div class="admin-login-page">
      <div class="admin-login-card">
        <div class="admin-login-logo"Ashir <span>Writes</span></div>
        <div class="admin-login-subtitle">Admin Panel</div>
        <div id="login-alert"></div>
        <label class="form-label-login" for="login-username">Username</label>
        <input class="form-input-login" type="text" id="login-username" autocomplete="username" placeholder="Enter username" />
        <label class="form-label-login" for="login-password">Password</label>
        <input class="form-input-login" type="password" id="login-password" autocomplete="current-password" placeholder="Enter password" />
        <button class="btn-login" id="login-btn">Sign In</button>
      </div>
    </div>`;

  const btn = document.getElementById('login-btn');
  const alertEl = document.getElementById('login-alert');

  async function doLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    alertEl.innerHTML = '';
    if (!username || !password) {
      alertEl.innerHTML = `<div class="alert alert-error">Please enter both username and password.</div>`;
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    try {
      const data = await API.post('/admin/login', { username, password });
      API.setToken(data.token);
      Router.navigate('/admin-secret-panel');
    } catch (e) {
      alertEl.innerHTML = `<div class="alert alert-error">${e.message}</div>`;
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  }

  btn.addEventListener('click', doLogin);
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
}
