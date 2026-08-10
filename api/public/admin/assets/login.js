async function checkSession() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (res.ok) {
    window.location.href = '/admin/dashboard.html';
  }
}

checkSession();

const form = document.getElementById('loginForm');
const errorEl = document.getElementById('error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    errorEl.textContent = data.message || 'No se pudo iniciar sesion';
    return;
  }

  window.location.href = '/admin/dashboard.html';
});
