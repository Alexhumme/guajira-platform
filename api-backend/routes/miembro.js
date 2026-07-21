const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT m.id_miembro, m.id_comunidad, c.nombre AS comunidad, m.rol_id, r.nombre AS rol, m.cedula, m.nombres, m.fecha_nacimiento, m.status, m.genero, m.numero_contacto, m.fecha_registro, m.created_at, m.updated_at ' +
      'FROM miembro m JOIN comunidad c ON c.id_comunidad = m.id_comunidad JOIN rol r ON r.id_rol = m.rol_id ' +
      'ORDER BY m.id_miembro DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      id_comunidad,
      rol_id,
      cedula,
      nombres,
      fecha_nacimiento = null,
      status = 'activo',
      genero = null,
      numero_contacto = null,
      fecha_registro = null,
    } = req.body || {};
    if (!id_comunidad || !rol_id || !cedula || !nombres) {
      return res.status(400).json({ message: 'id_comunidad, rol_id, cedula y nombres requeridos' });
    }

    const [result] = await pool.query(
      'INSERT INTO miembro (id_comunidad, rol_id, cedula, nombres, fecha_nacimiento, status, genero, numero_contacto, fecha_registro, created_at, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), NOW(), NOW())',
      [id_comunidad, rol_id, cedula, nombres, fecha_nacimiento, status, genero, numero_contacto, fecha_registro]
    );
    res.status(201).json({ id_miembro: result.insertId, id_comunidad, rol_id, cedula, nombres });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      id_comunidad,
      rol_id,
      cedula,
      nombres,
      fecha_nacimiento = null,
      status = 'activo',
      genero = null,
      numero_contacto = null,
    } = req.body || {};
    if (!id_comunidad || !rol_id || !cedula || !nombres) {
      return res.status(400).json({ message: 'id_comunidad, rol_id, cedula y nombres requeridos' });
    }

    const [result] = await pool.query(
      'UPDATE miembro SET id_comunidad = ?, rol_id = ?, cedula = ?, nombres = ?, fecha_nacimiento = ?, status = ?, genero = ?, numero_contacto = ?, updated_at = NOW() WHERE id_miembro = ?',
      [id_comunidad, rol_id, cedula, nombres, fecha_nacimiento, status, genero, numero_contacto, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_miembro: req.params.id, id_comunidad, rol_id, cedula, nombres });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM miembro WHERE id_miembro = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
