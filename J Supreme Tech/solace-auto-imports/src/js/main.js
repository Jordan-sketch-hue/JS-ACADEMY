import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initFAQ } from './faq.js';
import { initInventory, loadFeatured, loadTestimonials } from './inventory.js';
import { initLeadForms } from './leads.js';
import { initWhatsAppFAB } from './whatsapp.js';

function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(async () => {
  initNav();
  initFAQ();
  initWhatsAppFAB();
  initLeadForms();

  if (document.querySelector('#inventory-grid')) {
    await initInventory();
  }
  if (document.querySelector('#featured-strip')) {
    await loadFeatured(3);
  }
  if (document.querySelector('#testimonials')) {
    await loadTestimonials();
  }

  initReveal();
});
