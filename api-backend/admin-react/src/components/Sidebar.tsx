import type { SectionDefinition, SectionKey } from '../types'
import { LogOut } from 'lucide-react'

type SidebarProps = {
  sections: SectionDefinition[]
  activeSection: SectionKey
  onSelect: (section: SectionKey) => void
  onLogout: () => void
}

export function Sidebar({ sections, activeSection, onSelect, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar-card">
      <div className="brand-box">
        <div className="brand-mark">G</div>
        <div>
          <p className="eyebrow">Guajira</p>
          <h2>Admin React</h2>
        </div>
      </div>

      <nav className="nav-list">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.key}
              className={section.key === activeSection ? 'nav-item active' : 'nav-item'}
              onClick={() => onSelect(section.key)}
              type="button"
            >
              <Icon size={16} />
              <span>{section.label}</span>
            </button>
          )
        })}
      </nav>

      <button className="logout-button" type="button" onClick={onLogout}>
        <LogOut size={16} /> Cerrar sesión
      </button>
    </aside>
  )
}
