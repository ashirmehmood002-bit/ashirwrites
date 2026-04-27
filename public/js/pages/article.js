/* public/js/pages/article.js */
'use strict';

async function renderArticle(slug) {
  document.getElementById('main-content').innerHTML = `
    <div class="article-page">
      <div class="article-content-wrap">
        <div class="skeleton-card" style="border:none">
          <div class="skeleton-body" style="padding:0;gap:1rem">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line title" style="height:36px;width:70%"></div>
            <div class="skeleton-line"></div><div class="skeleton-line mid"></div>
          </div>
        </div>
      </div>
    </div>`;

  try {
    const { article } = await API.get(`/articles/slug/${slug}`);
    document.title = `${article.title} — Ashir Writes`;

    const cover = article.coverImage
      ? `<img class="article-cover" src="${article.coverImage}" alt="${article.title}" />`
      : '';
    const tags = article.tags?.length
      ? `<div class="article-tags">${article.tags.map(t => `<span class="article-tag">${t}</span>`).join('')}</div>`
      : '';
    const date = new Date(article.createdAt).toLocaleDateString('en-US', { year:'numeric',month:'long',day:'numeric' });

    document.getElementById('main-content').innerHTML = `
      <div class="article-page">
        <div class="article-content-wrap">
          <a href="/" class="article-back" data-link>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><line x1="14" y1="8" x2="2" y2="8"/><polyline points="7 3 2 8 7 13"/></svg>
            All Articles
          </a>
          <header class="article-header">
            <div class="article-meta">
              <span class="article-date">${date}</span>
              ${tags}
            </div>
            <h1 class="article-title">${article.title}</h1>
            <p class="article-description">${article.description}</p>
          </header>
          ${cover}
          <div class="article-body">${article.content}</div>
        </div>
      </div>`;
  } catch (e) {
    document.getElementById('main-content').innerHTML = `
      <div class="error-page">
        <div class="error-code">404</div>
        <h2 class="error-title">Article not found</h2>
        <p class="error-text">This article may have been removed or the link is incorrect.</p>
        <a href="/" class="btn-primary" data-link>← Back to Home</a>
      </div>`;
  }
}
