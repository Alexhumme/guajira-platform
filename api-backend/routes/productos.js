const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.id_producto, p.id_miembro, m.nombres AS miembro, c.nombre AS comunidad, ' +
      'p.id_tipo_producto, tp.nombre AS tipo_producto, p.nombre, p.precio, p.descripcion, ' +
      'p.visibilidad, p.fecha_registro, p.created_at, p.updated_at ' +
      'FROM producto p ' +
      'JOIN miembro m ON m.id_miembro = p.id_miembro ' +
      'JOIN comunidad c ON c.id_comunidad = m.id_comunidad ' +
      'JOIN tipo_producto tp ON tp.id_tipo_producto = p.id_tipo_producto ' +
      'ORDER BY p.id_producto DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      id_miembro,
      id_tipo_producto,
      nombre,
      precio,
      descripcion = null,
      visibilidad = true,
      fecha_registro = null,
    } = req.body || {};
    const precioNumerico = Number(precio);

    if (!id_miembro || !id_tipo_producto || !nombre || !Number.isFinite(precioNumerico) || precioNumerico < 0) {
      return res.status(400).json({ message: 'miembro, tipo, nombre y precio valido son requeridos' });
    }

    const [result] = await pool.query(
      'INSERT INTO producto (id_miembro, id_tipo_producto, nombre, precio, descripcion, visibilidad, fecha_registro, created_at, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), NOW(), NOW())',
      [id_miembro, id_tipo_producto, nombre, precioNumerico, descripcion, visibilidad ? 1 : 0, fecha_registro]
    );
    res.status(201).json({ id_producto: result.insertId, id_miembro, id_tipo_producto, nombre, precio: precioNumerico });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      id_miembro,
      id_tipo_producto,
      nombre,
      precio,
      descripcion = null,
      visibilidad = true,
    } = req.body || {};
    const precioNumerico = Number(precio);

    if (!id_miembro || !id_tipo_producto || !nombre || !Number.isFinite(precioNumerico) || precioNumerico < 0) {
      return res.status(400).json({ message: 'miembro, tipo, nombre y precio valido son requeridos' });
    }

    const [result] = await pool.query(
      'UPDATE producto SET id_miembro = ?, id_tipo_producto = ?, nombre = ?, precio = ?, descripcion = ?, visibilidad = ?, updated_at = NOW() WHERE id_producto = ?',
      [id_miembro, id_tipo_producto, nombre, precioNumerico, descripcion, visibilidad ? 1 : 0, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_producto: Number(req.params.id), id_miembro, id_tipo_producto, nombre, precio: precioNumerico });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM producto WHERE id_producto = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
