import type { FormEvent } from 'react'

// Pantalla de acceso reutilizable para el panel admin.
type AuthScreenProps = {
  username: string
  password: string
  error: string
  onUsernameChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AuthScreen({ username, password, error, onUsernameChange, onPasswordChange, onSubmit }: AuthScreenProps) {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="eyebrow">Guajira admin</p>
        <h1>Iniciar sesión</h1>
        <p>Accede con tu usuario y contraseña del panel administrativo.</p>
        <form onSubmit={onSubmit} className="auth-form">
          <input value={username} onChange={(event) => onUsernameChange(event.target.value)} placeholder="Usuario" required />
          <input value={password} type="password" onChange={(event) => onPasswordChange(event.target.value)} placeholder="Contraseña" required />
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}
