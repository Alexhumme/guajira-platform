const express = require('express');
const router = express.Router();
const slugify = require('../../utils/slugify');
const pool = require('../../config/db');

function mapCategoria(nombre) {
  const normalized = String(nombre || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  if (normalized.includes('artesania')) return 'Artesanías';
  if (normalized.includes('panaderia')) return 'Panaderia';
  if (normalized.includes('gastronomia')) return 'Gastronomía';
  if (normalized.includes('agricultura') || normalized.includes('agronomia')) return 'Agricultura';
  if (normalized.includes('pesca')) return 'Pesca';
  if (normalized.includes('turismo')) return 'Turismo';
  return 'Otros';
}

async function getProductosPublicos(idProducto = null) {
  const params = [];
  let where = 'WHERE p.visibilidad = 1';

  if (idProducto !== null) {
    where += ' AND p.id_producto = ?';
    params.push(idProducto);
  }

  const [productosRows] = await pool.query(
    `SELECT p.id_producto, p.nombre, p.descripcion, p.precio,
            tp.nombre AS tipo_producto, m.id_comunidad, m.nombres AS artesano
     FROM producto p
     JOIN miembro m ON m.id_miembro = p.id_miembro
     JOIN tipo_producto tp ON tp.id_tipo_producto = p.id_tipo_producto
     ${where}
     ORDER BY p.id_producto DESC`,
    params
  );

  if (productosRows.length === 0) return [];

  const ids = productosRows.map((producto) => producto.id_producto);
  const [mediaRows] = await pool.query(
    `SELECT id_producto, media_dir
     FROM producto_media
     WHERE id_producto IN (?)
     ORDER BY id_producto ASC, \`index\` ASC, created_at ASC`,
    [ids]
  );

  const imagenesPorProducto = new Map();
  mediaRows.forEach((media) => {
    if (!imagenesPorProducto.has(media.id_producto)) {
      imagenesPorProducto.set(media.id_producto, []);
    }
    if (media.media_dir) {
      imagenesPorProducto.get(media.id_producto).push(media.media_dir);
    }
  });

  return productosRows.map((producto) => ({
    id: String(producto.id_producto),
    slug: slugify(producto.nombre),
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    categoria: mapCategoria(producto.tipo_producto),
    precio: Number(producto.precio),
    comunidadId: String(producto.id_comunidad),
    artesano: producto.artesano || '',
    imagenes: imagenesPorProducto.get(producto.id_producto) || [],
  }));
}

// GET /api/web-client/productos - Devuelve los productos visibles en el formato del web-client
router.get('/productos', async (req, res, next) => {
  try {
    res.json(await getProductosPublicos());
  } catch (err) {
    next(err);
  }
});

// GET /api/web-client/productos/:id - Devuelve un producto visible en el formato del web-client
router.get('/productos/:id', async (req, res, next) => {
  try {
    const [producto] = await getProductosPublicos(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    next(err);
  }
});

module.exports = router;