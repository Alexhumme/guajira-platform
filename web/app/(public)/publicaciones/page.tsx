import { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPublicaciones } from "@/lib/api";

export const metadata: Metadata = {
  title: 'Publicaciones | IAP La Guajira',
  description: 'Conoce las comunidades Wayuu que hacen parte del proyecto IAP en La Guajira.',
}

export default async function PublicacionesPage() {
    const publicaciones = await getPublicaciones()
    return (
        <>
            <PageHero 
            eyebrow="Nuestra vida" 
            title="Publicaciones"
            description="Mantente al tanto de las actualizaciones que hacen nuestras comunidades sobre nuevos productos, eventos y apreciaciones de nuestra cultura"
            image="images/sections/publicaciones.jpg"
            >

            </PageHero>

            <section>
                {
                    
                }
            </section>
        </>
    )
}