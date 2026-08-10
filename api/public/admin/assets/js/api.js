export async function apiFetch(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
  });

  if (response.status === 401) {
    window.location.href = '/admin/login.html';
    return null;
  }

  return response;
}

export async function requestJson(path, options = {}) {
  const response = await apiFetch(path, options);
  if (!response) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'No se pudo completar la solicitud.');
  }

  return data;
}

export async function ensureAuth() {
  const response = await apiFetch('/api/auth/me');
  return Boolean(response && response.ok);
}
