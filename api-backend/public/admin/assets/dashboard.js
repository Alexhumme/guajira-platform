import { apiFetch, ensureAuth } from './js/api.js';
import { configureDetailsModal, configureFormModal } from './js/ui.js';
import { createRenderers, refreshStats } from './js/entities.js';

const content = document.getElementById('content');
const navItems = document.querySelectorAll('.nav-item');
const logoutButton = document.getElementById('logoutBtn');
const renderers = createRenderers({ content });

function activate(tab) {
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.tab === tab));
  renderers[tab]();
}

logoutButton.addEventListener('click', async () => {
  await apiFetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/admin/login.html';
});

navItems.forEach((item) => {
  item.addEventListener('click', () => activate(item.dataset.tab));
});

(async () => {
  if (!await ensureAuth()) return;
  configureFormModal();
  configureDetailsModal();
  await refreshStats();
  activate('roles');
})();
