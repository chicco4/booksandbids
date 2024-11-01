import express from 'express';
import * as auctionController from '../controllers/auction.controller';
import { requiresAuth } from '../middleware/auth.middleware';

const router = express.Router();

// /api/auctions

router.get('/', auctionController.getAuctions);
router.get('/:auctionId', auctionController.getAuction);
router.post('/', requiresAuth, auctionController.createAuction);
router.delete('/', auctionController.deleteAuctions);
router.delete('/:auctionId', auctionController.deleteAuction);

export default router;
