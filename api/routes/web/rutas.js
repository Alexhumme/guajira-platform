const express = require('express');
const router = express.Router();
const slugify = require('../../utils/slugify');
const pool = require('../../config/db');

// GET /api/web-client/rutas - Devuelve rutas visibles para el web-client
router.get('/rutas', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id_ruta, r.id_comunidad, c.id_municipio, r.nombre, r.descripcion, r.duracion, r.distancia, r.dificultad, r.tipo_experiencia, r.portada_dir
       FROM ruta r
       JOIN comunidad c ON c.id_comunidad = r.id_comunidad
       WHERE r.visibilidad = 1
       ORDER BY r.fecha_registro DESC`
    );

    const ids = rows.map((ruta) => ruta.id_ruta);
    let mediaRows = [];
    if (ids.length > 0) {
      const [mRows] = await pool.query(
        `SELECT id_ruta, media_dir, ` + "`index`" + `
         FROM ruta_media
         WHERE id_ruta IN (?)
         ORDER BY id_ruta ASC, ` + "`index`" + ` ASC`,
        [ids]
      );
      mediaRows = mRows;
    }

    const mediaByRuta = new Map();
    mediaRows.forEach((row) => {
      if (!mediaByRuta.has(row.id_ruta)) {
        mediaByRuta.set(row.id_ruta, []);
      }
      mediaByRuta.get(row.id_ruta).push(row.media_dir);
    });

    const payload = rows.map((ruta) => {
      const galeria = (mediaByRuta.get(ruta.id_ruta) || []).filter(Boolean);
      const portada = galeria.length > 0 ? galeria[0] : (ruta.portada_dir || '');

      return {
        id: String(ruta.id_ruta),
        slug: slugify(ruta.nombre),
        nombre: ruta.nombre,
        descripcion: ruta.descripcion || '',
        duracion: ruta.duracion || '',
        distancia: ruta.distancia || '',
        municipioId: String(ruta.id_municipio),
        comunidadPrincipalId: String(ruta.id_comunidad),
        comunidadesIds: [String(ruta.id_comunidad)],
        dificultad: ruta.dificultad || 'Media',
        tipoExperiencia: ruta.tipo_experiencia || 'Turístico',
        portada,
        galeria,
        puntos: [],
        serviciosIds: [],
      };
    });

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

module.exports = router;