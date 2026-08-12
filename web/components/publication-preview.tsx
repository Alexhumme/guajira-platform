"use client";

import Image from "next/image";
import { Publicacion } from "@/lib/data";

export function PublicationPreview({
  publicacion,
  active,
  onClick,
}: {
  publicacion: Publicacion;
  active: boolean;
  onClick: () => void;
}) {
  const imagen = publicacion.imagenes?.[0];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative aspect-square overflow-hidden rounded-lg
        border-2 transition-all
        ${
          active
            ? "border-primary ring-2 ring-primary/20"
            : "border-transparent hover:border-border"
        }
      `}
    >

      {imagen ? (
        <Image
          src={imagen}
          alt=""
          fill
          sizes="130px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted p-3 text-center text-xs text-muted-foreground">
          {publicacion.autor}
        </div>
      )}

    </button>
  );
}