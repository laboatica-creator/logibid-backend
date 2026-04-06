import pg from 'pg';
const { Pool } = pg;

console.log("==> [db.ts] Inicializando conexión a la base de datos...");

// Configuración manual sin URL
const poolConfig = {
  user: 'postgres.cqnfjzehzolugxigxuny',
  password: 'LesLaboatica#',
  host: 'aws-1-us-east-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  // Timeouts para evitar que se cuelgue
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
};

console.log(`==> [db.ts] Host: ${poolConfig.host}, User: ${poolConfig.user}, Database: ${poolConfig.database}, Port: ${poolConfig.port}`);

const pool = new Pool(poolConfig);

// Evento de error para capturar problemas de conexión
pool.on('error', (err, client) => {
  console.error('==> [db.ts] Error inesperado en el pool de conexiones:', err.message);
});

// Probar la conexión al iniciar
pool.connect((err, client, release) => {
  if (err) {
    console.error('==> [db.ts] ERROR DE CONEXIÓN INICIAL:', err.message);
  } else {
    console.log('==> [db.ts] Conexión a la base de datos establecida con éxito.');
    release();
  }
});

export { pool };