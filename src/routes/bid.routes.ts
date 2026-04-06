import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { createBid, getBidsByRequest, getBidById, acceptBid } from '../controllers/bid.controller.js';

const router = Router();
router.post('/', protect, createBid);
router.get('/request/:requestId', protect, getBidsByRequest);
router.get('/:id', protect, getBidById);
router.patch('/:id/accept', protect, acceptBid);
export default router;