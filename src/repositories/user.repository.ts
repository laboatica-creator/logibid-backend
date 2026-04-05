import { pool } from '../config/db.js';

export class UserRepository {
  async findByEmail(email: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findById(id: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(userData: any) {
    const { name, email, phone, password_hash, role } = userData;
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, phone, password_hash, role]
    );
    return result.rows[0];
  }
}