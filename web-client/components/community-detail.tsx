"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Calendar, Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { RouteCard } from "@/components/route-card"
import { PublicationCard } from "@/components/publication-card"
import { WayuuDivider } from "@/components/wayuu-divider"
import { cn } from "@/lib/utils"
import {
  type Comunidad,
  getMunicipio,
  productosByComunidad,
  publicacionesByComunidad,
  rutasByComunidad,
  serviciosByComunidad,
} from "@/lib/data"

const tabs = ["Historia", "Cultura", "Productos", "Turismo", "Publicaciones", "Contacto"] as const
type Tab = (typeof tabs)[number]

export function CommunityDetail({ comunidad }: { comunidad: Comunidad }) {
  const [tab, setTab] = useState<Tab>("Historia")
  const municipio = getMunicipio(comunidad.municipioId)
  const productos = productosByComunidad(comunidad.id)
  const rutas = rutasByComunidad(comunidad.id)
  const publicaciones = publicacionesByComunidad(comunidad.id)
  const servicios = serviciosByComunidad(comunidad.id)

  return (
    <>
      <section className="relative h-[52vh] min-h-80 w-full overflow-hidden">
        <Image src={comunidad.portada || "/placeholder.svg"} alt={comunidad.nombre} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-background/80">
            <MapPin className="size-4" />
            <span>
              {municipio?.nombre}, {municipio?.departamento}
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold text-background text-balance md:text-5xl">
            {comunidad.nombre}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-background/90">{comunidad.descripcion}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Badge variant="onDark">
              <Users className="size-3.5" /> {comunidad.familias} familias
            </Badge>
            <Badge variant="onDark">
              <Calendar className="size-3.5" /> Desde {comunidad.fundacion}
            </Badge>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {tab === "Historia" && (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-serif text-2xl font-bold">Historia de la comunidad</h2>
              <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{comunidad.historia}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {comunidad.galeria.map((img) => (
                <div key={img} className="relative aspect-square overflow-hidden rounded-xl border border-border">
                  <Image src={img || "/placeholder.svg"} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Cultura" && (
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl font-bold">Cultura y saberes</h2>
            <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{comunidad.cultura}</p>
          </div>
        )}

        {tab === "Productos" && (
          <div>
            <h2 className="font-serif text-2xl font-bold">Productos de la comunidad</h2>
            {productos.length ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {productos.map((p) => (
                  <ProductCard key={p.id} producto={p} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">Aún no hay productos registrados.</p>
            )}
          </div>
        )}

        {tab === "Turismo" && (
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-2xl font-bold">Rutas relacionadas</h2>
              {rutas.length ? (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rutas.map((r) => (
                    <RouteCard key={r.id} ruta={r} />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-muted-foreground">Sin rutas asociadas por ahora.</p>
              )}
            </div>
            {servicios.length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-bold">Servicios turísticos</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {servicios.map((s) => (
                    <div key={s.id} className="rounded-xl border border-border p-4">
                      <Badge variant="secondary">{s.tipo}</Badge>
                      <p className="mt-2 font-medium">{s.nombre}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{s.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "Publicaciones" && (
          <div>
            <h2 className="font-serif text-2xl font-bold">Publicaciones</h2>
            {publicaciones.length ? (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {publicaciones.map((p) => (
                  <PublicationCard key={p.id} publicacion={p} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-muted-foreground">Esta comunidad aún no ha publicado.</p>
            )}
          </div>
        )}

        {tab === "Contacto" && (
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl font-bold">Contacto</h2>
            <div className="mt-6 space-y-3">
              <a href={`tel:${comunidad.contacto.telefono}`} className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary">
                <Phone className="size-5 text-primary" />
                <span>{comunidad.contacto.telefono}</span>
              </a>
              <a href={`mailto:${comunidad.contacto.correo}`} className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary">
                <Mail className="size-5 text-primary" />
                <span>{comunidad.contacto.correo}</span>
              </a>
              <a
                href={`https://wa.me/${comunidad.contacto.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary"
              >
                <MessageCircle className="size-5 text-primary" />
                <span>WhatsApp</span>
              </a>
              {(comunidad.redes.facebook || comunidad.redes.instagram) && (
                <div className="flex gap-3 pt-2">
                  {comunidad.redes.instagram && (
                    <Badge variant="outline">
                      <svg width={30} height={30} href="/icons/instagram.svg"><use href="" /></svg> {comunidad.redes.instagram}
                    </Badge>
                  )}
                  {comunidad.redes.facebook && (
                    <Badge variant="outline">
                      <svg><use href="/icons/facebook.svg" /></svg> {comunidad.redes.facebook}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button className="mt-6 h-11 px-5" render={<Link href="/marketplace" />}>
              Ver todos sus productos
            </Button>
          </div>
        )}
      </section>
      <WayuuDivider />
    </>
  )
}
