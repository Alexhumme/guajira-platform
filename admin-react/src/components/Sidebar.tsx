import { useState } from 'react'
import type { SectionDefinition, SectionKey } from '../types'
import { LogOut, Menu, X } from 'lucide-react'

type SidebarProps = {
  sections: SectionDefinition[]
  activeSection: SectionKey
  onSelect: (section: SectionKey) => void
  onLogout: () => void
}

export function Sidebar({ sections, activeSection, onSelect, onLogout }: SidebarProps) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <aside className="sidebar-card">
      <div className="brand-box">
        <div className="brand-mark">C</div>
        <div>
          <p className="eyebrow">Comured</p>
          <h2>Panel Admin</h2>
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setNavOpen((v) => !v)}
        >
          {navOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <nav className={navOpen ? 'nav-list open' : 'nav-list'}>
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.key}
              className={section.key === activeSection ? 'nav-item active' : 'nav-item'}
              onClick={() => {
                onSelect(section.key)
                setNavOpen(false)
              }}
              type="button"
            >
              <Icon size={16} />
              <span>{section.label}</span>
            </button>
          )
        })}
      </nav>

      <button className={navOpen ? 'logout-button open' : 'logout-button'} type="button" onClick={onLogout}>
        <LogOut size={16} /> Cerrar sesión
      </button>
    </aside>
  )
}
