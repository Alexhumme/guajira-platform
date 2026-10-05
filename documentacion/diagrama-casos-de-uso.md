# Diagrama de Casos de Uso

```mermaid
graph LR
  Visitante(["👤 Visitante"])
  Miembro(["👤 Miembro / Líder"])
  Admin(["👤 Administrador"])

  subgraph Publico["Sitio público (web)"]
    UC1(["Explorar comunidades"])
    UC2(["Ver detalle de comunidad y sus líderes"])
    UC3(["Ver marketplace de productos"])
    UC4(["Ver rutas y categorías turísticas"])
    UC5(["Ver publicaciones"])
  end

  subgraph MiembroUC["Gestión de contenido"]
    UC6(["Publicar productos / posts"])
    UC7(["Subir imágenes (media)"])
    UC8(["Actualizar perfil"])
  end

  subgraph AdminUC["Panel de administración (admin-react)"]
    UC9(["Iniciar sesión"])
    UC10(["CRUD comunidades / miembros / productos"])
    UC11(["CRUD rutas / posts / categorías"])
    UC12(["Gestionar municipios, roles y tipos de producto"])
    UC13(["Exportar datos (Excel)"])
    UC14(["Monitorear madurez de comunidades"])
  end

  Visitante --> UC1
  Visitante --> UC2
  Visitante --> UC3
  Visitante --> UC4
  Visitante --> UC5

  Miembro --> UC1
  Miembro --> UC6
  Miembro --> UC7
  Miembro --> UC8

  Admin --> UC9
  Admin --> UC10
  Admin --> UC11
  Admin --> UC12
  Admin --> UC13
  Admin --> UC14
```
