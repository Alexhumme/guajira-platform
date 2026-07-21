const PAGE_SIZE = 8;

export function createButton(label, onClick, variant = '') {
  const button = document.createElement('button');
  button.textContent = label;
  if (variant) button.classList.add(variant);
  button.addEventListener('click', onClick);
  return button;
}

export function setStat(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function toDateInput(value) {
  return value ? String(value).slice(0, 10) : '';
}

export function openDetails(title, entries) {
  const overlay = document.getElementById('detailsOverlay');
  const titleElement = document.getElementById('detailsTitle');
  const body = document.getElementById('detailsBody');
  titleElement.textContent = title;
  body.innerHTML = '';

  entries.forEach(([label, value]) => {
    const item = document.createElement('div');
    item.className = 'details-item';
    const labelElement = document.createElement('div');
    labelElement.className = 'details-label';
    labelElement.textContent = label;
    const valueElement = document.createElement('div');
    valueElement.className = 'details-value';
    valueElement.textContent = value ?? '-';
    item.append(labelElement, valueElement);
    body.appendChild(item);
  });

  overlay.classList.remove('hidden');
}

export function configureDetailsModal() {
  const overlay = document.getElementById('detailsOverlay');
  document.getElementById('detailsClose').addEventListener('click', () => {
    overlay.classList.add('hidden');
  });
}

export function openFormModal({ title, fields, values = {}, onSubmit }) {
  const overlay = document.getElementById('formModalOverlay');
  const titleElement = document.getElementById('formModalTitle');
  const errorElement = document.getElementById('formModalError');
  const fieldsElement = document.getElementById('formModalFields');
  const saveButton = document.getElementById('formModalSave');

  titleElement.textContent = title;
  errorElement.textContent = '';
  fieldsElement.innerHTML = '';

  fields.forEach((field) => {
    const wrapper = document.createElement('label');
    wrapper.className = field.type === 'textarea' ? 'form-field form-field-wide' : 'form-field';
    if (field.type === 'checkbox') wrapper.classList.add('form-field-checkbox');
    const label = document.createElement('span');
    label.textContent = `${field.label}${field.required ? ' *' : ''}`;

    let control;
    if (field.type === 'select') {
      control = document.createElement('select');
      field.options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        control.appendChild(optionElement);
      });
    } else if (field.type === 'textarea') {
      control = document.createElement('textarea');
      control.rows = 4;
    } else {
      control = document.createElement('input');
      control.type = field.type || 'text';
      if (field.min !== undefined) control.min = field.min;
      if (field.step !== undefined) control.step = field.step;
    }

    control.dataset.field = field.key;
    if (field.type === 'checkbox') {
      control.checked = Boolean(values[field.key] ?? field.defaultValue);
    } else {
      control.value = values[field.key] ?? field.defaultValue ?? '';
    }
    if (field.type === 'checkbox') {
      wrapper.append(control, label);
    } else {
      wrapper.append(label, control);
    }
    fieldsElement.appendChild(wrapper);
  });

  saveButton.onclick = async () => {
    const payload = {};
    for (const field of fields) {
      const control = fieldsElement.querySelector(`[data-field="${field.key}"]`);
      let value = field.type === 'checkbox' ? control.checked : control.value.trim();
      if (field.type === 'number' && value !== '') value = Number(value);
      if (field.type === 'select' && field.numeric) value = Number(value);
      if (value === '' && !field.required) value = null;

      if (field.required && (value === null || value === '' || Number.isNaN(value))) {
        errorElement.textContent = `Completa el campo obligatorio: ${field.label}.`;
        return;
      }
      payload[field.key] = value;
    }

    try {
      saveButton.disabled = true;
      await onSubmit(payload);
      overlay.classList.add('hidden');
    } catch (error) {
      errorElement.textContent = error.message;
    } finally {
      saveButton.disabled = false;
    }
  };

  overlay.classList.remove('hidden');
}

export function configureFormModal() {
  const overlay = document.getElementById('formModalOverlay');
  document.getElementById('formModalClose').addEventListener('click', () => {
    overlay.classList.add('hidden');
  });
}

export function renderCrudView({
  content,
  title,
  createLabel,
  rows,
  columns,
  searchFields,
  filters = [],
  onCreate,
  onEdit,
  onDelete,
  onView,
}) {
  content.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  const heading = document.createElement('h2');
  heading.textContent = title;
  const toolbar = document.createElement('div');
  toolbar.className = 'table-toolbar';
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = `Buscar en ${title.toLowerCase()}...`;
  search.className = 'table-search';
  const create = createButton(createLabel, onCreate);
  toolbar.append(search);

  filters.forEach((filter) => {
    const select = document.createElement('select');
    select.dataset.filter = filter.key;
    const all = document.createElement('option');
    all.value = '';
    all.textContent = filter.label;
    select.appendChild(all);
    filter.options.forEach((option) => {
      const item = document.createElement('option');
      item.value = option.value;
      item.textContent = option.label;
      select.appendChild(item);
    });
    toolbar.appendChild(select);
  });
  toolbar.appendChild(create);
  card.append(heading, toolbar);

  const tableHost = document.createElement('div');
  card.appendChild(tableHost);
  content.appendChild(card);

  let page = 1;
  const getFilteredRows = () => {
    const query = search.value.trim().toLocaleLowerCase('es-CO');
    const selectedFilters = Object.fromEntries(
      [...toolbar.querySelectorAll('[data-filter]')].map((input) => [input.dataset.filter, input.value])
    );

    return rows.filter((row) => {
      const matchesSearch = !query || searchFields.some((field) =>
        String(row[field] ?? '').toLocaleLowerCase('es-CO').includes(query)
      );
      const matchesFilters = filters.every((filter) => {
        const value = selectedFilters[filter.key];
        return !value || filter.matches(row, value);
      });
      return matchesSearch && matchesFilters;
    });
  };

  const draw = () => {
    const filteredRows = getFilteredRows();
    const pages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
    page = Math.min(page, pages);
    const currentRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    tableHost.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table';
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    [...columns, { label: 'Acciones' }].forEach((column) => {
      const header = document.createElement('th');
      header.textContent = column.label;
      headRow.appendChild(header);
    });
    head.appendChild(headRow);
    table.appendChild(head);

    const body = document.createElement('tbody');
    currentRows.forEach((row) => {
      const tableRow = document.createElement('tr');
      columns.forEach((column) => {
        const cell = document.createElement('td');
        cell.textContent = column.format ? column.format(row) : row[column.key] ?? '';
        tableRow.appendChild(cell);
      });
      const actions = document.createElement('td');
      actions.className = 'action-cell';
      if (onView) actions.appendChild(createButton('Ver', () => onView(row), 'secondary'));
      actions.appendChild(createButton('Editar', () => onEdit(row)));
      actions.appendChild(createButton('Eliminar', async () => {
        if (!confirm(`Eliminar ${title.slice(0, -1).toLowerCase()}?`)) return;
        await onDelete(row);
      }, 'danger'));
      tableRow.appendChild(actions);
      body.appendChild(tableRow);
    });
    table.appendChild(body);
    tableHost.appendChild(table);

    const pager = document.createElement('div');
    pager.className = 'table-pager';
    const info = document.createElement('span');
    info.className = 'notice';
    info.textContent = `Pagina ${page} de ${pages} (${filteredRows.length} registros)`;
    const previous = createButton('Anterior', () => { page -= 1; draw(); }, 'secondary');
    previous.disabled = page <= 1;
    const next = createButton('Siguiente', () => { page += 1; draw(); }, 'secondary');
    next.disabled = page >= pages;
    pager.append(info, previous, next);
    tableHost.appendChild(pager);
  };

  search.addEventListener('input', () => { page = 1; draw(); });
  toolbar.querySelectorAll('[data-filter]').forEach((input) => {
    input.addEventListener('change', () => { page = 1; draw(); });
  });
  draw();
}
