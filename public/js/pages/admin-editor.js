/* public/js/pages/admin-editor.js */
'use strict';

async function renderAdminEditor(id) {
  if (!API.getToken()) return Router.navigate('/admin-secret-panel/login');
  const isEdit = !!id;
  document.title = `${isEdit ? 'Edit' : 'New'} Article — Admin`;

  renderAdminShell(isEdit ? 'dashboard' : 'new', `
    <div class="admin-topbar">
      <h1 class="admin-page-title">${isEdit ? 'Edit Article' : 'New Article'}</h1>
      <button class="admin-btn admin-btn-ghost" onclick="Router.navigate('/admin-secret-panel')">← Back</button>
    </div>
    <div id="editor-alert"></div>
    <div class="admin-form-page">
      <div class="admin-form-section">
        <div class="admin-form-section-title">Basic Info</div>
        <div class="form-group">
          <label class="form-label" for="f-title">Title <span class="required">*</span></label>
          <input class="form-input" type="text" id="f-title" placeholder="Article title" maxlength="200" />
        </div>
        <div class="form-group">
          <label class="form-label" for="f-desc">Short Description <span class="required">*</span></label>
          <textarea class="form-textarea" id="f-desc" rows="3" placeholder="A brief description shown on the article card…" maxlength="500"></textarea>
          <div class="form-hint">Max 500 characters. Shown on the homepage card.</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-cover">Cover Image URL</label>
          <input class="form-input" type="url" id="f-cover" placeholder="https://example.com/image.jpg" />
          <div class="form-hint">Optional. Use a direct image URL (e.g. Unsplash).</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="f-tags">Tags</label>
          <input class="form-input" type="text" id="f-tags" placeholder="writing, craft, ideas" />
          <div class="form-hint">Comma-separated. First tag shown on the card.</div>
        </div>
        <div class="form-group">
          <div class="form-checkbox-group">
            <input type="checkbox" id="f-published" checked />
            <label class="form-label" for="f-published" style="margin:0;cursor:pointer">Publish immediately</label>
          </div>
          <div class="form-hint">Uncheck to save as draft.</div>
        </div>
      </div>
      <div class="admin-form-section">
        <div class="admin-form-section-title">Content (HTML supported)</div>
        <div class="form-group">
          <label class="form-label" for="f-content">Body <span class="required">*</span></label>
          <textarea class="form-textarea content-area" id="f-content" placeholder="<h2>Section</h2>&#10;<p>Your content here…</p>"></textarea>
          <div class="form-hint">Supports HTML: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;blockquote&gt;, &lt;code&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;img&gt;</div>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:flex-end">
        <button class="admin-btn admin-btn-ghost" onclick="Router.navigate('/admin-secret-panel')">Cancel</button>
        <button class="admin-btn admin-btn-primary" id="save-btn">${isEdit ? 'Update Article' : 'Publish Article'}</button>
      </div>
    </div>`);

  // Pre-fill form if editing
  if (isEdit) {
    try {
      const { article } = await API.get(`/articles/id/${id}`);
      document.getElementById('f-title').value = article.title || '';
      document.getElementById('f-desc').value = article.description || '';
      document.getElementById('f-cover').value = article.coverImage || '';
      document.getElementById('f-tags').value = (article.tags || []).join(', ');
      document.getElementById('f-content').value = article.content || '';
      document.getElementById('f-published').checked = article.published !== false;
    } catch (e) {
      document.getElementById('editor-alert').innerHTML = `<div class="alert alert-error">Could not load article: ${e.message}</div>`;
      return;
    }
  }

  document.getElementById('save-btn').addEventListener('click', async () => {
    const alertEl = document.getElementById('editor-alert');
    alertEl.innerHTML = '';
    const title = document.getElementById('f-title').value.trim();
    const description = document.getElementById('f-desc').value.trim();
    const content = document.getElementById('f-content').value.trim();
    const coverImage = document.getElementById('f-cover').value.trim();
    const tagsRaw = document.getElementById('f-tags').value;
    const published = document.getElementById('f-published').checked;
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

    const errors = [];
    if (!title || title.length < 3) errors.push('Title must be at least 3 characters.');
    if (!description || description.length < 10) errors.push('Description must be at least 10 characters.');
    if (!content || content.length < 20) errors.push('Content must be at least 20 characters.');
    if (errors.length) {
      alertEl.innerHTML = `<div class="alert alert-error">${errors.join('<br>')}</div>`;
      return;
    }

    const btn = document.getElementById('save-btn');
    btn.disabled = true;
    btn.textContent = 'Saving…';

    try {
      const payload = { title, description, content, coverImage, tags, published };
      if (isEdit) {
        await API.put(`/articles/${id}`, payload);
      } else {
        await API.post('/articles', payload);
      }
      Router.navigate('/admin-secret-panel');
    } catch (e) {
      alertEl.innerHTML = `<div class="alert alert-error">${e.message}</div>`;
      btn.disabled = false;
      btn.textContent = isEdit ? 'Update Article' : 'Publish Article';
    }
  });
}
