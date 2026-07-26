import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

let supabase;
let session;
let vehicles = [];
let leads = [];

const loginSection = document.querySelector('#admin-login');
const appSection = document.querySelector('#admin-app');
const loginForm = document.querySelector('#admin-login form');
const loginStatus = document.querySelector('#login-status');
const vehicleForm = document.querySelector('#vehicle-form');
const vehicleStatus = document.querySelector('#vehicle-status');

init();

async function init() {
  try {
    const config = await fetchJson('/api/config');
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      loginStatus.textContent = 'Supabase is not configured for this project yet.';
      return;
    }

    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    const current = await supabase.auth.getSession();
    session = current.data.session;

    wireEvents();
    if (session) await showApp();
  } catch (error) {
    loginStatus.textContent = error.message;
  }
}

function wireEvents() {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginStatus.textContent = 'Signing in...';
    const form = new FormData(loginForm);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.get('email'),
      password: form.get('password'),
    });
    if (error) {
      loginStatus.textContent = error.message;
      return;
    }
    session = data.session;
    loginStatus.textContent = '';
    await showApp();
  });

  document.querySelector('#reset-password').addEventListener('click', async () => {
    const email = new FormData(loginForm).get('email');
    if (!email) {
      loginStatus.textContent = 'Enter your email first.';
      return;
    }
    const redirectTo =
      window.location.hostname === 'localhost'
        ? 'https://solace-auto-imports.vercel.app/admin'
        : `${window.location.origin}/admin`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    loginStatus.textContent = error ? error.message : 'Password reset email sent.';
  });

  document.querySelector('#logout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    session = null;
    appSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  });

  document.querySelector('#new-vehicle').addEventListener('click', () => resetVehicleForm());
  document.querySelector('#delete-vehicle').addEventListener('click', deleteSelectedVehicle);
  vehicleForm.addEventListener('submit', saveVehicle);
}

async function showApp() {
  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  await refreshDashboard();
}

async function refreshDashboard() {
  const [vehicleData, leadData] = await Promise.all([
    adminFetch('/api/admin/vehicles'),
    adminFetch('/api/admin/leads'),
  ]);
  vehicles = vehicleData.cars || [];
  leads = leadData.leads || [];
  renderVehicles();
  renderLeads();
  renderMetrics();
}

function renderMetrics() {
  document.querySelector('#metric-vehicles').textContent = vehicles.length;
  document.querySelector('#metric-featured').textContent = vehicles.filter((car) => car.featured).length;
  document.querySelector('#metric-leads').textContent = leads.filter((lead) => lead.status !== 'closed').length;
}

function renderVehicles() {
  const wrap = document.querySelector('#admin-vehicles');
  if (!vehicles.length) {
    wrap.innerHTML = '<p class="text-sm text-solace-navy/60">No vehicles found.</p>';
    return;
  }
  wrap.innerHTML = vehicles.map((car) => `
    <article class="admin-list-row" data-id="${escapeHtml(car.id)}">
      <div>
        <h3>${escapeHtml(car.year)} ${escapeHtml(car.make)} ${escapeHtml(car.model)}</h3>
        <p>${escapeHtml(car.status || 'Available')} · ${car.featured ? 'Featured' : 'Standard'} · ${escapeHtml(car.priceDisplay || 'Contact for price')}</p>
      </div>
      <button type="button" class="btn-outline px-3 py-2 rounded-lg text-sm font-semibold">Edit</button>
    </article>
  `).join('');

  wrap.querySelectorAll('[data-id]').forEach((row) => {
    row.addEventListener('click', () => loadVehicleIntoForm(row.dataset.id));
  });
}

function renderLeads() {
  const wrap = document.querySelector('#admin-leads');
  if (!leads.length) {
    wrap.innerHTML = '<p class="text-sm text-solace-navy/60">No inquiries found.</p>';
    return;
  }
  wrap.innerHTML = leads.map((lead) => `
    <article class="admin-lead-row">
      <div>
        <h3>${escapeHtml(lead.name)} <span>${escapeHtml(lead.status)}</span></h3>
        <p>${escapeHtml(lead.phone)} ${lead.email ? `· ${escapeHtml(lead.email)}` : ''}</p>
        <p>${escapeHtml(lead.message)}</p>
      </div>
      <select data-lead-status="${escapeHtml(lead.id)}" class="inv-select">
        ${['new', 'contacted', 'closed'].map((status) => `<option value="${status}" ${lead.status === status ? 'selected' : ''}>${status}</option>`).join('')}
      </select>
    </article>
  `).join('');

  wrap.querySelectorAll('[data-lead-status]').forEach((select) => {
    select.addEventListener('change', async () => {
      await adminFetch('/api/admin/leads', {
        method: 'PUT',
        body: JSON.stringify({ id: select.dataset.leadStatus, status: select.value }),
      });
      await refreshDashboard();
    });
  });
}

function loadVehicleIntoForm(id) {
  const car = vehicles.find((item) => item.id === id);
  if (!car) return;
  resetVehicleForm();
  Object.entries(car).forEach(([key, value]) => {
    const field = vehicleForm.elements[key];
    if (!field) return;
    if (field.type === 'checkbox') field.checked = Boolean(value);
    else if (key === 'images') field.value = (value || []).join('\n');
    else field.value = value ?? '';
  });
  vehicleForm.elements.editing.value = car.id;
  vehicleForm.elements.id.readOnly = true;
  vehicleStatus.textContent = `Editing ${car.year} ${car.make} ${car.model}.`;
}

function resetVehicleForm() {
  vehicleForm.reset();
  vehicleForm.elements.editing.value = '';
  vehicleForm.elements.id.readOnly = false;
  vehicleForm.elements.dateAdded.value = new Date().toISOString().slice(0, 10);
  vehicleStatus.textContent = '';
}

async function saveVehicle(event) {
  event.preventDefault();
  vehicleStatus.textContent = 'Saving...';
  const form = new FormData(vehicleForm);
  const payload = Object.fromEntries(form.entries());
  payload.featured = vehicleForm.elements.featured.checked;
  payload.images = String(payload.images || '').split('\n').map((line) => line.trim()).filter(Boolean);
  const method = payload.editing ? 'PUT' : 'POST';
  delete payload.editing;

  try {
    await adminFetch('/api/admin/vehicles', { method, body: JSON.stringify(payload) });
    vehicleStatus.textContent = 'Vehicle saved.';
    resetVehicleForm();
    await refreshDashboard();
  } catch (error) {
    vehicleStatus.textContent = error.message;
  }
}

async function deleteSelectedVehicle() {
  const id = vehicleForm.elements.editing.value;
  if (!id) {
    vehicleStatus.textContent = 'Select a vehicle first.';
    return;
  }
  if (!window.confirm(`Delete ${id}?`)) return;
  await adminFetch(`/api/admin/vehicles?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
  resetVehicleForm();
  await refreshDashboard();
}

async function adminFetch(url, options = {}) {
  if (!session?.access_token) throw new Error('Admin session expired. Log in again.');
  return fetchJson(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...(options.headers || {}),
    },
  });
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) {
    session = null;
    appSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
    loginStatus.textContent = data.error || 'Session expired. Sign in again.';
    throw new Error(data.error || 'Unauthorized.');
  }
  if (!res.ok) throw new Error(data.error || 'Request failed.');
  return data;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char]));
}
