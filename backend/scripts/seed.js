const fs = require('fs');
const path = require('path');
const pool = require('../utils/db');

const seed = async () => {
const originalPath = path.join(
  __dirname,
  '..',
  'database',
  'db.sql',
);

  try {
    const sql = fs.readFileSync(originalPath, 'utf8');

    const connection = await pool.getConnection();

    console.log('🔄 Running database.sql...');

    const queries = sql
      .split(';')
      .map(q => q.trim())
      .filter(q => q.length);

    for (const query of queries) {
      try {
        await connection.query(query);
      } catch (err) {
        console.log('⚠️ Query skipped:', err.message);
      }
    }

    connection.release();

    console.log('✅ database.sql executed');
  } catch (err) {
    console.error('❌ SQL file execution error:', err);
  }
};

seed();
