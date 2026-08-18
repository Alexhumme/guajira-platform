"use client"

import Image from "next/image"
import { ArrowDown, ArrowUpRight, MapPin, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  ProyectoMosaic,
  ProyectoImage,
  ProyectoNumber,
  ProyectoQuote,
} from "@/components/proyecto/proyecto-mosaic"

import { ProyectoMarquee } from "@/components/proyecto/proyecto-animations"

const lideresProyecto = [
  {
    nombre: "Nombre del líder",
    cargo: "Líder del proyecto IAP",
    imagen: "/placeholder.svg",
  },
  {
    nombre: "Nombre del investigador",
    cargo: "Investigador / líder de proyecto",
    imagen: "/placeholder.svg",
  },
  {
    nombre: "Nombre del líder",
    cargo: "Líder territorial",
    imagen: "/placeholder.svg",
  },
]

const lideresSistema = [
  {
    nombre: "Nombre del investigador",
    cargo: "Sistema de Investigación, Desarrollo Tecnológico e Innovación",
    imagen: "/placeholder.svg",
  },
  {
    nombre: "Nombre del investigador",
    cargo: "Coordinación de investigación",
    imagen: "/placeholder.svg",
  },
]

const territorios = [
  "Puerto Caracol",
  "Tocoromana",
  "Buenos Aires",
  "Santa Rita de la Sierra",
  "Royosira",
  "Guamachito",
  "Pautshamana",
  "El Guajirito",
  "Bayabonda",
  "Grasamana",
]

export default function ProyectoPage() {
  return (
    <main className="overflow-hidden">

      {/* =====================================================
          INTRODUCCIÓN
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">

        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              El proyecto
            </p>
          </div>

          <div>
            <h2 className="max-w-4xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Investigación que parte del territorio y construye con sus
              comunidades.
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              El proyecto IAP busca reconocer las necesidades y oportunidades
              existentes en los territorios para desarrollar soluciones que
              respondan a sus realidades sociales, productivas, culturales y
              tecnológicas.
            </p>

            <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
              El trabajo combina investigación, acompañamiento técnico,
              apropiación tecnológica y construcción participativa para fortalecer
              iniciativas comunitarias y generar herramientas que contribuyan al
              desarrollo productivo local.
            </p>
          </div>

        </div>
      </section>


      {/* =====================================================
          MOSAICO PRINCIPAL
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

        <ProyectoMosaic>

          <ProyectoImage
            src="/placeholder.svg"
            alt="Actividad comunitaria"
            className="lg:col-span-2 lg:row-span-2 min-h-[420px]"
          />

          <ProyectoNumber
            number="01"
            title="Diagnóstico"
            text="Reconocimiento participativo de necesidades, capacidades y oportunidades presentes en las comunidades."
          />

          <ProyectoNumber
            number="02"
            title="Co-creación"
            text="Diseño de soluciones junto con los actores del territorio, integrando conocimientos locales y herramientas tecnológicas."
          />

          <ProyectoImage
            src="/placeholder.svg"
            alt="Trabajo en territorio"
            className="min-h-[280px]"
          />

        </ProyectoMosaic>

      </section>


      {/* =====================================================
          ACTIVIDADES
      ====================================================== */}

      <section className="mt-32 bg-[#f3eee7] py-24 sm:py-32">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mb-16 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Trabajo territorial
            </p>

            <div>
              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
                Del diagnóstico a la acción.
              </h2>

              <p className="mt-6 max-w-2xl text-muted-foreground">
                Las actividades desarrolladas en los territorios articulan
                acompañamiento, formación, investigación y desarrollo de
                herramientas para fortalecer las iniciativas de las comunidades.
              </p>
            </div>

          </div>


          <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                numero: "01",
                titulo: "Diagnóstico participativo",
                texto:
                  "Identificación de necesidades digitales, tecnológicas y productivas.",
              },
              {
                numero: "02",
                titulo: "Formación",
                texto:
                  "Procesos de capacitación para el fortalecimiento de capacidades comunitarias.",
              },
              {
                numero: "03",
                titulo: "Desarrollo tecnológico",
                texto:
                  "Construcción de plataformas, herramientas digitales y recursos interactivos.",
              },
              {
                numero: "04",
                titulo: "Visibilidad",
                texto:
                  "Fortalecimiento de la presencia digital de las iniciativas y productos comunitarios.",
              },
            ].map((actividad) => (

              <article
                key={actividad.numero}
                className="bg-[#f3eee7] p-7 transition-colors duration-300 hover:bg-white sm:p-9"
              >

                <span className="text-xs font-semibold tracking-[0.2em] text-primary">
                  {actividad.numero}
                </span>

                <h3 className="mt-16 font-serif text-2xl">
                  {actividad.titulo}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {actividad.texto}
                </p>

              </article>

            ))}

          </div>

        </div>
      </section>


      {/* =====================================================
          TERRITORIOS
      ====================================================== */}

      <section className="relative py-28 sm:py-36">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Territorio
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Comunidades que hacen parte del proceso.
              </h2>

              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
                El proyecto se desarrolla mediante el acompañamiento directo
                a comunidades y organizaciones del territorio.
              </p>

            </div>

            <div className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3">

              {territorios.map((territorio, index) => (

                <div
                  key={territorio}
                  className="group border-b border-r border-border p-5 transition-colors hover:bg-muted/50 sm:p-7"
                >

                  <span className="text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="mt-8 font-medium">
                    {territorio}
                  </p>

                  <MapPin className="mt-5 size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SENA
      ====================================================== */}

      <section className="bg-[#17130f] text-white">

        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-12">

          <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                SENA
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
                Formación y tecnología al servicio del desarrollo productivo.
              </h2>

            </div>

            <div className="space-y-6 text-white/65">

              <p className="leading-relaxed">
                El SENA articula formación, investigación aplicada, desarrollo
                tecnológico y acompañamiento para contribuir al fortalecimiento
                de las capacidades productivas de las comunidades.
              </p>

              <p className="leading-relaxed">
                A través de estos procesos se busca que las herramientas
                desarrolladas no sean únicamente soluciones tecnológicas, sino
                instrumentos apropiados por las personas y organizaciones que
                participan en el territorio.
              </p>

            </div>

          </div>


          <div className="mt-20 grid gap-px bg-white/15 sm:grid-cols-3">

            <div className="bg-[#17130f] p-8">
              <Users className="size-5 text-white/50" />
              <p className="mt-8 font-serif text-2xl">
                Formación
              </p>
              <p className="mt-3 text-sm text-white/50">
                Transferencia y fortalecimiento de conocimientos.
              </p>
            </div>

            <div className="bg-[#17130f] p-8">
              <ArrowUpRight className="size-5 text-white/50" />
              <p className="mt-8 font-serif text-2xl">
                Innovación
              </p>
              <p className="mt-3 text-sm text-white/50">
                Desarrollo de soluciones relacionadas con las necesidades del territorio.
              </p>
            </div>

            <div className="bg-[#17130f] p-8">
              <MapPin className="size-5 text-white/50" />
              <p className="mt-8 font-serif text-2xl">
                Territorio
              </p>
              <p className="mt-3 text-sm text-white/50">
                Conocimiento construido desde las comunidades.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MOSAICO DE ACTIVIDADES
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-12">

        <div className="mb-14">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            En territorio
          </p>

          <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
            Una investigación que también sucede fuera del laboratorio.
          </h2>

        </div>


        <ProyectoMosaic>

          <ProyectoImage
            src="/placeholder.svg"
            alt="Formación comunitaria"
            className="min-h-[350px]"
          />

          <ProyectoImage
            src="/placeholder.svg"
            alt="Actividad de formación"
            className="min-h-[350px]"
          />

          <ProyectoImage
            src="/placeholder.svg"
            alt="Trabajo con comunidades"
            className="lg:col-span-2 min-h-[420px]"
          />

        </ProyectoMosaic>

      </section>


      {/* =====================================================
          LÍDERES
      ====================================================== */}

      <section className="border-t border-border py-28 sm:py-36">

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mb-16 max-w-3xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Equipo
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
              Personas detrás del proceso.
            </h2>

            <p className="mt-6 text-muted-foreground">
              El desarrollo del proyecto es posible gracias a la articulación
              entre investigadores, líderes territoriales, instructores y
              comunidades.
            </p>

          </div>


          <div className="grid gap-12 lg:grid-cols-2">

            {/* Líderes del proyecto */}

            <div>

              <div className="mb-7 flex items-center justify-between border-b border-border pb-4">

                <h3 className="font-serif text-2xl">
                  Líderes del proyecto
                </h3>

                <span className="text-xs text-muted-foreground">
                  IAP
                </span>

              </div>

              <div className="space-y-0">

                {lideresProyecto.map((lider, index) => (

                  <div
                    key={index}
                    className="group flex items-center gap-5 border-b border-border py-5"
                  >

                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={lider.imagen}
                        alt={lider.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div>
                      <p className="font-medium">
                        {lider.nombre}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {lider.cargo}
                      </p>
                    </div>

                  </div>

                ))}

              </div>

            </div>


            {/* Sistema de investigación */}

            <div>

              <div className="mb-7 flex items-center justify-between border-b border-border pb-4">

                <h3 className="font-serif text-2xl">
                  Sistema de investigación
                </h3>

                <span className="text-xs text-muted-foreground">
                  SENA
                </span>

              </div>

              <div className="space-y-0">

                {lideresSistema.map((lider, index) => (

                  <div
                    key={index}
                    className="group flex items-center gap-5 border-b border-border py-5"
                  >

                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Image
                        src={lider.imagen}
                        alt={lider.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <div>
                      <p className="font-medium">
                        {lider.nombre}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {lider.cargo}
                      </p>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CIERRE / FRASE
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#b32920] py-28 text-white sm:py-36">

        <div className="absolute inset-0 opacity-10">
          <ProyectoMarquee />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">

          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Investigación aplicada
          </p>

          <h2 className="mt-7 font-serif text-4xl leading-tight sm:text-6xl">
            El desarrollo comienza cuando el conocimiento encuentra al territorio.
          </h2>

        </div>

      </section>

    </main>
  )
}