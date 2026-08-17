require('dotenv').config();
const express = require('express');
const cors = require('cors');
//const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const db = require('./config/db');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad
//app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500 // limit each IP to 500 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-web-domain.com']
        : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:8081', 'http://localhost:5000'],
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

async function testDatabaseConnection() {

    try {

        const connection = await db.getConnection();

        console.log('📦 Connected to MySQL');

        connection.release();

    } catch (error) {

        console.error('❌ MySQL connection error:', error);

    }

}

testDatabaseConnection();

// Session setup (MySQL store)

app.use(session({
    key: 'guajira.sid',
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 8
    }
}));

// Static assets
app.use('', require('./routes/health'));

app.use(express.static(path.join(__dirname, 'public', 'static')));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'static', 'index.html'));
});


// Public web-client API (no authentication required)
app.use('/web-client', require('./routes/web/web-client-api'));
app.use('/web-client', require('./routes/web/posts'));
app.use('/web-client', require('./routes/web/municipios'));
app.use('/web-client', require('./routes/web/comunidades'));
app.use('/web-client', require('./routes/web/asociaciones'));
app.use('/web-client', require('./routes/web/productos'));
app.use('/web-client', require('./routes/web/rutas'));
app.use('/web-client', require('./routes/web/miembros.js'));

// Admin auth & core entities
app.use('/api/auth', require('./routes/admin/auth'));
app.use('/api/admins', require('./routes/admin/admins'));
app.use('/api/export', require('./routes/admin/export'));
app.use('/api/roles', require('./routes/admin/roles'));
app.use('/api/tipos-producto', require('./routes/admin/tipoProducto'));
app.use('/api/departamentos', require('./routes/admin/departamentos'));
app.use('/api/municipios', require('./routes/admin/municipios'));
app.use('/api/comunidades', require('./routes/admin/comunidades'));
app.use('/api/asociaciones', require('./routes/admin/asociaciones'));
app.use('/api/miembros', require('./routes/admin/miembro'));
app.use('/api/monitoring', require('./routes/admin/monitoring'));
app.use('/api/productos', require('./routes/admin/productos'));
app.use('/api/posts', require('./routes/admin/post'));
app.use('/api/rutas', require('./routes/admin/ruta'));
app.use('/api/categorias-turisticas', require('./routes/admin/categoriaTuristica'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Mobile app can connect to: http://localhost:${PORT}`);
    console.log(`💻 Web client can connect to: http://localhost:${PORT}`);
});
