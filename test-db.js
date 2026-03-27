import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://laboa:LogiBid123@localhost:5433/logibid'
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('❌ Error:', err.message);
  } else {
    console.log('✅ Conexión exitosa:', res.rows[0]);
  }
  pool.end();
});