const express = require('express');
const router = express.Router();
const PORT = process.env.PORT || 5000;
const db = require('../config/db');

router.get('/health', async (req, res) => {

  const start = Date.now();

  try {

    await db.query('SELECT 1');

    const databaseResponseTime = Date.now() - start;

    res.json({
      status: 'ok',
      database: 'connected',
      databaseResponseTime,
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      node: process.version,
      uptime: process.uptime()
    });

  } catch (error) {

    console.error('Health check MySQL:', error.message);

    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      node: process.version,
      uptime: process.uptime()
    });

  }

});

module.exports = router;