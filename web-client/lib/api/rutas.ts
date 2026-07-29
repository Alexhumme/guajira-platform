import type { RutaTuristica } from '@/lib/data'
import { fetchApi, resolveApiAssetUrl } from './client'

export async function getRutas(): Promise<RutaTuristica[]> {
  const rutas = await fetchApi<RutaTuristica[]>('/api/web-client/rutas')
  return rutas.map((ruta) => ({
    ...ruta,
    portada: resolveApiAssetUrl(ruta.portada),
    galeria: ruta.galeria.map(resolveApiAssetUrl),
  }))
}

export async function getRutaBySlug(slug: string): Promise<RutaTuristica | undefined> {
  const rutas = await getRutas()
  return rutas.find((ruta) => ruta.slug === slug)
}
