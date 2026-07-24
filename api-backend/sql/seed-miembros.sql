-- Miembros reales
INSERT INTO miembro (id_comunidad, rol_id, cedula, nombres, status, genero, numero_contacto, email_contacto, fecha_registro, created_at, updated_at)
SELECT c.id_comunidad, r.id_rol, m.cedula, m.nombres, 'activo', m.genero, m.numero_contacto, m.email_contacto, CURRENT_DATE, NOW(), NOW()
FROM (
    -- Grasamana
  SELECT 'Grasamana' AS comunidad, 'miembro' AS rol, 17801200 AS cedula, 'Lucas Epinayu' AS nombres, 'Masculino' AS genero, '3126434120' AS numero_contacto, '' AS email_contacto UNION ALL
  SELECT 'Grasamana', 'miembro', 1193930980, 'Diego Epinayu', 'Masculino',   '3238572656', 'diegoepinayu1999@gmail.com' UNION ALL
  SELECT 'Grasamana', 'miembro', 106153753, 'Elizabeth Epinayu', 'Femenino', '3170784911', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 40951267, 'Rosa Epinayu', 'Femenino', '3235280489', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 1118831805, 'Yanileth Epinayu', 'Femenino', '', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 1118826954, 'Elianis Epinayu', 'Femenino', '', 'elianisepinayu@gmail.com' UNION ALL
  SELECT 'Grasamana', 'miembro', 1192809870, 'Leonardo Epinayu', 'Masculino', '3118299898', 'leonardoepinayu@gmail.com' UNION ALL
  SELECT 'Grasamana', 'miembro', 56101265, 'Rosa Perez', 'Femenino', '', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 1118820098, 'Natalia Ipuana', 'Femenino', '', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 40952155, 'Maria Epiayu', 'Femenino', '', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 84079443, 'Jose Epiayu', 'Masculino', '', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 1118843836, 'Malene Epiayu', 'Femenino', '3206504187', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 1006577906, 'Yanelis Epiayu', 'Femenino','3187148542', 'epiayuyanelis11@gmail.com' UNION ALL
  SELECT 'Grasamana', 'miembro', 1006575016, 'Dalmis Epinea', 'Femenino', '3102719197', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 4095169, 'Catalina Pulio', 'Femenino', '', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 1124359938, 'Shelma Epinea', 'Femenino', '3113823107', '' UNION ALL
  SELECT 'Grasamana', 'miembro', 1124382524, 'Kareli Epiayu', 'Femenino', '3216701320',  '' UNION ALL
  SELECT 'Grasamana', 'miembro', 1056582198, 'Jose Epinea', 'Masculino',  '3021790797',  '' UNION ALL
    -- Guamachito
  SELECT 'Guamachito', 'lider', 84007084, 'David Ipuana', 'Masculino', '3156084081', 'ipuanadavid18@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1010011390, 'Mileidis Pérez', 'Femenino', '3046351395', 'gerrakonna147@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1122809318, 'Doiler Ortega', 'Masculino', '3014891181', 'brito15velasque@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1123970668, 'Jaime Montiel', 'Masculino', '3136948442', 'montielsolanoenriquejaime@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1123970742, 'Yisel Alvarez', 'Femenino',  '3015178286', 'yisella39@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1123976290, 'Esteban Gonzales', 'Masculino', '3139414931', 'estebangonzales3674@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1122811383, 'Luis Pinto', 'Masculino', '3116240058', 'liuspintocampuzana30@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1237689858, 'Jesus Bracho', 'Masculino', '3148243432', 'brachojesus255@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1120743203, 'Yadir Daza', 'Masculino', '3045220816', 'yadirdaza123@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1120742371, 'Yeiker Chamorro', 'Masculino', '3024531369', 'yeikerchamorrogonzales@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1121092233, 'Ehikel Brito', 'Masculino', '3216576865', '' UNION ALL
  SELECT 'Guamachito', 'miembro', 1122809697, 'Jean Aviles', 'Masculino', '3137020126', 'avilezjean440@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1120757371, 'Naireth Guerra', 'Femenino', '3044971508', 'nairethanez@gmail.com' UNION ALL

  SELECT 'Guamachito', 'miembro', 1121302385, 'Karen Vidal', 'Femenino', '3103491215', 'cesar270779@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 80066191, 'Cesar Rodriguez', 'Masculino', '3103491215', 'cesar270779@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1121307984, 'Roselia Ipuana', 'Femenino', '3138167209', 'roseliamontiel22@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 1121298456, 'Jose Uriana', 'Masculino', '3006496211', '' UNION ALL
  SELECT 'Guamachito', 'miembro', 5153805, 'Jesus Pushaina', 'Masculino', '3234166963', '' UNION ALL
  SELECT 'Guamachito', 'miembro', 56053192, 'Yesenia Plaza', 'Femenino', '3219190927', 'plazayesenia131@gmail.com' UNION ALL
  SELECT 'Guamachito', 'miembro', 56053209, 'Gladis Mejia', 'Femenino', '3205744770', '' UNION ALL
  SELECT 'Guamachito', 'miembro', 84005023, 'Jose Goriyu', 'Masculino', '3184136634', '' UNION ALL
  SELECT 'Guamachito', 'miembro', 17990309, 'Antonio Goriyu', 'Masculino', '3147089074', '' UNION ALL
  SELECT 'Guamachito', 'miembro', 1121300483, 'Lorena Uriana', 'Femenino', '3128037870', '' UNION ALL
  SELECT 'Guamachito', 'miembro', 1121300755, 'Edgardo Duarte', 'Masculino', '3207308417', '' UNION ALL
    -- Puerto Caracol
  SELECT 'Puerto Caracol', 'miembro', 1134182628, 'Reina Uriana', 'Femenino', '3118561570', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1119396860, 'Rosalinda Uriana', 'Femenino', '3128959629', 'rosalindau21@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1176215058, 'Nulvellis Barros', 'Femenino', '3145050856', 'nulvellisbarros@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1176215486, 'Rosiris Barros', 'Femenino', '3228356511', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1118840369, 'Yadilsa Epinayu', 'Femenino', '3205747821', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1118809664, 'Everson Uriana', 'Masculino', '3046235730', 'eversonuri30@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1006579561, 'Fanny Ipuana', 'Femenino', '3015829759', 'fcipuana@uniguajira.edu.co' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1124381894, 'Leonor Ipuana', 'Femenino', '3213025657', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1192777352, 'Yadira Uriana', 'Femenino', '3205747821', 'urianayadira@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1006615736, 'Juliana Uriana', 'Femenino', '', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1006569122, 'Sindy Uriana', 'Femenino', '3115633436', 'urianasindy@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1006578008, 'Lozbel Ipuana', 'Femenino', '3128959629', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1176214818, 'Heilis Viloria', 'Femenino', '3128064906', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1102777310, 'Katry Uriana', 'Femenino', '3202308426', 'kuriana@uniguajira.edu.co' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1118829738, 'Rosa Viloria', 'Femenino', '3116125683', 'rosaviloria382@gmail.com' UNION ALL

  SELECT 'Puerto Caracol', 'miembro', 1006579287, 'Yudi Epinayu', 'Femenino', '3127930496', 'yudiepinayu@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1118800790, 'Senobia Ipuana', 'Femenino', '', '' UNION ALL
  SELECT 'Puerto Caracol', 'lider', 66829513, 'Maria Rosalia Martinez', 'Femenino', '3118713670', 'luyjei21@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1149446925, 'Maria I. Ipuana', 'Femenino', '3145953639', 'rosalindau21@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 40944681, 'Francia Elena Ipuana', 'Femenino', '3187433635', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 40930651, 'Ana G Epinayu', 'Femenino', '3017891121', 'anaguedelosepinayu@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 40933130, 'Florentina Epinayu', 'Femenino', '', 'gladisepinayu41@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1119414415, 'Breinis T. D.', 'Femenino', '3018554889', 'gladisepinayu41@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 40949720, 'Gladys Epinayu', 'Femenino', '3018554889', 'gladisepinayu41@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1119394654, 'Greimis Deluque', 'Femenino', '3018554889', 'epinayudayana62@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1119699172, 'Yasuris Uriana', 'Femenino', '3206157746', 'yasurisuriana@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1192813401, 'Milaidys Uriana', 'Femenino', '3143040527', 'shuleidisu@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1192813428, 'Yamileth Uriana', 'Femenino', '3147904750', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1178809665, 'Shirleidis Uriana', 'Femenino', '3143040527', 'shirleidisu@gmail.com' UNION ALL

  SELECT 'Puerto Caracol', 'miembro', 1121539771, 'Laura Palmar', 'Femenino', '', 'palmarlopezlauranicole@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1118873065, 'Holibia Ipuana', 'Femenino', '3245332773', 'oliviaipuana86@gmail.com' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 40938916, 'Paula C. Martinez', 'Femenino', '', '' UNION ALL
  SELECT 'Puerto Caracol', 'miembro', 1192728403, 'Tabedis Epieyu', 'Femenino', '', '' UNION ALL
    -- Tocoromana
  SELECT 'Tocoromana', 'miembro', 1192728403, 'Yeneris Gouriyu', 'Femenino', '', '' UNION ALL

    -- El Guajirito
    SELECT 'El Guajirito', 'miembro', 90929891, 'Eloisa', 'Femenino', '3159691362', '' UNION ALL
    -- SELECT 'El Guajirito', 'miembro', XXXXXXXX, 'Aurora Jaxaiyú', 'Femenino', '', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 1124497782, 'Carmen Ipuana', 'Femenino', '3233380141', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 1124497780, 'Deicy Ipuana', 'Femenino', '3011934491', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 40950501, 'Laudith Uriana', 'Femenino', '3159033286', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 1119393696, 'Sharon Siosi', 'Femenino', '3181272028', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 40930387, 'Aurora Uriana', 'Femenino', '3024323552', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 40919948, 'Eva Onano', 'Femenino', '3044414434', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 1006617115, 'Odelmis Gouriyu', 'Femenino', '3044414434', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 26960239, 'Evelina Jayariyú', 'Femenino', '3044414434', '' UNION ALL
    -- SELECT 'El Guajirito', 'miembro', XXXXXXXX, 'Daicy Ipuana', 'Femenino', '', '' UNION ALL
    SELECT 'El Guajirito', 'miembro', 1118840635, 'Carmen Pérez', 'Femenino', '3230614532', '' UNION ALL
    -- SELECT 'El Guajirito', 'miembro', XXXXXXXX, 'Helka Pérez', 'Femenino', '', '' UNION ALL
    -- SELECT 'El Guajirito', 'miembro', XXXXXXXX, 'Marlene Uriana', 'Femenino', '', ''

    -- Bayabonda
  SELECT 'Bayabonda', 'lider', 1006713738, 'Erika Solano', 'Femenino', '3019424376', 'erikasolpus92@gmail.com' UNION ALL
    -- Buenos Aires
  SELECT 'Buenos Aires', 'lider', 40933619, 'Mirlenis Jusayu', 'Femenino', '3113546948', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 40941503, 'Gladys Jusayu', 'Femenino', '3136034726', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1118818657, 'Gladis Jusayu', 'Femenino', '3136034726', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1119715345, 'Paola Uriana', 'Femenino',  '3147298400', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1118829175, 'Phiyail Jusayu', 'Femenino',  '3136034726', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1118809127, 'Ema Uriana', 'Femenino',  '3113546948', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1119346218, 'Melany Ballesteros', 'Femenino',  '3136034721', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1006579262, 'Silvia Rodriguez', 'Femenino',  '3012923484', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1148697032, 'Olga Jusayu', 'Femenino',  '3183183562', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1006579206, 'Camilo Deluque', 'Masculino',  '3234919513', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1006572760, 'Elizabeth Jusayu', 'Femenino',  '3169704800', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1006570957, 'Estefany Jusayu', 'Femenino',  '3233430260', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1134174172, 'Maria Perez', 'Femenino',  '3113546948', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1006638550, 'Yonidis Jusayu', 'Femenino',  '3169704800', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1175963169, 'Keini Uriana', 'Femenino',  '3012923484', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 1106573125, 'Paula Epiayu', 'Femenino', '3169704800', '' UNION ALL
  SELECT 'Buenos Aires', 'miembro', 56070423, 'Maria Paz', 'Femenino', '3169704800', '' 
) m
JOIN comunidad c ON c.nombre = m.comunidad
JOIN rol r ON r.nombre = m.rol
ON DUPLICATE KEY UPDATE nombres = VALUES(nombres), status = VALUES(status), genero = VALUES(genero), numero_contacto = VALUES(numero_contacto), updated_at = NOW();