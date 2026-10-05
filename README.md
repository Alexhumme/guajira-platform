# Guajira Platform

Plataforma integral para visibilizar y gestionar comunidades rurales de La Guajira: marketplace artesanal, rutas turísticas, publicaciones y panel de administración.

## Estructura del monorepo

| Directorio | Stack | Descripción |
|---|---|---|
| `api/` | Node.js + Express 5 + MySQL2 | Backend REST con sesiones en MySQL, subida de archivos y exportación a Excel |
| `web/` | Next.js 16 + React 19 + Tailwind CSS 4 | Sitio público (comunidades, rutas, tienda, publicaciones) |
| `admin-react/` | Vite + React 19 | Panel de administración con CRUDs, autenticación y monitoreo |
| `app/` | React Native 0.82 | Aplicación móvil (en estado inicial) |

## Requisitos

- Node.js >= 20
- MySQL 8 (o compatible)
- npm

## Puesta en marcha

### 1. Base de datos

```sql
CREATE DATABASE comured;
```

```bash
mysql -u root -p comured < api/sql/schema.sql
mysql -u root -p comured < api/sql/seed.sql
```

### 2. API (`api/`)

```bash
cd api
cp .env.example .env   # ajustar credenciales de BD, SESSION_SECRET, etc.
npm install
npm run dev            # http://localhost:5000
```

Variables clave en `api/.env`: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`, `SESSION_SECRET`, `ADMIN_BOOTSTRAP_USER`, `ADMIN_BOOTSTRAP_PASSWORD`.

### 3. Sitio web (`web/`)

```bash
cd web
# .env debe definir NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev            # http://localhost:3000
```

### 4. Panel de administración (`admin-react/`)

```bash
cd admin-react
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

### 5. App móvil (`app/`)

```bash
cd app
npm install
npm run android        # o npm run ios
```

## API

- Rutas públicas del sitio: `/web-client/*` (`web/lib/api` en el frontend)
- Rutas administrativas: `/api/*` (auth, CRUDs de comunidades, productos, rutas, miembros, post, categorías, municipios, roles, exportación y monitoreo)
- Assets estáticos subidos por usuarios: `/uploads/*`

## Scripts

| Subproyecto | `dev` | `build` | `start` |
|---|---|---|---|
| `api` | `nodemon server.js` | — | `node server.js` |
| `web` | `next dev` | `next build` | `next start` |
| `admin-react` | `vite` | `vite build` | `vite preview` |
| `app` | `react-native start` | — | — |

## Notas

- El login del panel se crea vía `/api/auth/bootstrap` con las credenciales `ADMIN_BOOTSTRAP_*`.
- Las imágenes se almacenan en `api/public/uploads/` organizadas por entidad (`comunidades`, `miembros`, `productos`, `posts`, `asociaciones`).
