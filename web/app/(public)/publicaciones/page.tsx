import { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PublicationsClient } from "@/components/publications/publications-client";

export const metadata: Metadata = {
  title: "Publicaciones | Comured",
  description:
    "Conoce las publicaciones de las comunidades y miembros que hacen parte del proyecto Comured en La Guajira.",
};

export default function PublicacionesPage() {
  return (
    <>
      <PageHero
        eyebrow="Nuestra vida"
        title="Publicaciones"
        description="Mantente al tanto de las actualizaciones que hacen nuestras comunidades sobre nuevos productos, eventos y apreciaciones de nuestra cultura."
        image="images/sections/publicaciones.jpg"
      />

      <PublicationsClient />
    </>
  );
}