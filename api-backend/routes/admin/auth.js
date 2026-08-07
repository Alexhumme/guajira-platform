const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../../config/db');

const router = express.Router();

async function syncBootstrapAdminPassword(username, password) {
  const bootstrapUser = process.env.ADMIN_BOOTSTRAP_USER;
  const bootstrapPass = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!bootstrapUser || !bootstrapPass || username !== bootstrapUser || password !== bootstrapPass) {
    return false;
  }

  const [rows] = await pool.query('SELECT id_admin FROM admin WHERE username = ? LIMIT 1', [username]);
  if (!rows.length) {
    const passwordHash = await bcrypt.hash(bootstrapPass, 10);
    await pool.query(
      'INSERT INTO admin (username, password_hash, active, created_at, updated_at) VALUES (?, ?, 1, NOW(), NOW())',
      [bootstrapUser, passwordHash]
    );
    return true;
  }

  const passwordHash = await bcrypt.hash(bootstrapPass, 10);
  await pool.query('UPDATE admin SET password_hash = ?, active = 1, updated_at = NOW() WHERE id_admin = ?', [passwordHash, rows[0].id_admin]);
  return true;
}

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contrasena requeridos' });
    }

    const [rows] = await pool.query('SELECT id_admin, username, password_hash, active FROM admin WHERE username = ? LIMIT 1', [username]);
    if (!rows.length) {
      const bootstrapSynced = await syncBootstrapAdminPassword(username, password);
      if (!bootstrapSynced) {
        return res.status(401).json({ message: 'Credenciales invalidas' });
      }

      const [refreshedRows] = await pool.query('SELECT id_admin, username, password_hash, active FROM admin WHERE username = ? LIMIT 1', [username]);
      const admin = refreshedRows[0];
      req.session.adminId = admin.id_admin;
      req.session.username = admin.username;
      return res.json({ message: 'Login ok', username: admin.username });
    }

    const admin = rows[0];
    if (!admin.active) {
      return res.status(403).json({ message: 'Usuario inactivo' });
    }

    const ok = await bcrypt.compare(password, admin.password_hash);
    if (!ok) {
      const bootstrapSynced = await syncBootstrapAdminPassword(username, password);
      if (!bootstrapSynced) {
        return res.status(401).json({ message: 'Credenciales invalidas' });
      }

      const [refreshedRows] = await pool.query('SELECT id_admin, username, password_hash, active FROM admin WHERE username = ? LIMIT 1', [username]);
      const refreshedAdmin = refreshedRows[0];
      req.session.adminId = refreshedAdmin.id_admin;
      req.session.username = refreshedAdmin.username;
      return res.json({ message: 'Login ok', username: refreshedAdmin.username });
    }

    req.session.adminId = admin.id_admin;
    req.session.username = admin.username;

    return res.json({ message: 'Login ok', username: admin.username });
  } catch (err) {
    return next(err);
  }
});

router.post('/logout', (req, res) => {
  if (!req.session) return res.json({ message: 'Logout ok' });
  req.session.destroy(() => {
    res.json({ message: 'Logout ok' });
  });
});

router.get('/me', (req, res) => {
  if (req.session && req.session.adminId) {
    return res.json({ id_admin: req.session.adminId, username: req.session.username });
  }
  return res.status(401).json({ message: 'No autenticado' });
});

async function bootstrapAdmin(req, res, next) {
  try {
    const bootstrapUser = process.env.ADMIN_BOOTSTRAP_USER;
    const bootstrapPass = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    if (!bootstrapUser || !bootstrapPass) {
      return res.status(400).json({ message: 'Bootstrap no configurado' });
    }

    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM admin');
    if (countRows[0].total > 0) {
      return res.status(400).json({ message: 'Ya existe un admin' });
    }

    const passwordHash = await bcrypt.hash(bootstrapPass, 10);
    await pool.query(
      'INSERT INTO admin (username, password_hash, active, created_at, updated_at) VALUES (?, ?, 1, NOW(), NOW())',
      [bootstrapUser, passwordHash]
    );

    return res.json({ message: 'Admin creado' });
  } catch (err) {
    return next(err);
  }
}

router.route('/bootstrap')
  .get(bootstrapAdmin)
  .post(bootstrapAdmin);

module.exports = router;
