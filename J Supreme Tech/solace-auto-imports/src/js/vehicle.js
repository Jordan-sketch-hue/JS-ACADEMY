/**
 * Single-vehicle detail page. Reads ?id=<carId> from the URL, fetches that
 * vehicle from /api/vehicles, and renders the full gallery + specs.
 *
 * Falls back to data/cars.json so the page works even if Supabase is down.
 *
 * No fullscreen popup / lightbox / overlay — every photo is viewable in the
 * inline gallery (thumbnails + swipe + prev/next) above. Below the listing we
 * cross-sell "More vehicles": the dealer's most popular (featured) cars and
 * newest arrivals, so buyers keep browsing the lot instead of dead-ending.
 */

const PLACEHOLDER = 'assets/placeholder-car.svg'

function moneyDisplay(car) {
  return car.priceDisplay || car.price || 'Contact for price'
}

function waLinkForCar(car) {
  const text = encodeURIComponent(
    `Hi Solace Auto Imports, I'm interested in the ${car.year} ${car.make} ${car.model}${
      car.id ? ` (ref ${car.id})` : ''
    }.`,
  )
  return `https://wa.me/18764566976?text=${text}`
}

function statusBadgeClass(status) {
  if (status === 'Sold') return 'bg-red-100 text-red-700'
  if (status === 'Reserved') return 'bg-yellow-100 text-yellow-800'
  if (status === 'Hidden') return 'bg-solace-navy/15 text-solace-navy'
  return 'bg-green-100 text-green-700'
}

async function loadVehicle(id) {
  try {
    const res = await fetch(`/api/vehicles?id=${encodeURIComponent(id)}`)
    if (res.ok) {
      const data = await res.json()
      const car = Array.isArray(data?.cars) ? data.cars[0] : data?.car
      if (car) return car
    }
  } catch {}

  try {
    const res = await fetch('data/cars.json', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.cars || []
      return list.find((c) => c.id === id) || null
    }
  } catch {}

  return null
}

const isVideoUrl = (u) => /\.(mp4|mov|webm|m4v|mpeg|mpg)(\?|$)/i.test(u || '')

function render(car) {
  document.getElementById('vehicle-loading').classList.add('hidden')
  if (!car) {
    document.getElementById('vehicle-not-found').classList.remove('hidden')
    return
  }
  document.getElementById('vehicle-content').classList.remove('hidden')

  const title = `${car.year || ''} ${car.make || ''} ${car.model || ''}`.trim()
  document.getElementById('page-title').textContent = `${title} — Solace Auto Imports Limited`
  document.getElementById('v-title').textContent = title || 'Vehicle'
  document.getElementById('v-price').textContent = moneyDisplay(car)
  document.getElementById('v-type-line').textContent = car.type ? car.type : 'Available now'

  const status = car.status || 'Available'
  const statusEl = document.getElementById('v-status-badge')
  statusEl.textContent = status
  statusEl.className = `absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${statusBadgeClass(status)}`

  const images = (car.images || []).filter(Boolean)
  const slides = images.length ? images : [PLACEHOLDER]
  let index = 0
  const mainFrame = document.getElementById('v-main-frame')
  const counter = document.getElementById('v-counter')
  const prev = document.getElementById('v-prev')
  const next = document.getElementById('v-next')
  const thumbs = document.getElementById('v-thumbs')

  function paint() {
    const url = slides[index]
    const video = isVideoUrl(url)
    const current = document.getElementById('v-main-image')
    if (video && current.tagName !== 'VIDEO') {
      const v = document.createElement('video')
      v.id = 'v-main-image'
      v.controls = true
      v.playsInline = true
      v.className = 'w-full h-full object-contain bg-black select-none'
      current.replaceWith(v)
    } else if (!video && current.tagName !== 'IMG') {
      const im = document.createElement('img')
      im.id = 'v-main-image'
      im.className = 'w-full h-full object-cover select-none'
      im.draggable = false
      current.replaceWith(im)
    }
    const node = document.getElementById('v-main-image')
    node.src = url
    if (node.tagName === 'IMG') node.alt = `${title} — photo ${index + 1} of ${slides.length}`
    counter.textContent = `${index + 1} / ${slides.length}`
    thumbs.querySelectorAll('button').forEach((btn, i) => {
      btn.classList.toggle('ring-2', i === index)
      btn.classList.toggle('ring-solace-orange', i === index)
    })
  }

  if (slides.length > 1) {
    counter.classList.remove('hidden')
    prev.classList.remove('hidden')
    next.classList.remove('hidden')
    thumbs.innerHTML = slides
      .map((url, i) => {
        const video = isVideoUrl(url)
        const inner = video
          ? `<video src="${url}" muted playsinline preload="metadata" class="w-full h-full object-cover"></video>
             <span class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/65 text-white rounded-full px-2 py-0.5 text-[10px] font-bold pointer-events-none">▶</span>`
          : `<img src="${url}" alt="" class="w-full h-full object-cover" loading="lazy" />`
        return `
          <button type="button" data-thumb="${i}" aria-label="View photo ${i + 1}" class="relative aspect-square rounded-lg overflow-hidden bg-solace-cream ring-offset-2 active:scale-95 transition-transform">
            ${inner}
          </button>`
      })
      .join('')
    thumbs.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-thumb]')
      if (!btn) return
      index = Number(btn.dataset.thumb)
      paint()
      mainFrame.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    prev.addEventListener('click', (e) => {
      e.stopPropagation()
      index = (index - 1 + slides.length) % slides.length
      paint()
    })
    next.addEventListener('click', (e) => {
      e.stopPropagation()
      index = (index + 1) % slides.length
      paint()
    })
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        index = (index - 1 + slides.length) % slides.length
        paint()
      }
      if (e.key === 'ArrowRight') {
        index = (index + 1) % slides.length
        paint()
      }
    })

    attachSwipe(mainFrame, (dir) => {
      index = (index + (dir === 'left' ? 1 : -1) + slides.length) % slides.length
      paint()
    })
  } else {
    thumbs.innerHTML = ''
  }
  paint()

  // ─── Specs grid ──────────────────────────────────────────────────────────
  const mileage = car.mileageKm
    ? `${car.mileageKm.toLocaleString()} km`
    : car.mileage && car.mileage !== '—'
      ? car.mileage
      : null
  const specs = [
    ['Year', car.year],
    ['Make', car.make],
    ['Model', car.model],
    ['Type', car.type],
    ['Transmission', car.transmission],
    ['Fuel', car.fuel],
    ['Color', car.color],
    ['Mileage', mileage],
    ['Condition', car.condition],
    ['Location', car.location],
    ['Reference', car.id],
  ].filter(([, v]) => v != null && v !== '')

  document.getElementById('v-specs').innerHTML = specs
    .map(
      ([label, value]) => `
        <div>
          <dt class="text-xs uppercase tracking-wider font-semibold text-solace-navy/55">${label}</dt>
          <dd class="mt-0.5 font-medium">${value}</dd>
        </div>`,
    )
    .join('')

  if (car.description) {
    document.getElementById('v-description-wrap').classList.remove('hidden')
    document.getElementById('v-description').textContent = car.description
  }

  const waHref = waLinkForCar(car)
  document.getElementById('v-wa').href = waHref

  const mobileCta = document.getElementById('v-mobile-cta')
  if (mobileCta) {
    mobileCta.classList.remove('hidden')
    const waMobile = document.getElementById('v-wa-mobile')
    if (waMobile) waMobile.href = waHref
  }
}

function attachSwipe(el, cb) {
  let x = null
  let y = null
  el.addEventListener(
    'touchstart',
    (e) => {
      x = e.changedTouches[0].clientX
      y = e.changedTouches[0].clientY
    },
    { passive: true },
  )
  el.addEventListener(
    'touchend',
    (e) => {
      if (x == null) return
      const dx = e.changedTouches[0].clientX - x
      const dy = e.changedTouches[0].clientY - y
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        cb(dx < 0 ? 'left' : 'right')
      }
      x = null
      y = null
    },
    { passive: true },
  )
}

// ─── More vehicles (cross-sell) ─────────────────────────────────────────────
// Replaces the old "All photos" stack. Pulls the whole inventory, then surfaces
// the dealer's most popular (featured) cars and newest arrivals below the
// listing so a buyer keeps browsing the lot instead of dead-ending here.

const NEW_DAYS = 14

function isNew(dateAdded) {
  if (!dateAdded) return false
  const d = new Date(dateAdded)
  if (isNaN(d)) return false
  return (Date.now() - d.getTime()) / 86400000 < NEW_DAYS
}

function carCard(car) {
  const media = car.images || []
  const firstImage = media.find((u) => !isVideoUrl(u))
  const hasVideo = media.some(isVideoUrl)
  const img = firstImage || PLACEHOLDER
  const statusColor =
    car.status === 'Sold'
      ? 'bg-red-100 text-red-700'
      : car.status === 'Reserved'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-700'
  const price = car.priceDisplay || car.price || 'Contact for price'
  const mileage = car.mileageKm ? `${car.mileageKm.toLocaleString()} km` : null

  return `
    <article class="car-card group relative bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer" data-car-id="${car.id}" tabindex="0" role="button" aria-label="View ${car.year} ${car.make} ${car.model}">
      <div class="relative overflow-hidden">
        <img class="car-card-img group-hover:scale-105 transition-transform duration-500" src="${img}" alt="${car.year} ${car.make} ${car.model}" loading="lazy" />
        ${hasVideo ? '<span class="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded inline-flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Video</span>' : ''}
        <span class="absolute top-3 left-3 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${statusColor}">${car.status || 'Available'}</span>
        <div class="absolute top-3 right-3 flex gap-2">
          ${isNew(car.dateAdded) ? '<span class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-solace-blue text-white">New</span>' : ''}
          ${car.featured ? '<span class="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-solace-orange text-white">Featured</span>' : ''}
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
    </article>`
}

async function loadAllCars() {
  try {
    const res = await fetch('/api/vehicles', { cache: 'no-cache' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data?.cars)) return data.cars
    }
  } catch {}
  try {
    const res = await fetch('data/cars.json', { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return Array.isArray(data) ? data : data.cars || []
    }
  } catch {}
  return []
}

async function renderMoreVehicles(currentCar) {
  const section = document.getElementById('more-vehicles')
  if (!section) return
  const popularBlock = document.getElementById('v-popular-block')
  const newBlock = document.getElementById('v-new-block')
  const popularGrid = document.getElementById('v-popular')
  const newGrid = document.getElementById('v-new')
  const viewAll = document.getElementById('v-view-all')

  const all = await loadAllCars()
  // Don't cross-sell the car already on screen, or sold/hidden stock.
  const sellable = all.filter(
    (c) => c && c.id !== currentCar.id && c.status !== 'Sold' && c.status !== 'Hidden',
  )

  // Most popular = the dealer's hand-picked featured cars.
  const popular = sellable.filter((c) => c.featured).slice(0, 6)
  const popularIds = new Set(popular.map((c) => c.id))
  // New vehicles = most recently added, minus anything already shown above.
  const fresh = sellable
    .slice()
    .sort((a, b) => (b.dateAdded || '').localeCompare(a.dateAdded || ''))
    .filter((c) => !popularIds.has(c.id))
    .slice(0, 6)

  let shown = false
  if (popular.length) {
    popularGrid.innerHTML = popular.map(carCard).join('')
    popularBlock.classList.remove('hidden')
    shown = true
  }
  if (fresh.length) {
    newGrid.innerHTML = fresh.map(carCard).join('')
    newBlock.classList.remove('hidden')
    shown = true
  }
  if (!shown) return

  section.classList.remove('hidden')
  if (viewAll) viewAll.classList.remove('hidden')

  // Whole card opens that vehicle; the inline WhatsApp/Call CTAs opt out.
  const open = (id) => {
    window.location.href = `vehicle.html?id=${encodeURIComponent(id)}`
  }
  section.addEventListener('click', (e) => {
    const card = e.target.closest('[data-car-id]')
    if (!card || e.target.closest('[data-wa]') || e.target.closest('a[href]')) return
    open(card.dataset.carId)
  })
  section.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    const card = e.target.closest('[data-car-id]')
    if (!card) return
    e.preventDefault()
    open(card.dataset.carId)
  })
}

async function init() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  if (!id) {
    render(null)
    return
  }
  const car = await loadVehicle(id)
  render(car)
  if (car) renderMoreVehicles(car)
}

init()
