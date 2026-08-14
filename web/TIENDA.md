# 🛍️ Tienda Virtual - Guajira Platform

## Estructura de Páginas

### 🏠 Home (`/`)
Landing page con todas las secciones:
- Hero
- Comunidades
- Productos (vista previa)
- Galería
- Contacto

### 🛒 Tienda (`/shop`)
Vista de e-commerce completa con:
- **Sidebar de filtros**:
  - Buscador por nombre o comunidad
  - Filtros por categoría (Todos, Artesanías, Turismo Cultural, Gastronomía, Joyería, Textiles, Experiencias)
  - Información adicional

- **Grid de productos**:
  - Cada tarjeta muestra:
    - Imagen del producto (placeholder)
    - Nombre del producto
    - Comunidad que lo elaboró
    - Precio en COP (formato colombiano)
    - Badge de categoría
    - Botón "Añadir"

## Características Implementadas

✅ **Navegación con React Router**
- Navbar con enlaces funcionales
- Botones CTA que redirigen a la tienda
- Navegación entre Home y Shop

✅ **Sistema de Filtros**
- Filtrado por categoría (7 categorías)
- Búsqueda por texto (nombre o comunidad)
- Contador de resultados
- Mensaje cuando no hay resultados

✅ **Diseño Responsivo**
- Desktop: Sidebar fijo + grid de 3-4 columnas
- Tablet: Sidebar horizontal + grid de 2-3 columnas
- Móvil: Filtros apilados + grid de 1 columna

✅ **12 Productos de Ejemplo**
Distribuidos en las 6 categorías definidas

## Datos de Productos

Actualmente los productos están hardcodeados en `Shop.js`. Estructura:

\`\`\`javascript
{
  id: number,
  name: string,
  price: number (COP),
  category: string,
  community: string,
  image: string (placeholder)
}
\`\`\`

## Próximos Pasos

1. **Conectar con Backend**: Reemplazar datos hardcodeados con API
2. **Carrito de Compras**: Implementar funcionalidad del botón "Añadir"
3. **Detalle de Producto**: Página individual para cada producto
4. **Imágenes Reales**: Reemplazar placeholders con fotos reales
5. **Filtros Adicionales**: Por precio, por comunidad, ordenamiento
6. **Paginación**: Si hay muchos productos

## Cómo Ejecutar

\`\`\`bash
cd web
npm start
\`\`\`

Visita:
- Home: http://localhost:3000/
- Tienda: http://localhost:3000/shop

## Navegación

- **Navbar**: "Inicio" → `/`, "Tienda" → `/shop`
- **Hero**: Botón "Explorar Productos" → `/shop`
- **Sección Products**: Botones "Ver más" → `/shop`
- **Navbar CTA**: "Explorar Tienda" → `/shop`
