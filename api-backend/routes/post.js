const express = require('express');
const { randomUUID } = require('crypto');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.id_post, p.id_miembro, m.nombres AS miembro, c.nombre AS comunidad, p.descripcion, p.visibilidad, p.likes, p.fecha_registro, p.created_at, p.updated_at ' +
      'FROM post p ' +
      'JOIN miembro m ON m.id_miembro = p.id_miembro ' +
      'JOIN comunidad c ON c.id_comunidad = m.id_comunidad ' +
      'ORDER BY p.fecha_registro DESC'
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
      descripcion,
      visibilidad = true,
      likes = 0,
      fecha_registro = null,
    } = req.body || {};

    if (!id_miembro || !descripcion) {
      return res.status(400).json({ message: 'id_miembro y descripcion son requeridos' });
    }

    const likesNumero = Number(likes);
    if (!Number.isInteger(likesNumero) || likesNumero < 0) {
      return res.status(400).json({ message: 'likes debe ser un entero positivo' });
    }

    const id_post = randomUUID();
    await pool.query(
      'INSERT INTO post (id_post, id_miembro, descripcion, visibilidad, likes, fecha_registro, created_at, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), NOW(), NOW())',
      [id_post, id_miembro, descripcion, visibilidad ? 1 : 0, likesNumero, fecha_registro]
    );

    res.status(201).json({ id_post, id_miembro, descripcion, visibilidad: Boolean(visibilidad), likes: likesNumero });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      id_miembro,
      descripcion,
      visibilidad = true,
      likes = 0,
    } = req.body || {};

    if (!id_miembro || !descripcion) {
      return res.status(400).json({ message: 'id_miembro y descripcion son requeridos' });
    }

    const likesNumero = Number(likes);
    if (!Number.isInteger(likesNumero) || likesNumero < 0) {
      return res.status(400).json({ message: 'likes debe ser un entero positivo' });
    }

    const [result] = await pool.query(
      'UPDATE post SET id_miembro = ?, descripcion = ?, visibilidad = ?, likes = ?, updated_at = NOW() WHERE id_post = ?',
      [id_miembro, descripcion, visibilidad ? 1 : 0, likesNumero, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });

    res.json({ id_post: req.params.id, id_miembro, descripcion, visibilidad: Boolean(visibilidad), likes: likesNumero });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM post WHERE id_post = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
