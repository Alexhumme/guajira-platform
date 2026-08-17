const express = require('express');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const pool = require('../../config/db');
const { requireAdmin } = require('../../middleware/auth');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'asociaciones');

function ensureUploadsDir() {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function sanitizeFileName(name) {
  return String(name || 'logo')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function duplicateRelationshipError(res, message) {
  return res.status(409).json({ message });
}

router.use(requireAdmin);

router.get('/uploads', async (req, res, next) => {
  try {
    ensureUploadsDir();
    const entries = fs.readdirSync(uploadsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => `/uploads/asociaciones/${entry.name}`)
      .sort();
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

router.post('/upload', async (req, res, next) => {
  try {
    const { fileData, fileName } = req.body || {};
    if (!fileData || !fileName) {
      return res.status(400).json({ message: 'fileData y fileName son requeridos' });
    }

    const matches = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(fileData);
    if (!matches) {
      return res.status(400).json({ message: 'Formato de archivo no soportado' });
    }

    ensureUploadsDir();
    const extension = path.extname(fileName) || '.png';
    const safeName = `${Date.now()}-${sanitizeFileName(path.basename(fileName, extension))}${extension}`;
    fs.writeFileSync(path.join(uploadsDir, safeName), Buffer.from(matches[2], 'base64'));

    res.status(201).json({ path: `/uploads/asociaciones/${safeName}` });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id_asociacion, a.nombre, a.acronimo, a.telefono, a.correo, a.logo_dir,
              a.descripcion, a.nombre_representante_sena, a.telefono_representante_sena,
              a.correo_representante_sena, a.visibilidad, a.fecha_registro,
              COUNT(DISTINCT ac.id_asociacion_comunidad) AS comunidades_count,
              COUNT(DISTINCT mr.id_miembro_representante) AS representantes_count
       FROM asociacion a
       LEFT JOIN asociacion_comunidad ac ON ac.id_asociacion = a.id_asociacion
       LEFT JOIN miembro_representante mr ON mr.id_asociacion = a.id_asociacion
       GROUP BY a.id_asociacion
       ORDER BY a.nombre ASC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/comunidades', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT ac.id_asociacion_comunidad, ac.id_asociacion, ac.id_comunidad, c.nombre AS comunidad
       FROM asociacion_comunidad ac
       JOIN comunidad c ON c.id_comunidad = ac.id_comunidad
       WHERE ac.id_asociacion = ?
       ORDER BY c.nombre ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/comunidades', async (req, res, next) => {
  try {
    const { id_comunidad } = req.body || {};
    if (!id_comunidad) return res.status(400).json({ message: 'id_comunidad requerido' });

    const [existing] = await pool.query(
      'SELECT id_asociacion_comunidad FROM asociacion_comunidad WHERE id_asociacion = ? AND id_comunidad = ?',
      [req.params.id, id_comunidad]
    );
    if (existing.length) return duplicateRelationshipError(res, 'La comunidad ya está vinculada a la asociación');

    const id_asociacion_comunidad = randomUUID();
    await pool.query(
      'INSERT INTO asociacion_comunidad (id_asociacion_comunidad, id_asociacion, id_comunidad) VALUES (?, ?, ?)',
      [id_asociacion_comunidad, req.params.id, id_comunidad]
    );
    res.status(201).json({ id_asociacion_comunidad, id_asociacion: req.params.id, id_comunidad });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/comunidades/:relationshipId', async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM asociacion_comunidad WHERE id_asociacion_comunidad = ? AND id_asociacion = ?',
      [req.params.relationshipId, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/representantes', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT mr.id_miembro_representante, mr.id_asociacion, mr.id_miembro,
              m.nombres AS miembro, c.nombre AS comunidad
       FROM miembro_representante mr
       JOIN miembro m ON m.id_miembro = mr.id_miembro
       JOIN comunidad c ON c.id_comunidad = m.id_comunidad
       WHERE mr.id_asociacion = ?
       ORDER BY m.nombres ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/representantes', async (req, res, next) => {
  try {
    const { id_miembro } = req.body || {};
    if (!id_miembro) return res.status(400).json({ message: 'id_miembro requerido' });

    const [existing] = await pool.query(
      'SELECT id_miembro_representante FROM miembro_representante WHERE id_asociacion = ? AND id_miembro = ?',
      [req.params.id, id_miembro]
    );
    if (existing.length) return duplicateRelationshipError(res, 'El miembro ya representa a la asociación');

    const id_miembro_representante = randomUUID();
    await pool.query(
      'INSERT INTO miembro_representante (id_miembro_representante, id_asociacion, id_miembro) VALUES (?, ?, ?)',
      [id_miembro_representante, req.params.id, id_miembro]
    );
    res.status(201).json({ id_miembro_representante, id_asociacion: req.params.id, id_miembro });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/representantes/:relationshipId', async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM miembro_representante WHERE id_miembro_representante = ? AND id_asociacion = ?',
      [req.params.relationshipId, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/redes', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_red_asociacion, id_asociacion, red_social, usuario, link FROM red_asociacion WHERE id_asociacion = ? ORDER BY id_red_asociacion ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/redes', async (req, res, next) => {
  try {
    const { red_social, usuario = null, link = null } = req.body || {};
    if (!red_social) return res.status(400).json({ message: 'red_social requerido' });

    const id_red_asociacion = randomUUID();
    await pool.query(
      'INSERT INTO red_asociacion (id_red_asociacion, id_asociacion, red_social, usuario, link) VALUES (?, ?, ?, ?, ?)',
      [id_red_asociacion, req.params.id, red_social, usuario, link]
    );
    res.status(201).json({ id_red_asociacion, id_asociacion: req.params.id, red_social, usuario, link });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/redes/:redId', async (req, res, next) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM red_asociacion WHERE id_red_asociacion = ? AND id_asociacion = ?',
      [req.params.redId, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      nombre,
      acronimo = null,
      telefono = null,
      correo = null,
      logo_dir = null,
      descripcion = null,
      nombre_representante_sena = null,
      telefono_representante_sena = null,
      correo_representante_sena = null,
      visibilidad = true,
    } = req.body || {};
    if (!nombre) return res.status(400).json({ message: 'nombre requerido' });

    const id_asociacion = randomUUID();
    await pool.query(
      `INSERT INTO asociacion (
        id_asociacion, nombre, acronimo, telefono, correo, logo_dir, descripcion,
        nombre_representante_sena, telefono_representante_sena, correo_representante_sena,
        visibilidad, fecha_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE)`,
      [
        id_asociacion, nombre, acronimo, telefono, correo, logo_dir, descripcion,
        nombre_representante_sena, telefono_representante_sena, correo_representante_sena,
        visibilidad ? 1 : 0,
      ]
    );
    res.status(201).json({ id_asociacion, nombre, acronimo, logo_dir });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      nombre,
      acronimo = null,
      telefono = null,
      correo = null,
      logo_dir = null,
      descripcion = null,
      nombre_representante_sena = null,
      telefono_representante_sena = null,
      correo_representante_sena = null,
      visibilidad = true,
    } = req.body || {};
    if (!nombre) return res.status(400).json({ message: 'nombre requerido' });

    const [result] = await pool.query(
      `UPDATE asociacion SET
        nombre = ?, acronimo = ?, telefono = ?, correo = ?, logo_dir = ?, descripcion = ?,
        nombre_representante_sena = ?, telefono_representante_sena = ?,
        correo_representante_sena = ?, visibilidad = ?
       WHERE id_asociacion = ?`,
      [
        nombre, acronimo, telefono, correo, logo_dir, descripcion,
        nombre_representante_sena, telefono_representante_sena,
        correo_representante_sena, visibilidad ? 1 : 0, req.params.id,
      ]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_asociacion: req.params.id, nombre, acronimo, logo_dir });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM asociacion WHERE id_asociacion = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
