import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react'
import { WayuuDivider } from '@/components/wayuu-divider'

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-sidebar text-sidebar-foreground">
      <WayuuDivider />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary font-serif text-lg font-bold text-primary-foreground">
              IA
            </span>
            <span className="font-serif text-base font-bold">IAP La Guajira</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            Investigación Acción Participativa para el fortalecimiento de las comunidades rurales
            del departamento de La Guajira, Colombia.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold">Explorar</h4>
          <ul className="mt-4 space-y-2 text-sm text-sidebar-foreground/70">
            <li><Link href="/marketplace" className="hover:text-sidebar-foreground">Marketplace</Link></li>
            <li><Link href="/comunidades" className="hover:text-sidebar-foreground">Comunidades</Link></li>
            <li><Link href="/turismo" className="hover:text-sidebar-foreground">Turismo comunitario</Link></li>
            <li><Link href="/mapa" className="hover:text-sidebar-foreground">Mapa interactivo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold">Proyecto</h4>
          <ul className="mt-4 space-y-2 text-sm text-sidebar-foreground/70">
            <li><Link href="/proyecto" className="hover:text-sidebar-foreground">Sobre el IAP</Link></li>
            <li><Link href="/publicaciones" className="hover:text-sidebar-foreground">Publicaciones</Link></li>
            <li><Link href="/admin" className="hover:text-sidebar-foreground">Panel administrativo</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-sm font-semibold">Contacto</h4>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/70">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> Riohacha, La Guajira, Colombia</li>
            <li className="flex items-center gap-2"><Mail className="size-4 shrink-0 text-primary" /> contacto@iapguajira.co</li>
            <li className="flex items-center gap-2"><Phone className="size-4 shrink-0 text-primary" /> +57 300 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sidebar-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-sidebar-foreground/60 sm:flex-row sm:px-6">
          <p>&copy; {new Date().getFullYear()} Proyecto IAP La Guajira. Todos los derechos reservados.</p>
          <p>Hecho con respeto por la cultura Wayuu.</p>
        </div>
      </div>
    </footer>
  )
}
