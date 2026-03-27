import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'laboa',
  password: 'LogiBid123',
  host: 'localhost',
  port: 5433,
  database: 'logibid',
});

export { pool };