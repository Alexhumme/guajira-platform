const express = require('express');
const pool = require('../../config/db');
const slugify = require('../../utils/slugify');

const router = express.Router();

// GET /api/web-client/indicadores - Devuelve los indicadores de la homepage
router.get('/indicadores', async (req, res, next) => {
  try {
    const [comunidadesRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM comunidad WHERE visibilidad = 1`
    );

    const [miembrosRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM miembro WHERE status = 'activo'`
    );

    const [municipiosRows] = await pool.query(
      `SELECT COUNT(DISTINCT id_municipio) AS total FROM comunidad WHERE visibilidad = 1`
    );

    const [productosRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM producto WHERE visibilidad = 1`
    );

    const [publicacionesRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM post WHERE visibilidad = 1`
    );

    const [rutasRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM ruta WHERE visibilidad = 1`
    );

    const indicadores = [
      {
        label: 'Comunidades activas',
        valor: Number(comunidadesRows[0]?.total || 0),
        sufijo: '',
      },
      {
        label: 'Municipios con comunidades',
        valor: Number(municipiosRows[0]?.total || 0),
        sufijo: '',
      },
      {
        label: 'Artesanos activos',
        valor: Number(miembrosRows[0]?.total || 0),
        sufijo: '',
      },
      {
        label: 'Productos disponibles',
        valor: Number(productosRows[0]?.total || 0),
        sufijo: '',
      },
      {
        label: 'Publicaciones',
        valor: Number(publicacionesRows[0]?.total || 0),
        sufijo: '',
      },
      {
        label: 'Rutas comunitarias',
        valor: Number(rutasRows[0]?.total || 0),
        sufijo: '+',
      },
    ];

    res.json(indicadores);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
