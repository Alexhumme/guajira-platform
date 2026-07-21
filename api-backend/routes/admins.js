const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_admin, username, active, created_at, updated_at FROM admin ORDER BY id_admin'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { username, password, active = true } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contrasena son requeridos' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admin (username, password_hash, active, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [username, passwordHash, active ? 1 : 0]
    );
    res.status(201).json({ id_admin: result.insertId, username, active: Boolean(active) });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { username, password, active = true } = req.body || {};
    if (!username) {
      return res.status(400).json({ message: 'Usuario es requerido' });
    }
    let query;
    let params;

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      query = 'UPDATE admin SET username = ?, password_hash = ?, active = ?, updated_at = NOW() WHERE id_admin = ?';
      params = [username, passwordHash, active ? 1 : 0, req.params.id];
    } else {
      query = 'UPDATE admin SET username = ?, active = ?, updated_at = NOW() WHERE id_admin = ?';
      params = [username, active ? 1 : 0, req.params.id];
    }

    const [result] = await pool.query(query, params);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });

    res.json({ id_admin: Number(req.params.id), username, active: Boolean(active) });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM admin WHERE id_admin = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
