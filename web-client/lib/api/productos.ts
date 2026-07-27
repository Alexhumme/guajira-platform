import type { Producto } from '@/lib/data'
import { fetchApi, resolveApiAssetUrl } from './client'

export async function getProductos(): Promise<Producto[]> {
  const productos = await fetchApi<Producto[]>('/api/web-client/productos')
  return productos.map((producto) => ({
    ...producto,
    imagenes: producto.imagenes.map(resolveApiAssetUrl),
  }))
}

export async function getProductoBySlug(slug: string): Promise<Producto | undefined> {
  const productos = await getProductos()
  return productos.find((producto) => producto.slug === slug)
}
