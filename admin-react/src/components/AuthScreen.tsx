import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <p className="eyebrow">Comured admin</p>
        <h1>Iniciar sesión</h1>
        <p>Accede con tu usuario y contraseña del panel administrativo.</p>
        <form onSubmit={onSubmit} className="auth-form">
          <input value={username} onChange={(event) => onUsernameChange(event.target.value)} placeholder="Usuario" required />
          <div className="password-field">
            <input value={password} type={showPassword ? 'text' : 'password'} onChange={(event) => onPasswordChange(event.target.value)} placeholder="Contraseña" required />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error ? <p className="auth-error">{error}</p> : null}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  )
}
