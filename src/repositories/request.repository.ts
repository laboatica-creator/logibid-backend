import { pool } from '../config/db.js';

export class RequestRepository {
  async create(data: any) {
    const { client_id, pickup_address, delivery_address, description, weight_kg, dimensions, budget } = data;
    const result = await pool.query(
      `INSERT INTO shipment_requests (client_id, pickup_address, delivery_address, description, weight_kg, dimensions, budget)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [client_id, pickup_address, delivery_address, description, weight_kg, dimensions, budget]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(
      `SELECT sr.*, u.name as client_name, u.email as client_email
       FROM shipment_requests sr
       JOIN users u ON sr.client_id = u.id
       ORDER BY sr.created_at DESC`
    );
    return result.rows;
  }

  async findById(id: string) {
    const result = await pool.query(
      `SELECT sr.*, u.name as client_name, u.email as client_email
       FROM shipment_requests sr
       JOIN users u ON sr.client_id = u.id
       WHERE sr.id = $1`,
      [id]
    );
    return result.rows[0];
  }
}