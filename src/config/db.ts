import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres.cqnfjzehzolugxigxuny',
  password: 'LesLaboatica#',
  host: 'aws-1-us-east-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

export { pool };