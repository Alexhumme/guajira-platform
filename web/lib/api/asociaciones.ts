import type { Asociacion } from '@/lib/data'
import { fetchApi, resolveApiAssetUrl } from './client'

export async function getAsociaciones(): Promise<Asociacion[]> {
  const asociaciones = await fetchApi<Asociacion[]>('/web-client/asociaciones')
  return asociaciones.map((asociacion) => ({
    ...asociacion,
    logo: resolveApiAssetUrl(asociacion.logo),
  }))
}
