const mysql = require('mysql2');

// Create pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10, // 🔥 important
  queueLimit: 0,

  ssl: {
    rejectUnauthorized: false,
  },
});

// Promisified version
const db = pool.promise();

// Optional: test connection once
(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected');
    // connection.release();
  } catch (err) {
    console.error('❌ DB connection failed:', err);
  }
})();

module.exports = db;
