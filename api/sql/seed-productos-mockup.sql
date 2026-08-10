USE guajira_platform;

-- Productos de prueba. Requiere que miembros y tipos de producto ya existan.
INSERT INTO producto (id_miembro, id_tipo_producto, nombre, precio, descripcion, visibilidad, fecha_registro, created_at, updated_at)
SELECT m.id_miembro, tp.id_tipo_producto, p.nombre, p.precio, p.descripcion, 1, CURRENT_DATE, NOW(), NOW()
FROM (
  SELECT 1001234568 AS cedula, 'Artesania' AS tipo, 'Mochila Wayuu tradicional' AS nombre, 120000.00 AS precio, 'Mochila tejida a mano con motivos tradicionales.' AS descripcion UNION ALL
  SELECT 1001234569, 'Artesania', 'Aretes artesanales', 35000.00, 'Aretes elaborados a mano.' UNION ALL
  SELECT 1001234571, 'Pesca', 'Pescado seco artesanal', 28000.00, 'Producto de pesca preparado de forma tradicional.' UNION ALL
  SELECT 1001234572, 'Turismo', 'Recorrido cultural Wayuu', 180000.00, 'Experiencia guiada por la comunidad.' UNION ALL
  SELECT 1001234574, 'Gastronomia', 'Dulces tradicionales', 18000.00, 'Preparacion artesanal de la comunidad.' UNION ALL
  SELECT 1001234576, 'Agronomia', 'Miel de abeja local', 25000.00, 'Miel producida en La Guajira.'
) p
JOIN miembro m ON m.cedula = p.cedula
JOIN tipo_producto tp ON tp.nombre = p.tipo
LEFT JOIN producto existente ON existente.id_miembro = m.id_miembro AND existente.id_tipo_producto = tp.id_tipo_producto AND existente.nombre = p.nombre
WHERE existente.id_producto IS NULL;
