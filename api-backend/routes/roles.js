const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id_rol, nombre, created_at, updated_at FROM rol ORDER BY id_rol DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { nombre } = req.body || {};
    if (!nombre) return res.status(400).json({ message: 'nombre requerido' });

    const [result] = await pool.query(
      'INSERT INTO rol (nombre, created_at, updated_at) VALUES (?, NOW(), NOW())',
      [nombre]
    );
    res.status(201).json({ id_rol: result.insertId, nombre });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { nombre } = req.body || {};
    if (!nombre) return res.status(400).json({ message: 'nombre requerido' });

    const [result] = await pool.query(
      'UPDATE rol SET nombre = ?, updated_at = NOW() WHERE id_rol = ?',
      [nombre, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_rol: Number(req.params.id), nombre });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM rol WHERE id_rol = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
