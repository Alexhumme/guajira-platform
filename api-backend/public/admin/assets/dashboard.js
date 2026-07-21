import { apiFetch, ensureAuth } from './js/api.js';
import { configureDetailsModal, configureFormModal } from './js/ui.js';
import { createRenderers, refreshStats } from './js/entities.js';

const content = document.getElementById('content');
const navItems = document.querySelectorAll('.nav-item');
const logoutButton = document.getElementById('logoutBtn');
const exportButton = document.getElementById('exportBtn');
const renderers = createRenderers({ content });

function activate(tab) {
  navItems.forEach((item) => item.classList.toggle('active', item.dataset.tab === tab));
  renderers[tab]();
}

async function downloadExport() {
  if (!exportButton) return;
  exportButton.disabled = true;
  try {
    const response = await apiFetch('/api/export');
    if (!response || !response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guajira-export.xlsx';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert(error.message || 'No se pudo exportar el archivo.');
  } finally {
    exportButton.disabled = false;
  }
}

if (exportButton) {
  exportButton.addEventListener('click', downloadExport);
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
