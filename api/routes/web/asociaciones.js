const express = require('express');
const pool = require('../../config/db');

const router = express.Router();

router.get('/asociaciones', async (req, res, next) => {
  try {
    const [asociacionesRows] = await pool.query(
      `SELECT id_asociacion, nombre, acronimo, telefono, correo, logo_dir, descripcion,
              nombre_representante_sena, telefono_representante_sena,
              correo_representante_sena
       FROM asociacion
       WHERE visibilidad = 1
       ORDER BY nombre ASC`
    );

    if (!asociacionesRows.length) return res.json([]);

    const ids = asociacionesRows.map((asociacion) => asociacion.id_asociacion);
    const [comunidadesRows] = await pool.query(
      `SELECT ac.id_asociacion, ac.id_comunidad
       FROM asociacion_comunidad ac
       JOIN comunidad c ON c.id_comunidad = ac.id_comunidad
       WHERE ac.id_asociacion IN (?) AND c.visibilidad = 1
       ORDER BY ac.id_comunidad ASC`,
      [ids]
    );
    const [representantesRows] = await pool.query(
      `SELECT mr.id_asociacion, m.id_miembro, m.nombres, m.numero_contacto,
              m.email_contacto, c.nombre AS comunidad
       FROM miembro_representante mr
       JOIN miembro m ON m.id_miembro = mr.id_miembro
       JOIN comunidad c ON c.id_comunidad = m.id_comunidad
       WHERE mr.id_asociacion IN (?) AND m.status = 'activo'
       ORDER BY m.nombres ASC`,
      [ids]
    );
    const [redesRows] = await pool.query(
      `SELECT id_asociacion, red_social, usuario, link
       FROM red_asociacion
       WHERE id_asociacion IN (?)
       ORDER BY id_red_asociacion ASC`,
      [ids]
    );

    const comunidadesPorAsociacion = new Map();
    comunidadesRows.forEach((row) => {
      if (!comunidadesPorAsociacion.has(row.id_asociacion)) {
        comunidadesPorAsociacion.set(row.id_asociacion, []);
      }
      comunidadesPorAsociacion.get(row.id_asociacion).push(String(row.id_comunidad));
    });

    const representantesPorAsociacion = new Map();
    representantesRows.forEach((row) => {
      if (!representantesPorAsociacion.has(row.id_asociacion)) {
        representantesPorAsociacion.set(row.id_asociacion, []);
      }
      representantesPorAsociacion.get(row.id_asociacion).push({
        id: String(row.id_miembro),
        nombre: row.nombres,
        comunidad: row.comunidad,
        telefono: row.numero_contacto || '',
        correo: row.email_contacto || '',
      });
    });

    const redesPorAsociacion = new Map();
    redesRows.forEach((row) => {
      if (!redesPorAsociacion.has(row.id_asociacion)) {
        redesPorAsociacion.set(row.id_asociacion, []);
      }
      redesPorAsociacion.get(row.id_asociacion).push({
        red_social: row.red_social,
        usuario: row.usuario || undefined,
        link: row.link || undefined,
      });
    });

    res.json(asociacionesRows.map((asociacion) => ({
      id: asociacion.id_asociacion,
      nombre: asociacion.nombre,
      acronimo: asociacion.acronimo || '',
      telefono: asociacion.telefono || '',
      correo: asociacion.correo || '',
      logo: asociacion.logo_dir || '',
      descripcion: asociacion.descripcion || '',
      representanteSena: {
        nombre: asociacion.nombre_representante_sena || '',
        telefono: asociacion.telefono_representante_sena || '',
        correo: asociacion.correo_representante_sena || '',
      },
      comunidadesIds: comunidadesPorAsociacion.get(asociacion.id_asociacion) || [],
      representantes: representantesPorAsociacion.get(asociacion.id_asociacion) || [],
      redes: redesPorAsociacion.get(asociacion.id_asociacion) || [],
    })));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
