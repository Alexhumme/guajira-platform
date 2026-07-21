const express = require('express');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'icons');

function ensureUploadsDir() {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function sanitizeFileName(name) {
  return String(name || 'icono')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_categoria_turistica, nombre, icono_dir, created_at, updated_at FROM categoria_turistica ORDER BY nombre ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.get('/icons', async (req, res, next) => {
  try {
    ensureUploadsDir();
    const entries = fs.readdirSync(uploadsDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => `/uploads/icons/${entry.name}`)
      .sort();
    res.json(entries);
  } catch (err) {
    next(err);
  }
});

router.post('/upload', async (req, res, next) => {
  try {
    const { fileName, fileData } = req.body || {};
    if (!fileData) {
      return res.status(400).json({ message: 'fileData requerido' });
    }

    ensureUploadsDir();
    const matches = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(fileData);
    if (!matches) {
      return res.status(400).json({ message: 'Formato de imagen no soportado' });
    }

    const extension = path.extname(fileName || 'icono.png') || '.png';
    const safeName = `${Date.now()}-${sanitizeFileName(path.basename(fileName || 'icono.png', extension))}${extension}`;
    const buffer = Buffer.from(matches[2], 'base64');
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);

    res.json({ path: `/uploads/icons/${safeName}` });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { nombre, icono_dir = null } = req.body || {};

    if (!nombre) {
      return res.status(400).json({ message: 'nombre requerido' });
    }

    const id_categoria_turistica = randomUUID();
    await pool.query(
      'INSERT INTO categoria_turistica (id_categoria_turistica, nombre, icono_dir, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [id_categoria_turistica, nombre, icono_dir]
    );

    res.status(201).json({ id_categoria_turistica, nombre, icono_dir });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { nombre, icono_dir = null } = req.body || {};

    if (!nombre) {
      return res.status(400).json({ message: 'nombre requerido' });
    }

    const [result] = await pool.query(
      'UPDATE categoria_turistica SET nombre = ?, icono_dir = ?, updated_at = NOW() WHERE id_categoria_turistica = ?',
      [nombre, icono_dir, req.params.id]
    );

    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });

    res.json({ id_categoria_turistica: req.params.id, nombre, icono_dir });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM categoria_turistica WHERE id_categoria_turistica = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
