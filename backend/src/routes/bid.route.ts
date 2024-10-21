import express from 'express';
import * as bidController from '../controllers/bid.controller';
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

// /api/bids

router.get('/', bidController.getBids);
router.get('/:bidId', bidController.getBid);
router.post('/', requiresAuth, bidController.createBid);
router.delete('/', requiresAuth, bidController.deleteBids);
router.delete('/:bidId', requiresAuth, bidController.deleteBid);

export default router;
