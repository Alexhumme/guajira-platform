USE guajira_platform;

-- Departamento
INSERT INTO departamento (nombre, created_at, updated_at)
VALUES ('La Guajira', NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), updated_at = NOW();

-- Roles
INSERT INTO rol (nombre, created_at, updated_at)
VALUES
  ('miembro', NOW(), NOW()),
  ('lider', NOW(), NOW()),
  ('guia', NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), updated_at = NOW();

-- Tipos de producto (segun referencia)
INSERT INTO tipo_producto (nombre, created_at, updated_at)
VALUES
  ('Panaderia', NOW(), NOW()),
  ('Pesca', NOW(), NOW()),
  ('Turismo', NOW(), NOW()),
  ('Ganaderia', NOW(), NOW()),
  ('Agronomia', NOW(), NOW()),
  ('Artesania', NOW(), NOW()),
  ('Gastronomia', NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), updated_at = NOW();

-- Municipios de La Guajira
INSERT INTO municipio (nombre, id_departamento, created_at, updated_at)
SELECT m.nombre, d.id_departamento, NOW(), NOW()
FROM (
  SELECT 'Riohacha' AS nombre UNION ALL
  SELECT 'Maicao' UNION ALL
  SELECT 'Uribia' UNION ALL
  SELECT 'Manaure' UNION ALL
  SELECT 'Albania' UNION ALL
  SELECT 'Barrancas' UNION ALL
  SELECT 'Dibulla' UNION ALL
  SELECT 'Distraccion' UNION ALL
  SELECT 'El Molino' UNION ALL
  SELECT 'Fonseca' UNION ALL
  SELECT 'Hatonuevo' UNION ALL
  SELECT 'La Jagua del Pilar' UNION ALL
  SELECT 'San Juan del Cesar' UNION ALL
  SELECT 'Urumita' UNION ALL
  SELECT 'Villanueva'
) m
JOIN departamento d ON d.nombre = 'La Guajira'
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), updated_at = NOW();

-- Comunidades (por municipio)
INSERT INTO comunidad (nombre, id_municipio, visibilidad, fecha_registro, created_at, updated_at)
SELECT c.nombre, m.id_municipio, 1, CURRENT_DATE, NOW(), NOW()
FROM (
  SELECT 'El Ahumao 2' AS nombre, 'Riohacha' AS municipio UNION ALL
  SELECT 'Tocoromana', 'Riohacha' UNION ALL
  SELECT 'Santa Rita de la Sierra', 'Dibulla' UNION ALL
  SELECT 'Buenos Aires', 'Riohacha' UNION ALL
  SELECT 'Camarones', 'Riohacha' UNION ALL
  SELECT 'Puerto Caracol', 'Riohacha' UNION ALL
  SELECT 'Puente Guerrero', 'Riohacha' UNION ALL
  SELECT 'Santa Cruz', 'Riohacha' UNION ALL
  SELECT 'Preciaru', 'Manaure' UNION ALL
  SELECT 'Rancheria', 'Riohacha' UNION ALL
  SELECT 'Manantiales', 'Maicao' UNION ALL
  SELECT 'Guamachito', 'Hatonuevo' UNION ALL
  SELECT 'La Esperanza', 'Urumita' UNION ALL
  SELECT 'La Esperanza', 'Uribia' UNION ALL
  SELECT 'Fundacion de campesinos', 'Urumita' UNION ALL
  SELECT 'Grasamana', 'Manaure' UNION ALL
  SELECT 'Bayabonda', 'Fonseca' UNION ALL
  SELECT 'Yawoulia', 'Maicao'
) c
JOIN municipio m ON m.nombre = c.municipio
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), updated_at = NOW();

-- Productos de prueba. Se asocian a miembros y tipos ya cargados.
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

-- Rutas de prueba.
INSERT INTO ruta (id_ruta, id_comunidad, nombre, descripcion, duracion, distancia, dificultad, tipo_experiencia, portada_dir, visibilidad, fecha_registro, created_at, updated_at)
VALUES
  ('a1d2e3f4-0000-4000-8000-000000000001', (SELECT id_comunidad FROM comunidad WHERE nombre = 'El Ahumao 2'), 'Ruta de la Sal', 'Recorrido por los salares y la cultura ancestral Wayuu.', '3 horas', '5 km', 'Media', 'Cultural', '/uploads/rutas/ruta-sal.jpg', 1, CURRENT_DATE, NOW(), NOW()),
  ('b2d3f4a5-0000-4000-8000-000000000002', (SELECT id_comunidad FROM comunidad WHERE nombre = 'Tocoromana'), 'Camino de la Playa', 'Tour entre manglares y costas cercanas a la comunidad.', '2 horas', '4 km', 'Baja', 'Naturaleza', '/uploads/rutas/ruta-playa.jpg', 1, CURRENT_DATE, NOW(), NOW()),
  ('c3f4a5b6-0000-4000-8000-000000000003', (SELECT id_comunidad FROM comunidad WHERE nombre = 'Santa Rita de la Sierra'), 'Sendero del Horizonte', 'Ruta de montaña con miradores sobre el valle.', '4 horas', '7 km', 'Alta', 'Aventura', '/uploads/rutas/ruta-horizonte.jpg', 1, CURRENT_DATE, NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), descripcion = VALUES(descripcion), duracion = VALUES(duracion), distancia = VALUES(distancia), dificultad = VALUES(dificultad), tipo_experiencia = VALUES(tipo_experiencia), portada_dir = VALUES(portada_dir), visibilidad = VALUES(visibilidad), fecha_registro = VALUES(fecha_registro), updated_at = NOW();

-- Categorias turísticas de prueba.
INSERT INTO categoria_turistica (id_categoria_turistica, nombre, icono_dir, created_at, updated_at)
VALUES
  ('7e8614fa-4f91-47c1-9d18-b0adac6534c1', 'Hotel', '/uploads/icons/hotel.svg', NOW(), NOW()),
  ('f49f11f4-4861-42ef-b92f-48d5f4934c2e', 'Restaurante', '/uploads/icons/hotel.svg', NOW(), NOW()),
  ('d95a6042-8513-40d2-a2a4-6851e4a3472f', 'Playa', '/uploads/icons/playa.svg', NOW(), NOW()),
  ('9a108f4a-b58f-4934-b3de-3f59b3db64da', 'Punto de avistamiento', '/uploads/icons/aves.svg', NOW(), NOW())
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), icono_dir = VALUES(icono_dir), updated_at = NOW();

-- Posts de prueba.
INSERT INTO post (id_post, id_miembro, descripcion, visibilidad, likes, fecha_registro, created_at, updated_at)
VALUES
  ('9a9d6e94-6a4b-4c18-9a42-7cbf3b740b3f', (SELECT id_miembro FROM miembro WHERE cedula = 1001234568), 'Lanzamos nuevo producto artesanal en la comunidad.', 1, 12, CURRENT_DATE, NOW(), NOW()),
  ('d4fbc838-2a35-4e02-93ea-3d60c3a574c2', (SELECT id_miembro FROM miembro WHERE cedula = 1001234569), 'Historias de la artesania wayuu compartidas hoy.', 1, 8, CURRENT_DATE, NOW(), NOW()),
  ('f2a61b30-379c-45c7-8529-8a3f2f0a1b9e', (SELECT id_miembro FROM miembro WHERE cedula = 1001234571), 'Disponible servicio de pesca tradicional este fin de semana.', 1, 5, CURRENT_DATE, NOW(), NOW())
ON DUPLICATE KEY UPDATE descripcion = VALUES(descripcion), visibilidad = VALUES(visibilidad), likes = VALUES(likes), updated_at = NOW();
