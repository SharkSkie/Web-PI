const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const host = process.env.DB_HOST || process.env.MYSQL_ADDON_HOST || 'bdqygnfxhd52boan8adn-mysql.services.clever-cloud.com';
const user = process.env.DB_USER || process.env.MYSQL_ADDON_USER || 'uhjd8ixejbarncst';
const password = process.env.DB_PASSWORD || process.env.MYSQL_ADDON_PASSWORD || 'Wkos4FxuM7m6bt94fGoz';
const database = process.env.DB_NAME || process.env.MYSQL_ADDON_DB || 'bdqygnfxhd52boan8adn';
const port = parseInt(process.env.DB_PORT || process.env.MYSQL_ADDON_PORT || '3306', 10);

// Serverless-optimized connection pool with low limit to avoid Clever Cloud max_user_connections (limit: 5)
const pool = mysql.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    port: port,
    waitForConnections: true,
    connectionLimit: 2,
    maxIdle: 2,
    idleTimeout: 10000,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;
