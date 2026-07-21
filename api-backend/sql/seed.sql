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
  SELECT 'Yawoulia', 'Maicao'
) c
JOIN municipio m ON m.nombre = c.municipio
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), updated_at = NOW();

-- Miembros de prueba
INSERT INTO miembro (id_comunidad, rol_id, cedula, nombres, edad, status, genero, numero_contacto, fecha_registro, created_at, updated_at)
SELECT c.id_comunidad, r.id_rol, m.cedula, m.nombres, m.edad, 'activo', m.genero, m.numero_contacto, CURRENT_DATE, NOW(), NOW()
FROM (
  SELECT 'El Ahumao 2' AS comunidad, 'lider' AS rol, 1001234567 AS cedula, 'Juan Pérez Martínez' AS nombres, 45 AS edad, 'Masculino' AS genero, '3101234567' AS numero_contacto UNION ALL
  SELECT 'El Ahumao 2', 'miembro', 1001234568, 'María García López', 32, 'Femenino', '3101234568' UNION ALL
  SELECT 'El Ahumao 2', 'miembro', 1001234569, 'Carlos Rodríguez Silva', 28, 'Masculino', '3101234569' UNION ALL
  SELECT 'Tocoromana', 'lider', 1001234570, 'Ana Martínez Gutiérrez', 51, 'Femenino', '3101234570' UNION ALL
  SELECT 'Tocoromana', 'miembro', 1001234571, 'Pedro Díaz Castro', 38, 'Masculino', '3101234571' UNION ALL
  SELECT 'Tocoromana', 'guia', 1001234572, 'Rosa Sánchez Flores', 29, 'Femenino', '3101234572' UNION ALL
  SELECT 'Santa Rita de la Sierra', 'lider', 1001234573, 'Jorge López Ramírez', 55, 'Masculino', '3101234573' UNION ALL
  SELECT 'Santa Rita de la Sierra', 'miembro', 1001234574, 'Luisa Fernández Torres', 35, 'Femenino', '3101234574' UNION ALL
  SELECT 'Buenos Aires', 'lider', 1001234575, 'Miguel Ángel Vargas', 47, 'Masculino', '3101234575' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1001234576, 'Carmen Ruiz Moreno', 33, 'Femenino', '3101234576'
) m
JOIN comunidad c ON c.nombre = m.comunidad
JOIN rol r ON r.nombre = m.rol
ON DUPLICATE KEY UPDATE nombres = VALUES(nombres), edad = VALUES(edad), status = VALUES(status), genero = VALUES(genero), numero_contacto = VALUES(numero_contacto), updated_at = NOW();
