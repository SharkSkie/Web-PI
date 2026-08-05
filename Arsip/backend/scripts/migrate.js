const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function runMigrations() {
    console.log('Starting migrations...');
    let connection;
    try {
        // Connect without database first to ensure it exists
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        const dbName = process.env.DB_NAME || 'zine_platform';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await connection.query(`USE \`${dbName}\`;`);

        // Create migrations table to track applied migrations
        await connection.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const migrationsDir = path.join(__dirname, '../database/migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        // Check already applied
        const [appliedRows] = await connection.query('SELECT name FROM migrations');
        const appliedMigrations = appliedRows.map(row => row.name);

        for (const file of files) {
            if (!appliedMigrations.includes(file)) {
                console.log(`Applying migration: ${file}`);
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                
                // execute multi-statements required (but standard query often doesn't like multiple without specific config, 
                // so we split by semicolon for simple raw sql execution)
                const queries = sql.split(';')
                    .map(q => q.trim())
                    .filter(q => q.length > 0);
                    
                for (let q of queries) {
                    await connection.query(q);
                }

                await connection.query('INSERT INTO migrations (name) VALUES (?)', [file]);
                console.log(`Success: ${file}`);
            } else {
                console.log(`Skipping already applied migration: ${file}`);
            }
        }
        console.log('All migrations executed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

runMigrations();
