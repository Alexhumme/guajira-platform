import { ProductoPageClient } from "@/components/products/producto-page-client"

// No API dependency at build time: one static page is generated and the real
// slug is resolved entirely on the client. The hosting server must rewrite
// /marketplace/<slug> to this page (see public/.htaccess).
export async function generateStaticParams() {
  return [{ slug: 'index' }]
}

export default function ProductoPage() {
  return <ProductoPageClient />
}
