import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/products/product-detail"
import { getProductoBySlug } from "@/lib/api/productos"
import { getComunidades } from "@/lib/api/comunidades"

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const producto = await getProductoBySlug(slug)
  if (!producto) notFound()
  const comunidad = (await getComunidades()).find((item) => item.id === producto.comunidadId)
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <ProductDetail producto={producto} comunidad={comunidad} />
    </div>
  )
}
