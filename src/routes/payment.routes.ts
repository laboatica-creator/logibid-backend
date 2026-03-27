import { Router } from 'express';
import { holdPayment, releasePayment, refundPayment, getPaymentsByRequest, getUserPayments } from '../controllers/payment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.post('/hold', holdPayment);
router.post('/release', releasePayment);
router.post('/refund', refundPayment);
router.get('/request/:requestId', getPaymentsByRequest);
router.get('/user', getUserPayments);

export default router;
