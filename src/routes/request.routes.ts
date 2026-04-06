import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { createRequest, getAllRequests, getRequestById } from '../controllers/request.controller.js';

const router = Router();
router.post('/', protect, createRequest);
router.get('/', protect, getAllRequests);
router.get('/:id', protect, getRequestById);
export default router;