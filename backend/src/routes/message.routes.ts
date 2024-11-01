import express from 'express';
import * as messageController from '../controllers/message.controller';
import { requiresAuth } from '../middleware/auth.middleware';

const router = express.Router();

// /api/messages

router.get('/', messageController.getMessages);
router.get('/:messageId', messageController.getMessage);
router.post('/', requiresAuth, messageController.createMessage);
router.delete('/', messageController.deleteMessages);
router.delete('/:messageId', messageController.deleteMessage);

export default router;
