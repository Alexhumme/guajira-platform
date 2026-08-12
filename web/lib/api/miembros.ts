import type { Miembro } from '@/lib/data'
import { fetchApi, resolveApiAssetUrl } from './client'

export async function getMiembros(): Promise<Miembro[]> {
    const miembros = await fetchApi<Miembro[]>('/web-client/miembros')
    return miembros.map((miembro) => ({
      ...miembro,
      avatar: resolveApiAssetUrl(miembro.avatar),
    }))
}