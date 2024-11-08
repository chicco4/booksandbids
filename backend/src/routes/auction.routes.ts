import express from 'express';
import * as auctionController from '../controllers/auction.controller';
import { requiresMod, requiresStud } from '../middleware/auth.middleware';

const router = express.Router();

// /api/auctions

router.get('/', auctionController.searchAuctions);
router.get('/:auctionId', auctionController.getAuctionById);
router.get('/logged', requiresStud, auctionController.getAuthenticatedUserAuctions);

router.put<{ auctionId: string }>('/:auctionId', requiresMod, auctionController.updateAuctionById);
router.post('/', requiresStud, auctionController.createAuction);

router.delete('/all', requiresMod, auctionController.deleteAllAuctions);
router.delete('/:auctionId', requiresMod, auctionController.deleteAuctionById);

// nested bids and messages
router.get('/:auctionId/bids', auctionController.getAuctionBids);
router.post<{ auctionId: string }>('/:auctionId/bids', requiresStud, auctionController.bidAuction);

router.get('/:auctionId/messages', auctionController.getAuctionMessages);
router.post<{ auctionId: string }>('/:auctionId/messages', requiresStud, auctionController.messageAuction);

export default router;
