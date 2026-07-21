const express = require('express');
const ExcelJS = require('exceljs');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAdmin);

const exportTables = [
  { name: 'admins', query: 'SELECT id_admin, username, active, created_at, updated_at FROM admin ORDER BY id_admin' },
  { name: 'roles', query: 'SELECT * FROM rol ORDER BY id_rol' },
  { name: 'tipos_producto', query: 'SELECT * FROM tipo_producto ORDER BY id_tipo_producto' },
  { name: 'departamentos', query: 'SELECT * FROM departamento ORDER BY id_departamento' },
  { name: 'municipios', query: 'SELECT * FROM municipio ORDER BY id_municipio' },
  { name: 'comunidades', query: 'SELECT * FROM comunidad ORDER BY id_comunidad' },
  { name: 'miembros', query: 'SELECT * FROM miembro ORDER BY id_miembro' },
  { name: 'productos', query: 'SELECT * FROM producto ORDER BY id_producto' },
  { name: 'categorias_turisticas', query: 'SELECT * FROM categoria_turistica ORDER BY id_categoria_turistica' },
  { name: 'posts', query: 'SELECT * FROM post ORDER BY id_post' },
  { name: 'post_media', query: 'SELECT * FROM post_media ORDER BY id_post_media' },
  { name: 'producto_media', query: 'SELECT * FROM producto_media ORDER BY id_producto_media' },
  { name: 'rutas', query: 'SELECT * FROM ruta ORDER BY id_ruta' },
  { name: 'ruta_media', query: 'SELECT * FROM ruta_media ORDER BY id_ruta_media' },
];

router.get('/', async (req, res, next) => {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Guajira Platform';
    workbook.created = new Date();

    for (const table of exportTables) {
      const [rows] = await pool.query(table.query);
      const sheet = workbook.addWorksheet(table.name);

      if (!rows.length) {
        sheet.addRow(['No hay datos disponibles']);
        continue;
      }

      const headers = Object.keys(rows[0]);
      sheet.addRow(headers);
      rows.forEach((row) => {
        sheet.addRow(headers.map((key) => row[key]));
      });
      sheet.columns.forEach((column) => {
        column.width = Math.max(15, String(column.header).length + 4);
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="guajira-export.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
