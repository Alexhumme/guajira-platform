const express = require('express');
const router = express.Router();
const slugify = require('../../utils/slugify');
const pool = require('../../config/db');

// GET /api/web-client/municipios - Devuelve todos los municipios
router.get('/municipios', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.id_municipio, m.nombre, d.nombre AS departamento
       FROM municipio m
       JOIN departamento d ON d.id_departamento = m.id_departamento
       ORDER BY m.id_municipio DESC`
    );

    const payload = rows.map((municipio) => ({
      id: String(municipio.id_municipio),
      nombre: municipio.nombre,
      departamento: municipio.departamento,
    }));

    res.json(payload);
  } catch (err) {
    next(err);
  }
});


module.exports = router;