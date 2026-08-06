const express = require('express');
const router = express.Router();
const slugify = require('../../utils/slugify');
const pool = require('../../config/db');

// GET /api/web-client/posts - Devuelve los posts visibles para el web-client
router.get('/posts', async (req, res, next) => {

  const { comunidadId } = req.query;

  try {

    // Build SQL with optional filter before ORDER BY to avoid invalid SQL
    let sql = `SELECT p.id_post, m.nombres AS autor, `
      //+`m.avatar_dir AS avatar, `
      +`c.nombre AS comunidad, p.fecha_registro AS fecha, p.descripcion AS contenido, p.likes
       FROM post p
       JOIN miembro m ON m.id_miembro = p.id_miembro
       JOIN comunidad c ON m.id_comunidad = c.id_comunidad
       WHERE p.visibilidad = 1`

    const params = [];

    if (comunidadId) {
      sql += ' AND c.id_comunidad = ?';
      params.push(comunidadId);
    }

    sql += ' ORDER BY p.fecha_registro DESC'

    const [rows] = await pool.query(sql, params);

    const payload = rows.map((post) => ({
      id: String(post.id_post),
      autor: post.autor,
      avatar: null,//post.avatar,
      comunidadSlug: slugify(post.comunidad),
      comunidadNombre: post.comunidad,
      fecha: String(post.fecha),
      contenido: post.contenido || '',
      imagenes: [],
      likes: Number(post.likes || 0),
    }));

    await Promise.all(
      payload.map(async (post) => {
        const [mediaRows] = await pool.query(
          `SELECT media_dir
          FROM post_media
          WHERE id_post = ?
          ORDER BY \`index\` ASC`,
          [post.id]
        );

        post.imagenes = mediaRows
          .map((media) => media.media_dir)
          .filter(Boolean);
      })
    );

    res.json(payload);

  } catch (err) {
    next(err);
  }
});

// GET /api/web-client/posts/recent - Devuelve los posts recientes visibles para el web-client
router.get('/posts/recent', async (req, res, next) => {

  const { comunidadId } = req.query;

  try {

    // Build SQL with optional filter before ORDER BY to avoid invalid SQL
    let sql = `SELECT p.id_post, m.nombres AS autor, `
      +`m.avatar_dir AS avatar, `
      +`c.nombre AS comunidad, p.fecha_registro AS fecha, p.descripcion AS contenido, p.likes
       FROM post p
       JOIN miembro m ON m.id_miembro = p.id_miembro
       JOIN comunidad c ON m.id_comunidad = c.id_comunidad
       WHERE p.visibilidad = 1`

    const params = [];

    if (comunidadId) {
      sql += ' AND c.id_comunidad = ?';
      params.push(comunidadId);
    }

    sql += ' ORDER BY p.fecha_registro DESC LIMIT 3'

    const [rows] = await pool.query(sql, params);

    const payload = rows.map((post) => ({
      id: String(post.id_post),
      autor: post.autor,
      avatar: post.avatar,
      comunidadSlug: slugify(post.comunidad),
      comunidadNombre: post.comunidad,
      fecha: String(post.fecha),
      contenido: post.contenido || '',
      imagenes: [],
      likes: Number(post.likes || 0),
    }));

    await Promise.all(
      payload.map(async (post) => {
        const [mediaRows] = await pool.query(
          `SELECT media_dir
          FROM post_media
          WHERE id_post = ?
          ORDER BY \`index\` ASC`,
          [post.id]
        );

        post.imagenes = mediaRows
          .map((media) => media.media_dir)
          .filter(Boolean);
      })
    );

    res.json(payload);

  } catch (err) {
    next(err);
  }
});

module.exports = router;