const { Pool } = require('pg');

// PostgreSQL connection config
const pool = new Pool({
  user: 'postgres',
  host: '172.30.6.19',
  database: 'homechef',
  password: 'P@ssw0rd',
  port: 5454, 
});


pool.connect()
  .then(() => console.log('Connected to PostgreSQL!'))
  .catch(err => console.error('Connection error', err));

module.exports = pool;


