import type { Producto } from '@/lib/data'
import { safeFetchApi, resolveApiAssetUrl } from './client'

export async function getProductos(): Promise<Producto[]> {
  const productos = await safeFetchApi<Producto[]>('/web-client/productos', [])
  return productos.map((producto) => ({
    ...producto,
    imagenes: producto.imagenes.map(resolveApiAssetUrl),
  }))
}

export async function getProductoBySlug(slug: string): Promise<Producto | undefined> {
  const productos = await getProductos()
  return productos.find((producto) => producto.slug === slug)
}
