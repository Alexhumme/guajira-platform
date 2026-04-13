const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.id_comunidad, c.nombre, c.id_municipio, m.nombre AS municipio, c.logo_dir, c.descripcion, c.direccion, c.coordenadas, c.numero_contacto, c.visibilidad, c.fecha_fundacion, c.fecha_registro, c.created_at, c.updated_at ' +
      'FROM comunidad c JOIN municipio m ON m.id_municipio = c.id_municipio ' +
      'ORDER BY c.id_comunidad DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      nombre,
      id_municipio,
      logo_dir = null,
      descripcion = null,
      direccion = null,
      coordenadas = null,
      numero_contacto = null,
      visibilidad = true,
      fecha_fundacion = null,
      fecha_registro = null,
    } = req.body || {};
    if (!nombre || !id_municipio) return res.status(400).json({ message: 'nombre e id_municipio requeridos' });

    const [result] = await pool.query(
      'INSERT INTO comunidad (nombre, id_municipio, logo_dir, descripcion, direccion, coordenadas, numero_contacto, visibilidad, fecha_fundacion, fecha_registro, created_at, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), NOW(), NOW())',
      [nombre, id_municipio, logo_dir, descripcion, direccion, coordenadas, numero_contacto, visibilidad ? 1 : 0, fecha_fundacion, fecha_registro]
    );
    res.status(201).json({ id_comunidad: result.insertId, nombre, id_municipio });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      nombre,
      id_municipio,
      logo_dir = null,
      descripcion = null,
      direccion = null,
      coordenadas = null,
      numero_contacto = null,
      visibilidad = true,
      fecha_fundacion = null,
      fecha_registro = null,
    } = req.body || {};
    if (!nombre || !id_municipio) return res.status(400).json({ message: 'nombre e id_municipio requeridos' });

    const [result] = await pool.query(
      'UPDATE comunidad SET nombre = ?, id_municipio = ?, logo_dir = ?, descripcion = ?, direccion = ?, coordenadas = ?, numero_contacto = ?, visibilidad = ?, fecha_fundacion = ?, fecha_registro = ?, updated_at = NOW() WHERE id_comunidad = ?',
      [nombre, id_municipio, logo_dir, descripcion, direccion, coordenadas, numero_contacto, visibilidad ? 1 : 0, fecha_fundacion, fecha_registro, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_comunidad: req.params.id, nombre, id_municipio });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM comunidad WHERE id_comunidad = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
