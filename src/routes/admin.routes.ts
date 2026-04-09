import { Router } from 'express';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

// Todas las rutas de admin requieren estar logueadas y rol 'admin'
router.use(protect);
router.use(adminOnly);

// ==========================
// GESTIÓN DE USUARIOS
// ==========================
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// ==========================
// GESTIÓN DE SOLICITUDES
// ==========================
router.get('/requests', adminController.getAllRequests);
router.delete('/requests/:id', adminController.deleteRequest);

// ==========================
// GESTIÓN DE OFERTAS
// ==========================
router.get('/bids', adminController.getAllBids);
router.delete('/bids/:id', adminController.deleteBid);

// ==========================
// GESTIÓN DE PAGOS
// ==========================
router.get('/payments', adminController.getAllPayments);
router.post('/payments/:id/release', adminController.releasePayment);
router.post('/payments/:id/refund', adminController.refundPayment);

// ==========================
// CONFIGURACIÓN DE SISTEMA
// ==========================
router.get('/system-config', adminController.getSystemConfig);
router.put('/system-config', adminController.updateSystemConfig);

export default router;
