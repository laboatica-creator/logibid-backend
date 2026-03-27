import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { createRequest, getAllRequests, getRequestById } from '../controllers/request.controller';

const router = Router();

router.post('/', protect, createRequest);
router.get('/', protect, getAllRequests);
router.get('/:id', protect, getRequestById);

export default router;