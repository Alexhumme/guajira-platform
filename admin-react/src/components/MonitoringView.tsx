import { useEffect, useState } from 'react'
import { Loader2, Check, X } from 'lucide-react'
import { readJson, resolveApiPath } from '../lib/api'

type MonitoringRow = Record<string, unknown>

type MaturityLevel = { label: string; color: string }

type MonitoringDetail = {
  profile: {
    nombre: string
    logo_dir?: string | null
    portada_dir?: string | null
    descripcion?: string | null
    numero_contacto?: string | null
    direccion?: string | null
    municipio?: string
    departamento?: string
  }
  media?: { id_comunidad_media: string; media_dir: string }[]
  counts: Record<string, number>
  maturity: {
    score: number
    maxScore: number
    level: MaturityLevel
    indicators: { key: string; label: string; ok: boolean }[]
  }
}

// Vista personalizada de monitoreo: tabla sin acciones y panel lateral de detalle.
export function MonitoringView({ rows, emptyMessage }: { rows: MonitoringRow[]; emptyMessage: string }) {
  const [selectedId, setSelectedId] = useState<string | number | null>(null)
  const [detail, setDetail] = useState<MonitoringDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  useEffect(() => {
    if (selectedId === null) {
      setDetail(null)
      return
    }

    let isMounted = true
    setDetailLoading(true)
    setDetailError(null)

    readJson<MonitoringDetail>(`/api/monitoring/comunidades/${selectedId}`)
      .then((data) => { if (isMounted) setDetail(data) })
      .catch((err) => { if (isMounted) setDetailError(err instanceof Error ? err.message : 'No se pudo cargar el detalle') })
      .finally(() => { if (isMounted) setDetailLoading(false) })

    return () => { isMounted = false }
  }, [selectedId])

  return (
    <div className="monitoring-layout">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Comunidad</th>
              <th>Municipio</th>
              <th>Departamento</th>
              <th>Madurez</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row, index) => {
              const id = row.id_comunidad as string | number
              const level = row.maturity_level as MaturityLevel | undefined
              return (
                <tr
                  key={String(id ?? index)}
                  className={selectedId === id ? 'row-selected' : ''}
                  onClick={() => setSelectedId(id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{String(row.nombre ?? '')}</td>
                  <td>{String(row.municipio ?? '')}</td>
                  <td>{String(row.departamento ?? '')}</td>
                  <td>
                    {level ? (
                      <span className="maturity-badge" style={{ background: level.color }}>
                        {String(row.maturity_score ?? 0)}/10 · {level.label}
                      </span>
                    ) : (
                      String(row.maturity_score ?? '')
                    )}
                  </td>
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={4}>
                  <div className="empty-state">{emptyMessage}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedId !== null ? (
        <aside className="monitoring-detail">
          {detailLoading ? (
            <div className="empty-state"><Loader2 className="spin" size={18} /> Cargando detalle...</div>
          ) : detailError ? (
            <p className="auth-error">{detailError}</p>
          ) : detail ? (
            <>
              {detail.profile.portada_dir ? (
                <img className="monitoring-portada" src={resolveApiPath(detail.profile.portada_dir)} alt={`Portada de ${detail.profile.nombre}`} />
              ) : null}
              <div className="monitoring-detail-header">
                {detail.profile.logo_dir ? (
                  <img className="monitoring-logo" src={resolveApiPath(detail.profile.logo_dir)} alt={`Logo de ${detail.profile.nombre}`} />
                ) : null}
                <div>
                  <h3>{detail.profile.nombre}</h3>
                  <p className="muted">{detail.profile.municipio} · {detail.profile.departamento}</p>
                </div>
              </div>

              {detail.profile.descripcion ? <p>{detail.profile.descripcion}</p> : null}
              {detail.profile.numero_contacto ? <p className="muted">Contacto: {detail.profile.numero_contacto}</p> : null}
              {detail.profile.direccion ? <p className="muted">Dirección: {detail.profile.direccion}</p> : null}

              {detail.media && detail.media.length > 0 ? (
                <div className="monitoring-gallery">
                  {detail.media.map((item) => (
                    <img key={item.id_comunidad_media} src={resolveApiPath(item.media_dir)} alt={`Foto de ${detail.profile.nombre}`} />
                  ))}
                </div>
              ) : null}

              <div className="monitoring-maturity">
                <p>
                  <strong>Madurez:</strong>{' '}
                  <span className="maturity-badge" style={{ background: detail.maturity.level.color }}>
                    {detail.maturity.score}/{detail.maturity.maxScore} · {detail.maturity.level.label}
                  </span>
                </p>
                <ul className="indicator-list">
                  {detail.maturity.indicators.map((item) => (
                    <li key={item.key} className={item.ok ? 'indicator-ok' : 'indicator-fail'}>
                      {item.ok ? <Check size={14} /> : <X size={14} />} {item.label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="monitoring-counts">
                {Object.entries(detail.counts).map(([key, value]) => (
                  <span key={key} className="count-chip">{key}: {value}</span>
                ))}
              </div>
            </>
          ) : null}
        </aside>
      ) : null}
    </div>
  )
}
