/* public/js/pages/contact.js */
'use strict';

function renderContact() {
  try {
    console.log('renderContact called');
    document.title = 'Contact — Ashir Writes';
    const html = `
      <div class="contact-page">
        <h1 class="contact-title">Get in Touch</h1>
        <div class="contact-divider"></div>
        <div class="contact-body">
          <p class="contact-intro">Feel free to reach out through any of the channels below.</p>
          
          <div class="contact-info">
            <div class="contact-item">
              <h3 class="contact-label">Email</h3>
              <a href="mailto:ashir@ashirwrites.com" class="contact-link">ashir@ashirwrites.com</a>
            </div>
            
            <div class="contact-item">
              <h3 class="contact-label">Twitter</h3>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="contact-link">@ashirwrites</a>
            </div>
            
            <div class="contact-item">
              <h3 class="contact-label">WhatsApp</h3>
              <a href="https://wa.me/923260286859" target="_blank" rel="noopener noreferrer" class="contact-link">+92 326 0286859</a>
            </div>
            <div class="contact-item">
              <h4 class="contact-label">Instagram</h4>
              <a href="https://instagram.com/ashiir002" target="_blank" rel="noopener noreferrer" class="contact-link">@ashiir002</a>
            </div>
          </div>
          
          <div class="contact-note">
            <p>I read all messages and try to respond as soon as possible. Thank you for reaching out!</p>
          </div>
        </div>
      </div>
    `;
    document.getElementById('main-content').innerHTML = html;
    console.log('renderContact completed successfully');
  } catch (error) {
    console.error('Error in renderContact:', error);
  }
}
