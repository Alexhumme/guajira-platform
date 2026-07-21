const express = require('express');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'comunidades');

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
      'SELECT c.id_comunidad, c.nombre, c.id_municipio, m.nombre AS municipio, c.logo_dir, c.portada_dir, c.descripcion, c.direccion, c.coordenadas, c.numero_contacto, c.visibilidad, c.fecha_fundacion, c.fecha_registro, c.created_at, c.updated_at ' +
      'FROM comunidad c JOIN municipio m ON m.id_municipio = c.id_municipio ' +
      'ORDER BY c.id_comunidad DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/upload', async (req, res, next) => {
  try {
    const { fileData, fileName, media_dir = null } = req.body || {};
    if (media_dir) {
      return res.status(201).json({ path: media_dir });
    }
    if (!fileData) {
      return res.status(400).json({ message: 'fileData requerido' });
    }

    const matches = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(fileData);
    if (!matches) {
      return res.status(400).json({ message: 'Formato de archivo no soportado' });
    }

    ensureUploadsDir();
    const extension = path.extname(fileName || 'media.bin') || '.bin';
    const safeName = `${Date.now()}-${sanitizeFileName(path.basename(fileName || 'media', extension))}${extension}`;
    const buffer = Buffer.from(matches[2], 'base64');
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    res.status(201).json({ path: `/uploads/comunidades/${safeName}` });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/redes', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id_red_comunidad, id_comunidad, red_social, usuario, link FROM red_comunidad WHERE id_comunidad = ? ORDER BY created_at ASC', [req.params.id]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/:id/redes', async (req, res, next) => {
  try {
    const { red_social, usuario = null, link = null } = req.body || {};
    if (!red_social) return res.status(400).json({ message: 'red_social requerido' });
    const id_red_comunidad = randomUUID();
    await pool.query('INSERT INTO red_comunidad (id_red_comunidad, id_comunidad, red_social, usuario, link, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())', [id_red_comunidad, req.params.id, red_social, usuario, link]);
    res.status(201).json({ id_red_comunidad, id_comunidad: req.params.id, red_social, usuario, link });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/redes/:redId', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM red_comunidad WHERE id_red_comunidad = ? AND id_comunidad = ?', [req.params.redId, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

router.get('/:id/media', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id_comunidad_media, id_comunidad, media_dir, `index` FROM comunidad_media WHERE id_comunidad = ? ORDER BY `index` ASC, created_at ASC', [req.params.id]);
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
      resolvedMediaDir = `/uploads/comunidades/${safeName}`;
    }

    if (!resolvedMediaDir) {
      return res.status(400).json({ message: 'media_dir requerido' });
    }

    const id_comunidad_media = randomUUID();
    await pool.query('INSERT INTO comunidad_media (id_comunidad_media, id_comunidad, media_dir, `index`, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', [id_comunidad_media, req.params.id, resolvedMediaDir, Number(index) || 0]);

    res.status(201).json({ id_comunidad_media, id_comunidad: req.params.id, media_dir: resolvedMediaDir, index: Number(index) || 0 });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/media/:mediaId', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM comunidad_media WHERE id_comunidad_media = ? AND id_comunidad = ?', [req.params.mediaId, req.params.id]);
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
      id_municipio,
      logo_dir = null,
      portada_dir = null,
      descripcion = null,
      direccion = null,
      coordenadas = null,
      numero_contacto = null,
      visibilidad = true,
      fecha_fundacion = null,
      fecha_registro = null,
    } = req.body || {};
    if (!nombre || !id_municipio) return res.status(400).json({ message: 'nombre e id_municipio requeridos' });

    const [result] = await pool.query(
      'INSERT INTO comunidad (nombre, id_municipio, logo_dir, portada_dir, descripcion, direccion, coordenadas, numero_contacto, visibilidad, fecha_fundacion, fecha_registro, created_at, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), NOW(), NOW())',
      [nombre, id_municipio, logo_dir, portada_dir, descripcion, direccion, coordenadas, numero_contacto, visibilidad ? 1 : 0, fecha_fundacion, fecha_registro]
    );
    res.status(201).json({ id_comunidad: result.insertId, nombre, id_municipio, logo_dir, portada_dir });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      nombre,
      id_municipio,
      logo_dir = null,
      portada_dir = null,
      descripcion = null,
      direccion = null,
      coordenadas = null,
      numero_contacto = null,
      visibilidad = true,
      fecha_fundacion = null,
    } = req.body || {};
    if (!nombre || !id_municipio) return res.status(400).json({ message: 'nombre e id_municipio requeridos' });

    const [result] = await pool.query(
      'UPDATE comunidad SET nombre = ?, id_municipio = ?, logo_dir = ?, portada_dir = ?, descripcion = ?, direccion = ?, coordenadas = ?, numero_contacto = ?, visibilidad = ?, fecha_fundacion = ?, updated_at = NOW() WHERE id_comunidad = ?',
      [nombre, id_municipio, logo_dir, portada_dir, descripcion, direccion, coordenadas, numero_contacto, visibilidad ? 1 : 0, fecha_fundacion, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_comunidad: req.params.id, nombre, id_municipio, logo_dir, portada_dir });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM comunidad WHERE id_comunidad = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
