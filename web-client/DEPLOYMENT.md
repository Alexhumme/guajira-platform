# 🚀 Deployment a GitHub Pages

## Configuración Inicial (Ya está lista)

✅ Se instaló `gh-pages` como dependencia de desarrollo
✅ Se configuró `homepage` en package.json
✅ Se agregaron scripts `predeploy` y `deploy`
✅ Se creó archivo `.nojekyll` en public/

## URL de la Aplicación

Una vez deployada, tu aplicación estará disponible en:

**https://alexhumme.github.io/guajira-platform/**

## Comandos Rápidos

### Desplegar Nueva Versión

Para subir una nueva versión a GitHub Pages, simplemente ejecuta:

```bash
npm run deploy
```

Este comando hace dos cosas automáticamente:
1. Ejecuta `npm run build` (crear build de producción)
2. Sube los archivos a la rama `gh-pages` de GitHub

### Verificar antes de desplegar

Si quieres probar el build de producción localmente antes de desplegarlo:

```bash
npm run build
npx serve -s build
```

## Flujo de Trabajo Recomendado

1. **Desarrollo local:**
   ```bash
   npm start
   ```

2. **Hacer cambios y commit:**
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```

3. **Desplegar a GitHub Pages:**
   ```bash
   npm run deploy
   ```

## Primera Vez - Configuración en GitHub

Si es la primera vez que despliegas, asegúrate de:

1. Ve a tu repositorio en GitHub: https://github.com/Alexhumme/guajira-platform
2. Ve a **Settings** → **Pages**
3. En **Source**, selecciona la rama `gh-pages`
4. Guarda los cambios
5. Espera 2-3 minutos y visita la URL

## Notas Importantes

- ⚠️ El comando `npm run deploy` NO hace commit a la rama `main`, solo sube a `gh-pages`
- ⚠️ Siempre haz `git push` primero si quieres que tus cambios estén en `main`
- ⚠️ GitHub Pages puede tomar 1-2 minutos en actualizar después del deploy
- ✅ El archivo `.nojekyll` evita problemas con rutas que empiezan con `_`
- ✅ React Router funciona correctamente con GitHub Pages

## Troubleshooting

### Problema: Página en blanco después del deploy
- Verifica que `homepage` en package.json sea correcto
- Revisa la consola del navegador para errores de rutas

### Problema: Rutas 404 al recargar
- GitHub Pages no soporta SPA routing directamente
- Solución: Los usuarios deben navegar desde la home (/)

### Problema: Estilos no cargan
- Verifica que todas las rutas de assets sean relativas
- El build debe incluir todos los archivos CSS

## Estructura de Ramas

- **main**: Código fuente
- **gh-pages**: Build de producción (creada automáticamente por gh-pages)

## Actualización Rápida

Para hacer cambios y actualizar la página:

```bash
# 1. Hacer cambios en el código
# 2. Guardar y probar localmente
npm start

# 3. Si todo está bien, deployar
npm run deploy

# 4. Opcional: Subir cambios a main
git add .
git commit -m "Actualización"
git push origin main
```

¡Listo! Tu aplicación estará actualizada en https://alexhumme.github.io/guajira-platform/ 🎉
