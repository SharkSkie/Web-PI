const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Hardcoded Clever Cloud credentials as final fallback
const CLEVER_HOST = 'bdqygnfxhd52boan8adn-mysql.services.clever-cloud.com';
const CLEVER_USER = 'uhjd8ixejbarncst';
const CLEVER_PASS = 'Wkos4FxuM7m6bt94fGoz';
const CLEVER_DB   = 'bdqygnfxhd52boan8adn';
const CLEVER_PORT = 3306;

// Use env vars if set, otherwise use hardcoded Clever Cloud values
const host     = (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1') ? process.env.DB_HOST : CLEVER_HOST;
const user     = (process.env.DB_USER && process.env.DB_USER !== 'root') ? process.env.DB_USER : CLEVER_USER;
const password = (process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== '') ? process.env.DB_PASSWORD : CLEVER_PASS;
const database = (process.env.DB_NAME && process.env.DB_NAME !== 'zine_platform') ? process.env.DB_NAME : CLEVER_DB;
const port     = parseInt(process.env.DB_PORT || String(CLEVER_PORT), 10);

const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 3,
    maxIdle: 1,
    idleTimeout: 15000,
    queueLimit: 0,
    connectTimeout: 20000,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;
