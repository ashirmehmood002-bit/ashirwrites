/* public/js/pages/home.js */
'use strict';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function skeletonCards(n = 6) {
  return Array.from({ length: n }, () => `
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line mid"></div>
      </div>
    </div>`).join('');
}

function articleCard(a) {
  const img = a.coverImage
    ? `<div class="card-image"><img src="${a.coverImage}" alt="${a.title}" loading="lazy"/></div>`
    : `<div class="card-no-image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`;
  const tag = a.tags?.[0] ? `<span class="card-tag">${a.tags[0]}</span>` : '';
  return `
    <article class="article-card">
      <a href="/article/${a.slug}" data-link>
        ${img}
        <div class="card-body">
          <div class="card-meta">
            <span class="card-date">${formatDate(a.createdAt)}</span>
            ${tag}
          </div>
          <h2 class="card-title">${a.title}</h2>
          <p class="card-description">${a.description}</p>
          <span class="card-read-more">
            Read more
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="8" x2="14" y2="8"/><polyline points="9 3 14 8 9 13"/></svg>
          </span>
        </div>
      </a>
    </article>`;
}

async function renderHome() {
  document.title = 'Ashir Writes — Essays & Ideas';
  document.getElementById('main-content').innerHTML = `
    <section class="hero">
      <span class="hero-eyebrow">A writer's corner</span>
      <h1 class="hero-title">Words that make you<br/><em>think twice</em></h1>
      <p class="hero-subtitle">Essays on writing, reading, and the examined life — by Ashir Mahmood.</p>
    </section>
    <div class="section-header">
      <h2 class="section-title">Latest Articles</h2>
      <div class="section-rule"></div>
    </div>
    <div class="articles-container">
      <div class="articles-grid" id="articles-grid">${skeletonCards()}</div>
    </div>`;

  try {
    const { articles } = await API.get('/articles');
    const grid = document.getElementById('articles-grid');
    if (!grid) return;
    grid.innerHTML = articles.length
      ? articles.map(articleCard).join('')
      : `<div class="empty-state"><h3>No articles yet</h3><p>Check back soon.</p></div>`;
  } catch (e) {
    const grid = document.getElementById('articles-grid');
    if (grid) grid.innerHTML = `<div class="empty-state"><h3>Could not load articles</h3><p>${e.message}</p></div>`;
  }
}
