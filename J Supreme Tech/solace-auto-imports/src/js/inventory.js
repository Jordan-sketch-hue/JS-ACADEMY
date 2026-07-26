// (Modal kept in repo but no longer used — clicking a card navigates to vehicle.html?id=…)
import { waLinkForCar } from './whatsapp.js';

const PLACEHOLDER = 'assets/placeholder-car.svg';
const NEW_DAYS = 14;

let allCars = [];
let testimonials = [];
let filters = { q: '', type: 'All', brand: 'All', transmission: 'All', fuel: 'All', sort: 'newest' };

export async function initInventory() {
  const grid = document.querySelector('#inventory-grid');
  const empty = document.querySelector('#inventory-empty');
  if (!grid) return;

  try {
    const res = await fetch('/api/vehicles', { cache: 'no-cache' });
    if (!res.ok) throw new Error('Failed to load inventory');
    const data = await res.json();
    allCars = data.cars || [];
  } catch (err) {
    console.warn('Database inventory unavailable; falling back to local JSON.', err);
    try {
      const res = await fetch('data/cars.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('Failed to load fallback inventory');
      const data = await res.json();
      allCars = data.cars || [];
    } catch (fallbackErr) {
      console.error(fallbackErr);
      grid.innerHTML = `<p class="col-span-full text-center text-solace-navy/70 py-12">Unable to load inventory. Please refresh or try again later.</p>`;
      return;
    }
  }

  populateFilterOptions();
  wireFilterEvents();
  render(grid, empty);

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('[data-car-id]');
    if (!card) return;
    // Don't intercept the inline CTAs (WhatsApp / Call / View details link)
    if (e.target.closest('[data-wa]')) return;
    if (e.target.closest('a[href]')) return;
    window.location.href = `vehicle.html?id=${encodeURIComponent(card.dataset.carId)}`;
  });
}

function populateFilterOptions() {
  const types = ['All', ...new Set(allCars.map(c => c.type).filter(Boolean))];
  const brands = ['All', ...new Set(allCars.map(c => c.make).filter(Boolean))].sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));
  const fuels = ['All', ...new Set(allCars.map(c => c.fuel).filter(Boolean))];
  const trans = ['All', ...new Set(allCars.map(c => c.transmission).filter(Boolean))];

  const typePills = document.querySelector('#filter-type');
  if (typePills) {
    typePills.innerHTML = types.map((t, i) => `
      <button type="button" class="filter-pill px-4 py-2 rounded-full border-2 border-solace-navy/15 text-sm font-medium text-solace-navy hover:border-solace-orange transition" data-filter="type" data-value="${t}" aria-pressed="${i === 0}">${t}</button>
    `).join('');
  }
  fillSelect('#filter-brand', brands);
  fillSelect('#filter-fuel', fuels);
  fillSelect('#filter-trans', trans);
}

function fillSelect(sel, values) {
  const el = document.querySelector(sel);
  if (!el) return;
  el.innerHTML = values.map(v => `<option value="${v}">${v === 'All' ? `Any ${el.dataset.label || ''}` : v}</option>`).join('');
}

function wireFilterEvents() {
  const grid = document.querySelector('#inventory-grid');
  const empty = document.querySelector('#inventory-empty');

  const search = document.querySelector('#filter-search');
  if (search) {
    search.addEventListener('input', (e) => {
      filters.q = e.target.value.toLowerCase().trim();
      render(grid, empty);
    });
  }

  const typePills = document.querySelector('#filter-type');
  if (typePills) {
    typePills.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      typePills.querySelectorAll('.filter-pill').forEach(p => p.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      filters.type = btn.dataset.value;
      render(grid, empty);
    });
  }

  ['#filter-brand', '#filter-fuel', '#filter-trans', '#filter-sort'].forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.addEventListener('change', (e) => {
      const key = sel.replace('#filter-', '');
      const map = { brand: 'brand', fuel: 'fuel', trans: 'transmission', sort: 'sort' };
      filters[map[key]] = e.target.value;
      render(grid, empty);
    });
  });

  const reset = document.querySelector('#filter-reset');
  if (reset) {
    reset.addEventListener('click', () => {
      filters = { q: '', type: 'All', brand: 'All', transmission: 'All', fuel: 'All', sort: 'newest' };
      if (search) search.value = '';
      document.querySelectorAll('#filter-type .filter-pill').forEach((p, i) => p.setAttribute('aria-pressed', i === 0 ? 'true' : 'false'));
      ['#filter-brand', '#filter-fuel', '#filter-trans'].forEach(s => { const el = document.querySelector(s); if (el) el.value = 'All'; });
      const sortEl = document.querySelector('#filter-sort');
      if (sortEl) sortEl.value = 'newest';
      render(grid, empty);
    });
  }
}

function render(grid, empty) {
  let list = allCars.filter(c => {
    if (filters.type !== 'All' && c.type !== filters.type) return false;
    if (filters.brand !== 'All' && c.make !== filters.brand) return false;
    if (filters.transmission !== 'All' && c.transmission !== filters.transmission) return false;
    if (filters.fuel !== 'All' && c.fuel !== filters.fuel) return false;
    if (filters.q) {
      const hay = `${c.year} ${c.make} ${c.model} ${c.color || ''} ${c.type || ''}`.toLowerCase();
      if (!hay.includes(filters.q)) return false;
    }
    return true;
  });

  switch (filters.sort) {
    case 'price-asc': list.sort((a, b) => (a.priceJMD ?? Infinity) - (b.priceJMD ?? Infinity)); break;
    case 'price-desc': list.sort((a, b) => (b.priceJMD ?? -1) - (a.priceJMD ?? -1)); break;
    case 'year-desc': list.sort((a, b) => (b.year || 0) - (a.year || 0)); break;
    case 'newest':
    default: list.sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''));
  }

  const count = document.querySelector('#inventory-count');
  if (count) count.textContent = `${list.length} ${list.length === 1 ? 'vehicle' : 'vehicles'}`;

  if (!list.length) {
    grid.innerHTML = '';
    empty?.classList.remove('hidden');
    return;
  }
  empty?.classList.add('hidden');
  grid.innerHTML = list.map(carCard).join('');
}

function isNew(dateAdded) {
  if (!dateAdded) return false;
  const d = new Date(dateAdded);
  if (isNaN(d)) return false;
  return (Date.now() - d.getTime()) / 86400000 < NEW_DAYS;
}

function carCard(car) {
  const allMedia = car.images || [];
  const isVideoUrl = (u) => /\.(mp4|mov|webm|m4v|mpeg|mpg)(\?|$)/i.test(u || '');
  // Card thumbnail prefers a still image. If the listing has only videos,
  // fall back to the placeholder so we don't try to render a video URL
  // as an <img src>.
  const firstImage = allMedia.find((u) => !isVideoUrl(u));
  const hasAnyVideo = allMedia.some(isVideoUrl);
  const img = firstImage || PLACEHOLDER;
  const statusColor = car.status === 'Sold' ? 'bg-red-100 text-red-700'
    : car.status === 'Reserved' ? 'bg-yellow-100 text-yellow-800'
    : 'bg-green-100 text-green-700';
  const newBadge = isNew(car.dateAdded);
  const price = car.priceDisplay || car.price || 'Contact for price';
  const mileage = car.mileageKm ? `${car.mileageKm.toLocaleString()} km` : null;

  return `
    <article class="car-card group relative bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer reveal" data-car-id="${car.id}" tabindex="0" role="button" aria-label="View ${car.year} ${car.make} ${car.model}">
      <div class="relative overflow-hidden">
        <img class="car-card-img group-hover:scale-105 transition-transform duration-500" src="${img}" alt="${car.year} ${car.make} ${car.model}" loading="lazy">
        ${hasAnyVideo ? '<span class="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded inline-flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Video</span>' : ''}
        <span class="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${statusColor}">${car.status || 'Available'}</span>
        <div class="absolute top-3 right-3 flex gap-2">
          ${newBadge ? `<span class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-solace-blue text-white">New</span>` : ''}
          ${car.featured ? `<span class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-solace-orange text-white">Featured</span>` : ''}
        </div>
      </div>
      <div class="p-5">
        <div class="flex items-baseline justify-between gap-3">
          <h3 class="font-display text-lg font-bold text-solace-navy leading-tight">${car.year} ${car.make}</h3>
          <span class="text-xs uppercase tracking-wider text-solace-navy/50 font-semibold">${car.type || ''}</span>
        </div>
        <p class="text-solace-navy/70 mt-0.5">${car.model}</p>
        <p class="text-solace-orange font-display font-semibold mt-3">${price}</p>
        <div class="flex flex-wrap gap-2 mt-4 text-xs text-solace-navy/60">
          ${car.transmission ? `<span class="px-2 py-1 bg-solace-cream rounded">${car.transmission}</span>` : ''}
          ${car.fuel ? `<span class="px-2 py-1 bg-solace-cream rounded">${car.fuel}</span>` : ''}
          ${mileage ? `<span class="px-2 py-1 bg-solace-cream rounded">${mileage}</span>` : ''}
        </div>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <a data-wa href="${waLinkForCar(car)}" target="_blank" rel="noopener" onclick="event.stopPropagation()" class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebd5a]">
            <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.4.7 4.6 1.9 6.5L4 29l7.7-1.9c1.8.9 3.9 1.5 6.3 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3z"/></svg>
            WhatsApp
          </a>
          <a href="tel:+18764566976" onclick="event.stopPropagation()" class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-solace-navy text-white text-sm font-semibold hover:bg-solace-blue">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            Call
          </a>
        </div>
      </div>
    </article>
  `;
}

export async function loadFeatured(limit = 3) {
  const strip = document.querySelector('#featured-strip');
  if (!strip) return;
  try {
    let res = await fetch('/api/vehicles', { cache: 'no-cache' });
    if (!res.ok) res = await fetch('data/cars.json', { cache: 'no-cache' });
    const data = await res.json();
    const featured = (data.cars || []).filter(c => c.featured).slice(0, limit);
    if (!featured.length) {
      strip.innerHTML = `<p class="col-span-full text-center text-solace-navy/60">New arrivals coming soon — call (876) 456-6976.</p>`;
      return;
    }
    strip.innerHTML = featured.map(carCard).join('');
    strip.addEventListener('click', (e) => {
      const card = e.target.closest('[data-car-id]');
      if (!card) return;
      if (e.target.closest('[data-wa]')) return;
      if (e.target.closest('a[href]')) return;
      window.location.href = `vehicle.html?id=${encodeURIComponent(card.dataset.carId)}`;
    });
  } catch (err) {
    console.error(err);
    strip.innerHTML = '';
  }
}

export async function loadTestimonials() {
  const wrap = document.querySelector('#testimonials');
  if (!wrap) return;
  try {
    const res = await fetch('data/cars.json', { cache: 'no-cache' });
    const data = await res.json();
    testimonials = data.testimonials || [];
    if (!testimonials.length) { wrap.parentElement?.classList.add('hidden'); return; }
    wrap.innerHTML = testimonials.map(t => `
      <figure class="reveal bg-white rounded-2xl p-6 shadow-sm border border-solace-navy/5">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" class="text-solace-orange/30"><path d="M9.17 14.42c0 1.92-1.55 3.48-3.46 3.48-1.92 0-3.48-1.56-3.48-3.48 0-3.94 2.86-7.18 6.62-7.83l.42 1.74c-2.07.45-3.86 2.31-3.86 4.36.55-.36 1.18-.57 1.84-.57 1.92 0 3.48 1.55 3.48 3.48.44-.06-.86.82-1.56.82z"/><path d="M21.92 14.42c0 1.92-1.55 3.48-3.46 3.48-1.92 0-3.48-1.56-3.48-3.48 0-3.94 2.86-7.18 6.62-7.83l.42 1.74c-2.07.45-3.86 2.31-3.86 4.36.55-.36 1.18-.57 1.84-.57 1.92 0 3.48 1.55 3.48 3.48z"/></svg>
        <blockquote class="mt-3 text-solace-navy leading-relaxed">${t.quote}</blockquote>
        <figcaption class="mt-4 text-sm font-semibold text-solace-navy">${t.name} <span class="text-solace-navy/50 font-normal">— ${t.location}</span></figcaption>
      </figure>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}
