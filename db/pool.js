require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.PROD_DATABASE_URL
});

module.exports = pool;