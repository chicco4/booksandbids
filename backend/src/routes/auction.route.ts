import express from 'express';
import * as auctionController from '../controllers/auction.controller';
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

// /api/auctions

router.get('/', auctionController.getAuctions);
router.get('/:auctionId', auctionController.getAuction);
router.post('/', auctionController.createAuction);
router.delete('/:auctionId', requiresAuth, auctionController.deleteAuction);

export default router;
