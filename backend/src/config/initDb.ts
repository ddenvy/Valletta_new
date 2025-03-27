import fs from 'fs';
import path from 'path';
import pool from './database';

async function initializeDatabase() {
    try {
        // Читаем SQL файл
        const sqlPath = path.join(__dirname, 'init.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Выполняем SQL
        await pool.query(sql);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Запускаем инициализацию
initializeDatabase(); 