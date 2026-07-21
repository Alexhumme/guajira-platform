const express = require('express');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'rutas');

function ensureUploadsDir() {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function sanitizeFileName(name) {
  return String(name || 'media')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT r.id_ruta, r.id_comunidad, c.nombre AS comunidad, r.nombre, r.descripcion, r.distancia, r.duracion, r.dificultad, r.tipo_experiencia, r.portada_dir, r.visibilidad, r.fecha_registro, r.created_at, r.updated_at ' +
      'FROM ruta r ' +
      'JOIN comunidad c ON c.id_comunidad = r.id_comunidad ' +
      'ORDER BY r.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/media', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_ruta_media, id_ruta, media_dir, `index` FROM ruta_media WHERE id_ruta = ? ORDER BY `index` ASC, created_at ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/media', async (req, res, next) => {
  try {
    const { media_dir = null, index = 0, fileName, fileData } = req.body || {};
    let resolvedMediaDir = media_dir;

    if (fileData) {
      ensureUploadsDir();
      const matches = /^data:(image\/[a-zA-Z0-9.+-]+|video\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(fileData);
      if (!matches) {
        return res.status(400).json({ message: 'Formato de archivo no soportado' });
      }

      const extension = path.extname(fileName || 'media.bin') || '.bin';
      const safeName = `${Date.now()}-${sanitizeFileName(path.basename(fileName || 'media', extension))}${extension}`;
      const buffer = Buffer.from(matches[2], 'base64');
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);
      resolvedMediaDir = `/uploads/rutas/${safeName}`;
    }

    if (!resolvedMediaDir) {
      return res.status(400).json({ message: 'media_dir requerido' });
    }

    const id_ruta_media = randomUUID();
    await pool.query(
      'INSERT INTO ruta_media (id_ruta_media, id_ruta, media_dir, `index`, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [id_ruta_media, req.params.id, resolvedMediaDir, Number(index) || 0]
    );

    res.status(201).json({ id_ruta_media, id_ruta: req.params.id, media_dir: resolvedMediaDir, index: Number(index) || 0 });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/media/:mediaId', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM ruta_media WHERE id_ruta_media = ? AND id_ruta = ?', [req.params.mediaId, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      id_comunidad,
      nombre,
      descripcion = null,
      duracion = null,
      distancia = null,
      dificultad = 'Media',
      tipo_experiencia = null,
      portada_dir = null,
      visibilidad = true,
      fecha_registro = null,
    } = req.body || {};

    if (!id_comunidad || !nombre) {
      return res.status(400).json({ message: 'id_comunidad y nombre son requeridos' });
    }

    const id_ruta = randomUUID();
    await pool.query(
      'INSERT INTO ruta (id_ruta, id_comunidad, nombre, descripcion, duracion, distancia, dificultad, tipo_experiencia, portada_dir, visibilidad, fecha_registro, created_at, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), NOW(), NOW())',
      [id_ruta, id_comunidad, nombre, descripcion, duracion, distancia, dificultad, tipo_experiencia, portada_dir, visibilidad ? 1 : 0, fecha_registro]
    );

    res.status(201).json({ id_ruta, id_comunidad, nombre, descripcion, duracion, distancia, dificultad, tipo_experiencia, portada_dir, visibilidad: Boolean(visibilidad) });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      id_comunidad,
      nombre,
      descripcion = null,
      duracion = null,
      distancia = null,
      dificultad = 'Media',
      tipo_experiencia = null,
      portada_dir = null,
      visibilidad = true,
      fecha_registro = null,
    } = req.body || {};

    if (!id_comunidad || !nombre) {
      return res.status(400).json({ message: 'id_comunidad y nombre son requeridos' });
    }

    const [result] = await pool.query(
      'UPDATE ruta SET id_comunidad = ?, nombre = ?, descripcion = ?, duracion = ?, distancia = ?, dificultad = ?, tipo_experiencia = ?, portada_dir = ?, visibilidad = ?, fecha_registro = COALESCE(?, fecha_registro), updated_at = NOW() WHERE id_ruta = ?',
      [id_comunidad, nombre, descripcion, duracion, distancia, dificultad, tipo_experiencia, portada_dir, visibilidad ? 1 : 0, fecha_registro, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });

    res.json({ id_ruta: req.params.id, id_comunidad, nombre, descripcion, duracion, distancia, dificultad, tipo_experiencia, portada_dir, visibilidad: Boolean(visibilidad) });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM ruta WHERE id_ruta = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
