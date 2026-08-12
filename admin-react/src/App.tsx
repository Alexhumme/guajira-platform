import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { AuthScreen } from './components/AuthScreen'
import { EntityModal } from './components/EntityModal'
import { EntityTable } from './components/EntityTable'
import { HeaderPanel } from './components/HeaderPanel'
import { ListToolbar } from './components/ListToolbar'
import { Pagination } from './components/Pagination'
import { PostPreviewModal } from './components/PostPreviewModal'
import { Sidebar } from './components/Sidebar'
import { createRecord, deleteRecord, readJson, resolveApiPath, updateRecord } from './lib/api'
import { useAuthState, useSectionData } from './lib/hooks'
import { formatValue } from './lib/utils'
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
  const [authState, setAuthState] = useAuthState()
  const currentSection = sections.find((section) => section.key === activeSection) ?? sections[0]
  const { rowsBySection, setRowsBySection, loading } = useSectionData(currentSection.endpoint, activeSection, authState)
  const [query, setQuery] = useState('')
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

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError('')

    try {
      const response = await fetch(resolveApiPath('/api/auth/login'), {
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
      await fetch(resolveApiPath('/api/auth/logout'), { method: 'POST', credentials: 'include' })
    } catch {
      // ignore cleanup errors
    } finally {
      setAuthState('guest')
      setQuery('')
      setPassword('')
    }
  }

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
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onSelect={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="main-panel">
        <HeaderPanel section={currentSection} recordsCount={rowsBySection[currentSection.key]?.length ?? 0} />

        <section className="panel-card">
          <ListToolbar
            title={currentSection.label}
            subtitle="Datos en vivo desde las rutas del backend."
            query={query}
            onQueryChange={setQuery}
            onAdd={currentSection.canMutate !== false ? openCreateModal : undefined}
            canAdd={currentSection.canMutate !== false}
          />

          {loginError ? <p className="auth-error">{loginError}</p> : null}

          {loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={18} /> Cargando datos del panel...
            </div>
          ) : (
            <>
              <EntityTable
                rows={visibleRows}
                columns={currentSection.columns}
                entityIdKey={currentSection.entityIdKey}
                currentSectionKey={currentSection.key}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onViewPost={currentSection.key === 'posts' ? handleViewPost : undefined}
                formatValue={formatValue}
                resolveApiPath={resolveApiPath}
              />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
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
          <PostPreviewModal
            post={previewPost}
            media={previewMedia}
            loading={previewLoading}
            onClose={() => setPreviewPost(null)}
          />
        ) : null}
      </main>
    </div>
  )
}
