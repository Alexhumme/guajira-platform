"use client";

import { useEffect, useState } from "react";
import { PublicationPreview } from "./publication-preview";
import { Publicacion } from "@/lib/data";

export function PublicationPreviews({
  publicaciones,
}: {
  publicaciones: Publicacion[];
}) {
  const [activeId, setActiveId] = useState<string | null>(
    publicaciones[0]?.id ?? null
  );

  /*
   * Detectamos cuál publicación está actualmente
   * visible en el feed.
   */
  useEffect(() => {
    const elements = publicaciones
      .map((p) =>
        document.getElementById(`publication-${p.id}`)
      )
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (visible[0]) {
          setActiveId(
            visible[0].target.id.replace(
              "publication-",
              ""
            )
          );
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
      }
    );

    elements.forEach((element) =>
      observer.observe(element!)
    );

    return () => observer.disconnect();
  }, [publicaciones]);

  const scrollToPublication = (id: string) => {
    const element = document.getElementById(
      `publication-${id}`
    );

    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <aside className="hidden lg:block">

      <div className="sticky top-24">

        <h2 className="mb-4 font-serif text-lg font-semibold">
          Explorar publicaciones
        </h2>

        <div className="grid grid-cols-2 gap-3">

          {publicaciones.map((publicacion) => (
            <PublicationPreview
              key={publicacion.id}
              publicacion={publicacion}
              active={activeId === publicacion.id}
              onClick={() =>
                scrollToPublication(publicacion.id)
              }
            />
          ))}

        </div>

      </div>

    </aside>
  );
}