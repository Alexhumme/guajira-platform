import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Loader2, LogOut, ShieldCheck } from 'lucide-react'
import { AuthScreen } from './components/AuthScreen'
import { EntityModal } from './components/EntityModal'
import { createRecord, deleteRecord, formatValue, readJson, updateRecord } from './lib/api'
import { sections } from './lib/sections'
import type { SectionDefinition, SectionKey } from './types'

type ModalState = {
  open: boolean
  mode: 'create' | 'edit'
  section?: SectionDefinition
  initialValues?: Record<string, unknown>
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionKey>('monitoring')
  const [rowsBySection, setRowsBySection] = useState<Record<SectionKey, Record<string, unknown>[]>>({} as Record<SectionKey, Record<string, unknown>[]>)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'guest'>('loading')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [modalState, setModalState] = useState<ModalState>({ open: false, mode: 'create' })
  const [submitting, setSubmitting] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    async function ensureSession() {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' })
        setAuthState(response.ok ? 'authenticated' : 'guest')
      } catch {
        setAuthState('guest')
      }
    }

    void ensureSession()
  }, [])

  useEffect(() => {
    if (authState !== 'authenticated') return

    const section = sections.find((item) => item.key === activeSection)
    if (!section) return

    async function loadSection() {
      try {
        setLoading(true)
        const data = await readJson<Record<string, unknown>[]>(section.endpoint)
        setRowsBySection((current) => ({ ...current, [activeSection]: Array.isArray(data) ? data : [] }))
      } catch (error) {
        console.error(error)
        setRowsBySection((current) => ({ ...current, [activeSection]: [] }))
      } finally {
        setLoading(false)
      }
    }

    void loadSection()
  }, [activeSection, authState])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setLoginError(data.message || 'No se pudo iniciar sesión.')
        return
      }

      setPassword('')
      setAuthState('authenticated')
    } catch {
      setLoginError('No se pudo conectar con el backend.')
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // ignore cleanup errors
    } finally {
      setAuthState('guest')
      setQuery('')
      setPassword('')
    }
  }

  const currentSection = sections.find((section) => section.key === activeSection) ?? sections[0]
  const filteredRows = useMemo(() => {
    const term = query.toLowerCase()
    const data = rowsBySection[activeSection] ?? []
    if (!term) return data

    return data.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(term)))
  }, [activeSection, query, rowsBySection])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const visibleRows = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredRows.slice(startIndex, startIndex + pageSize)
  }, [filteredRows, page])

  useEffect(() => {
    setPage(1)
  }, [query, activeSection])

  function openCreateModal() {
    setModalState({ open: true, mode: 'create', section: currentSection })
  }

  function openEditModal(row: Record<string, unknown>) {
    setModalState({ open: true, mode: 'edit', section: currentSection, initialValues: row })
  }

  async function handleSubmit(payload: Record<string, unknown>) {
    if (!modalState.section) return

    setSubmitting(true)
    try {
      const section = modalState.section
      const endpoint = `${section.endpoint}/${modalState.mode === 'edit' ? String(payload[section.entityIdKey] ?? '') : ''}`.replace(/\/$/, '')
      const request = modalState.mode === 'edit'
        ? updateRecord<Record<string, unknown>>(endpoint, payload)
        : createRecord<Record<string, unknown>>(section.endpoint, payload)

      const saved = await request
      setRowsBySection((current) => {
        const items = current[section.key] ?? []
        if (modalState.mode === 'edit') {
          return {
            ...current,
            [section.key]: items.map((item) => String(item[section.entityIdKey]) === String(saved[section.entityIdKey] ?? payload[section.entityIdKey]) ? { ...item, ...saved } : item),
          }
        }

        return { ...current, [section.key]: [saved, ...items] }
      })
      setModalState({ open: false, mode: 'create' })
    } catch (error) {
      console.error(error)
      setLoginError(error instanceof Error ? error.message : 'No se pudo guardar el registro')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(row: Record<string, unknown>) {
    const id = row[currentSection.entityIdKey]
    if (!id || !window.confirm('¿Deseas eliminar este registro?')) return

    try {
      await deleteRecord(`${currentSection.endpoint}/${id}`)
      setRowsBySection((current) => ({
        ...current,
        [currentSection.key]: (current[currentSection.key] ?? []).filter((item) => String(item[currentSection.entityIdKey]) !== String(id)),
      }))
    } catch (error) {
      console.error(error)
      setLoginError(error instanceof Error ? error.message : 'No se pudo eliminar el registro')
    }
  }

  if (authState === 'loading') {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <p className="eyebrow">Panel administrativo</p>
          <h1>Verificando sesión...</h1>
          <p>Comprobando tu acceso al panel React.</p>
        </div>
      </div>
    )
  }

  if (authState === 'guest') {
    return (
      <AuthScreen
        username={username}
        password={password}
        error={loginError}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
    )
  }

  return (
    <div className="app-shell">
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
                onClick={() => setActiveSection(section.key)}
              >
                <Icon size={16} />
                <span>{section.label}</span>
              </button>
            )
          })}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </aside>

      <main className="main-panel">
        <header className="hero-card">
          <div>
            <p className="eyebrow">Panel administrativo</p>
            <h1>{currentSection.label}</h1>
            <p>{currentSection.description}</p>
          </div>
          <div className="pill">
            <ShieldCheck size={16} /> Autenticación admin
          </div>
        </header>

        <section className="panel-card">
          <div className="panel-toolbar">
            <div>
              <h3>{currentSection.label}</h3>
              <p className="panel-subtitle">Datos en vivo desde las rutas del backend.</p>
            </div>
            <div className="toolbar-actions">
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en la tabla" />
              {currentSection.canMutate !== false ? (
                <button className="primary-action" onClick={openCreateModal}>Agregar</button>
              ) : null}
            </div>
          </div>

          {loginError ? <p className="auth-error">{loginError}</p> : null}

          {loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={18} /> Cargando datos del panel...
            </div>
          ) : (
            <>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {currentSection.columns.map((column) => (
                        <th key={column.key}>{column.label}</th>
                      ))}
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.length ? visibleRows.map((row, index) => (
                      <tr key={`${row[currentSection.entityIdKey] ?? index}`}>
                        {currentSection.columns.map((column) => {
                          const value = row[column.key]
                          const render = column.render
                          return <td key={column.key}>{render ? render(row) : formatValue(value)}</td>
                        })}
                        <td>
                          <div className="row-actions">
                            <button className="secondary-action" onClick={() => openEditModal(row)}>Editar</button>
                            <button className="danger-action" onClick={() => handleDelete(row)}>Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={currentSection.columns.length + 1} className="empty-row">{currentSection.emptyMessage ?? 'No hay registros para mostrar.'}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Anterior</button>
                <span>Página {page} de {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Siguiente</button>
              </div>
            </>
          )}
        </section>

        <EntityModal
          isOpen={modalState.open}
          title={modalState.mode === 'edit' ? 'Editar registro' : 'Crear registro'}
          fields={currentSection.formFields}
          initialValues={modalState.initialValues ?? {}}
          onClose={() => setModalState({ open: false, mode: 'create' })}
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      </main>
    </div>
  )
}
