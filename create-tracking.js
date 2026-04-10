import pg from 'pg';
const { Pool } = pg;

const poolConfig = {
  user: 'postgres.cqnfjzehzolugxigxuny',
  password: 'LesLaboatica#',
  host: 'aws-1-us-east-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
};

const pool = new Pool(poolConfig);

const createDriverLocations = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS driver_locations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        driver_id UUID REFERENCES users(id),
        request_id UUID,
        lat DECIMAL(10,8),
        lng DECIMAL(10,8),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Tabla driver_locations creada o verificada');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
};

createDriverLocations();
