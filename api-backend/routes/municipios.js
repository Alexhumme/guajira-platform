const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT m.id_municipio, m.nombre, m.id_departamento, d.nombre AS departamento, m.created_at, m.updated_at ' +
      'FROM municipio m JOIN departamento d ON d.id_departamento = m.id_departamento ' +
      'ORDER BY m.id_municipio DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { nombre, id_departamento } = req.body || {};
    if (!nombre || !id_departamento) return res.status(400).json({ message: 'nombre e id_departamento requeridos' });

    const [result] = await pool.query(
      'INSERT INTO municipio (nombre, id_departamento, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [nombre, id_departamento]
    );
    res.status(201).json({ id_municipio: result.insertId, nombre, id_departamento });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, id_departamento } = req.body || {};
    if (!nombre || !id_departamento) return res.status(400).json({ message: 'nombre e id_departamento requeridos' });

    const [result] = await pool.query(
      'UPDATE municipio SET nombre = ?, id_departamento = ?, updated_at = NOW() WHERE id_municipio = ?',
      [nombre, id_departamento, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_municipio: Number(req.params.id), nombre, id_departamento });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM municipio WHERE id_municipio = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
