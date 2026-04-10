const { Pool } = require('pg');
require('dotenv').config();

const universityDB = new Pool({
  connectionString: process.env.UNIVERSITY_DB_URL,
});

module.exports = universityDB;