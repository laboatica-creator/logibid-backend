import { pool } from '../config/db.js';

export class BidRepository {
  async create(data: any) {
    const { request_id, driver_id, amount, message } = data;
    const result = await pool.query(
      `INSERT INTO bids (request_id, driver_id, amount, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [request_id, driver_id, amount, message]
    );
    return result.rows[0];
  }

  async findByRequestId(request_id: string) {
    const result = await pool.query(
      `SELECT b.*, u.name as driver_name, u.rating
       FROM bids b
       JOIN users u ON b.driver_id = u.id
       WHERE b.request_id = $1
       ORDER BY b.amount ASC`,
      [request_id]
    );
    return result.rows;
  }

  async findById(id: string) {
    const result = await pool.query(
      `SELECT b.*, u.name as driver_name, u.rating
       FROM bids b
       JOIN users u ON b.driver_id = u.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async updateStatus(id: string, status: string) {
    const result = await pool.query(
      `UPDATE bids SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }

  async rejectOtherBids(request_id: string, excludeBidId: string) {
    const result = await pool.query(
      `UPDATE bids 
       SET status = 'rejected' 
       WHERE request_id = $1 AND id != $2 AND status = 'pending'
       RETURNING *`,
      [request_id, excludeBidId]
    );
    return result.rows;
  }

  async updateRequestStatus(request_id: string, status: string) {
    await pool.query(
      `UPDATE shipment_requests SET status = $1 WHERE id = $2`,
      [status, request_id]
    );
  }

  async findRequestByClient(requestId: string, clientId: string) {
    const result = await pool.query(
      `SELECT * FROM shipment_requests WHERE id = $1 AND client_id = $2`,
      [requestId, clientId]
    );
    return result.rows[0];
  }

  async getRequestById(requestId: string) {
    const result = await pool.query(
      `SELECT * FROM shipment_requests WHERE id = $1`,
      [requestId]
    );
    return result.rows[0];
  }
}