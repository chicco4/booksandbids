import express from 'express';
import * as messageController from '../controllers/message.controller';
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

// /api/auctions

router.get('/', messageController.getMessages);
router.get('/:messageId', messageController.getMessage);
router.post('/', requiresAuth, messageController.createMessage);
router.delete('/:messageId', requiresAuth, messageController.deleteMessage);

export default router;
