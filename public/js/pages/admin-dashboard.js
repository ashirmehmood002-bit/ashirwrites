/* public/js/pages/admin-dashboard.js */
'use strict';

let _deleteId = null;

function renderAdminShell(activeSection, bodyHtml) {
  document.getElementById('site-header').style.display = 'none';
  document.querySelector('.site-footer').style.display = 'none';
  document.getElementById('main-content').innerHTML = `
    <div class="admin-wrapper">
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-logo">
          <a href="/" data-link>Ashir <span>Writes</span></a>
          <div class="admin-sidebar-subtitle">Admin Panel</div>
        </div>
        <nav class="admin-nav">
          <div class="admin-nav-item ${activeSection==='dashboard'?'active':''}" id="nav-dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Articles
          </div>
          <div class="admin-nav-item ${activeSection==='new'?'active':''}" id="nav-new">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Article
          </div>
        </nav>
        <div class="admin-logout">
          <button class="admin-logout-btn" id="admin-logout-btn">Sign Out</button>
        </div>
      </aside>
      <main class="admin-main">${bodyHtml}</main>
    </div>`;

  document.getElementById('nav-dashboard').addEventListener('click', () => Router.navigate('/admin-secret-panel'));
  document.getElementById('nav-new').addEventListener('click', () => Router.navigate('/admin-secret-panel/new'));
  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    API.clearToken();
    Router.navigate('/admin-secret-panel/login');
  });
}

async function renderAdminDashboard() {
  if (!API.getToken()) return Router.navigate('/admin-secret-panel/login');
  document.title = 'Dashboard — Admin';

  renderAdminShell('dashboard', `
    <div class="admin-topbar">
      <h1 class="admin-page-title">Articles</h1>
      <button class="admin-btn admin-btn-primary" id="new-article-btn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New Article
      </button>
    </div>
    <div id="dash-alert"></div>
    <div class="admin-card">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="articles-tbody">
          <tr><td colspan="4" style="text-align:center;color:var(--ink-faint);padding:2rem">Loading…</td></tr>
        </tbody>
      </table>
    </div>`);

  document.getElementById('new-article-btn').addEventListener('click', () => Router.navigate('/admin-secret-panel/new'));
  await loadArticlesTable();
  setupDeleteModal();
}

async function loadArticlesTable() {
  const tbody = document.getElementById('articles-tbody');
  if (!tbody) return;
  try {
    const { articles } = await API.get('/articles/all');
    if (!articles.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--ink-faint);padding:2rem">No articles yet. Create your first one!</td></tr>`;
      return;
    }
    tbody.innerHTML = articles.map(a => `
      <tr>
        <td class="article-title-cell">${a.title}</td>
        <td><span class="admin-status-badge ${a.published?'published':'draft'}">${a.published?'Published':'Draft'}</span></td>
        <td style="color:var(--ink-muted);font-size:0.85rem">${new Date(a.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
        <td>
          <div class="admin-actions">
            <button class="admin-btn admin-btn-ghost" data-edit="${a._id}">Edit</button>
            <button class="admin-btn admin-btn-danger" data-delete="${a._id}">Delete</button>
          </div>
        </td>
      </tr>`).join('');

    document.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        Router.navigate(`/admin-secret-panel/edit/${btn.dataset.edit}`);
      });
    });

    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        _deleteId = btn.dataset.delete;
        document.getElementById('confirm-modal').classList.add('open');
      });
    });
  } catch (e) {
    if (e.status === 401) return Router.navigate('/admin-secret-panel/login');
    tbody.innerHTML = `<tr><td colspan="4" style="color:#c0392b;text-align:center;padding:2rem">${e.message}</td></tr>`;
  }
}

function setupDeleteModal() {
  document.getElementById('modal-cancel').onclick = () => {
    document.getElementById('confirm-modal').classList.remove('open');
    _deleteId = null;
  };
  document.getElementById('modal-confirm').onclick = async () => {
    if (!_deleteId) return;
    try {
      await API.del(`/articles/${_deleteId}`);
      document.getElementById('confirm-modal').classList.remove('open');
      _deleteId = null;
      document.getElementById('dash-alert').innerHTML = `<div class="alert alert-success">Article deleted successfully.</div>`;
      await loadArticlesTable();
    } catch (e) {
      document.getElementById('confirm-modal').classList.remove('open');
      document.getElementById('dash-alert').innerHTML = `<div class="alert alert-error">${e.message}</div>`;
    }
  };
}
