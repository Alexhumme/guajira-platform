import { requestJson } from './api.js';
import { formatCurrency, openDetails, openFormModal, renderCrudView, setStat, toDateInput } from './ui.js';

const jsonRequest = (method, payload) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});

const optionsFrom = (rows, valueKey, label) => rows.map((row) => ({
  value: row[valueKey],
  label: label(row),
}));

function openEntityForm({ title, fields, record, endpoint, idKey, reload }) {
  const values = record ? {
    ...record,
    fecha_fundacion: toDateInput(record.fecha_fundacion),
    fecha_nacimiento: toDateInput(record.fecha_nacimiento),
    fecha_registro: toDateInput(record.fecha_registro),
  } : {};

  openFormModal({
    title,
    fields,
    values,
    onSubmit: async (payload) => {
      const url = record ? `${endpoint}/${record[idKey]}` : endpoint;
      await requestJson(url, jsonRequest(record ? 'PUT' : 'POST', payload));
      await reload();
    },
  });
}

async function renderSimpleEntity(context, config) {
  const rows = await requestJson(config.endpoint) || [];
  setStat(config.stat, rows.length);
  const reload = () => renderSimpleEntity(context, config);
  const fields = [{ key: 'nombre', label: 'Nombre', type: 'text', required: true }];

  renderCrudView({
    content: context.content,
    title: config.title,
    createLabel: `Nuevo ${config.singular}`,
    rows,
    columns: [
      { key: config.idKey, label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
    ],
    searchFields: ['nombre'],
    onCreate: () => openEntityForm({
      title: `Nuevo ${config.singular}`,
      fields,
      endpoint: config.endpoint,
      idKey: config.idKey,
      reload,
    }),
    onEdit: (record) => openEntityForm({
      title: `Editar ${config.singular}`,
      fields,
      record,
      endpoint: config.endpoint,
      idKey: config.idKey,
      reload,
    }),
    onDelete: async (record) => {
      await requestJson(`${config.endpoint}/${record[config.idKey]}`, { method: 'DELETE' });
      await reload();
    },
  });
}

async function renderMunicipios(context) {
  const [municipios, departamentos] = await Promise.all([
    requestJson('/api/municipios'),
    requestJson('/api/departamentos'),
  ]);
  const rows = municipios || [];
  const deps = departamentos || [];
  setStat('statMuns', rows.length);
  setStat('statDeps', deps.length);
  const reload = () => renderMunicipios(context);
  const fields = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    {
      key: 'id_departamento', label: 'Departamento', type: 'select', numeric: true, required: true,
      options: optionsFrom(deps, 'id_departamento', (dep) => dep.nombre),
    },
  ];

  renderCrudView({
    content: context.content,
    title: 'Municipios',
    createLabel: 'Nuevo municipio',
    rows,
    columns: [
      { key: 'id_municipio', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'departamento', label: 'Departamento' },
    ],
    searchFields: ['nombre', 'departamento'],
    filters: [{
      key: 'departamento', label: 'Todos los departamentos',
      options: optionsFrom(deps, 'id_departamento', (dep) => dep.nombre),
      matches: (row, value) => String(row.id_departamento) === value,
    }],
    onCreate: () => openEntityForm({ title: 'Nuevo municipio', fields, endpoint: '/api/municipios', idKey: 'id_municipio', reload }),
    onEdit: (record) => openEntityForm({ title: 'Editar municipio', fields, record, endpoint: '/api/municipios', idKey: 'id_municipio', reload }),
    onDelete: async (record) => {
      await requestJson(`/api/municipios/${record.id_municipio}`, { method: 'DELETE' });
      await reload();
    },
  });
}

async function renderComunidades(context) {
  const [comunidades, municipios] = await Promise.all([
    requestJson('/api/comunidades'),
    requestJson('/api/municipios'),
  ]);
  const rows = comunidades || [];
  const muns = municipios || [];
  const reload = () => renderComunidades(context);
  const fields = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'id_municipio', label: 'Municipio', type: 'select', numeric: true, required: true, options: optionsFrom(muns, 'id_municipio', (mun) => mun.nombre) },
    { key: 'logo_dir', label: 'Ruta de logo', type: 'text' },
    { key: 'direccion', label: 'Direccion', type: 'text' },
    { key: 'coordenadas', label: 'Coordenadas', type: 'text' },
    { key: 'numero_contacto', label: 'Numero de contacto', type: 'text' },
    { key: 'fecha_fundacion', label: 'Fecha de fundacion', type: 'date' },
    { key: 'visibilidad', label: 'Visible', type: 'checkbox', defaultValue: true },
    { key: 'descripcion', label: 'Descripcion', type: 'textarea' },
  ];

  renderCrudView({
    content: context.content,
    title: 'Comunidades',
    createLabel: 'Nueva comunidad',
    rows,
    columns: [
      { key: 'id_comunidad', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'municipio', label: 'Municipio' },
      { key: 'visibilidad', label: 'Visible', format: (row) => row.visibilidad ? 'Si' : 'No' },
    ],
    searchFields: ['nombre', 'municipio', 'descripcion', 'direccion'],
    filters: [{
      key: 'municipio', label: 'Todos los municipios',
      options: optionsFrom(muns, 'id_municipio', (mun) => mun.nombre),
      matches: (row, value) => String(row.id_municipio) === value,
    }],
    onCreate: () => openEntityForm({ title: 'Nueva comunidad', fields, endpoint: '/api/comunidades', idKey: 'id_comunidad', reload }),
    onEdit: (record) => openEntityForm({ title: 'Editar comunidad', fields, record, endpoint: '/api/comunidades', idKey: 'id_comunidad', reload }),
    onDelete: async (record) => {
      await requestJson(`/api/comunidades/${record.id_comunidad}`, { method: 'DELETE' });
      await reload();
    },
    onView: (record) => openDetails('Detalle comunidad', [
      ['Nombre', record.nombre], ['Municipio', record.municipio], ['Logo', record.logo_dir],
      ['Descripcion', record.descripcion], ['Direccion', record.direccion], ['Coordenadas', record.coordenadas],
      ['Contacto', record.numero_contacto], ['Visible', record.visibilidad ? 'Si' : 'No'],
      ['Fundacion', toDateInput(record.fecha_fundacion)], ['Registro', toDateInput(record.fecha_registro)],
    ]),
  });
}

async function renderMiembros(context) {
  const [miembros, comunidades, roles] = await Promise.all([
    requestJson('/api/miembros'), requestJson('/api/comunidades'), requestJson('/api/roles'),
  ]);
  const rows = miembros || [];
  const coms = comunidades || [];
  const rols = roles || [];
  setStat('statMiembros', rows.length);
  const reload = () => renderMiembros(context);
  const fields = [
    { key: 'nombres', label: 'Nombres', type: 'text', required: true },
    { key: 'cedula', label: 'Cedula', type: 'number', min: 0, required: true },
    { key: 'id_comunidad', label: 'Comunidad', type: 'select', numeric: true, required: true, options: optionsFrom(coms, 'id_comunidad', (com) => com.nombre) },
    { key: 'rol_id', label: 'Rol', type: 'select', numeric: true, required: true, options: optionsFrom(rols, 'id_rol', (rol) => rol.nombre) },
    { key: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date' },
    { key: 'numero_contacto', label: 'Numero de contacto', type: 'text' },
    { key: 'genero', label: 'Genero', type: 'text' },
    { key: 'status', label: 'Estado', type: 'select', required: true, defaultValue: 'activo', options: [{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }] },
  ];

  renderCrudView({
    content: context.content,
    title: 'Miembros',
    createLabel: 'Nuevo miembro',
    rows,
    columns: [
      { key: 'id_miembro', label: 'ID' }, { key: 'nombres', label: 'Nombres' },
      { key: 'cedula', label: 'Cedula' }, { key: 'comunidad', label: 'Comunidad' },
      { key: 'rol', label: 'Rol' }, { key: 'status', label: 'Estado' },
    ],
    searchFields: ['nombres', 'cedula', 'comunidad', 'rol', 'numero_contacto'],
    filters: [
      { key: 'comunidad', label: 'Todas las comunidades', options: optionsFrom(coms, 'id_comunidad', (com) => com.nombre), matches: (row, value) => String(row.id_comunidad) === value },
      { key: 'rol', label: 'Todos los roles', options: optionsFrom(rols, 'id_rol', (rol) => rol.nombre), matches: (row, value) => String(row.rol_id) === value },
      { key: 'status', label: 'Todos los estados', options: [{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }], matches: (row, value) => row.status === value },
    ],
    onCreate: () => openEntityForm({ title: 'Nuevo miembro', fields, endpoint: '/api/miembros', idKey: 'id_miembro', reload }),
    onEdit: (record) => openEntityForm({ title: 'Editar miembro', fields, record, endpoint: '/api/miembros', idKey: 'id_miembro', reload }),
    onDelete: async (record) => {
      await requestJson(`/api/miembros/${record.id_miembro}`, { method: 'DELETE' });
      await reload();
    },
  });
}

async function renderProductos(context) {
  const [productos, miembros, tipos] = await Promise.all([
    requestJson('/api/productos'), requestJson('/api/miembros'), requestJson('/api/tipos-producto'),
  ]);
  const rows = productos || [];
  const mems = miembros || [];
  const tiposProducto = tipos || [];
  setStat('statProductos', rows.length);
  const reload = () => renderProductos(context);
  const fields = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'precio', label: 'Precio (COP)', type: 'number', min: 0, step: 0.01, required: true },
    { key: 'id_miembro', label: 'Miembro', type: 'select', numeric: true, required: true, options: optionsFrom(mems, 'id_miembro', (mem) => `${mem.nombres} - ${mem.comunidad}`) },
    { key: 'id_tipo_producto', label: 'Tipo de producto', type: 'select', numeric: true, required: true, options: optionsFrom(tiposProducto, 'id_tipo_producto', (tipo) => tipo.nombre) },
    { key: 'visibilidad', label: 'Visible', type: 'checkbox', defaultValue: true },
    { key: 'descripcion', label: 'Descripcion', type: 'textarea' },
  ];

  renderCrudView({
    content: context.content,
    title: 'Productos',
    createLabel: 'Nuevo producto',
    rows,
    columns: [
      { key: 'id_producto', label: 'ID' }, { key: 'nombre', label: 'Producto' },
      { key: 'tipo_producto', label: 'Tipo' }, { key: 'miembro', label: 'Miembro' },
      { key: 'precio', label: 'Precio', format: (row) => formatCurrency(row.precio) },
      { key: 'visibilidad', label: 'Visible', format: (row) => row.visibilidad ? 'Si' : 'No' },
    ],
    searchFields: ['nombre', 'tipo_producto', 'miembro', 'comunidad', 'descripcion'],
    filters: [
      { key: 'miembro', label: 'Todos los miembros', options: optionsFrom(mems, 'id_miembro', (mem) => `${mem.nombres} - ${mem.comunidad}`), matches: (row, value) => String(row.id_miembro) === value },
      { key: 'tipo', label: 'Todos los tipos', options: optionsFrom(tiposProducto, 'id_tipo_producto', (tipo) => tipo.nombre), matches: (row, value) => String(row.id_tipo_producto) === value },
      { key: 'visibilidad', label: 'Visibilidad', options: [{ value: '1', label: 'Visibles' }, { value: '0', label: 'Ocultos' }], matches: (row, value) => String(Number(row.visibilidad)) === value },
    ],
    onCreate: () => openEntityForm({ title: 'Nuevo producto', fields, endpoint: '/api/productos', idKey: 'id_producto', reload }),
    onEdit: (record) => openEntityForm({ title: 'Editar producto', fields, record, endpoint: '/api/productos', idKey: 'id_producto', reload }),
    onDelete: async (record) => {
      await requestJson(`/api/productos/${record.id_producto}`, { method: 'DELETE' });
      await reload();
    },
    onView: (record) => openDetails('Detalle producto', [
      ['Nombre', record.nombre], ['Tipo', record.tipo_producto], ['Miembro', record.miembro],
      ['Comunidad', record.comunidad], ['Precio', formatCurrency(record.precio)],
      ['Descripcion', record.descripcion], ['Visible', record.visibilidad ? 'Si' : 'No'],
      ['Registro', toDateInput(record.fecha_registro)],
    ]),
  });
}

async function renderCategoriasTuristicas(context) {
  const [categorias, serverIcons] = await Promise.all([
    requestJson('/api/categorias-turisticas'), requestJson('/api/categorias-turisticas/icons'),
  ]);
  const rows = categorias || [];
  const iconOptions = (serverIcons || []).map((value) => ({ value, label: value }));
  setStat('statCategoriasTuristicas', rows.length);
  const reload = () => renderCategoriasTuristicas(context);

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
  });

  const fields = [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    {
      key: 'icono_dir',
      label: 'Icono',
      type: 'image',
      placeholder: 'URL externa o ruta del servidor',
      options: iconOptions,
      onUpload: async (file) => {
        const dataUrl = await toBase64(file);
        const result = await requestJson('/api/categorias-turisticas/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, fileData: dataUrl }),
        });
        return result?.path || '';
      },
    },
  ];

  renderCrudView({
    content: context.content,
    title: 'Categorías turísticas',
    createLabel: 'Nueva categoría',
    rows,
    columns: [
      { key: 'id_categoria_turistica', label: 'ID' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'icono_dir', label: 'Icono', type: 'image' },
    ],
    searchFields: ['nombre'],
    onCreate: () => openEntityForm({ title: 'Nueva categoría', fields, endpoint: '/api/categorias-turisticas', idKey: 'id_categoria_turistica', reload }),
    onEdit: (record) => openEntityForm({ title: 'Editar categoría', fields, record, endpoint: '/api/categorias-turisticas', idKey: 'id_categoria_turistica', reload }),
    onDelete: async (record) => {
      await requestJson(`/api/categorias-turisticas/${record.id_categoria_turistica}`, { method: 'DELETE' });
      await reload();
    },
    onView: (record) => openDetails('Detalle categoría', [
      ['Nombre', record.nombre], ['Icono', record.icono_dir || '-'],
    ]),
  });
}

async function renderPosts(context) {
  const [posts, miembros] = await Promise.all([
    requestJson('/api/posts'), requestJson('/api/miembros'),
  ]);
  const rows = posts || [];
  const reload = () => renderPosts(context);
  setStat('statPosts', rows.length);
  const fields = [
    { key: 'id_miembro', label: 'Miembro', type: 'select', numeric: true, required: true, options: optionsFrom(miembros, 'id_miembro', (mem) => `${mem.nombres} - ${mem.comunidad}`) },
    { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true },
    { key: 'visibilidad', label: 'Visible', type: 'checkbox', defaultValue: true },
    { key: 'likes', label: 'Likes', type: 'number', min: 0, defaultValue: 0 },
  ];

  renderCrudView({
    content: context.content,
    title: 'Posts',
    createLabel: 'Nuevo post',
    rows,
    columns: [
      { key: 'id_post', label: 'ID' },
      { key: 'miembro', label: 'Miembro' },
      { key: 'comunidad', label: 'Comunidad' },
      { key: 'descripcion', label: 'Descripcion' },
      { key: 'visibilidad', label: 'Visible', format: (row) => row.visibilidad ? 'Si' : 'No' },
      { key: 'likes', label: 'Likes' },
      { key: 'fecha_registro', label: 'Fecha registro' },
    ],
    searchFields: ['descripcion', 'miembro', 'comunidad'],
    onCreate: () => openEntityForm({ title: 'Nuevo post', fields, endpoint: '/api/posts', idKey: 'id_post', reload }),
    onEdit: (record) => openEntityForm({ title: 'Editar post', fields, record, endpoint: '/api/posts', idKey: 'id_post', reload }),
    onDelete: async (record) => {
      await requestJson(`/api/posts/${record.id_post}`, { method: 'DELETE' });
      await reload();
    },
    onView: (record) => openDetails('Detalle post', [
      ['Miembro', record.miembro], ['Comunidad', record.comunidad], ['Descripcion', record.descripcion],
      ['Visible', record.visibilidad ? 'Si' : 'No'], ['Likes', record.likes], ['Registro', toDateInput(record.fecha_registro)],
    ]),
  });
}

export function createRenderers(context) {
  return {
    roles: () => renderSimpleEntity(context, { title: 'Roles', singular: 'rol', endpoint: '/api/roles', idKey: 'id_rol', stat: 'statRoles' }),
    tipos: () => renderSimpleEntity(context, { title: 'Tipos de Producto', singular: 'tipo de producto', endpoint: '/api/tipos-producto', idKey: 'id_tipo_producto', stat: 'statTipos' }),
    departamentos: () => renderSimpleEntity(context, { title: 'Departamentos', singular: 'departamento', endpoint: '/api/departamentos', idKey: 'id_departamento', stat: 'statDeps' }),
    municipios: () => renderMunicipios(context),
    comunidades: () => renderComunidades(context),
    miembros: () => renderMiembros(context),
    productos: () => renderProductos(context),
    categoriasTuristicas: () => renderCategoriasTuristicas(context),
    posts: () => renderPosts(context),
  };
}

export async function refreshStats() {
  const endpoints = [
    ['/api/roles', 'statRoles'], ['/api/tipos-producto', 'statTipos'],
    ['/api/departamentos', 'statDeps'], ['/api/municipios', 'statMuns'],
    ['/api/miembros', 'statMiembros'], ['/api/productos', 'statProductos'],
    ['/api/categorias-turisticas', 'statCategoriasTuristicas'], ['/api/posts', 'statPosts'],
  ];
  await Promise.all(endpoints.map(async ([endpoint, stat]) => {
    const rows = await requestJson(endpoint);
    setStat(stat, rows?.length || 0);
  }));
}
