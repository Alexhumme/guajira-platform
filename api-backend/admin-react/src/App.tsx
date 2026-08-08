import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Loader2, LogOut, ShieldCheck } from 'lucide-react'
import { AuthScreen } from './components/AuthScreen'
import { EntityModal } from './components/EntityModal'
import { createRecord, deleteRecord, formatValue, readJson, resolveApiPath, updateRecord } from './lib/api'
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
  const [previewPost, setPreviewPost] = useState<Record<string, unknown> | null>(null)
  const [previewMedia, setPreviewMedia] = useState<string[]>([])
  const [previewLoading, setPreviewLoading] = useState(false)
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

    const endpoint = section.endpoint

    async function loadSection() {
      try {
        setLoading(true)
        const data = await readJson<Record<string, unknown>[]>(endpoint)
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
        const errorMessage = data.message || 'No se pudo iniciar sesión.'
        setLoginError(errorMessage)
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

  async function commitNestedChanges(section: SectionDefinition, recordId: string, nestedChanges: Record<string, { items: Record<string, unknown>[]; removedIds: string[] }>) {
    for (const [fieldKey, changes] of Object.entries(nestedChanges)) {
      const field = section.formFields.find((item) => item.key === fieldKey)
      if (!field || !field.nestedEndpoint || !field.nestedCollectionKey) continue

      const basePath = `${field.nestedEndpoint}/${recordId}/${field.nestedCollectionKey}`
      for (const mediaId of changes.removedIds) {
        try {
          await deleteRecord(`${basePath}/${mediaId}`)
        } catch (error) {
          console.error('Error eliminando elemento anidado:', fieldKey, mediaId, error)
        }
      }

      for (const item of changes.items) {
        if (!item.isNew) continue
        try {
          await createRecord(basePath, item)
        } catch (error) {
          console.error('Error guardando elemento anidado:', fieldKey, item, error)
        }
      }
    }
  }

  async function handleSubmit(payload: Record<string, unknown>, nestedChanges: Record<string, { items: Record<string, unknown>[]; removedIds: string[] }> = {}) {
    if (!modalState.section) return

    setSubmitting(true)
    try {
      const section = modalState.section
      const editId = modalState.mode === 'edit'
        ? String(payload[section.entityIdKey] ?? modalState.initialValues?.[section.entityIdKey] ?? '')
        : ''
      const endpoint = `${section.endpoint}/${editId}`.replace(/\/$/, '')
      const request = modalState.mode === 'edit'
        ? updateRecord<Record<string, unknown>>(endpoint, payload)
        : createRecord<Record<string, unknown>>(section.endpoint, payload)

      const saved = await request
      const recordId = String(saved[section.entityIdKey] ?? payload[section.entityIdKey] ?? editId)

      if (recordId && Object.keys(nestedChanges).length) {
        await commitNestedChanges(section, recordId, nestedChanges)
      }

      const updatedRows = await readJson<Record<string, unknown>[]>(section.endpoint)
      setRowsBySection((current) => ({
        ...current,
        [section.key]: Array.isArray(updatedRows) ? updatedRows : [],
      }))

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
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el registro'
      setLoginError(message)
    }
  }

  async function handleViewPost(row: Record<string, unknown>) {
    const id = String(row.id_post ?? row[Object.keys(row).find((key) => key === 'id_post') ?? ''])
    if (!id) return

    setPreviewLoading(true)
    try {
      const data = await readJson<Record<string, unknown>[]>(`/api/posts/${id}/media`)
      const items = Array.isArray(data)
        ? data.map((item) => String(item.media_dir ?? ''))
        : []
      setPreviewMedia(items)
      setPreviewPost(row)
    } catch (error) {
      console.error('Error cargando preview del post:', error)
      setPreviewMedia([])
      setPreviewPost(row)
    } finally {
      setPreviewLoading(false)
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
          <div className="pill">
            <strong>{rowsBySection[currentSection.key]?.length ?? 0}</strong> registros
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
                          let content = render ? render(row) : formatValue(value)
                          if (currentSection.key === 'miembros' && column.key === 'avatar_dir') {
                            const src = String(row.avatar_dir ?? '')
                            const resolvedSrc = src ? resolveApiPath(src) : ''
                            content = resolvedSrc ? <img src={resolvedSrc} alt="Avatar" style={{ width: 32, height: 32, borderRadius: '999px', objectFit: 'cover' }} /> : '—'
                          }
                          return <td key={column.key}>{content}</td>
                        })}
                        <td>
                          <div className="row-actions">
                            {currentSection.key === 'posts' ? (
                              <button className="secondary-action" onClick={() => void handleViewPost(row)}>Ver</button>
                            ) : null}
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
        {previewPost ? (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal-card preview-modal">
              <div className="modal-header">
                <h3>Preview del post</h3>
                <button type="button" className="modal-close" onClick={() => setPreviewPost(null)}>Cerrar</button>
              </div>
              <div className="preview-card-body">
                <div className="preview-header">
                  <div className="preview-avatar">
                    {previewPost.avatar_dir ? (
                      <img src={resolveApiPath(String(previewPost.avatar_dir))} alt="Avatar" />
                    ) : (
                      <span>{String(previewPost.miembro ?? '').charAt(0).toUpperCase() || 'P'}</span>
                    )}
                  </div>
                  <div>
                    <p className="preview-author">{String(previewPost.miembro ?? '')}</p>
                    <p className="preview-subtitle">{String(previewPost.comunidad ?? '')} · {String(previewPost.fecha_registro ?? '')}</p>
                  </div>
                </div>
                <p className="preview-description">{String(previewPost.descripcion ?? '')}</p>
                <div className="preview-info">
                  <span>Likes: {String(previewPost.likes ?? 0)}</span>
                  <span>{previewPost.visibilidad ? 'Visible' : 'No visible'}</span>
                </div>
                {previewLoading ? (
                  <div className="empty-state">Cargando recursos...</div>
                ) : previewMedia.length ? (
                  <div className="preview-gallery">
                    <div className="preview-main-media">
                      {previewMedia[0].match(/\.(mp4|webm|mov|ogg)$/i) ? (
                        <video src={resolveApiPath(String(previewMedia[0]))} controls className="preview-main-video" />
                      ) : (
                        <img src={resolveApiPath(String(previewMedia[0]))} alt="Recurso principal" />
                      )}
                    </div>
                    {previewMedia.length > 1 ? (
                      <div className="preview-thumbs">
                        {previewMedia.slice(1).map((media) => (
                          <div key={media} className="preview-thumb">
                            {media.match(/\.(mp4|webm|mov|ogg)$/i) ? (
                              <video src={resolveApiPath(String(media))} muted className="preview-thumb-video" />
                            ) : (
                              <img src={resolveApiPath(String(media))} alt="Recurso" />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="empty-state">No hay recursos para este post.</div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
