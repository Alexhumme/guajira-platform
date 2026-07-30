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
  | 'Panaderia'
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

export type Indicador = {
  label: string
  valor: number | string
  sufijo?: string
}

export type Publicacion = {
  id: string
  autor: string
  avatar: string
  comunidadSlug: string
  comunidadNombre: string
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
  dificultad?: string
  tipoExperiencia?: string
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

export const roles: Rol[] = ['Administrador', 'Gestor', 'Líder comunitario', 'Artesano', 'Publicador']

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

export const getMunicipio = (id: string) => municipios.find((m) => m.id === id)
export const getRuta = (slug: string) => rutas.find((r) => r.slug === slug)
export const getServicio = (id: string) => servicios.find((s) => s.id === id)
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
