/* public/js/pages/about.js */
'use strict';

function renderAbout() {
  document.title = 'About — Ashir Writes';
  document.getElementById('main-content').innerHTML = `
    <div class="about-page">
      <p class="about-eyebrow">About the writer</p>
      <h1 class="about-title">Ashir Mahmood</h1>
      <div class="about-divider"></div>
      <div class="about-body">
        <p><strong>I write to think.</strong> These essays are the product of a restless curiosity — an attempt to understand what it means to live deliberately, to read deeply, and to say something true.</p>
        <p>I'm interested in the craft of writing, the practice of reading, and the ideas that quietly reshape how we see the world. I don't have all the answers, but I've found that asking better questions is usually enough to get started.</p>
        <p>This site is my corner of the internet — unsponsored, unsentimental, and written without the pressure of performance. If something here made you pause, I'd call that a success.</p>
        <p>You can reach me on Twitter or Substack. I read everything, even when I can't reply to everything.</p>
      </div>
      <div class="about-signature">— Ashir Mahmood</div>
    </div>`;
}
