import { Request, Response } from 'express';
import { pool } from '../config/db.js';

// ==========================================
// USUARIOS
// ==========================================

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['client', 'driver', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role provided' });
    }

    const result = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING id, role', [role, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    
    res.json({ message: 'User role updated', user: result.rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Precaución: Esto podría fallar debido a constraints de llave foránea. Se requiere ON DELETE CASCADE en la DB.
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message, details: 'Cannot delete user if it has active relationships.' });
  }
};

// ==========================================
// SOLICITUDES
// ==========================================

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM shipment_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM shipment_requests WHERE id = $1', [id]);
    res.json({ message: 'Request deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// OFERTAS
// ==========================================

export const getAllBids = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM bids ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bids WHERE id = $1', [id]);
    res.json({ message: 'Bid deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// PAGOS
// ==========================================

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const releasePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Verifica si el pago existe
    const exists = await pool.query('SELECT status FROM payments WHERE id = $1', [id]);
    if (exists.rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    
    // Actualizar a released
    await pool.query('UPDATE payments SET status = $1 WHERE id = $2', ['released', id]);
    res.json({ message: 'Payment released successfully' });
  } catch (error: any) {
     res.status(500).json({ error: error.message });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exists = await pool.query('SELECT status FROM payments WHERE id = $1', [id]);
    if (exists.rows.length === 0) return res.status(404).json({ error: 'Payment not found' });
    
    await pool.query('UPDATE payments SET status = $1 WHERE id = $2', ['refunded', id]);
    res.json({ message: 'Payment refunded successfully' });
  } catch (error: any) {
     res.status(500).json({ error: error.message });
  }
};

// ==========================================
// CONFIGURACIÓN DEL SISTEMA
// ==========================================

export const getSystemConfig = async (req: Request, res: Response) => {
  try {
    // Si la tabla no existe o falla, devolveremos un array vacío temporalmente
    const result = await pool.query('SELECT key, value, description FROM system_config');
    res.json(result.rows);
  } catch (error: any) {
    // Para ambientes de desarrollo donde no han creado la tabla aún
    res.status(200).json([
      { key: 'seguro_porcentaje', value: '5', description: 'Default fallback' },
      { key: 'comision_logibid', value: '15', description: 'Default fallback' },
    ]);
  }
};

export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    // Esperamos un body key-value: { "seguro_porcentaje": "6", "comision_logibid": "10" }
    const entries = Object.entries(req.body);
    
    for (const [key, value] of entries) {
       await pool.query(
         'INSERT INTO system_config (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
         [key, String(value)]
       );
    }

    res.json({ message: 'System configuration updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
