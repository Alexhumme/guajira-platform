import { notFound } from "next/navigation"
import { getProducto, productos } from "@/lib/data"
import { ProductDetail } from "@/components/product-detail"

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }))
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const producto = getProducto(slug)
  if (!producto) notFound()
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <ProductDetail producto={producto} />
    </div>
  )
}
