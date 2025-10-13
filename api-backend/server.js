const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
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
    : ['http://localhost:3000', 'http://localhost:8081'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guajira-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('📦 Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🌴 Guajira Platform API',
    version: '1.0.0',
    status: 'Running'
  });
});

// API routes will be added here
// app.use('/api/products', require('./routes/products'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/communities', require('./routes/communities'));

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