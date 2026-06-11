const mysql = require('mysql2');

// Aiven DB config (from your URL)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});
// Promisified version (async/await support)
const db = pool.promise();

module.exports = db;
