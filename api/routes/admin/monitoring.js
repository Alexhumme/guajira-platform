const express = require('express');
const pool = require('../../config/db');
const { requireAdmin } = require('../../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

function getMaturityLevel(score) {
  if (score >= 8) return { label: 'Alto', color: '#16a34a' };
  if (score >= 5) return { label: 'Medio', color: '#f59e0b' };
  return { label: 'Bajo', color: '#dc2626' };
}

function buildIndicatorList(data) {
  return [
    { key: 'logo', label: 'Logo de comunidad', ok: Boolean(data.logo_dir && String(data.logo_dir).trim()) },
    { key: 'descripcion', label: 'Descripción', ok: Boolean(data.descripcion && String(data.descripcion).trim()) },
    { key: 'fotos', label: 'Fotos', ok: data.media_count > 0 },
    { key: 'lider_definido', label: 'Líder definido', ok: data.lider_count > 0 },
    { key: 'mas_de_10_miembros', label: 'Más de 10 miembros', ok: data.miembro_count > 10 },
    { key: 'contacto', label: 'Contacto', ok: Boolean(data.numero_contacto && String(data.numero_contacto).trim()) },
    { key: 'redes_sociales', label: 'Redes sociales', ok: data.redes_count > 0 },
    { key: 'hasta_3_posts', label: 'Hasta 3 posts', ok: data.posts_count > 0 && data.posts_count <= 3 },
    { key: 'hasta_3_productos', label: 'Hasta 3 productos', ok: data.productos_count > 0 && data.productos_count <= 3 },
    { key: 'hasta_1_ruta', label: 'Hasta 1 ruta', ok: data.rutas_count > 0 && data.rutas_count <= 1 },
  ];
}

router.get('/comunidades', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        c.id_comunidad,
        c.nombre,
        c.logo_dir,
        c.descripcion,
        c.numero_contacto,
        m.nombre AS municipio,
        d.nombre AS departamento,
        COALESCE(cm.media_count, 0) AS media_count,
        COALESCE(rc.redes_count, 0) AS redes_count,
        COALESCE(mi.miembro_count, 0) AS miembro_count,
        COALESCE(posts.posts_count, 0) AS posts_count,
        COALESCE(prods.productos_count, 0) AS productos_count,
        COALESCE(rutas.rutas_count, 0) AS rutas_count,
        COALESCE(lider.lider_count, 0) AS lider_count
      FROM comunidad c
      JOIN municipio m ON m.id_municipio = c.id_municipio
      JOIN departamento d ON d.id_departamento = m.id_departamento
      LEFT JOIN (SELECT id_comunidad, COUNT(*) AS media_count FROM comunidad_media GROUP BY id_comunidad) cm ON cm.id_comunidad = c.id_comunidad
      LEFT JOIN (SELECT id_comunidad, COUNT(*) AS redes_count FROM red_comunidad GROUP BY id_comunidad) rc ON rc.id_comunidad = c.id_comunidad
      LEFT JOIN (SELECT id_comunidad, COUNT(*) AS miembro_count FROM miembro GROUP BY id_comunidad) mi ON mi.id_comunidad = c.id_comunidad
      LEFT JOIN (
        SELECT mi.id_comunidad, COUNT(*) AS posts_count
        FROM post p
        JOIN miembro mi ON mi.id_miembro = p.id_miembro
        GROUP BY mi.id_comunidad
      ) posts ON posts.id_comunidad = c.id_comunidad
      LEFT JOIN (
        SELECT mi.id_comunidad, COUNT(*) AS productos_count
        FROM producto pr
        JOIN miembro mi ON mi.id_miembro = pr.id_miembro
        GROUP BY mi.id_comunidad
      ) prods ON prods.id_comunidad = c.id_comunidad
      LEFT JOIN (SELECT id_comunidad, COUNT(*) AS rutas_count FROM ruta GROUP BY id_comunidad) rutas ON rutas.id_comunidad = c.id_comunidad
      LEFT JOIN (
        SELECT mi.id_comunidad, COUNT(*) AS lider_count
        FROM miembro mi
        JOIN rol r ON r.id_rol = mi.rol_id
        WHERE LOWER(r.nombre) LIKE '%lider%'
        GROUP BY mi.id_comunidad
      ) lider ON lider.id_comunidad = c.id_comunidad
      ORDER BY c.nombre ASC`
    );

    const result = rows.map((row) => {
      const indicators = buildIndicatorList(row);
      const score = indicators.reduce((sum, item) => sum + (item.ok ? 1 : 0), 0);
      return {
        ...row,
        maturity_score: score,
        maturity_level: getMaturityLevel(score),
        indicators: indicators.map(({ key, label, ok }) => ({ key, label, ok })),
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/comunidades/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT
        c.id_comunidad,
        c.nombre,
        c.logo_dir,
        c.descripcion,
        c.numero_contacto,
        c.direccion,
        c.coordenadas,
        c.fecha_fundacion,
        c.fecha_registro,
        m.nombre AS municipio,
        d.nombre AS departamento
      FROM comunidad c
      JOIN municipio m ON m.id_municipio = c.id_municipio
      JOIN departamento d ON d.id_departamento = m.id_departamento
      WHERE c.id_comunidad = ?`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Comunidad no encontrada' });
    }

    const [genderRows] = await pool.query(
      `SELECT
        COUNT(*) AS miembro_count,
        SUM(CASE WHEN LOWER(TRIM(genero)) = 'masculino' THEN 1 ELSE 0 END) AS masculino_count,
        SUM(CASE WHEN LOWER(TRIM(genero)) = 'femenino' THEN 1 ELSE 0 END) AS femenino_count,
        SUM(CASE WHEN genero IS NULL OR TRIM(genero) = '' THEN 1 ELSE 0 END) AS sin_genero_count,
        SUM(CASE WHEN genero IS NOT NULL AND TRIM(genero) != '' AND LOWER(TRIM(genero)) NOT IN ('masculino', 'femenino') THEN 1 ELSE 0 END) AS otros_count
      FROM miembro
      WHERE id_comunidad = ?`,
      [req.params.id]
    );

    const [countsRows] = await pool.query(
      `SELECT
        COALESCE(COUNT(DISTINCT cm.id_comunidad_media), 0) AS media_count,
        COALESCE(COUNT(DISTINCT rc.id_red_comunidad), 0) AS redes_count,
        COALESCE(COUNT(DISTINCT p.id_post), 0) AS posts_count,
        COALESCE(COUNT(DISTINCT pr.id_producto), 0) AS productos_count,
        COALESCE(COUNT(DISTINCT rta.id_ruta), 0) AS rutas_count,
        COALESCE(SUM(CASE WHEN LOWER(rr.nombre) LIKE '%lider%' THEN 1 ELSE 0 END), 0) AS lider_count
      FROM comunidad c
      LEFT JOIN comunidad_media cm ON cm.id_comunidad = c.id_comunidad
      LEFT JOIN red_comunidad rc ON rc.id_comunidad = c.id_comunidad
      LEFT JOIN miembro me ON me.id_comunidad = c.id_comunidad
      LEFT JOIN rol rr ON rr.id_rol = me.rol_id
      LEFT JOIN post p ON p.id_miembro = me.id_miembro
      LEFT JOIN producto pr ON pr.id_miembro = me.id_miembro
      LEFT JOIN ruta rta ON rta.id_comunidad = c.id_comunidad
      WHERE c.id_comunidad = ?
      GROUP BY c.id_comunidad`,
      [req.params.id]
    );

    const counts = countsRows[0] || {
      media_count: 0,
      redes_count: 0,
      posts_count: 0,
      productos_count: 0,
      rutas_count: 0,
      lider_count: 0,
    };

    const context = {
      ...rows[0],
      ...genderRows[0],
      ...counts,
    };

    const indicators = buildIndicatorList(context);
    const score = indicators.reduce((sum, item) => sum + (item.ok ? 1 : 0), 0);
    const maturity = {
      score,
      maxScore: indicators.length,
      level: getMaturityLevel(score),
      indicators: indicators.map(({ key, label, ok }) => ({ key, label, ok })),
    };

    res.json({
      profile: context,
      gender: {
        masculino: Number(genderRows[0].masculino_count) || 0,
        femenino: Number(genderRows[0].femenino_count) || 0,
        otros: Number(genderRows[0].otros_count) || 0,
        sin_genero: Number(genderRows[0].sin_genero_count) || 0,
        total: Number(genderRows[0].miembro_count) || 0,
      },
      counts: {
        miembros: Number(genderRows[0].miembro_count) || 0,
        fotos: Number(counts.media_count) || 0,
        redes: Number(counts.redes_count) || 0,
        posts: Number(counts.posts_count) || 0,
        productos: Number(counts.productos_count) || 0,
        rutas: Number(counts.rutas_count) || 0,
      },
      maturity,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
