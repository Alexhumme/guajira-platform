import { getProductos } from "@/lib/api/productos"
import { ProductoPageClient } from "@/components/products/producto-page-client"

export async function generateStaticParams() {
  const productos = await getProductos()
  return productos.map((producto) => ({ slug: producto.slug }))
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProductoPageClient slug={slug} />
}
