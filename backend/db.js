const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'pixelwar',
  password: process.env.DB_PASSWORD || 'pixelwar',
  database: process.env.DB_NAME || 'pixelwar',
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pixels (
      x INTEGER NOT NULL,
      y INTEGER NOT NULL,
      color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
      PRIMARY KEY (x, y)
    )
  `);
  console.log('Database initialized');
}

module.exports = { pool, initDB };
