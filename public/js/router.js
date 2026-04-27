/* public/js/router.js — Hash-free SPA router */
'use strict';

const Router = (() => {
  const routes = [];
  let current = null;

  function define(pattern, handler) {
    routes.push({ pattern: new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$'), raw: pattern, handler });
  }

  function navigate(path, push = true) {
    if (push && path !== location.pathname) history.pushState({}, '', path);
    const main = document.getElementById('main-content');
    for (const route of routes) {
      const m = location.pathname.match(route.pattern);
      if (m) {
        current = route;
        route.handler(...m.slice(1));
        updateNav();
        window.scrollTo(0, 0);
        return;
      }
    }
    render404();
  }

  function updateNav() {
    document.querySelectorAll('.nav-link[data-link]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === location.pathname);
    });
  }

  function render404() {
    document.getElementById('main-content').innerHTML = `
      <div class="error-page">
        <div class="error-code">404</div>
        <h2 class="error-title">Page not found</h2>
        <p class="error-text">The page you're looking for doesn't exist.</p>
        <a href="/" class="btn-primary" data-link>← Back to Home</a>
      </div>`;
  }

  // Intercept all data-link clicks
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-link]');
    if (a && a.href && a.origin === location.origin) {
      e.preventDefault();
      navigate(a.pathname);
      // Close mobile nav
      document.getElementById('site-nav')?.classList.remove('open');
      document.getElementById('nav-toggle')?.classList.remove('open');
    }
  });

  window.addEventListener('popstate', () => navigate(location.pathname, false));

  return { define, navigate, render404 };
})();
