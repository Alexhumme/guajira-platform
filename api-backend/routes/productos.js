const express = require('express');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'productos');

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
      'SELECT p.id_producto, p.id_miembro, m.nombres AS miembro, c.nombre AS comunidad, ' +
      'p.id_tipo_producto, tp.nombre AS tipo_producto, p.nombre, p.precio, p.descripcion, ' +
      'p.visibilidad, p.fecha_registro, p.created_at, p.updated_at ' +
      'FROM producto p ' +
      'JOIN miembro m ON m.id_miembro = p.id_miembro ' +
      'JOIN comunidad c ON c.id_comunidad = m.id_comunidad ' +
      'JOIN tipo_producto tp ON tp.id_tipo_producto = p.id_tipo_producto ' +
      'ORDER BY p.id_producto DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/media', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_producto_media, id_producto, media_dir, `index` FROM producto_media WHERE id_producto = ? ORDER BY `index` ASC, created_at ASC',
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
      resolvedMediaDir = `/uploads/productos/${safeName}`;
    }

    if (!resolvedMediaDir) {
      return res.status(400).json({ message: 'media_dir requerido' });
    }

    const id_producto_media = randomUUID();
    await pool.query(
      'INSERT INTO producto_media (id_producto_media, id_producto, media_dir, `index`, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [id_producto_media, req.params.id, resolvedMediaDir, Number(index) || 0]
    );

    res.status(201).json({ id_producto_media, id_producto: req.params.id, media_dir: resolvedMediaDir, index: Number(index) || 0 });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id/media/:mediaId', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM producto_media WHERE id_producto_media = ? AND id_producto = ?', [req.params.mediaId, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const {
      id_miembro,
      id_tipo_producto,
      nombre,
      precio,
      descripcion = null,
      visibilidad = true,
      fecha_registro = null,
    } = req.body || {};
    const precioNumerico = Number(precio);

    if (!id_miembro || !id_tipo_producto || !nombre || !Number.isFinite(precioNumerico) || precioNumerico < 0) {
      return res.status(400).json({ message: 'miembro, tipo, nombre y precio valido son requeridos' });
    }

    const [result] = await pool.query(
      'INSERT INTO producto (id_miembro, id_tipo_producto, nombre, precio, descripcion, visibilidad, fecha_registro, created_at, updated_at) ' +
      'VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, CURRENT_DATE), NOW(), NOW())',
      [id_miembro, id_tipo_producto, nombre, precioNumerico, descripcion, visibilidad ? 1 : 0, fecha_registro]
    );
    res.status(201).json({ id_producto: result.insertId, id_miembro, id_tipo_producto, nombre, precio: precioNumerico });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const {
      id_miembro,
      id_tipo_producto,
      nombre,
      precio,
      descripcion = null,
      visibilidad = true,
    } = req.body || {};
    const precioNumerico = Number(precio);

    if (!id_miembro || !id_tipo_producto || !nombre || !Number.isFinite(precioNumerico) || precioNumerico < 0) {
      return res.status(400).json({ message: 'miembro, tipo, nombre y precio valido son requeridos' });
    }

    const [result] = await pool.query(
      'UPDATE producto SET id_miembro = ?, id_tipo_producto = ?, nombre = ?, precio = ?, descripcion = ?, visibilidad = ?, updated_at = NOW() WHERE id_producto = ?',
      [id_miembro, id_tipo_producto, nombre, precioNumerico, descripcion, visibilidad ? 1 : 0, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ id_producto: Number(req.params.id), id_miembro, id_tipo_producto, nombre, precio: precioNumerico });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM producto WHERE id_producto = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
