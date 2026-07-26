import {
  api,
  escapeHtml,
  formatStatus,
  getSession,
  initSupabase,
  setSession,
  setSessionHandlers,
  signIn,
  signOut,
  resetPassword,
  statusBadgeClass,
} from './api.js?v=mqbi8stn';
import { toast } from './toast.js?v=mqbi8stn';

const app = document.getElementById('app');
const routeBase = location.pathname.startsWith('/backoffice') ? '/backoffice' : '/admin';
const loginPath = `${routeBase}/login`;
const dashboardPath = `${routeBase}/dashboard`;
const PUBLIC_ROUTES = [`${routeBase}/login`, routeBase];
const NAV = [
  { path: `${routeBase}/dashboard`, label: 'Dashboard', icon: '[ ]' },
  { path: `${routeBase}/vehicles`, label: 'Vehicles', icon: 'CAR' },
  { path: `${routeBase}/leads`, label: 'Leads', icon: 'MSG' },
  { path: `${routeBase}/users`, label: 'Users', icon: 'USR', adminOnly: true },
  { path: `${routeBase}/settings`, label: 'Settings', icon: 'SET' },
];

let vehiclesCache = [];
let leadsCache = [];
let currentUser = null; // { id, email, role, displayName } — populated after sign-in

boot();

async function boot() {
  try {
    setSessionHandlers({
      onSessionLost: () => {
        currentUser = null;
        navigate(loginPath, true);
      },
    });
    await initSupabase();
    if (getSession()) await refreshCurrentUser();
    window.addEventListener('popstate', () => renderRoute(location.pathname, false));
    renderRoute(location.pathname || '/admin/login', true);
  } catch (error) {
    app.innerHTML = `<div class="login-wrap"><div class="login-card"><p>${escapeHtml(error.message)}</p></div></div>`;
  }
}

function navigate(path, replace = false) {
  if (replace) history.replaceState({}, '', path);
  else history.pushState({}, '', path);
  renderRoute(path, false);
}

async function renderRoute(path, initial) {
  const session = getSession();
  const isPublic = PUBLIC_ROUTES.includes(path);

  if (!session && !isPublic) {
    if (!initial) toast('Session expired. Sign in again.', 'error');
    path = loginPath;
    history.replaceState({}, '', path);
  }

  if (session && (path === loginPath || path === routeBase)) {
    navigate(dashboardPath, true);
    return;
  }

  if (path === loginPath || path === routeBase) return renderLogin();
  if (path === dashboardPath) return renderDashboard();
  if (path === `${routeBase}/vehicles`) return renderVehiclesList();
  if (path === `${routeBase}/vehicles/new`) return renderVehicleForm(null);
  if (path.startsWith(`${routeBase}/vehicles/`) && path.endsWith('/edit')) {
    const id = decodeURIComponent(path.split('/')[3] || '');
    return renderVehicleForm(id);
  }
  if (path === `${routeBase}/leads`) return renderLeads();
  if (path === `${routeBase}/users`) return renderUsers();
  if (path === `${routeBase}/settings`) return renderSettings();

  navigate(session ? dashboardPath : loginPath, true);
}

/** Fetches /api/admin/me and caches role globally. Safe to call repeatedly. */
async function refreshCurrentUser() {
  try {
    const data = await api.me();
    currentUser = data.user;
    return currentUser;
  } catch {
    currentUser = null;
    return null;
  }
}

function isAdmin() {
  return currentUser?.role === 'admin';
}

function shell(title, content) {
  app.innerHTML = `
    <div class="sidebar-overlay hidden" id="sidebar-overlay"></div>
    <div class="shell">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand">
          <img src="/images/logo.png?v=mqbi8stn" alt="Solace Auto Imports" width="48" height="48" style="border-radius:50%;margin-bottom:0.5rem" onerror="this.src='/images/logo.png?v=mqbi8stn'" />
          <small>Solace Backoffice</small>
          <strong>Admin Dashboard</strong>
        </div>
        ${NAV.filter((item) => !item.adminOnly || isAdmin())
          .map((item) => `<a href="${item.path}" class="nav-link" data-nav="${item.path}">${item.icon} ${item.label}</a>`)
          .join('')}
        <div class="sidebar-footer">
          <a href="/" class="nav-link" target="_blank" rel="noopener">View website</a>
          <button type="button" class="nav-link" id="logout-btn" style="width:100%;border:none;background:none;cursor:pointer;text-align:left">Logout</button>
        </div>
      </aside>
      <div class="main">
        <header class="topbar">
          <div style="display:flex;align-items:center;gap:0.75rem">
            <button type="button" class="menu-btn" id="menu-btn" aria-label="Menu">Menu</button>
            <h1>${escapeHtml(title)}</h1>
          </div>
        </header>
        <div class="content">${content}</div>
      </div>
    </div>`;

  document.querySelector(`[data-nav="${location.pathname}"]`)?.classList.add('active');
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await signOut();
    navigate(loginPath);
  });
  document.getElementById('menu-btn')?.addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
  app.querySelectorAll(`.nav-link[href^="${routeBase}"]`).forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      closeSidebar();
      navigate(link.getAttribute('href'));
    });
  });
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebar-overlay')?.classList.toggle('hidden');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.add('hidden');
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-wrap">
      <form class="login-card" id="login-form">
        <img src="/images/logo.png?v=mqbi8stn" alt="Solace Auto Imports" width="80" height="80" style="display:block;margin:0 auto 1rem;border-radius:50%" onerror="this.src='/images/logo.png?v=mqbi8stn'" />
        <h1>Backoffice Login</h1>
        <p>Sign in with your approved architect or business admin email.</p>
        <div class="field"><label>Email</label><input type="email" name="email" required autocomplete="email" /></div>
        <div class="field"><label>Password</label><input type="password" name="password" required autocomplete="current-password" /></div>
        <button type="submit" class="btn btn-primary" style="width:100%">Log in</button>
        <button type="button" class="btn btn-outline" style="width:100%;margin-top:0.5rem" id="reset-btn">Send password reset</button>
        <p class="status-msg" id="login-status"></p>
      </form>
    </div>`;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const status = document.getElementById('login-status');
    status.textContent = 'Signing in...';
    try {
      await signIn(fd.get('email'), fd.get('password'));
      await refreshCurrentUser();
      toast('Welcome back!', 'success');
      navigate(dashboardPath);
    } catch (err) {
      status.textContent = err.message;
    }
  });

  document.getElementById('reset-btn').addEventListener('click', async () => {
    const email = new FormData(document.getElementById('login-form')).get('email');
    if (!email) { toast('Enter your email first.', 'error'); return; }
    try {
      await resetPassword(email);
      toast('Password reset email sent.', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  });
}

async function renderDashboard() {
  shell('Dashboard', '<p class="status-msg"><span class="loading"></span> Loading...</p>');
  try {
    const { stats } = await api.dashboard();
    shell('Dashboard', `
      <div class="grid-metrics">
        ${metric('Total vehicles', stats.totalVehicles)}
        ${metric('Available', stats.availableVehicles)}
        ${metric('Sold', stats.soldVehicles)}
        ${metric('Featured', stats.featuredVehicles)}
        ${metric('New inquiries', stats.newInquiries)}
        ${metric('Sourcing requests', stats.sourcingRequests)}
      </div>
      <div class="panel">
        <div class="panel-head"><h2>Quick actions</h2></div>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
          <a href="${routeBase}/vehicles/new" class="btn btn-primary" data-quick="${routeBase}/vehicles/new">+ Add vehicle</a>
          <a href="${routeBase}/leads" class="btn btn-outline" data-quick="${routeBase}/leads">View leads (${stats.openLeads})</a>
          <a href="${routeBase}/vehicles" class="btn btn-outline" data-quick="${routeBase}/vehicles">Manage inventory</a>
        </div>
      </div>`);
    app.querySelectorAll('[data-quick]').forEach((el) => {
      el.addEventListener('click', (e) => { e.preventDefault(); navigate(el.dataset.quick); });
    });
  } catch (err) {
    if (err.status !== 401) toast(err.message, 'error');
  }
}

function metric(label, value) {
  return `<div class="metric"><span>${escapeHtml(label)}</span><strong>${value ?? 0}</strong></div>`;
}

async function renderVehiclesList() {
  shell('Vehicles', '<p class="status-msg"><span class="loading"></span> Loading inventory...</p>');
  try {
    const data = await api.vehicles.list();
    vehiclesCache = data.cars || [];
    const q = '';
    shell('Vehicles', `
      <div class="panel">
        <div class="panel-head">
          <h2>Inventory (${vehiclesCache.length})</h2>
          <a href="${routeBase}/vehicles/new" class="btn btn-primary" id="add-vehicle">+ New vehicle</a>
        </div>
        <div class="toolbar">
          <input type="search" id="veh-search" placeholder="Search make, model, ID..." />
          <select id="veh-status"><option value="">All statuses</option><option>Available</option><option>Reserved</option><option>Sold</option><option>Hidden</option></select>
          <select id="veh-sort"><option value="newest">Newest first</option><option value="year">Year</option><option value="price">Price JMD</option></select>
        </div>
        <div class="table-wrap"><table><thead><tr><th>Vehicle</th><th>Status</th><th>Price</th><th></th></tr></thead><tbody id="veh-tbody"></tbody></table></div>
        <div id="veh-empty" class="empty hidden"><strong>No vehicles yet</strong>Add your first listing to appear on the public site.</div>
      </div>`);

    document.getElementById('add-vehicle').addEventListener('click', (e) => { e.preventDefault(); navigate(`${routeBase}/vehicles/new`); });

    const render = () => {
      const search = document.getElementById('veh-search').value.toLowerCase();
      const status = document.getElementById('veh-status').value;
      const sort = document.getElementById('veh-sort').value;
      let rows = vehiclesCache.filter((c) => {
        if (status && c.status !== status) return false;
        const hay = `${c.id} ${c.make} ${c.model} ${c.year}`.toLowerCase();
        return !search || hay.includes(search);
      });
      if (sort === 'year') rows.sort((a, b) => (b.year || 0) - (a.year || 0));
      else if (sort === 'price') rows.sort((a, b) => (b.priceJMD || 0) - (a.priceJMD || 0));
      else rows.sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)));

      const tbody = document.getElementById('veh-tbody');
      const empty = document.getElementById('veh-empty');
      if (!rows.length) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
      tbody.innerHTML = rows.map((c) => `
        <tr>
          <td><strong>${escapeHtml(c.year)} ${escapeHtml(c.make)} ${escapeHtml(c.model)}</strong><br><small>${escapeHtml(c.id)} ${c.featured ? ' - Featured' : ''}</small></td>
          <td><span class="${statusBadgeClass(c.status)}">${escapeHtml(c.status)}</span></td>
          <td>${escapeHtml(c.priceDisplay || '-')}</td>
          <td class="row-actions">
            <a href="${routeBase}/vehicles/${encodeURIComponent(c.id)}/edit" class="btn btn-outline btn-sm" data-edit="${escapeHtml(c.id)}">Edit</a>
            <button type="button" class="btn btn-danger btn-sm" data-del="${escapeHtml(c.id)}">Delete</button>
          </td>
        </tr>`).join('');

      tbody.querySelectorAll('[data-edit]').forEach((btn) => {
        btn.addEventListener('click', (e) => { e.preventDefault(); navigate(`${routeBase}/vehicles/${encodeURIComponent(btn.dataset.edit)}/edit`); });
      });
      tbody.querySelectorAll('[data-del]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm(`Delete ${btn.dataset.del}?`)) return;
          try {
            await api.vehicles.remove(btn.dataset.del);
            toast('Vehicle deleted.', 'success');
            renderVehiclesList();
          } catch (err) {
            if (err.status !== 401) toast(err.message, 'error');
          }
        });
      });
    };

    ['veh-search', 'veh-status', 'veh-sort'].forEach((id) => {
      document.getElementById(id).addEventListener('input', render);
      document.getElementById(id).addEventListener('change', render);
    });
    render();
  } catch (err) {
    if (err.status !== 401) toast(err.message, 'error');
  }
}

async function renderVehicleForm(editId) {
  const isEdit = Boolean(editId);
  shell(isEdit ? 'Edit vehicle' : 'New vehicle', '<p class="status-msg"><span class="loading"></span> Loading form...</p>');

  let car = null;
  if (isEdit) {
    if (!vehiclesCache.length) {
      const data = await api.vehicles.list();
      vehiclesCache = data.cars || [];
    }
    car = vehiclesCache.find((c) => c.id === editId);
    if (!car) { toast('Vehicle not found.', 'error'); navigate(`${routeBase}/vehicles`); return; }
  }

  const v = car || {};
  shell(isEdit ? `Edit: ${v.year} ${v.make} ${v.model}` : 'New vehicle', vehicleFormHtml(v, isEdit));
  wireVehicleForm(isEdit);
}

function vehicleFormHtml(v, isEdit) {
  return `
    <form class="panel" id="vehicle-form">
      <div class="field-row">
        <div class="field"><label>Vehicle ID *</label><input name="id" required value="${escapeHtml(v.id || '')}" ${isEdit ? 'readonly' : ''} placeholder="toyota-axio-2018" /></div>
        <div class="field"><label>Date added</label><input type="date" name="dateAdded" value="${escapeHtml(v.dateAdded || new Date().toISOString().slice(0, 10))}" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Make *</label><input name="make" required value="${escapeHtml(v.make || '')}" /></div>
        <div class="field"><label>Model *</label><input name="model" required value="${escapeHtml(v.model || '')}" /></div>
        <div class="field"><label>Year *</label><input type="number" name="year" required value="${escapeHtml(v.year || '')}" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Body type</label><input name="type" value="${escapeHtml(v.type || '')}" placeholder="Sedan, SUV..." /></div>
        <div class="field"><label>Status</label><select name="status">${['Available', 'Reserved', 'Sold', 'Hidden'].map((s) => `<option ${v.status === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
        <div class="field field-check" style="align-self:end"><label><input type="checkbox" name="featured" ${v.featured ? 'checked' : ''} /> Featured on homepage</label></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Transmission</label><input name="transmission" value="${escapeHtml(v.transmission || '')}" /></div>
        <div class="field"><label>Fuel</label><input name="fuel" value="${escapeHtml(v.fuel || '')}" /></div>
        <div class="field"><label>Color</label><input name="color" value="${escapeHtml(v.color || '')}" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Mileage (km)</label><input type="number" name="mileageKm" value="${escapeHtml(v.mileageKm ?? '')}" /></div>
        <div class="field"><label>Price display</label><input name="priceDisplay" value="${escapeHtml(v.priceDisplay || '')}" placeholder="Contact for price" /></div>
        <div class="field"><label>Price JMD</label><input type="number" name="priceJMD" value="${escapeHtml(v.priceJMD ?? '')}" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Condition</label><input name="condition" value="${escapeHtml(v.condition || '')}" /></div>
        <div class="field"><label>Location</label><input name="location" value="${escapeHtml(v.location || '')}" /></div>
      </div>
      <div class="field"><label>Description</label><textarea name="description">${escapeHtml(v.description || '')}</textarea></div>
      <div class="field">
        <label>Photos &amp; videos <small style="color:var(--muted);font-weight:500">(tap a thumbnail's ✕ to remove it · drag-reorder coming soon)</small></label>
        <textarea name="images" id="images-text" rows="3" style="font-family:ui-monospace,monospace;font-size:0.78rem">${escapeHtml((v.images || []).join('\n'))}</textarea>
        <input type="file" id="image-upload" accept="image/*,video/*,.heic,.heif" multiple style="margin-top:0.5rem" />
        <p style="margin:0.4rem 0 0;font-size:0.75rem;color:var(--muted)">
          On phone, tap the file input → choose <strong>Photo Library</strong> to pick existing media, or <strong>Take Photo / Video</strong> to shoot new. Accepts JPG / PNG / WebP / HEIC / AVIF / SVG · MP4 / MOV / WebM. Up to 50 MB each. Big photos auto-compress.
          <br /><strong>Not supported:</strong> .AI, .PSD — export to JPG / PNG / SVG first (browsers can't render Illustrator/Photoshop files).
        </p>
        <div class="image-previews" id="image-previews"></div>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        <button type="submit" class="btn btn-primary">Save vehicle</button>
        <a href="${routeBase}/vehicles" class="btn btn-outline" id="cancel-veh">Cancel</a>
      </div>
      <p class="status-msg" id="veh-status"></p>
    </form>`;
}

function wireVehicleForm(isEdit) {
  document.getElementById('cancel-veh')?.addEventListener('click', (e) => { e.preventDefault(); navigate(`${routeBase}/vehicles`); });

  const previews = document.getElementById('image-previews');
  const imagesText = document.getElementById('images-text');

  const getUrls = () => imagesText.value.split('\n').map((l) => l.trim()).filter(Boolean);
  const setUrls = (urls) => { imagesText.value = urls.join('\n'); };

  const refreshPreviews = () => {
    const urls = getUrls();
    previews.innerHTML = urls
      .map((url, i) => {
        const isVideo = /\.(mp4|mov|webm|m4v|mpeg|mpg)(\?|$)/i.test(url);
        const inner = isVideo
          ? `<video src="${escapeHtml(url)}" muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover"></video>
             <span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(15,27,44,0.65);color:#fff;border-radius:999px;padding:4px 8px;font-size:0.65rem;font-weight:700;pointer-events:none">▶ VIDEO</span>`
          : `<img src="${escapeHtml(url)}" alt="Photo ${i + 1}" loading="lazy" />`;
        return `
          <div class="image-thumb">
            ${inner}
            <span class="image-thumb-index">${i + 1}</span>
            <button type="button" class="image-thumb-delete" data-remove="${i}" aria-label="Remove media ${i + 1}" title="Remove this">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>`;
      })
      .join('');
  };

  previews.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    const idx = Number(btn.dataset.remove);
    const urls = getUrls();
    urls.splice(idx, 1);
    setUrls(urls);
    refreshPreviews();
    toast('Photo removed.', 'success');
  });

  imagesText.addEventListener('input', refreshPreviews);
  refreshPreviews();

  document.getElementById('image-upload')?.addEventListener('change', async (e) => {
    const files = [...e.target.files];
    for (const file of files) {
      try {
        // Reject formats browsers can't render up front so the operator gets
        // a useful error instead of a generic "mime not supported".
        if (/\.(ai|psd|eps|sketch|fig|xcf|tiff?)$/i.test(file.name)) {
          throw new Error(`${file.name.split('.').pop().toUpperCase()} files can't be shown in browsers. Export to JPG, PNG or SVG first.`);
        }

        toast(`Processing ${file.name}…`);
        const isVideo = file.type.startsWith('video/');
        const prepared = isVideo ? file : await prepareImageForUpload(file);
        const mb = (prepared.size / 1048576).toFixed(1);
        toast(`Uploading ${prepared.name} (${mb} MB)…`);

        const { url, mediaType } = await api.upload(prepared);
        const urls = getUrls();
        urls.push(url);
        setUrls(urls);
        refreshPreviews();
        toast(`${mediaType === 'video' ? 'Video' : 'Image'} uploaded.`, 'success');
      } catch (err) {
        // Surface every failure visibly. ApiError carries `.status`; we still
        // toast on 401/403 so the operator sees "you're signed out" / "admin
        // role required" instead of staring at a silent failure.
        const reason = err?.message || 'Upload failed.';
        const tag = err?.status ? ` (HTTP ${err.status})` : '';
        console.error('[media upload]', err);
        toast(`${file.name}: ${reason}${tag}`, 'error');
      }
    }
    e.target.value = '';
  });

  document.getElementById('vehicle-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    payload.featured = e.target.elements.featured.checked;
    payload.images = String(payload.images || '').split('\n').map((l) => l.trim()).filter(Boolean);
    payload.mileageKm = payload.mileageKm === '' ? null : Number(payload.mileageKm);
    payload.priceJMD = payload.priceJMD === '' ? null : Number(payload.priceJMD);
    payload.year = Number(payload.year);

    const statusEl = document.getElementById('veh-status');
    statusEl.textContent = 'Saving...';
    try {
      if (isEdit) await api.vehicles.update(payload);
      else await api.vehicles.create(payload);
      toast('Vehicle saved.', 'success');
      navigate(`${routeBase}/vehicles`);
    } catch (err) {
      statusEl.textContent = err.message;
      if (err.status !== 401) toast(err.message, 'error');
    }
  });
}

async function renderLeads() {
  shell('Leads', '<p class="status-msg"><span class="loading"></span> Loading leads...</p>');
  try {
    const data = await api.leads.list();
    leadsCache = data.leads || [];
    shell('Leads', `
      <div class="panel">
        <div class="panel-head"><h2>Inquiries (${leadsCache.length})</h2></div>
        <div class="toolbar">
          <input type="search" id="lead-search" placeholder="Search name, phone, email, message..." />
          <select id="lead-status-filter"><option value="">All statuses</option><option>new</option><option>contacted</option><option>in_progress</option><option>closed</option></select>
          <select id="lead-source-filter"><option value="">All sources</option><option>contact_form</option><option>source-vehicle</option><option>vehicle-detail</option><option>website</option></select>
        </div>
        <div id="leads-list"></div>
        <div id="leads-empty" class="empty hidden"><strong>No inquiries yet</strong>Contact and source forms will appear here.</div>
      </div>`);

    const render = () => {
      const sf = document.getElementById('lead-status-filter').value;
      const src = document.getElementById('lead-source-filter').value;
      const search = document.getElementById('lead-search').value.toLowerCase();
      const rows = leadsCache.filter((l) => {
        if (sf && l.status !== sf) return false;
        if (src && l.source !== src) return false;
        const hay = `${l.name || ''} ${l.phone || ''} ${l.email || ''} ${l.interest || ''} ${l.message || ''}`.toLowerCase();
        if (search && !hay.includes(search)) return false;
        return true;
      });
      const wrap = document.getElementById('leads-list');
      const empty = document.getElementById('leads-empty');
      if (!rows.length) { wrap.innerHTML = ''; empty.classList.remove('hidden'); return; }
      empty.classList.add('hidden');
      wrap.innerHTML = rows.map((l) => `
        <article class="panel" style="margin-bottom:0.75rem" data-lead="${escapeHtml(l.id)}">
          <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap">
            <div>
              <strong>${escapeHtml(l.name)}</strong>
              <span class="${statusBadgeClass(l.status)}">${formatStatus(l.status)}</span>
              <p style="margin:0.35rem 0;font-size:0.875rem;color:var(--muted)">
                <a href="tel:${escapeHtml(l.phone)}">${escapeHtml(l.phone)}</a>
                ${l.email ? ` - <a href="mailto:${escapeHtml(l.email)}">${escapeHtml(l.email)}</a>` : ''}
                - ${escapeHtml(l.source)}
              </p>
              <p style="margin:0;font-size:0.875rem">${escapeHtml(l.message)}</p>
            </div>
            <select class="lead-status" data-id="${escapeHtml(l.id)}">
              ${['new', 'contacted', 'in_progress', 'closed'].map((s) => `<option value="${s}" ${l.status === s ? 'selected' : ''}>${formatStatus(s)}</option>`).join('')}
            </select>
          </div>
          <label class="field" style="margin-top:0.75rem;margin-bottom:0"><span>Admin notes</span>
            <textarea class="lead-notes" data-id="${escapeHtml(l.id)}" rows="2">${escapeHtml(l.adminNotes || '')}</textarea>
          </label>
        </article>`).join('');

      wrap.querySelectorAll('.lead-status').forEach((sel) => {
        sel.addEventListener('change', () => saveLead(sel.dataset.id, { status: sel.value }));
      });
      wrap.querySelectorAll('.lead-notes').forEach((ta) => {
        ta.addEventListener('blur', () => saveLead(ta.dataset.id, { adminNotes: ta.value }));
      });
    };

    document.getElementById('lead-search').addEventListener('input', render);
    document.getElementById('lead-status-filter').addEventListener('change', render);
    document.getElementById('lead-source-filter').addEventListener('change', render);
    render();
  } catch (err) {
    if (err.status !== 401) toast(err.message, 'error');
  }
}

async function saveLead(id, patch) {
  try {
    await api.leads.update({ id, ...patch });
    toast('Lead updated.', 'success');
    const idx = leadsCache.findIndex((l) => l.id === id);
    if (idx >= 0) leadsCache[idx] = { ...leadsCache[idx], ...patch };
  } catch (err) {
    if (err.status !== 401) toast(err.message, 'error');
  }
}

async function renderSettings() {
  shell('Settings', '<p class="status-msg"><span class="loading"></span> Loading...</p>');
  try {
    const { settings } = await api.settings.get();
    shell('Settings', `
      <form class="panel" id="settings-form">
        <h2>Business contact (banner info)</h2>
        <div class="field-row">
          <div class="field"><label>Phone</label><input name="phone" value="${escapeHtml(settings.phone || '')}" /></div>
          <div class="field"><label>WhatsApp (digits)</label><input name="whatsapp" value="${escapeHtml(settings.whatsapp || '')}" /></div>
          <div class="field"><label>Email</label><input type="email" name="email" value="${escapeHtml(settings.email || '')}" /></div>
        </div>
        <div class="field"><label>Instagram URL</label><input name="instagram" value="${escapeHtml(settings.instagram || '')}" /></div>
        <div class="field"><label>Address</label><input name="address" value="${escapeHtml(settings.address || '')}" /></div>
        <h2 style="margin-top:1.5rem">Homepage</h2>
        <div class="field"><label>Hero subtitle</label><input name="heroSubtitle" value="${escapeHtml(settings.heroSubtitle || '')}" placeholder="Certified Used Car Dealer" /></div>
        <div class="field"><label>Hero title</label><input name="heroTitle" value="${escapeHtml(settings.heroTitle || '')}" placeholder="We Import | We Sell | We Source" /></div>
        <div class="field"><label>Hero tagline</label><textarea name="heroTagline">${escapeHtml(settings.heroTagline || '')}</textarea></div>
        <div class="field-row">
          <div class="field"><label>Primary CTA</label><input name="ctaPrimary" value="${escapeHtml(settings.ctaPrimary || '')}" /></div>
          <div class="field"><label>Secondary CTA</label><input name="ctaSecondary" value="${escapeHtml(settings.ctaSecondary || '')}" /></div>
        </div>
        <label class="field-check"><input type="checkbox" name="hideSoldOnPublic" ${settings.hideSoldOnPublic ? 'checked' : ''} /> Hide sold vehicles on public inventory (still show Sold badge if unchecked)</label>
        <button type="submit" class="btn btn-primary">Save settings</button>
        <p class="status-msg" id="settings-status"></p>
      </form>`);

    document.getElementById('settings-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const body = Object.fromEntries(fd.entries());
      body.hideSoldOnPublic = e.target.elements.hideSoldOnPublic.checked;
      const st = document.getElementById('settings-status');
      st.textContent = 'Saving...';
      try {
        await api.settings.save(body);
        toast('Settings saved.', 'success');
        st.textContent = 'Saved.';
      } catch (err) {
        st.textContent = err.message;
        if (err.status !== 401) toast(err.message, 'error');
      }
    });
  } catch (err) {
    if (err.status !== 401) toast(err.message, 'error');
  }
}

// ─── Users ──────────────────────────────────────────────────────────────────

async function renderUsers() {
  if (!isAdmin()) {
    shell(
      'Users',
      '<div class="panel"><p>Only admins can manage users. Ask an admin to upgrade your role.</p></div>',
    );
    return;
  }

  shell('Users', '<p class="status-msg"><span class="loading"></span> Loading users...</p>');
  try {
    const { users } = await api.users.list();
    const meId = currentUser?.id;
    shell(
      'Users',
      `
      <div class="panel">
        <div class="panel-head">
          <h2>Back-office users (${users.length})</h2>
          <button type="button" class="btn btn-primary" id="add-user-btn">+ New user</button>
        </div>
        <p class="status-msg" style="margin-top:0">Admins can sign in and manage everything. Basic users get read-only access in future updates.</p>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>User</th><th>Role</th><th>Last sign-in</th><th>Created</th><th></th></tr>
            </thead>
            <tbody id="users-tbody">
              ${users
                .map(
                  (u) => `
                  <tr>
                    <td>
                      <strong>${escapeHtml(u.displayName || u.email)}</strong>
                      <br/><small>${escapeHtml(u.email)}${u.id === meId ? ' &middot; you' : ''}</small>
                    </td>
                    <td><span class="badge badge-${u.role === 'admin' ? 'admin' : 'basic'}">${escapeHtml(u.role)}</span></td>
                    <td>${u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleString() : '—'}</td>
                    <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                    <td class="row-actions">
                      <button type="button" class="btn btn-outline btn-sm" data-edit="${u.id}">Edit</button>
                      ${
                        u.id === meId
                          ? ''
                          : `<button type="button" class="btn btn-danger btn-sm" data-del="${u.id}" data-del-email="${escapeHtml(u.email)}">Delete</button>`
                      }
                    </td>
                  </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </div>
        ${users.length === 0 ? '<div class="empty"><strong>No users yet</strong>Click + New user to create the first one.</div>' : ''}
      </div>`,
    );

    document.getElementById('add-user-btn').addEventListener('click', () => openUserForm(null, users));
    app.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const user = users.find((u) => u.id === btn.dataset.edit);
        if (user) openUserForm(user, users);
      });
    });
    app.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm(`Delete ${btn.dataset.delEmail}? This permanently removes their sign-in.`)) return;
        try {
          await api.users.remove(btn.dataset.del);
          toast('User deleted.', 'success');
          renderUsers();
        } catch (err) {
          if (err.status !== 401) toast(err.message, 'error');
        }
      });
    });
  } catch (err) {
    if (err.status !== 401) toast(err.message, 'error');
  }
}

function openUserForm(user, allUsers) {
  const isEdit = Boolean(user);
  const isSelf = user?.id === currentUser?.id;
  const adminCount = (allUsers || []).filter((u) => u.role === 'admin').length;
  const lastAdmin = isEdit && user.role === 'admin' && adminCount <= 1;

  const wrap = document.createElement('div');
  wrap.className = 'modal-wrap';
  wrap.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
      <div class="modal-head">
        <h2 id="user-modal-title">${isEdit ? 'Edit user' : 'Create user'}</h2>
        <button type="button" class="modal-close" aria-label="Close">&times;</button>
      </div>
      <form id="user-form" class="modal-body">
        <div class="field">
          <label>Email</label>
          <input name="email" type="email" required autocomplete="email"
            value="${escapeHtml(user?.email || '')}" ${isEdit ? 'disabled' : ''} />
          ${isEdit ? '<small>Email is read-only after creation.</small>' : ''}
        </div>
        <div class="field">
          <label>Display name <small>(optional)</small></label>
          <input name="displayName" value="${escapeHtml(user?.displayName || '')}" autocomplete="name" />
        </div>
        <div class="field">
          <label>${isEdit ? 'New password' : 'Password'}</label>
          <input name="password" type="password" minlength="8"
            ${isEdit ? 'placeholder="Leave blank to keep current password"' : 'required placeholder="Minimum 8 characters"'}
            autocomplete="new-password" />
          <small>Minimum 8 characters.</small>
        </div>
        <div class="field">
          <label>Role</label>
          <select name="role" ${isSelf || lastAdmin ? 'disabled' : ''}>
            <option value="basic" ${user?.role === 'basic' ? 'selected' : ''}>Basic — read-only (future)</option>
            <option value="admin" ${user?.role === 'admin' || !isEdit ? 'selected' : ''}>Admin — full back-office</option>
          </select>
          ${isSelf ? '<small>You cannot change your own role.</small>' : ''}
          ${lastAdmin && !isSelf ? '<small>This is the only admin — promote another user before demoting.</small>' : ''}
        </div>
        <p class="status-msg" id="user-form-status"></p>
        <div class="modal-actions">
          <button type="button" class="btn btn-outline" id="user-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save changes' : 'Create user'}</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(wrap);

  const close = () => wrap.remove();
  wrap.addEventListener('click', (e) => {
    if (e.target === wrap) close();
  });
  wrap.querySelector('.modal-close').addEventListener('click', close);
  wrap.querySelector('#user-cancel').addEventListener('click', close);

  wrap.querySelector('#user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const status = wrap.querySelector('#user-form-status');
    status.textContent = isEdit ? 'Saving…' : 'Creating…';

    const payload = {
      email: String(fd.get('email') || '').trim(),
      displayName: String(fd.get('displayName') || '').trim(),
      role: String(fd.get('role') || 'basic'),
      password: String(fd.get('password') || ''),
    };

    try {
      if (isEdit) {
        const patch = { role: payload.role, displayName: payload.displayName };
        if (payload.password) patch.password = payload.password;
        await api.users.update(user.id, patch);
        toast('User updated.', 'success');
      } else {
        if (!payload.password || payload.password.length < 8) {
          status.textContent = 'Password must be at least 8 characters.';
          return;
        }
        await api.users.create(payload);
        toast('User created.', 'success');
      }
      close();
      renderUsers();
    } catch (err) {
      status.textContent = err.message;
      if (err.status !== 401) toast(err.message, 'error');
    }
  });
}

// ─── Image helpers ──────────────────────────────────────────────────────────

const UPLOAD_MAX_BYTES = 8 * 1024 * 1024; // matches server cap in api/admin/upload.js
const COMPRESS_MAX_EDGE = 2400; // px — long edge after resize
const COMPRESS_QUALITY = 0.82;

/**
 * Auto-resize / re-encode big phone photos before upload so they fit the
 * 8 MB server cap. Tries OffscreenCanvas first (fast, off-thread), falls
 * back to a regular <canvas> for older mobile browsers / in-app webviews
 * that lack OffscreenCanvas (Instagram / Facebook / WhatsApp browsers).
 *
 * Returns a File ready for the existing `api.upload(file)` helper. If the
 * input is already small enough, returns it unchanged.
 */
async function prepareImageForUpload(file) {
  if (!(file instanceof File) || !file.type.startsWith('image/')) return file;

  // Always re-encode HEIC / HEIF (iPhone default) → JPEG since Supabase
  // Storage rejects those mime types. Only skip the encode path for
  // already-tiny supported formats (JPG/PNG/WebP/GIF) under the size cap.
  const isHeic = /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
  if (!isHeic && file.size <= UPLOAD_MAX_BYTES) return file;

  const compressed = await compressViaOffscreen(file).catch(() => null);
  if (compressed) return compressed;

  return compressViaCanvas(file).catch((err) => {
    // Last resort — let the upload attempt the original; server cap will
    // reject it with a clear message instead of a silent failure.
    console.warn('[image compress] both paths failed, sending original', err);
    return file;
  });
}

async function compressViaOffscreen(file) {
  if (typeof createImageBitmap !== 'function' || typeof OffscreenCanvas === 'undefined') {
    throw new Error('OffscreenCanvas unavailable');
  }
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const longEdge = Math.max(width, height);
  const scale = longEdge > COMPRESS_MAX_EDGE ? COMPRESS_MAX_EDGE / longEdge : 1;
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const canvas = new OffscreenCanvas(w, h);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: COMPRESS_QUALITY });
  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
}

function compressViaCanvas(file) {
  // Regular <canvas> path — slower but works in every modern mobile browser.
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const longEdge = Math.max(img.naturalWidth, img.naturalHeight);
      const scale = longEdge > COMPRESS_MAX_EDGE ? COMPRESS_MAX_EDGE / longEdge : 1;
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas could not produce a blob'));
          const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
          resolve(new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() }));
        },
        'image/jpeg',
        COMPRESS_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode this image — try JPG or PNG.'));
    };
    img.src = url;
  });
}
