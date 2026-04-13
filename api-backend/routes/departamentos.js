const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id_departamento, nombre, created_at, updated_at FROM departamento ORDER BY id_departamento DESC');
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
      'INSERT INTO departamento (nombre, created_at, updated_at) VALUES (?, NOW(), NOW())',
      [nombre]
    );
    res.status(201).json({ id_departamento: result.insertId, nombre });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { nombre } = req.body || {};
    if (!nombre) return res.status(400).json({ message: 'nombre requerido' });

    const [result] = await pool.query(
      'UPDATE departamento SET nombre = ?, updated_at = NOW() WHERE id_departamento = ?',
      [nombre, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_departamento: Number(req.params.id), nombre });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM departamento WHERE id_departamento = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
