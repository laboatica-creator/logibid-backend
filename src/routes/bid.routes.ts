import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createBid, getBidsByRequest, getBidById, acceptBid } from '../controllers/bid.controller';

const router = Router();

router.post('/', protect, createBid);
router.get('/request/:requestId', protect, getBidsByRequest);
router.get('/:id', protect, getBidById);
router.patch('/:id/accept', protect, acceptBid);

export default router;