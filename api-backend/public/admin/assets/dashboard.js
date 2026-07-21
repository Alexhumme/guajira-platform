const content = document.getElementById('content');
const tabs = document.querySelectorAll('.tab');
const navItems = document.querySelectorAll('.nav-item');
const logoutBtn = document.getElementById('logoutBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalSave = document.getElementById('modalSave');
const modalTitle = document.getElementById('modalTitle');
const modalError = document.getElementById('modalError');
const munModalOverlay = document.getElementById('munModalOverlay');
const munModalClose = document.getElementById('munModalClose');
const munModalSave = document.getElementById('munModalSave');
const munModalTitle = document.getElementById('munModalTitle');
const munModalError = document.getElementById('munModalError');
const memModalOverlay = document.getElementById('memModalOverlay');
const memModalClose = document.getElementById('memModalClose');
const memModalSave = document.getElementById('memModalSave');
const memModalTitle = document.getElementById('memModalTitle');
const memModalError = document.getElementById('memModalError');
const detailsOverlay = document.getElementById('detailsOverlay');
const detailsClose = document.getElementById('detailsClose');
const detailsBody = document.getElementById('detailsBody');

let currentEditId = null;
let currentMunicipios = [];
let currentDepartamentos = [];
let currentComunidades = [];
let currentRoles = [];
let modalMode = 'edit';
let munModalMode = 'edit';
let memModalMode = 'edit';

async function apiFetch(path, options = {}) {
  const res = await fetch(path, { credentials: 'include', ...options });
  if (res.status === 401) {
    window.location.href = '/admin/login.html';
    return null;
  }
  return res;
}

async function ensureAuth() {
  const res = await apiFetch('/api/auth/me');
  if (!res || !res.ok) {
    return;
  }
}

logoutBtn.addEventListener('click', async () => {
  await apiFetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/admin/login.html';
});

modalClose.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
  currentEditId = null;
});

munModalClose.addEventListener('click', () => {
  munModalOverlay.classList.add('hidden');
  currentEditId = null;
});

memModalClose.addEventListener('click', () => {
  memModalOverlay.classList.add('hidden');
  currentEditId = null;
});

detailsClose.addEventListener('click', () => {
  detailsOverlay.classList.add('hidden');
  detailsBody.innerHTML = '';
});

function setActiveTab(tabName) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
  navItems.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
}

function createTable(rows, columns, actions) {
  const table = document.createElement('table');
  table.className = 'table';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col.label;
    headRow.appendChild(th);
  });
  if (actions) {
    const th = document.createElement('th');
    th.textContent = 'Acciones';
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach(row => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = row[col.key] ?? '';
      tr.appendChild(td);
    });
    if (actions) {
      const td = document.createElement('td');
      td.className = 'action-cell';
      actions(row).forEach(btn => td.appendChild(btn));
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

function createPager(total, pageSize, page, onPageChange) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pager = document.createElement('div');
  pager.className = 'form-row';

  const info = document.createElement('div');
  info.className = 'notice';
  info.textContent = `Pagina ${page} de ${totalPages} (${total} registros)`;
  pager.appendChild(info);

  const prev = actionButton('Anterior', () => onPageChange(Math.max(1, page - 1)), 'secondary');
  prev.disabled = page <= 1;
  pager.appendChild(prev);

  const next = actionButton('Siguiente', () => onPageChange(Math.min(totalPages, page + 1)), 'secondary');
  next.disabled = page >= totalPages;
  pager.appendChild(next);

  return pager;
}

async function renderRoles() {
  const res = await apiFetch('/api/roles');
  if (!res) return;
  const rows = await res.json();
  updateStats({ roles: rows.length });
  const pageSize = 8;
  let page = 1;

  content.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>Roles</h2>
    <div class="form-row">
      <input id="roleName" placeholder="Nuevo rol" />
      <button id="addRole">Agregar</button>
    </div>
  `;
  content.appendChild(card);

  const tableHost = document.createElement('div');
  card.appendChild(tableHost);

  const renderPage = () => {
    tableHost.innerHTML = '';
    const start = (page - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);
    const table = createTable(
      pageRows,
      [{ key: 'id_rol', label: 'ID' }, { key: 'nombre', label: 'Nombre' }],
      (row) => [
        actionButton('Editar', async () => {
          const nombre = prompt('Nuevo nombre', row.nombre);
          if (!nombre) return;
          await apiFetch(`/api/roles/${row.id_rol}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
          });
          renderRoles();
        }),
        actionButton('Eliminar', async () => {
          if (!confirm('Eliminar rol?')) return;
          await apiFetch(`/api/roles/${row.id_rol}`, { method: 'DELETE' });
          renderRoles();
        }, 'danger')
      ]
    );
    tableHost.appendChild(table);
    tableHost.appendChild(createPager(rows.length, pageSize, page, (p) => { page = p; renderPage(); }));
  };

  renderPage();

  document.getElementById('addRole').addEventListener('click', async () => {
    const nombre = document.getElementById('roleName').value.trim();
    if (!nombre) return;
    await apiFetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    document.getElementById('roleName').value = '';
    renderRoles();
  });
}

async function renderTipos() {
  const res = await apiFetch('/api/tipos-producto');
  if (!res) return;
  const rows = await res.json();
  updateStats({ tipos: rows.length });
  const pageSize = 8;
  let page = 1;

  content.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>Tipos de Producto</h2>
    <div class="form-row">
      <input id="tipoName" placeholder="Nuevo tipo" />
      <button id="addTipo">Agregar</button>
    </div>
  `;
  content.appendChild(card);

  const tableHost = document.createElement('div');
  card.appendChild(tableHost);

  const renderPage = () => {
    tableHost.innerHTML = '';
    const start = (page - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);
    const table = createTable(
      pageRows,
      [{ key: 'id_tipo_producto', label: 'ID' }, { key: 'nombre', label: 'Nombre' }],
      (row) => [
        actionButton('Editar', async () => {
          const nombre = prompt('Nuevo nombre', row.nombre);
          if (!nombre) return;
          await apiFetch(`/api/tipos-producto/${row.id_tipo_producto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
          });
          renderTipos();
        }),
        actionButton('Eliminar', async () => {
          if (!confirm('Eliminar tipo?')) return;
          await apiFetch(`/api/tipos-producto/${row.id_tipo_producto}`, { method: 'DELETE' });
          renderTipos();
        }, 'danger')
      ]
    );
    tableHost.appendChild(table);
    tableHost.appendChild(createPager(rows.length, pageSize, page, (p) => { page = p; renderPage(); }));
  };

  renderPage();

  document.getElementById('addTipo').addEventListener('click', async () => {
    const nombre = document.getElementById('tipoName').value.trim();
    if (!nombre) return;
    await apiFetch('/api/tipos-producto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    document.getElementById('tipoName').value = '';
    renderTipos();
  });
}

async function renderDepartamentos() {
  const res = await apiFetch('/api/departamentos');
  if (!res) return;
  const rows = await res.json();
  updateStats({ deps: rows.length });
  const pageSize = 8;
  let page = 1;

  content.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>Departamentos</h2>
    <div class="form-row">
      <input id="depName" placeholder="Nuevo departamento" />
      <button id="addDep">Agregar</button>
    </div>
  `;
  content.appendChild(card);

  const tableHost = document.createElement('div');
  card.appendChild(tableHost);

  const renderPage = () => {
    tableHost.innerHTML = '';
    const start = (page - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);
    const table = createTable(
      pageRows,
      [{ key: 'id_departamento', label: 'ID' }, { key: 'nombre', label: 'Nombre' }],
      (row) => [
        actionButton('Editar', async () => {
          const nombre = prompt('Nuevo nombre', row.nombre);
          if (!nombre) return;
          await apiFetch(`/api/departamentos/${row.id_departamento}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre })
          });
          renderDepartamentos();
        }),
        actionButton('Eliminar', async () => {
          if (!confirm('Eliminar departamento?')) return;
          await apiFetch(`/api/departamentos/${row.id_departamento}`, { method: 'DELETE' });
          renderDepartamentos();
        }, 'danger')
      ]
    );
    tableHost.appendChild(table);
    tableHost.appendChild(createPager(rows.length, pageSize, page, (p) => { page = p; renderPage(); }));
  };

  renderPage();

  document.getElementById('addDep').addEventListener('click', async () => {
    const nombre = document.getElementById('depName').value.trim();
    if (!nombre) return;
    await apiFetch('/api/departamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });
    document.getElementById('depName').value = '';
    renderDepartamentos();
  });
}

async function renderMunicipios() {
  const [munRes, depRes] = await Promise.all([
    apiFetch('/api/municipios'),
    apiFetch('/api/departamentos')
  ]);
  if (!munRes || !depRes) return;
  const municipios = await munRes.json();
  const departamentos = await depRes.json();
  currentDepartamentos = departamentos;
  updateStats({ muns: municipios.length, deps: departamentos.length });
  const pageSize = 8;
  let page = 1;

  content.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';

  const depOptions = departamentos.map(d => `<option value="${d.id_departamento}">${d.nombre}</option>`).join('');
  card.innerHTML = `
    <h2>Municipios</h2>
    <div class="form-row">
      <input id="munName" placeholder="Nuevo municipio" />
      <select id="munDep">
        ${depOptions}
      </select>
      <button id="addMun">Agregar</button>
    </div>
  `;
  content.appendChild(card);

  const tableHost = document.createElement('div');
  card.appendChild(tableHost);

  const renderPage = () => {
    tableHost.innerHTML = '';
    const start = (page - 1) * pageSize;
    const pageRows = municipios.slice(start, start + pageSize);
    const table = createTable(
      pageRows,
      [
        { key: 'id_municipio', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'departamento', label: 'Departamento' }
      ],
      (row) => [
        actionButton('Editar', async () => {
          openEditMunModal(row);
        }),
        actionButton('Eliminar', async () => {
          if (!confirm('Eliminar municipio?')) return;
          await apiFetch(`/api/municipios/${row.id_municipio}`, { method: 'DELETE' });
          renderMunicipios();
        }, 'danger')
      ]
    );
    tableHost.appendChild(table);
    tableHost.appendChild(createPager(municipios.length, pageSize, page, (p) => { page = p; renderPage(); }));
  };

  renderPage();

  document.getElementById('addMun').addEventListener('click', () => {
    openCreateMunModal();
  });
}

function openEditMunModal(row) {
  munModalMode = 'edit';
  currentEditId = row.id_municipio;
  munModalOverlay.classList.remove('hidden');
  munModalTitle.textContent = 'Editar municipio';
  munModalError.textContent = '';

  const depSelect = document.getElementById('editMunDep');
  depSelect.innerHTML = currentDepartamentos.map(d => `<option value="${d.id_departamento}">${d.nombre}</option>`).join('');
  depSelect.value = row.id_departamento;

  document.getElementById('editMunName').value = row.nombre || '';
}

function openCreateMunModal() {
  munModalMode = 'create';
  currentEditId = null;
  munModalOverlay.classList.remove('hidden');
  munModalTitle.textContent = 'Nuevo municipio';
  munModalError.textContent = '';

  const depSelect = document.getElementById('editMunDep');
  depSelect.innerHTML = currentDepartamentos.map(d => `<option value="${d.id_departamento}">${d.nombre}</option>`).join('');

  document.getElementById('editMunName').value = '';
}

async function renderComunidades() {
  const [comRes, munRes] = await Promise.all([
    apiFetch('/api/comunidades'),
    apiFetch('/api/municipios')
  ]);
  if (!comRes || !munRes) return;
  const comunidades = await comRes.json();
  const municipios = await munRes.json();
  currentMunicipios = municipios;
  const pageSize = 8;
  let page = 1;

  content.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';

  const munOptions = municipios.map(m => `<option value="${m.id_municipio}">${m.nombre}</option>`).join('');
  card.innerHTML = `
    <h2>Comunidades</h2>
    <div class="form-row">
      <button id="openCreateCom">Nueva comunidad</button>
    </div>
  `;
  content.appendChild(card);

  const tableHost = document.createElement('div');
  card.appendChild(tableHost);

  const renderPage = () => {
    tableHost.innerHTML = '';
    const start = (page - 1) * pageSize;
    const pageRows = comunidades.slice(start, start + pageSize);
    const table = createTable(
      pageRows,
      [
        { key: 'id_comunidad', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'municipio', label: 'Municipio' },
        { key: 'visibilidad', label: 'Visible' }
      ],
      (row) => [
        actionButton('Ver', async () => {
          openDetailsModal(row);
        }, 'secondary'),
        actionButton('Editar', async () => {
          openEditModal(row);
        }),
        actionButton('Eliminar', async () => {
          if (!confirm('Eliminar comunidad?')) return;
          await apiFetch(`/api/comunidades/${row.id_comunidad}`, { method: 'DELETE' });
          renderComunidades();
        }, 'danger')
      ]
    );
    tableHost.appendChild(table);
    tableHost.appendChild(createPager(comunidades.length, pageSize, page, (p) => { page = p; renderPage(); }));
  };

  renderPage();

  document.getElementById('openCreateCom').addEventListener('click', () => {
    openCreateModal();
  });
}

function actionButton(label, onClick, variant) {
  const btn = document.createElement('button');
  btn.textContent = label;
  if (variant === 'danger') btn.classList.add('danger');
  if (variant === 'secondary') btn.classList.add('secondary');
  btn.addEventListener('click', onClick);
  return btn;
}

async function renderMiembros() {
  const [memRes, comRes, rolRes] = await Promise.all([
    apiFetch('/api/miembros'),
    apiFetch('/api/comunidades'),
    apiFetch('/api/roles')
  ]);
  if (!memRes || !comRes || !rolRes) return;
  const miembros = await memRes.json();
  const comunidades = await comRes.json();
  const roles = await rolRes.json();
  currentComunidades = comunidades;
  currentRoles = roles;
  updateStats({ miembros: miembros.length });
  const pageSize = 8;
  let page = 1;

  content.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <h2>Miembros</h2>
    <div class="form-row">
      <button id="openCreateMem">Nuevo miembro</button>
    </div>
  `;
  content.appendChild(card);

  const tableHost = document.createElement('div');
  card.appendChild(tableHost);

  const renderPage = () => {
    tableHost.innerHTML = '';
    const start = (page - 1) * pageSize;
    const pageRows = miembros.slice(start, start + pageSize);
    const table = createTable(
      pageRows,
      [
        { key: 'id_miembro', label: 'ID' },
        { key: 'nombres', label: 'Nombres' },
        { key: 'cedula', label: 'Cédula' },
        { key: 'comunidad', label: 'Comunidad' },
        { key: 'rol', label: 'Rol' },
        { key: 'status', label: 'Estado' }
      ],
      (row) => [
        actionButton('Editar', async () => {
          openEditMemModal(row);
        }),
        actionButton('Eliminar', async () => {
          if (!confirm('Eliminar miembro?')) return;
          await apiFetch(`/api/miembros/${row.id_miembro}`, { method: 'DELETE' });
          renderMiembros();
        }, 'danger')
      ]
    );
    tableHost.appendChild(table);
    tableHost.appendChild(createPager(miembros.length, pageSize, page, (p) => { page = p; renderPage(); }));
  };

  renderPage();

  document.getElementById('openCreateMem').addEventListener('click', () => {
    openCreateMemModal();
  });
}

function openEditMemModal(row) {
  memModalMode = 'edit';
  currentEditId = row.id_miembro;
  memModalOverlay.classList.remove('hidden');
  memModalTitle.textContent = 'Editar miembro';
  memModalError.textContent = '';

  const comSelect = document.getElementById('editMemComunidad');
  comSelect.innerHTML = currentComunidades.map(c => `<option value="${c.id_comunidad}">${c.nombre}</option>`).join('');
  comSelect.value = row.id_comunidad;

  const rolSelect = document.getElementById('editMemRol');
  rolSelect.innerHTML = currentRoles.map(r => `<option value="${r.id_rol}">${r.nombre}</option>`).join('');
  rolSelect.value = row.rol_id;

  document.getElementById('editMemNombres').value = row.nombres || '';
  document.getElementById('editMemCedula').value = row.cedula || '';
  document.getElementById('editMemFechaNacimiento').value = row.fecha_nacimiento || '';
  document.getElementById('editMemContacto').value = row.numero_contacto || '';
  document.getElementById('editMemGenero').value = row.genero || '';
  document.getElementById('editMemStatus').value = row.status || 'activo';
}

function openCreateMemModal() {
  memModalMode = 'create';
  currentEditId = null;
  memModalOverlay.classList.remove('hidden');
  memModalTitle.textContent = 'Nuevo miembro';
  memModalError.textContent = '';

  const comSelect = document.getElementById('editMemComunidad');
  comSelect.innerHTML = currentComunidades.map(c => `<option value="${c.id_comunidad}">${c.nombre}</option>`).join('');

  const rolSelect = document.getElementById('editMemRol');
  rolSelect.innerHTML = currentRoles.map(r => `<option value="${r.id_rol}">${r.nombre}</option>`).join('');

  document.getElementById('editMemNombres').value = '';
  document.getElementById('editMemCedula').value = '';
  document.getElementById('editMemFechaNacimiento').value = '';
  document.getElementById('editMemContacto').value = '';
  document.getElementById('editMemGenero').value = '';
  document.getElementById('editMemStatus').value = 'activo';
}

const tabRenderers = {
  roles: renderRoles,
  tipos: renderTipos,
  departamentos: renderDepartamentos,
  municipios: renderMunicipios,
  comunidades: renderComunidades,
  miembros: renderMiembros,
};

for (const tab of tabs) {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    setActiveTab(tabName);
    tabRenderers[tabName]();
  });
}

for (const nav of navItems) {
  nav.addEventListener('click', () => {
    const tabName = nav.dataset.tab;
    setActiveTab(tabName);
    tabRenderers[tabName]();
  });
}

function updateStats({ roles, tipos, deps, muns, miembros }) {
  if (typeof roles === 'number') document.getElementById('statRoles').textContent = roles;
  if (typeof tipos === 'number') document.getElementById('statTipos').textContent = tipos;
  if (typeof deps === 'number') document.getElementById('statDeps').textContent = deps;
  if (typeof muns === 'number') document.getElementById('statMuns').textContent = muns;
  if (typeof miembros === 'number') document.getElementById('statMiembros').textContent = miembros;
}

function openEditModal(row) {
  modalMode = 'edit';
  currentEditId = row.id_comunidad;
  modalOverlay.classList.remove('hidden');
  modalTitle.textContent = 'Editar comunidad';
  modalError.textContent = '';

  const munSelect = document.getElementById('editComMun');
  munSelect.innerHTML = currentMunicipios.map(m => `<option value="${m.id_municipio}">${m.nombre}</option>`).join('');
  munSelect.value = row.id_municipio;

  document.getElementById('editComName').value = row.nombre || '';
  document.getElementById('editComLogo').value = row.logo_dir || '';
  document.getElementById('editComDireccion').value = row.direccion || '';
  document.getElementById('editComCoords').value = row.coordenadas || '';
  document.getElementById('editComContacto').value = row.numero_contacto || '';
  document.getElementById('editComFundacion').value = row.fecha_fundacion || '';
  document.getElementById('editComVisible').checked = Boolean(row.visibilidad);
  document.getElementById('editComDesc').value = row.descripcion || '';
}

function openCreateModal() {
  modalMode = 'create';
  currentEditId = null;
  modalOverlay.classList.remove('hidden');
  modalTitle.textContent = 'Nueva comunidad';
  modalError.textContent = '';

  const munSelect = document.getElementById('editComMun');
  munSelect.innerHTML = currentMunicipios.map(m => `<option value="${m.id_municipio}">${m.nombre}</option>`).join('');

  document.getElementById('editComName').value = '';
  document.getElementById('editComLogo').value = '';
  document.getElementById('editComDireccion').value = '';
  document.getElementById('editComCoords').value = '';
  document.getElementById('editComContacto').value = '';
  document.getElementById('editComFundacion').value = '';
  document.getElementById('editComVisible').checked = true;
  document.getElementById('editComDesc').value = '';
}

function openDetailsModal(row) {
  detailsBody.innerHTML = '';
  const entries = [
    ['Nombre', row.nombre],
    ['Municipio', row.municipio],
    ['Logo', row.logo_dir || '-'],
    ['Descripcion', row.descripcion || '-'],
    ['Direccion', row.direccion || '-'],
    ['Coordenadas', row.coordenadas || '-'],
    ['Contacto', row.numero_contacto || '-'],
    ['Visible', row.visibilidad ? 'Si' : 'No'],
    ['Fundacion', row.fecha_fundacion || '-'],
    ['Registro', row.fecha_registro || '-'],
  ];
  entries.forEach(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'details-item';
    item.innerHTML = `<div class="details-label">${label}</div><div class="details-value">${value}</div>`;
    detailsBody.appendChild(item);
  });
  detailsOverlay.classList.remove('hidden');
}

modalSave.addEventListener('click', async () => {
  const payload = {
    nombre: document.getElementById('editComName').value.trim(),
    id_municipio: Number(document.getElementById('editComMun').value),
    logo_dir: document.getElementById('editComLogo').value.trim() || null,
    direccion: document.getElementById('editComDireccion').value.trim() || null,
    coordenadas: document.getElementById('editComCoords').value.trim() || null,
    numero_contacto: document.getElementById('editComContacto').value.trim() || null,
    fecha_fundacion: document.getElementById('editComFundacion').value || null,
    visibilidad: document.getElementById('editComVisible').checked,
    descripcion: document.getElementById('editComDesc').value.trim() || null,
  };

  if (!payload.nombre || !payload.id_municipio) {
    modalError.textContent = 'Nombre y municipio son obligatorios.';
    return;
  }

  if (modalMode === 'create') {
    await apiFetch('/api/comunidades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    if (!currentEditId) return;
    await apiFetch(`/api/comunidades/${currentEditId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  modalOverlay.classList.add('hidden');
  currentEditId = null;
  renderComunidades();
});

munModalSave.addEventListener('click', async () => {
  const payload = {
    nombre: document.getElementById('editMunName').value.trim(),
    id_departamento: Number(document.getElementById('editMunDep').value),
  };

  if (!payload.nombre || !payload.id_departamento) {
    munModalError.textContent = 'Nombre y departamento son obligatorios.';
    return;
  }

  if (munModalMode === 'create') {
    await apiFetch('/api/municipios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    if (!currentEditId) return;
    await apiFetch(`/api/municipios/${currentEditId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  munModalOverlay.classList.add('hidden');
  currentEditId = null;
  renderMunicipios();
});

memModalSave.addEventListener('click', async () => {
  const payload = {
    nombres: document.getElementById('editMemNombres').value.trim(),
    cedula: Number(document.getElementById('editMemCedula').value),
    id_comunidad: Number(document.getElementById('editMemComunidad').value),
    rol_id: Number(document.getElementById('editMemRol').value),
    fecha_nacimiento: document.getElementById('editMemFechaNacimiento').value || null,
    numero_contacto: document.getElementById('editMemContacto').value.trim() || null,
    genero: document.getElementById('editMemGenero').value.trim() || null,
    status: document.getElementById('editMemStatus').value,
  };

  if (!payload.nombres || !payload.cedula || !payload.id_comunidad || !payload.rol_id) {
    memModalError.textContent = 'Nombres, cédula, comunidad y rol son obligatorios.';
    return;
  }

  if (memModalMode === 'create') {
    await apiFetch('/api/miembros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } else {
    if (!currentEditId) return;
    await apiFetch(`/api/miembros/${currentEditId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  memModalOverlay.classList.add('hidden');
  currentEditId = null;
  renderMiembros();
});

(async () => {
  await ensureAuth();
  await renderRoles();
})();
