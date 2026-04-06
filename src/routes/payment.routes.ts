import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { holdPayment, releasePayment, refundPayment, getPaymentsByRequest, getPaymentsByUser } from '../controllers/payment.controller.js';

const router = Router();
router.post('/hold', protect, holdPayment);
router.post('/release', protect, releasePayment);
router.post('/refund', protect, refundPayment);
router.get('/request/:requestId', protect, getPaymentsByRequest);
router.get('/user', protect, getPaymentsByUser);
export default router;
