const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MySQLStore = require('connect-mysql2')(session);
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-web-domain.com']
        : ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:5000'],
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Session setup (MySQL store)
const sessionStore = new MySQLStore({
    config: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'guajira_platform',
    },
    pool: true,
});

app.use(session({
    key: 'guajira.sid',
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 8
    }
}));

// Static admin dashboard
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: '🌴 Guajira Platform API',
        version: '1.0.0',
        status: 'Running'
    });
});

// Admin auth & core entities
app.use('/api/auth', require('./routes/auth'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/tipos-producto', require('./routes/tipoProducto'));
app.use('/api/departamentos', require('./routes/departamentos'));
app.use('/api/municipios', require('./routes/municipios'));
app.use('/api/comunidades', require('./routes/comunidades'));

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
