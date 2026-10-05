import type { Miembro } from '@/lib/data'
import { safeFetchApi, resolveApiAssetUrl } from './client'

export async function getMiembros(): Promise<Miembro[]> {
    const miembros = await safeFetchApi<Miembro[]>('/web-client/miembros', [])
    return miembros.map((miembro) => ({
      ...miembro,
      avatar: resolveApiAssetUrl(miembro.avatar),
    }))
}