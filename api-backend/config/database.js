const mysql = requre('mysql2/promise');
require('dotenv').config();

// crear una conexion tipo pool para rendimiento
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnwctions: true,
    connectionLimit: 10
});

module.exports = pool;

