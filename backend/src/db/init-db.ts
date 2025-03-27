import { pool } from './index';
import fs from 'fs';
import path from 'path';

async function initDatabase() {
  try {
    // Читаем и выполняем миграции
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();

    for (const file of migrationFiles) {
      console.log(`Executing migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await pool.query(sql);
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Запускаем инициализацию
initDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }); 