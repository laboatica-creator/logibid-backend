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

const createInvoices = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id),
        invoice_number VARCHAR(50) UNIQUE,
        type VARCHAR(20),
        amount DECIMAL(10,2),
        tax DECIMAL(10,2),
        total DECIMAL(10,2),
        status VARCHAR(20) DEFAULT 'pending',
        details JSONB,
        pdf_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        sent_at TIMESTAMP
      );
    `);
    console.log('✅ Tabla invoices creada o verificada');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
};

createInvoices();
