import type { Comunidad, Miembro } from '@/lib/data'
import { safeFetchApi, resolveApiAssetUrl } from './client'

export async function getComunidades(): Promise<Comunidad[]> {
  const comunidades = await safeFetchApi<Comunidad[]>('/web-client/comunidades', [])
  const comunidadesWithImages = comunidades.map((comunidad) => ({
    ...comunidad,
    galeria: comunidad.galeria.map((imagen) => resolveApiAssetUrl(imagen))
  }))
  return comunidadesWithImages
}

export async function getLideres(comunidadId: string): Promise<Miembro[]> {
  return safeFetchApi<Miembro[]>('/web-client/comunidades/' + comunidadId + '/lideres', [])
}

export async function getComunidadBySlug(slug: string): Promise<Comunidad | undefined> {
  const comunidades = await getComunidades()
  return comunidades.find((comunidad) => comunidad.slug === slug)
}

export type ComunidadWithMunicipio = Comunidad & {
  municipio?: {
    nombre: string
    departamento: string
  }
}

export async function getTopComunidades(): Promise<ComunidadWithMunicipio[]> {
  return safeFetchApi<ComunidadWithMunicipio[]>('/web-client/comunidades/top', [])
}
