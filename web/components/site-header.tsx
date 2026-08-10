'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/comunidades', label: 'Comunidades' },
  { href: '/publicaciones', label: 'Publicaciones' },
  { href: '/turismo', label: 'Turismo' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/proyecto', label: 'Proyecto IAP' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-md bg-primary font-serif text-lg font-bold text-primary-foreground">
            IA
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-base font-bold">IAP La Guajira</span>
            <span className="text-[11px] text-muted-foreground">Comunidades Wayuu</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
                isActive(item.href) ? 'text-primary' : 'text-foreground/80',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex"
            render={<Link href="/admin" />}
          >
            <ShieldCheck className="size-4" />
            Admin
          </Button>
          <button
            type="button"
            aria-label="Abrir menú"
            className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2.5 text-sm font-medium',
                  isActive(item.href) ? 'bg-muted text-primary' : 'text-foreground/80',
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80"
            >
              Panel administrativo
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
