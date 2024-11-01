import express from 'express';
import * as authController from '../controllers/auth.controller';
import { requiresAuth, requiresMod } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/check', requiresAuth, authController.getAuthenticatedUser);
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', requiresAuth, authController.logout);
router.post('/invite-moderator', requiresAuth, requiresMod, authController.inviteModerator);

export default router;