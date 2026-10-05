import type { Asociacion } from '@/lib/data'
import { safeFetchApi, resolveApiAssetUrl } from './client'

export async function getAsociaciones(): Promise<Asociacion[]> {
  const asociaciones = await safeFetchApi<Asociacion[]>('/web-client/asociaciones', [])
  return asociaciones.map((asociacion) => ({
    ...asociacion,
    logo: resolveApiAssetUrl(asociacion.logo),
  }))
}
