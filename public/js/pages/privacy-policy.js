/* public/js/pages/privacy-policy.js */
'use strict';

function renderPrivacyPolicy() {
  try {
    console.log('renderPrivacyPolicy called');
    document.title = 'Privacy & Policy — Ashir Writes';
    const html = `
      <div class="privacy-policy-page">
        <h1 class="policy-title">Privacy & Policy</h1>
        <div class="policy-divider"></div>
        <div class="policy-body">
          
          <section class="policy-section">
            <h2 class="policy-subtitle">Privacy Policy</h2>
            <p>Your privacy is important to us. This website does not collect, store, or share any personal information about you unless you voluntarily provide it.</p>
            
            <h3 class="policy-subheading">Information We Collect</h3>
            <p>We may collect information such as your name, email address, and message content only when you contact us directly through provided channels. This information is used solely to respond to your inquiry.</p>
            
            <h3 class="policy-subheading">Cookies & Analytics</h3>
            <p>This website may use basic analytics to understand visitor behavior and improve your experience. No personally identifiable information is stored in analytics. We do not use cookies for tracking or profiling.</p>
            
            <h3 class="policy-subheading">Data Security</h3>
            <p>We take reasonable measures to protect any information you provide. However, no method of transmission over the internet is completely secure. Use the site at your own risk.</p>
            
            <h3 class="policy-subheading">Third-Party Links</h3>
            <p>This website may contain links to external sites. We are not responsible for the privacy practices of external websites. Please review their privacy policies independently.</p>
          </section>

          <section class="policy-section">
            <h2 class="policy-subtitle">Terms of Use</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h3 class="policy-subheading">Intellectual Property Rights</h3>
            <p>All content on this website, including text, images, and articles, is the property of Ashir Mehmood and is protected by copyright law. Unauthorized reproduction or distribution is prohibited.</p>
            
            <h3 class="policy-subheading">User Conduct</h3>
            <p>Users agree not to use this website for any unlawful purpose or in any way that could damage, disable, or impair the site or its services.</p>
            
            <h3 class="policy-subheading">Disclaimer</h3>
            <p>The content on this website is provided "as is" without any representations or warranties. We make no representations or warranties relating to the website or information and materials provided.</p>
          </section>

          <section class="policy-section">
            <h2 class="policy-subtitle">Changes to This Policy</h2>
            <p>We may update this privacy and policy statement from time to time. Please check this page regularly for any changes. Your continued use of this website following the posting of revised terms means you accept and agree to the changes.</p>
          </section>

          <section class="policy-section">
            <h2 class="policy-subtitle">Contact Us</h2>
            <p>If you have questions or concerns regarding this privacy and policy statement, please <a href="/contact" data-link>contact us</a>.</p>
          </section>
        </div>
      </div>
    `;
    document.getElementById('main-content').innerHTML = html;
    console.log('renderPrivacyPolicy completed successfully');
  } catch (error) {
    console.error('Error in renderPrivacyPolicy:', error);
  }
}
