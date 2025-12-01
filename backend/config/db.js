// config/db.js
const oracledb = require('oracledb');
require('dotenv').config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const poolConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECTION_STRING,
  poolMin: 1,
  poolMax: 10,
  poolIncrement: 1
};

let pool;

async function init() {
  try {
    pool = await oracledb.createPool(poolConfig);
    console.log("Oracle DB pool created");

    //  Validate the connection immediately
    const conn = await pool.getConnection();
    await conn.execute(`SELECT 1 FROM dual`);
    await conn.close();

    console.log("✅ Oracle DB credentials are valid");

  } catch (err) {
    console.error("❌ Oracle DB startup error:", err);
    process.exit(1); // Stop server if DB is bad
  }
}

async function closePool() {
  if (pool) {
    await pool.close(10);
  }
}

async function getConnection() {
  if (!pool) {
    await init();
  }
  return pool.getConnection();
}

module.exports = { init, closePool, getConnection };
