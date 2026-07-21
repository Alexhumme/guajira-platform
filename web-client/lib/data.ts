// Mock data for the IAP La Guajira platform.
// This simulates the future MySQL/Express backend. No real API calls yet.

export type Municipio = {
  id: string
  nombre: string
  departamento: string
}

export type RedSocial = {
  red_social: 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'whatsapp' | 'otros'
  usuario?: string
  link?: string
}

export type Comunidad = {
  id: string
  slug: string
  nombre: string
  municipioId: string
  descripcion: string
  logo?: string
  portada: string
  galeria: string[]
  contacto: { telefono: string; correo: string; whatsapp: string }
  redes: RedSocial[]
  fundacion: string
  habitantes: number
  direccion?: string
  coordenadas?: string
}

export type Categoria =
  | 'Artesanías'
  | 'Gastronomía'
  | 'Agricultura'
  | 'Pesca'
  | 'Turismo'
  | 'Otros'

export type Producto = {
  id: string
  slug: string
  nombre: string
  descripcion: string
  categoria: Categoria
  precio: number
  comunidadId: string
  artesano: string
  imagenes: string[]
}

export type Publicacion = {
  id: string
  autor: string
  avatar: string
  comunidadId: string
  fecha: string
  contenido: string
  imagenes: string[]
  productosRelacionados: string[]
  likes: number
}

export type PuntoInteres = {
  nombre: string
  descripcion: string
  latitud: number
  longitud: number
  imagen: string
}

export type ServicioTuristico = {
  id: string
  tipo: 'Hospedaje' | 'Alimentación' | 'Guía' | 'Transporte' | 'Experiencia'
  nombre: string
  descripcion: string
  comunidadId: string
  precioDesde: number
}

export type RutaTuristica = {
  id: string
  slug: string
  nombre: string
  descripcion: string
  duracion: string
  distancia: string
  municipioId: string
  comunidadPrincipalId: string
  comunidadesIds: string[]
  portada: string
  galeria: string[]
  puntos: PuntoInteres[]
  serviciosIds: string[]
}

export type Rol = 'Administrador' | 'Gestor' | 'Líder comunitario' | 'Artesano' | 'Publicador'

export type Usuario = {
  id: string
  nombre: string
  correo: string
  rol: Rol
  fotografia: string
  comunidadId: string
  estado: 'Activo' | 'Inactivo'
}

export const municipios: Municipio[] = [
  { id: 'm1', nombre: 'Uribia', departamento: 'La Guajira' },
  { id: 'm2', nombre: 'Manaure', departamento: 'La Guajira' },
  { id: 'm3', nombre: 'Riohacha', departamento: 'La Guajira' },
  { id: 'm4', nombre: 'Maicao', departamento: 'La Guajira' },
]

export const comunidades: Comunidad[] = [
  {
    id: 'c1',
    slug: 'wayuu-uribia',
    nombre: 'Comunidad Wotkasainru',
    municipioId: 'm1',
    descripcion:
      'Comunidad artesanal de Uribia reconocida por sus mochilas y chinchorros tejidos a mano.',
    logo: '/images/artisan-1.png',
    portada: '/images/community-1.png',
    galeria: ['/images/gallery-1.png', '/images/gallery-2.png', '/images/gallery-4.png'],
    contacto: { telefono: '+57 300 000 0001', correo: 'wotkasainru@iapguajira.co', whatsapp: '573000000001' },
    redes: [{ red_social: 'instagram', usuario: '@wotkasainru', link: 'https://instagram.com/wotkasainru' }],
    fundacion: '1978',
    habitantes: 42,
  },
  {
    id: 'c2',
    slug: 'manaure-salinas',
    nombre: 'Comunidad Salinera Shipia',
    municipioId: 'm2',
    descripcion:
      'Comunidad dedicada a la extracción artesanal de sal marina en las charcas de Manaure.',
    logo: '/images/community-2.png',
    portada: '/images/community-2.png',
    galeria: ['/images/community-2.png', '/images/product-sal.png', '/images/gallery-3.png'],
    contacto: { telefono: '+57 300 000 0002', correo: 'shipia@iapguajira.co', whatsapp: '573000000002' },
    redes: [{ red_social: 'facebook', usuario: 'Salinas Shipia', link: 'https://facebook.com/salinasshipia' }],
    fundacion: '1965',
    habitantes: 68,
  },
  {
    id: 'c3',
    slug: 'cabo-de-la-vela',
    nombre: 'Comunidad Jepira',
    municipioId: 'm1',
    descripcion:
      'Comunidad costera en Cabo de la Vela dedicada a la pesca artesanal y el turismo comunitario.',
    logo: '/images/community-3.png',
    portada: '/images/community-3.png',
    galeria: ['/images/community-3.png', '/images/tourism-2.png', '/images/product-pescado.png'],
    contacto: { telefono: '+57 300 000 0003', correo: 'jepira@iapguajira.co', whatsapp: '573000000003' },
    redes: [{ red_social: 'instagram', usuario: '@jepira.cabo', link: 'https://instagram.com/jepira.cabo' }],
    fundacion: '1990',
    habitantes: 35,
  },
  {
    id: 'c4',
    slug: 'macuira',
    nombre: 'Comunidad Serranía de la Macuira',
    municipioId: 'm1',
    descripcion:
      'Comunidad del oasis de la Macuira que combina agricultura, pastoreo y ecoturismo.',
    logo: '/images/community-4.png',
    portada: '/images/community-4.png',
    galeria: ['/images/community-4.png', '/images/gallery-3.png', '/images/product-friche.png'],
    contacto: { telefono: '+57 300 000 0004', correo: 'macuira@iapguajira.co', whatsapp: '573000000004' },
    redes: [],
    fundacion: '1982',
    habitantes: 27,
  },
]

export const productos: Producto[] = [
  {
    id: 'p1',
    slug: 'mochila-kanas',
    nombre: 'Mochila Wayuu Kanás',
    descripcion:
      'Mochila tejida a una hebra con patrones geométricos kanás en tonos tierra. Pieza única.',
    categoria: 'Artesanías',
    precio: 180000,
    comunidadId: 'c1',
    artesano: 'María Epieyu',
    imagenes: ['/images/product-mochila.png', '/images/gallery-4.png'],
  },
  {
    id: 'p2',
    slug: 'chinchorro-guajiro',
    nombre: 'Chinchorro Guajiro',
    descripcion:
      'Hamaca tradicional tejida con flecos elaborados. Ideal para descanso y decoración.',
    categoria: 'Artesanías',
    precio: 950000,
    comunidadId: 'c1',
    artesano: 'Rosa Uriana',
    imagenes: ['/images/product-chinchorro.png'],
  },
  {
    id: 'p3',
    slug: 'manillas-wayuu',
    nombre: 'Set de Manillas Wayuu',
    descripcion: 'Conjunto de pulseras tejidas con mostacilla y patrones tradicionales.',
    categoria: 'Artesanías',
    precio: 35000,
    comunidadId: 'c1',
    artesano: 'Luz Pushaina',
    imagenes: ['/images/product-manilla.png'],
  },
  {
    id: 'p4',
    slug: 'pescado-fresco',
    nombre: 'Pescado Fresco del Caribe',
    descripcion: 'Pesca artesanal diaria: pargo, sierra y langosta según temporada.',
    categoria: 'Pesca',
    precio: 28000,
    comunidadId: 'c3',
    artesano: 'José Ipuana',
    imagenes: ['/images/product-pescado.png'],
  },
  {
    id: 'p5',
    slug: 'friche-guajiro',
    nombre: 'Friche Guajiro (plato típico)',
    descripcion: 'Plato tradicional de chivo, símbolo de la gastronomía Wayuu.',
    categoria: 'Gastronomía',
    precio: 22000,
    comunidadId: 'c4',
    artesano: 'Cocina comunitaria Macuira',
    imagenes: ['/images/product-friche.png'],
  },
  {
    id: 'p6',
    slug: 'sal-marina-artesanal',
    nombre: 'Sal Marina Artesanal',
    descripcion: 'Sal recolectada a mano en las charcas de Manaure, sin aditivos.',
    categoria: 'Agricultura',
    precio: 12000,
    comunidadId: 'c2',
    artesano: 'Cooperativa Shipia',
    imagenes: ['/images/product-sal.png'],
  },
]

export const publicaciones: Publicacion[] = [
  {
    id: 'pub1',
    autor: 'María Epieyu',
    avatar: '/images/artisan-1.png',
    comunidadId: 'c1',
    fecha: '2026-07-10',
    contenido:
      'Terminamos una nueva colección de mochilas con los colores del atardecer guajiro. Cada pieza cuenta una historia de nuestro clan.',
    imagenes: ['/images/product-mochila.png', '/images/gallery-1.png'],
    productosRelacionados: ['p1'],
    likes: 128,
  },
  {
    id: 'pub2',
    autor: 'Comunidad Jepira',
    avatar: '/images/gallery-2.png',
    comunidadId: 'c3',
    fecha: '2026-07-08',
    contenido:
      'Hoy recibimos visitantes que aprendieron a lanzar la atarraya con nuestros pescadores. El turismo comunitario fortalece nuestra economía.',
    imagenes: ['/images/tourism-2.png'],
    productosRelacionados: ['p4'],
    likes: 96,
  },
  {
    id: 'pub3',
    autor: 'Cooperativa Shipia',
    avatar: '/images/gallery-3.png',
    comunidadId: 'c2',
    fecha: '2026-07-05',
    contenido:
      'La cosecha de sal de esta temporada fue abundante. Gracias al proyecto IAP ahora llegamos a nuevos mercados.',
    imagenes: ['/images/community-2.png', '/images/product-sal.png'],
    productosRelacionados: ['p6'],
    likes: 74,
  },
]

export const servicios: ServicioTuristico[] = [
  { id: 's1', tipo: 'Hospedaje', nombre: 'Rancherías con chinchorro', descripcion: 'Alojamiento tradicional en enramadas frente al mar.', comunidadId: 'c3', precioDesde: 45000 },
  { id: 's2', tipo: 'Alimentación', nombre: 'Comida típica guajira', descripcion: 'Menú de pescado fresco, arroz de camarón y friche.', comunidadId: 'c3', precioDesde: 20000 },
  { id: 's3', tipo: 'Guía', nombre: 'Guía comunitario bilingüe', descripcion: 'Recorridos interpretados por miembros de la comunidad.', comunidadId: 'c4', precioDesde: 60000 },
  { id: 's4', tipo: 'Transporte', nombre: 'Transporte 4x4', descripcion: 'Traslados por caminos del desierto guajiro.', comunidadId: 'c1', precioDesde: 120000 },
  { id: 's5', tipo: 'Experiencia', nombre: 'Taller de tejido Wayuu', descripcion: 'Aprende los fundamentos del tejido kanás.', comunidadId: 'c1', precioDesde: 40000 },
]

export const rutas: RutaTuristica[] = [
  {
    id: 'r1',
    slug: 'cabo-de-la-vela-experiencia',
    nombre: 'Cabo de la Vela: mar y desierto',
    descripcion:
      'Una ruta de tres días por el sagrado Cabo de la Vela: playas turquesa, kitesurf, atardeceres en el Pilón de Azúcar y convivencia con la comunidad Jepira.',
    duracion: '3 días / 2 noches',
    distancia: '180 km',
    municipioId: 'm1',
    comunidadPrincipalId: 'c3',
    comunidadesIds: ['c3', 'c1'],
    portada: '/images/tourism-2.png',
    galeria: ['/images/community-3.png', '/images/tourism-2.png', '/images/tourism-1.png'],
    puntos: [
      { nombre: 'Pilón de Azúcar', descripcion: 'Mirador sagrado con vistas al Caribe.', latitud: 12.2, longitud: -72.16, imagen: '/images/tourism-1.png' },
      { nombre: 'Playa del Faro', descripcion: 'Atardecer y kitesurf.', latitud: 12.22, longitud: -72.15, imagen: '/images/tourism-2.png' },
      { nombre: 'Ranchería Jepira', descripcion: 'Convivencia y gastronomía local.', latitud: 12.21, longitud: -72.15, imagen: '/images/community-3.png' },
    ],
    serviciosIds: ['s1', 's2', 's4'],
  },
  {
    id: 'r2',
    slug: 'macuira-oasis',
    nombre: 'Oasis de la Macuira',
    descripcion:
      'Descubre el bosque de niebla en medio del desierto, camina entre cerros verdes y comparte con comunidades pastoras.',
    duracion: '2 días / 1 noche',
    distancia: '95 km',
    municipioId: 'm1',
    comunidadPrincipalId: 'c4',
    comunidadesIds: ['c4'],
    portada: '/images/community-4.png',
    galeria: ['/images/community-4.png', '/images/gallery-3.png'],
    puntos: [
      { nombre: 'Cerro Palúa', descripcion: 'Senderismo con vistas panorámicas.', latitud: 12.15, longitud: -71.34, imagen: '/images/community-4.png' },
      { nombre: 'Oasis interior', descripcion: 'Bosque de niebla único.', latitud: 12.14, longitud: -71.33, imagen: '/images/gallery-3.png' },
    ],
    serviciosIds: ['s3', 's2'],
},
  {
    id: 'r3',
    slug: 'punta-gallinas',
    nombre: 'Punta Gallinas: el fin del continente',
    descripcion:
      'Llega al punto más al norte de Suramérica: dunas rojas que caen al mar, flamencos y hospitalidad Wayuu.',
    duracion: '4 días / 3 noches',
    distancia: '260 km',
    municipioId: 'm1',
    comunidadPrincipalId: 'c3',
    comunidadesIds: ['c3', 'c2'],
    portada: '/images/tourism-1.png',
    galeria: ['/images/tourism-1.png', '/images/community-2.png', '/images/tourism-3.png'],
    puntos: [
      { nombre: 'Dunas de Taroa', descripcion: 'Dunas que caen al mar Caribe.', latitud: 12.45, longitud: -71.7, imagen: '/images/tourism-1.png' },
      { nombre: 'Bahía Hondita', descripcion: 'Avistamiento de flamencos.', latitud: 12.43, longitud: -71.73, imagen: '/images/tourism-3.png' },
    ],
    serviciosIds: ['s1', 's2', 's4'],
},
]

export const usuarios: Usuario[] = [
  { id: 'u1', nombre: 'Andrés Gómez', correo: 'admin@iapguajira.co', rol: 'Administrador', fotografia: '/images/artisan-1.png', comunidadId: 'c1', estado: 'Activo' },
  { id: 'u2', nombre: 'María Epieyu', correo: 'maria@iapguajira.co', rol: 'Artesano', fotografia: '/images/artisan-1.png', comunidadId: 'c1', estado: 'Activo' },
  { id: 'u3', nombre: 'José Ipuana', correo: 'jose@iapguajira.co', rol: 'Líder comunitario', fotografia: '/images/gallery-2.png', comunidadId: 'c3', estado: 'Activo' },
  { id: 'u4', nombre: 'Laura Restrepo', correo: 'laura@iapguajira.co', rol: 'Gestor', fotografia: '/images/gallery-3.png', comunidadId: 'c2', estado: 'Inactivo' },
  { id: 'u5', nombre: 'Rosa Uriana', correo: 'rosa@iapguajira.co', rol: 'Publicador', fotografia: '/images/artisan-1.png', comunidadId: 'c1', estado: 'Activo' },
]

export const categorias: Categoria[] = ['Artesanías', 'Gastronomía', 'Agricultura', 'Pesca', 'Turismo', 'Otros']

export const roles: Rol[] = ['Administrador', 'Gestor', 'Líder comunitario', 'Artesano', 'Publicador']

export const indicadores = [
  { label: 'Comunidades participantes', valor: comunidades.length, sufijo: '' },
  { label: 'Habitantes beneficiados', valor: 172, sufijo: '+' },
  { label: 'Productos en el marketplace', valor: productos.length, sufijo: '' },
  { label: 'Rutas de turismo comunitario', valor: rutas.length, sufijo: '' },
  { label: 'Municipios cubiertos', valor: municipios.length, sufijo: '' },
  { label: 'Artesanos activos', valor: 58, sufijo: '' },
]

export const galeria = [
  '/images/gallery-1.png',
  '/images/gallery-2.png',
  '/images/gallery-3.png',
  '/images/gallery-4.png',
  '/images/community-3.png',
  '/images/tourism-1.png',
  '/images/product-mochila.png',
  '/images/tourism-3.png',
]

// Helpers
export const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

export const getComunidad = (id: string) => comunidades.find((c) => c.id === id)
export const getComunidadBySlug = (slug: string) => comunidades.find((c) => c.slug === slug)
export const getMunicipio = (id: string) => municipios.find((m) => m.id === id)
export const getProducto = (slug: string) => productos.find((p) => p.slug === slug)
export const getRuta = (slug: string) => rutas.find((r) => r.slug === slug)
export const getServicio = (id: string) => servicios.find((s) => s.id === id)
export const getProductoById = (id: string) => productos.find((p) => p.id === id)
export const productosByComunidad = (comunidadId: string) => productos.filter((p) => p.comunidadId === comunidadId)
export const publicacionesByComunidad = (comunidadId: string) => publicaciones.filter((p) => p.comunidadId === comunidadId)
export const rutasByComunidad = (comunidadId: string) => rutas.filter((r) => r.comunidadesIds.includes(comunidadId))
export const serviciosByComunidad = (comunidadId: string) => servicios.filter((s) => s.comunidadId === comunidadId)

// Map points aggregated for the interactive map
export type MapPoint = {
  id: string
  nombre: string
  tipo: 'Comunidad' | 'Ruta' | 'Turístico' | 'Artesanal' | 'Playa' | 'Cultural'
  x: number // percentage position on map image
  y: number
  descripcion: string
  href: string
  imagen: string
}

export const mapPoints: MapPoint[] = [
  { id: 'mp1', nombre: 'Comunidad Wotkasainru', tipo: 'Comunidad', x: 46, y: 58, descripcion: 'Centro artesanal en Uribia.', href: '/comunidades/wayuu-uribia', imagen: '/images/community-1.png' },
  { id: 'mp2', nombre: 'Salinas de Manaure', tipo: 'Artesanal', x: 30, y: 52, descripcion: 'Extracción de sal marina.', href: '/comunidades/manaure-salinas', imagen: '/images/community-2.png' },
  { id: 'mp3', nombre: 'Cabo de la Vela', tipo: 'Playa', x: 52, y: 30, descripcion: 'Playas y turismo comunitario.', href: '/comunidades/cabo-de-la-vela', imagen: '/images/community-3.png' },
  { id: 'mp4', nombre: 'Serranía de la Macuira', tipo: 'Cultural', x: 78, y: 26, descripcion: 'Oasis de bosque de niebla.', href: '/comunidades/macuira', imagen: '/images/community-4.png' },
  { id: 'mp5', nombre: 'Punta Gallinas', tipo: 'Turístico', x: 66, y: 12, descripcion: 'Punto más al norte de Suramérica.', href: '/turismo/punta-gallinas', imagen: '/images/tourism-1.png' },
  { id: 'mp6', nombre: 'Riohacha', tipo: 'Comunidad', x: 20, y: 66, descripcion: 'Capital y punto de partida.', href: '/mapa', imagen: '/images/gallery-4.png' },
]
