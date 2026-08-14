import { ShieldCheck } from 'lucide-react'
import type { SectionDefinition } from '../types'

type HeaderPanelProps = {
  section: SectionDefinition
  recordsCount: number
}

export function HeaderPanel({ section, recordsCount }: HeaderPanelProps) {
  return (
    <header className="hero-card">
      <div>
        <p className="eyebrow">Panel administrativo</p>
        <h1>{section.label}</h1>
        <p>{section.description}</p>
      </div>
      <div className="pill">
        <strong>{recordsCount}</strong> registros
      </div>
    </header>
  )
}
