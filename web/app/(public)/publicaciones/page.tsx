import { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPublicaciones, getComunidades, getMiembros } from "@/lib/api";
import { PublicationsClient } from "@/components/publications-client";

export const metadata: Metadata = {
  title: "Publicaciones | IAP La Guajira",
  description:
    "Conoce las publicaciones de las comunidades y miembros que hacen parte del proyecto IAP en La Guajira.",
};

export default async function PublicacionesPage() {
  const [publicaciones, comunidades, miembros] = await Promise.all([
    getPublicaciones(),
    getComunidades(),
    getMiembros(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Nuestra vida"
        title="Publicaciones"
        description="Mantente al tanto de las actualizaciones que hacen nuestras comunidades sobre nuevos productos, eventos y apreciaciones de nuestra cultura."
        image="images/sections/publicaciones.jpg"
      />

      <PublicationsClient
        publicaciones={publicaciones}
        comunidades={comunidades}
        miembros={miembros}
      />
    </>
  );
}