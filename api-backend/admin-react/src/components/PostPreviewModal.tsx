import type { ReactNode } from 'react'
import { resolveApiPath } from '../lib/api'

type PostPreviewModalProps = {
  post: Record<string, unknown>
  media: string[]
  loading: boolean
  onClose: () => void
}

export function PostPreviewModal({ post, media, loading, onClose }: PostPreviewModalProps) {
  const avatarSrc = post.avatar_dir ? resolveApiPath(String(post.avatar_dir)) : ''

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card preview-modal">
        <div className="modal-header">
          <h3>Preview del post</h3>
          <button type="button" className="modal-close" onClick={onClose}>Cerrar</button>
        </div>
        <div className="preview-card-body">
          <div className="preview-header">
            <div className="preview-avatar">
              {avatarSrc ? <img src={avatarSrc} alt="Avatar" /> : <span>{String(post.miembro ?? '').charAt(0).toUpperCase() || 'P'}</span>}
            </div>
            <div>
              <p className="preview-author">{String(post.miembro ?? '')}</p>
              <p className="preview-subtitle">{String(post.comunidad ?? '')} · {String(post.fecha_registro ?? '')}</p>
            </div>
          </div>
          <p className="preview-description">{String(post.descripcion ?? '')}</p>
          <div className="preview-info">
            <span>Likes: {String(post.likes ?? 0)}</span>
            <span>{post.visibilidad ? 'Visible' : 'No visible'}</span>
          </div>
          {loading ? (
            <div className="empty-state">Cargando recursos...</div>
          ) : media.length ? (
            <div className="preview-gallery">
              <div className="preview-main-media">
                {media[0].match(/\.(mp4|webm|mov|ogg)$/i) ? (
                  <video src={resolveApiPath(String(media[0]))} controls className="preview-main-video" />
                ) : (
                  <img src={resolveApiPath(String(media[0]))} alt="Recurso principal" />
                )}
              </div>
              {media.length > 1 ? (
                <div className="preview-thumbs">
                  {media.slice(1).map((mediaItem) => (
                    <div key={mediaItem} className="preview-thumb">
                      {mediaItem.match(/\.(mp4|webm|mov|ogg)$/i) ? (
                        <video src={resolveApiPath(String(mediaItem))} muted className="preview-thumb-video" />
                      ) : (
                        <img src={resolveApiPath(String(mediaItem))} alt="Recurso" />
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
  )
}
