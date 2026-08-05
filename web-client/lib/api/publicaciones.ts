import type { Publicacion } from '@/lib/data'
import { fetchApi, resolveApiAssetUrl } from './client'

export async function getPublicaciones(): Promise<Publicacion[]> {
  const publicaciones = await fetchApi<Publicacion[]>('/api/web-client/posts')
  return publicaciones.map((publicacion) => ({
    ...publicacion,
    imagenes: publicacion.imagenes.map(resolveApiAssetUrl),
  }))
}

export async function getPublicacionesByComunidad(comunidadId: string): Promise<Publicacion[]> {
  const publicaciones = await fetchApi<Publicacion[]>(`/api/web-client/posts?comunidadId=${comunidadId}`)
  return publicaciones.map((publicacion) => ({
    ...publicacion,
    imagenes: publicacion.imagenes.map(resolveApiAssetUrl),
  }))
}

