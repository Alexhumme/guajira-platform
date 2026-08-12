const express = require('express');
const router = express.Router();
const slugify = require('../../utils/slugify');
const pool = require('../../config/db');

// GET /api/web-client/miembros - Devuelve todos los miembros
router.get('/miembros', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id_miembro, m.nombres, m.avatar_dir as avatar
       FROM miembro m
       ORDER BY m.id_miembro DESC`
    );

    const payload = rows.map((miembro) => ({
      id: String(miembro.id_miembro),
      nombre: miembro.nombres,
      avatar: miembro.avatar
    }));

    res.json(payload);
  } catch (err) {
    next(err);
  }
});


module.exports = router;