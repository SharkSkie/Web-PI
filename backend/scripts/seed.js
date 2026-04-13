const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function runSeeders() {
    console.log('Starting seeder execution...');
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'zine_platform'
        });

        const seedersDir = path.join(__dirname, '../database/seeders');
        const files = fs.readdirSync(seedersDir).filter(f => f.endsWith('.sql')).sort();

        for (const file of files) {
            console.log(`Applying seeder: ${file}`);
            const sql = fs.readFileSync(path.join(seedersDir, file), 'utf8');
            
            const queries = sql.split(';')
                .map(q => q.trim())
                .filter(q => q.length > 0 && !q.startsWith('--')); // ignore comments
                
            for (let q of queries) {
                await connection.query(q);
            }
            console.log(`Success: ${file}`);
        }
        console.log('All seeders executed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

runSeeders();
