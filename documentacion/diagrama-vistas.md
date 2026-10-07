# Diagrama de Vistas

## Sitio público (`web/`)

```mermaid
graph TD
  classDef default fill:#E3F2FD,stroke:#1565C0,color:#0D47A1,stroke-width:2px,font-family:monospace
  classDef actor fill:#FFEBEE,stroke:#C62828,color:#B71C1C
  classDef card fill:#FFF3E0,stroke:#EF6C00,color:#E65100
  Inicio["/ (Home)"] --> Com["/comunidades"]
  Inicio --> Mkt["/marketplace"]
  Inicio --> Pub["/publicaciones"]
  Inicio --> Pro["/proyecto"]
  Com --> ComD["/comunidades/[slug] — detalle, líderes, galería, rutas"]
  Mkt --> MktD["/marketplace/[slug] — producto"]
  Pub --> PubD["/publicaciones/[slug] — post"]
```

## Panel de administración (`admin-react/`)

```mermaid
graph TD
  classDef default fill:#E3F2FD,stroke:#1565C0,color:#0D47A1,stroke-width:2px,font-family:monospace
  classDef actor fill:#FFEBEE,stroke:#C62828,color:#B71C1C
  classDef card fill:#FFF3E0,stroke:#EF6C00,color:#E65100
  Login["AuthScreen — login"] --> Panel["Panel principal"]
  Panel --> Mon["Monitoreo — madurez de comunidades"]
  Panel --> Roles["Roles"]
  Panel --> Com["Comunidades (CRUD + media)"]
  Panel --> Mie["Miembros"]
  Panel --> Prod["Productos / Tipos de producto"]
  Panel --> Rut["Rutas turísticas"]
  Panel --> Post["Posts"]
  Panel --> Aso["Asociaciones"]
  Panel --> Geo["Departamentos / Municipios"]
  Panel --> Exp["Exportar datos (Excel)"]
```

## API (`api/`)

```mermaid
graph LR
  classDef default fill:#E3F2FD,stroke:#1565C0,color:#0D47A1,stroke-width:2px,font-family:monospace
  classDef actor fill:#FFEBEE,stroke:#C62828,color:#B71C1C
  classDef card fill:#FFF3E0,stroke:#EF6C00,color:#E65100
  subgraph WebClient["/web-client (público)"]
    W1["/comunidades"]
    W2["/productos"]
    W3["/rutas"]
    W4["/posts"]
    W5["/municipios"]
    W6["/asociaciones"]
    W7["/miembros"]
  end
  subgraph AdminAPI["/api (autenticado)"]
    A1["/auth/login, /auth/bootstrap"]
    A2["/comunidades, /miembro, /post"]
    A3["/productos, /tipoProducto"]
    A4["/ruta, /categoriaTuristica"]
    A5["/municipios, /departamentos, /roles, /admins"]
    A6["/export, /monitoring"]
  end
  Static["/uploads/* — imágenes subidas"]
```
