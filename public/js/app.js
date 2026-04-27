/* public/js/app.js — Bootstrap: register routes and start the app */
'use strict';

// Set footer year
document.getElementById('footer-year').textContent = new Date().getFullYear();

// Mobile nav toggle
document.getElementById('nav-toggle').addEventListener('click', function () {
  this.classList.toggle('open');
  document.getElementById('site-nav').classList.toggle('open');
});

// Restore public header/footer visibility on public page render
function showPublicChrome() {
  document.getElementById('site-header').style.display = '';
  document.querySelector('.site-footer').style.display = '';
}

// ── Route definitions ────────────────────────────────────────
Router.define('/', () => { showPublicChrome(); renderHome(); });
Router.define('/about', () => { showPublicChrome(); renderAbout(); });
Router.define('/article/([^/]+)', (slug) => { showPublicChrome(); renderArticle(slug); });

// Admin routes — chrome hidden inside each renderer
Router.define('/admin-secret-panel/login', renderAdminLogin);
Router.define('/admin-secret-panel', renderAdminDashboard);
Router.define('/admin-secret-panel/new', () => renderAdminEditor(null));
Router.define('/admin-secret-panel/edit/([^/]+)', (id) => renderAdminEditor(id));

// ── Initial render ───────────────────────────────────────────
Router.navigate(location.pathname, false);
