const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://mandir_user:mandir_password@postgres:5432/mandir_setu_db',
});

// Run migrations on startup
async function initDb() {
  let retries = 5;
  while (retries > 0) {
    try {
      const client = await pool.connect();
      console.log('✅ Connected to PostgreSQL successfully.');

      const migrationPath1 = path.join(__dirname, '../migrations/001_init.sql');
      const migrationPath2 = path.join(__dirname, '../migrations/002_seed.sql');

      if (fs.existsSync(migrationPath1)) {
        console.log('Running 001_init.sql...');
        const sql1 = fs.readFileSync(migrationPath1, 'utf-8');
        await client.query(sql1);
      }

      if (fs.existsSync(migrationPath2)) {
        console.log('Running 002_seed.sql...');
        const sql2 = fs.readFileSync(migrationPath2, 'utf-8');
        await client.query(sql2);
      }

      client.release();
      console.log('✅ Migrations & Seed applied successfully.');
      break;
    } catch (err) {
      console.error(`Postgres connection error (${retries} retries left):`, err.message);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  initDb,
};
