import pg from 'pg';
const { Pool } = pg;

// URL fija de Supabase (Session pooler)
const DATABASE_URL = 'postgresql://postgres.cqnfjzehzolugxigxuny:LesLaboatica#@aws-1-us-east-2.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export { pool };