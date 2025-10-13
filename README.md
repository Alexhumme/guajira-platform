# 🌴 Guajira Platform

Una plataforma digital para conectar las comunidades rurales y tradicionales del departamento de La Guajira con turistas y comerciantes, facilitando la promoción y venta de productos y servicios locales.

## 📋 Descripción del Proyecto

La Guajira Platform es una solución integral que permite a las comunidades rurales y tradicionales publicar sus productos y servicios, mientras que turistas y comerciantes pueden encontrarlos y contactarlos fácilmente.

## 🏗️ Arquitectura del Proyecto

El proyecto está compuesto por tres aplicaciones principales:

### 📱 MobileApp
- **Tecnología**: React Native
- **Propósito**: Aplicación móvil para los miembros de la comunidad
- **Funcionalidades**: Publicar productos, gestionar servicios, subir fotos, actualizar información

### 💻 web-client
- **Tecnología**: React.js
- **Propósito**: Aplicación web para turistas y comerciantes
- **Funcionalidades**: Explorar productos, buscar servicios, contactar comunidades, realizar reservas

### 🔧 api-backend
- **Tecnología**: Node.js + Express + MongoDB
- **Propósito**: API backend que sirve datos a ambas aplicaciones
- **Funcionalidades**: Gestión de usuarios, productos, servicios, autenticación, geolocalización

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MongoDB
- React Native CLI
- Android Studio (para desarrollo móvil)

### Configuración del Backend (api-backend)
```bash
cd api-backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run dev
```

### Configuración de la App Web (web-client)
```bash
cd web-client
npm install
npm start
```

### Configuración de la App Móvil (MobileApp)
```bash
cd MobileApp
npm install
# Para Android
npx react-native run-android
# Para iOS
npx react-native run-ios
```

## 🌟 Características Principales

### Para las Comunidades (App Móvil)
- ✅ Registro de productos artesanales
- ✅ Publicación de servicios turísticos
- ✅ Gestión de inventario
- ✅ Chat directo con clientes
- ✅ Geolocalización de servicios

### Para Turistas y Comerciantes (App Web)
- ✅ Exploración de productos por categorías
- ✅ Búsqueda geográfica
- ✅ Sistema de reservas
- ✅ Contacto directo con comunidades
- ✅ Reseñas y calificaciones

## 🗂️ Estructura del Proyecto

```
guajira-platform/
├── api-backend/          # Backend API con Node.js + Express + MongoDB
│   ├── server.js         # Archivo principal del servidor
│   ├── package.json      # Dependencias del backend
│   └── .env.example      # Ejemplo de variables de entorno
├── web-client/           # Frontend web con React.js
│   ├── src/              # Código fuente de la app web
│   ├── public/           # Archivos públicos
│   └── package.json      # Dependencias del frontend web
├── MobileApp/            # App móvil con React Native
│   ├── src/              # Código fuente de la app móvil
│   ├── android/          # Configuración Android
│   ├── ios/              # Configuración iOS
│   └── package.json      # Dependencias de React Native
└── README.md             # Este archivo
```

## 🔧 Tecnologías Utilizadas

### Frontend Web
- React.js
- HTML5, CSS3, JavaScript ES6+
- Responsive Design

### Mobile App
- React Native
- Navigation
- AsyncStorage
- Geolocation

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- CORS, Helmet (seguridad)
- Morgan (logging)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

Proyecto Guajira Platform - Una iniciativa para el desarrollo social y económico de las comunidades rurales de La Guajira.

---

**¡Construyamos juntos un puente digital entre las tradiciones ancestrales y el mundo moderno! 🌅**