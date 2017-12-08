const mysql = require('mysql2/promise');
const pool = mysql.createPool(process.env.JAWSDB_MARIA_URL);

module.exports = pool;
