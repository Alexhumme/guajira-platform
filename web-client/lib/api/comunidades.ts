import type { Comunidad } from '@/lib/data'
import { getComunidades as fetchComunidades, fetchApi } from './client'

export async function getComunidades(): Promise<Comunidad[]> {
  return fetchComunidades()
}

export async function getComunidadBySlug(slug: string): Promise<Comunidad | undefined> {
  const comunidades = await fetchComunidades()
  return comunidades.find((comunidad) => comunidad.slug === slug)
}

export type ComunidadWithMunicipio = Comunidad & {
  municipio?: {
    nombre: string
    departamento: string
  }
}

export async function getTopComunidades(): Promise<ComunidadWithMunicipio[]> {
  return fetchApi<ComunidadWithMunicipio[]>('/api/web-client/comunidades/top')
}
