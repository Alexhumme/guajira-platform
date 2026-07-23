const express = require('express');
const pool = require('../config/db');

const router = express.Router();

function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// GET /api/web-client/comunidades - Devuelve todas las comunidades en el formato del web-client
router.get('/comunidades', async (req, res, next) => {
  try {
    // Obtener todas las comunidades visibles
    const [comunidadesRows] = await pool.query(
      `SELECT c.id_comunidad, c.nombre, c.id_municipio, c.logo_dir, c.portada_dir, c.descripcion, 
              c.direccion, c.coordenadas, c.numero_contacto, c.fecha_fundacion
       FROM comunidad c
       WHERE c.visibilidad = 1
       ORDER BY c.id_comunidad DESC`
    );

    // Obtener media para todas las comunidades
    const [mediaRows] = await pool.query(
      `SELECT id_comunidad, media_dir, \`index\`
       FROM comunidad_media
       ORDER BY id_comunidad ASC, \`index\` ASC`
    );

    // Obtener redes sociales para todas las comunidades
    const [redesRows] = await pool.query(
      `SELECT id_comunidad, red_social, usuario, link
       FROM red_comunidad
       ORDER BY id_comunidad ASC`
    );

    // Obtener cantidad de miembros por comunidad
    const [habitantesRows] = await pool.query(
      `SELECT id_comunidad, COUNT(*) AS total
       FROM miembro
       GROUP BY id_comunidad`
    );

    // Mapear media por comunidad
    const mediaByComunidad = new Map();
    mediaRows.forEach((row) => {
      if (!mediaByComunidad.has(row.id_comunidad)) {
        mediaByComunidad.set(row.id_comunidad, []);
      }
      mediaByComunidad.get(row.id_comunidad).push(row);
    });

    // Mapear redes por comunidad
    const redesByComunidad = new Map();
    redesRows.forEach((row) => {
      if (!redesByComunidad.has(row.id_comunidad)) {
        redesByComunidad.set(row.id_comunidad, []);
      }
      redesByComunidad.get(row.id_comunidad).push(row);
    });

    // Mapear habitantes por comunidad
    const habitantesByComunidad = new Map();
    habitantesRows.forEach((row) => {
      habitantesByComunidad.set(row.id_comunidad, Number(row.total || 0));
    });

    // Construir el payload
    const payload = comunidadesRows.map((comunidad) => {
      const media = mediaByComunidad.get(comunidad.id_comunidad) || [];
      const galeria = media.map((item) => item.media_dir).filter(Boolean);
      const portada = galeria.length > 0 ? galeria[0] : (comunidad.portada_dir || comunidad.logo_dir || '');

      return {
        id: String(comunidad.id_comunidad),
        slug: slugify(comunidad.nombre),
        nombre: comunidad.nombre,
        municipioId: String(comunidad.id_municipio),
        descripcion: comunidad.descripcion || '',
        logo: comunidad.logo_dir || undefined,
        portada: portada,
        galeria: galeria,
        contacto: {
          telefono: comunidad.numero_contacto || '',
          correo: '',
          whatsapp: '',
        },
        redes: (redesByComunidad.get(comunidad.id_comunidad) || []).map((red) => ({
          red_social: red.red_social,
          usuario: red.usuario || undefined,
          link: red.link || undefined,
        })),
        fundacion: comunidad.fecha_fundacion ? String(comunidad.fecha_fundacion) : '',
        habitantes: habitantesByComunidad.get(comunidad.id_comunidad) || 0,
        direccion: comunidad.direccion || undefined,
        coordenadas: comunidad.coordenadas || undefined,
      };
    });

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// GET /api/web-client/comunidades/top - Devuelve las comunidades top por puntaje combinado
router.get('/comunidades/top', async (req, res, next) => {
  try {
    const [comunidadesRows] = await pool.query(
      `SELECT c.id_comunidad, c.nombre, c.id_municipio, c.logo_dir, c.portada_dir, c.descripcion, 
              c.direccion, c.coordenadas, c.numero_contacto, c.fecha_fundacion,
              m.nombre AS municipio_nombre,
              d.nombre AS departamento_nombre,
              COALESCE(p.productos_count,0) AS productos_count,
              COALESCE(pub.publicaciones_count,0) AS publicaciones_count,
              COALESCE(rutas.rutas_count,0) AS rutas_count,
              COALESCE(h.habitantes_count,0) AS habitantes_count,
              (COALESCE(p.productos_count,0) + COALESCE(pub.publicaciones_count,0) + COALESCE(rutas.rutas_count,0) + COALESCE(h.habitantes_count,0)) AS combined_score
       FROM comunidad c
       JOIN municipio m ON m.id_municipio = c.id_municipio
       JOIN departamento d ON d.id_departamento = m.id_departamento
       LEFT JOIN (SELECT m.id_comunidad, COUNT(*) AS productos_count FROM producto p JOIN miembro m ON p.id_miembro = m.id_miembro WHERE p.visibilidad = 1 GROUP BY m.id_comunidad) p ON p.id_comunidad = c.id_comunidad
       LEFT JOIN (SELECT m.id_comunidad, COUNT(*) AS publicaciones_count FROM post po JOIN miembro m ON po.id_miembro = m.id_miembro WHERE po.visibilidad = 1 GROUP BY m.id_comunidad) pub ON pub.id_comunidad = c.id_comunidad
       LEFT JOIN (SELECT id_comunidad, COUNT(*) AS rutas_count FROM ruta WHERE visibilidad = 1 GROUP BY id_comunidad) rutas ON rutas.id_comunidad = c.id_comunidad
       LEFT JOIN (SELECT id_comunidad, COUNT(*) AS habitantes_count FROM miembro WHERE status = 'activo' GROUP BY id_comunidad) h ON h.id_comunidad = c.id_comunidad
       WHERE c.visibilidad = 1
       ORDER BY combined_score DESC
       LIMIT 4`
    );

    const ids = comunidadesRows.map((r) => r.id_comunidad);

    let mediaRows = [];
    let redesRows = [];

    if (ids.length > 0) {
      const [mRows] = await pool.query(
        `SELECT id_comunidad, media_dir, ` + "`index`" + `
         FROM comunidad_media
         WHERE id_comunidad IN (?)
         ORDER BY id_comunidad ASC, ` + "`index`" + ` ASC`,
        [ids]
      );
      mediaRows = mRows;

      const [rRows] = await pool.query(
        `SELECT id_comunidad, red_social, usuario, link
         FROM red_comunidad
         WHERE id_comunidad IN (?)
         ORDER BY id_comunidad ASC`,
        [ids]
      );
      redesRows = rRows;
    }

    // Mapear media por comunidad
    const mediaByComunidad = new Map();
    mediaRows.forEach((row) => {
      if (!mediaByComunidad.has(row.id_comunidad)) {
        mediaByComunidad.set(row.id_comunidad, []);
      }
      mediaByComunidad.get(row.id_comunidad).push(row);
    });

    // Mapear redes por comunidad
    const redesByComunidad = new Map();
    redesRows.forEach((row) => {
      if (!redesByComunidad.has(row.id_comunidad)) {
        redesByComunidad.set(row.id_comunidad, []);
      }
      redesByComunidad.get(row.id_comunidad).push(row);
    });

    const payload = comunidadesRows.map((comunidad) => {
      const media = mediaByComunidad.get(comunidad.id_comunidad) || [];
      const galeria = media.map((item) => item.media_dir).filter(Boolean);
      const portada = galeria.length > 0 ? galeria[0] : (comunidad.portada_dir || comunidad.logo_dir || '');

      return {
        id: String(comunidad.id_comunidad),
        slug: slugify(comunidad.nombre),
        nombre: comunidad.nombre,
        municipioId: String(comunidad.id_municipio),
        municipio: {
          nombre: comunidad.municipio_nombre || '',
          departamento: comunidad.departamento_nombre || '',
        },
        descripcion: comunidad.descripcion || '',
        logo: comunidad.logo_dir || undefined,
        portada: portada,
        galeria: galeria,
        contacto: {
          telefono: comunidad.numero_contacto || '',
          correo: '',
          whatsapp: '',
        },
        redes: (redesByComunidad.get(comunidad.id_comunidad) || []).map((red) => ({
          red_social: red.red_social,
          usuario: red.usuario || undefined,
          link: red.link || undefined,
        })),
        fundacion: comunidad.fecha_fundacion ? String(comunidad.fecha_fundacion) : '',
        habitantes: Number(comunidad.habitantes_count || 0),
        direccion: comunidad.direccion || undefined,
        coordenadas: comunidad.coordenadas || undefined,
      };
    });

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// GET /api/web-client/comunidades/:id - Devuelve una comunidad específica en el formato del web-client
router.get('/comunidades/:id', async (req, res, next) => {
  try {
    const [comunidadesRows] = await pool.query(
      `SELECT c.id_comunidad, c.nombre, c.id_municipio, c.logo_dir, c.portada_dir, c.descripcion, 
              c.direccion, c.coordenadas, c.numero_contacto, c.fecha_fundacion
       FROM comunidad c
       WHERE c.id_comunidad = ? AND c.visibilidad = 1`,
      [req.params.id]
    );

    if (comunidadesRows.length === 0) {
      return res.status(404).json({ message: 'Comunidad no encontrada' });
    }

    const comunidad = comunidadesRows[0];

    // Obtener media para esta comunidad
    const [mediaRows] = await pool.query(
      `SELECT media_dir, \`index\`
       FROM comunidad_media
       WHERE id_comunidad = ?
       ORDER BY \`index\` ASC`,
      [req.params.id]
    );

    // Obtener redes para esta comunidad
    const [redesRows] = await pool.query(
      `SELECT red_social, usuario, link
       FROM red_comunidad
       WHERE id_comunidad = ?`,
      [req.params.id]
    );

    // Obtener habitantes
    const [habitantesRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM miembro
       WHERE id_comunidad = ?`,
      [req.params.id]
    );

    const galeria = mediaRows.map((item) => item.media_dir).filter(Boolean);
    const portada = galeria.length > 0 ? galeria[0] : (comunidad.portada_dir || comunidad.logo_dir || '');

    const payload = {
      id: String(comunidad.id_comunidad),
      slug: slugify(comunidad.nombre),
      nombre: comunidad.nombre,
      municipioId: String(comunidad.id_municipio),
      descripcion: comunidad.descripcion || '',
      logo: comunidad.logo_dir || undefined,
      portada: portada,
      galeria: galeria,
      contacto: {
        telefono: comunidad.numero_contacto || '',
        correo: '',
        whatsapp: '',
      },
      redes: redesRows.map((red) => ({
        red_social: red.red_social,
        usuario: red.usuario || undefined,
        link: red.link || undefined,
      })),
      fundacion: comunidad.fecha_fundacion ? String(comunidad.fecha_fundacion) : '',
      habitantes: Number(habitantesRows[0]?.total || 0),
      direccion: comunidad.direccion || undefined,
      coordenadas: comunidad.coordenadas || undefined,
    };

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// GET /api/web-client/comunidades/top - Devuelve las comunidades top por puntaje combinado
router.get('/comunidades/top', async (req, res, next) => {
  try {
    const [comunidadesRows] = await pool.query(
      `SELECT c.id_comunidad, c.nombre, c.id_municipio, c.logo_dir, c.portada_dir, c.descripcion, 
              c.direccion, c.coordenadas, c.numero_contacto, c.fecha_fundacion,
              COALESCE(p.productos_count,0) AS productos_count,
              COALESCE(pub.publicaciones_count,0) AS publicaciones_count,
              COALESCE(rutas.rutas_count,0) AS rutas_count,
              COALESCE(h.habitantes_count,0) AS habitantes_count,
              (COALESCE(p.productos_count,0) + COALESCE(pub.publicaciones_count,0) + COALESCE(rutas.rutas_count,0) + COALESCE(h.habitantes_count,0)) AS combined_score
       FROM comunidad c
       LEFT JOIN (SELECT id_comunidad, COUNT(*) AS productos_count FROM producto WHERE visibilidad = 1 GROUP BY id_comunidad) p ON p.id_comunidad = c.id_comunidad
       LEFT JOIN (SELECT id_comunidad, COUNT(*) AS publicaciones_count FROM publicacion WHERE visibilidad = 1 GROUP BY id_comunidad) pub ON pub.id_comunidad = c.id_comunidad
       LEFT JOIN (SELECT id_comunidad, COUNT(*) AS rutas_count FROM ruta WHERE visibilidad = 1 GROUP BY id_comunidad) rutas ON rutas.id_comunidad = c.id_comunidad
       LEFT JOIN (SELECT id_comunidad, COUNT(*) AS habitantes_count FROM miembro WHERE status = 'activo' GROUP BY id_comunidad) h ON h.id_comunidad = c.id_comunidad
       WHERE c.visibilidad = 1
       ORDER BY combined_score DESC
       LIMIT 4`
    );

    const ids = comunidadesRows.map((r) => r.id_comunidad);

    let mediaRows = [];
    let redesRows = [];

    if (ids.length > 0) {
      const [mRows] = await pool.query(
        `SELECT id_comunidad, media_dir, ` + "`index`" + `
         FROM comunidad_media
         WHERE id_comunidad IN (?)
         ORDER BY id_comunidad ASC, ` + "`index`" + ` ASC`,
        [ids]
      );
      mediaRows = mRows;

      const [rRows] = await pool.query(
        `SELECT id_comunidad, red_social, usuario, link
         FROM red_comunidad
         WHERE id_comunidad IN (?)
         ORDER BY id_comunidad ASC`,
        [ids]
      );
      redesRows = rRows;
    }

    // Mapear media por comunidad
    const mediaByComunidad = new Map();
    mediaRows.forEach((row) => {
      if (!mediaByComunidad.has(row.id_comunidad)) {
        mediaByComunidad.set(row.id_comunidad, []);
      }
      mediaByComunidad.get(row.id_comunidad).push(row);
    });

    // Mapear redes por comunidad
    const redesByComunidad = new Map();
    redesRows.forEach((row) => {
      if (!redesByComunidad.has(row.id_comunidad)) {
        redesByComunidad.set(row.id_comunidad, []);
      }
      redesByComunidad.get(row.id_comunidad).push(row);
    });

    const payload = comunidadesRows.map((comunidad) => {
      const media = mediaByComunidad.get(comunidad.id_comunidad) || [];
      const galeria = media.map((item) => item.media_dir).filter(Boolean);
      const portada = galeria.length > 0 ? galeria[0] : (comunidad.portada_dir || comunidad.logo_dir || '');

      return {
        id: String(comunidad.id_comunidad),
        slug: slugify(comunidad.nombre),
        nombre: comunidad.nombre,
        municipioId: String(comunidad.id_municipio),
        descripcion: comunidad.descripcion || '',
        logo: comunidad.logo_dir || undefined,
        portada: portada,
        galeria: galeria,
        contacto: {
          telefono: comunidad.numero_contacto || '',
          correo: '',
          whatsapp: '',
        },
        redes: (redesByComunidad.get(comunidad.id_comunidad) || []).map((red) => ({
          red_social: red.red_social,
          usuario: red.usuario || undefined,
          link: red.link || undefined,
        })),
        fundacion: comunidad.fecha_fundacion ? String(comunidad.fecha_fundacion) : '',
        habitantes: Number(comunidad.habitantes_count || 0),
        direccion: comunidad.direccion || undefined,
        coordenadas: comunidad.coordenadas || undefined,
      };
    });

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

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

    const [rutasRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM ruta WHERE visibilidad = 1`
    );

    const indicadores = [
      {
        label: 'Comunidades activas',
        valor: Number(comunidadesRows[0]?.total || 0),
        sufijo: '+',
      },
      {
        label: 'Municipios con comunidades',
        valor: Number(municipiosRows[0]?.total || 0),
        sufijo: '+',
      },
      {
        label: 'Artesanos activos',
        valor: Number(miembrosRows[0]?.total || 0),
        sufijo: '+',
      },
      {
        label: 'Productos disponibles',
        valor: Number(productosRows[0]?.total || 0),
        sufijo: '+',
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
