export function initNav() {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('#mobile-menu-toggle');
  const menu = document.querySelector('#mobile-menu');

  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.icon-open')?.classList.toggle('hidden', open);
      toggle.querySelector('.icon-close')?.classList.toggle('hidden', !open);
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelector('.icon-open')?.classList.remove('hidden');
        toggle.querySelector('.icon-close')?.classList.add('hidden');
      });
    });
  }

  // Mark current page link
  const path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === path || (path === '' && link.dataset.nav === 'index')) {
      link.classList.add('text-solace-orange');
    }
  });

  // Inject "Back Office" section into the mobile sidebar
  injectBackOffice(menu);
  // Inject a small Back Office link into the footer (every page has one or several)
  injectBackOfficeFooter();
}

function injectBackOffice(menu) {
  if (!menu || menu.querySelector('[data-bo]')) return;
  const container = menu.querySelector('.flex-col') || menu.firstElementChild;
  if (!container) return;

  const wrap = document.createElement('div');
  wrap.dataset.bo = '1';
  wrap.className = 'mt-4 pt-4 border-t border-solace-navy/10';
  wrap.innerHTML = `
    <p class="px-1 mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-solace-navy/55">Back Office</p>
    <a href="backoffice.html"
       class="flex items-center justify-between rounded-lg border border-solace-navy/15 bg-solace-cream px-3 py-3 text-sm font-semibold text-solace-navy hover:border-solace-orange hover:text-solace-orange transition">
      <span class="inline-flex items-center gap-2">
        <svg viewBox="0 0 20 20" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11h6V3H3z M11 17h6V9h-6z M3 17h6v-4H3z M11 7h6V3h-6z"/></svg>
        Dealership Console
      </span>
      <span class="text-solace-orange">→</span>
    </a>
    <a href="admin.html" class="mt-1 block px-3 py-1.5 text-xs text-solace-navy/50 hover:text-solace-orange transition">
      Legacy admin panel →
    </a>
  `;
  container.appendChild(wrap);
}

function injectBackOfficeFooter() {
  // Skip if we're already on the back office or admin so we don't link a page to itself.
  if (/backoffice|admin/.test(window.location.pathname)) return;
  if (document.querySelector('[data-bo-foot]')) return;

  const footer = document.querySelector('footer');
  if (!footer) return;

  const link = document.createElement('a');
  link.href = 'backoffice.html';
  link.dataset.boFoot = '1';
  link.title = 'Owner / staff back office';
  link.className = 'absolute right-4 bottom-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-solace-navy/40 hover:text-solace-orange transition';
  link.innerHTML = `
    <svg viewBox="0 0 20 20" class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11h6V3H3z M11 17h6V9h-6z M3 17h6v-4H3z M11 7h6V3h-6z"/></svg>
    Back Office
  `;

  // Ensure the footer can position an absolutely-placed child
  const computed = window.getComputedStyle(footer);
  if (computed.position === 'static') footer.style.position = 'relative';
  footer.appendChild(link);
}
