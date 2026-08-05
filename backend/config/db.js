const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const cleverHost = 'bdqygnfxhd52boan8adn-mysql.services.clever-cloud.com';
const cleverUser = 'uhjd8ixejbarncst';
const cleverPass = 'Wkos4FxuM7m6bt94fGoz';
const cleverDb   = 'bdqygnfxhd52boan8adn';

// In Vercel / Cloud serverless, never use localhost/127.0.0.1
let host = process.env.DB_HOST || process.env.MYSQL_ADDON_HOST;
if (process.env.VERCEL || !host || host === 'localhost' || host === '127.0.0.1') {
    host = cleverHost;
}

let user = process.env.DB_USER || process.env.MYSQL_ADDON_USER;
if (process.env.VERCEL || !user || user === 'root') {
    user = cleverUser;
}

let password = process.env.DB_PASSWORD || process.env.MYSQL_ADDON_PASSWORD;
if (process.env.VERCEL || password === undefined || password === '') {
    password = cleverPass;
}

let database = process.env.DB_NAME || process.env.MYSQL_ADDON_DB;
if (process.env.VERCEL || !database || database === 'db_zine' || database === 'zine_platform') {
    database = cleverDb;
}

const port = parseInt(process.env.DB_PORT || process.env.MYSQL_ADDON_PORT || '3306', 10);

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
