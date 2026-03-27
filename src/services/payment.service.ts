import { pool } from '../config/db';

export class PaymentService {
  async holdPayment(data: any) {
    const { request_id, client_id, driver_id, amount, payment_method, transaction_id } = data;
    
    const result = await pool.query(
      `INSERT INTO payments (request_id, client_id, driver_id, amount, status, payment_method, transaction_id)
       VALUES ($1, $2, $3, $4, 'held', $5, $6)
       RETURNING *`,
      [request_id, client_id, driver_id, amount, payment_method, transaction_id]
    );
    
    return result.rows[0];
  }

  async releasePayment(paymentId: string, userId: string) {
    const payment = await this.getPaymentById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.client_id !== userId) {
      throw new Error('Only the client can release this payment');
    }
    
    if (payment.status !== 'held') {
      throw new Error('Payment must be in held status to release');
    }
    
    const result = await pool.query(
      `UPDATE payments 
       SET status = 'released', released_at = NOW()
       WHERE id = $1 AND client_id = $2
       RETURNING *`,
      [paymentId, userId]
    );
    
    return result.rows[0];
  }

  async refundPayment(paymentId: string, userId: string) {
    const payment = await this.getPaymentById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    if (payment.client_id !== userId) {
      throw new Error('Only the client can request a refund');
    }
    
    if (payment.status !== 'held') {
      throw new Error('Payment must be in held status to refund');
    }
    
    const result = await pool.query(
      `UPDATE payments 
       SET status = 'refunded'
       WHERE id = $1 AND client_id = $2
       RETURNING *`,
      [paymentId, userId]
    );
    
    return result.rows[0];
  }

  async getPaymentsByRequest(requestId: string) {
    const result = await pool.query(
      `SELECT p.*, 
              c.name as client_name, 
              d.name as driver_name
       FROM payments p
       JOIN users c ON p.client_id = c.id
       JOIN users d ON p.driver_id = d.id
       WHERE p.request_id = $1
       ORDER BY p.created_at DESC`,
      [requestId]
    );
    return result.rows;
  }

  async getPaymentsByUser(userId: string) {
    const result = await pool.query(
      `SELECT p.*, 
              c.name as client_name, 
              d.name as driver_name,
              sr.pickup_address,
              sr.delivery_address
       FROM payments p
       JOIN users c ON p.client_id = c.id
       JOIN users d ON p.driver_id = d.id
       JOIN shipment_requests sr ON p.request_id = sr.id
       WHERE p.client_id = $1 OR p.driver_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async getPaymentById(id: string) {
    const result = await pool.query(
      `SELECT * FROM payments WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }
}