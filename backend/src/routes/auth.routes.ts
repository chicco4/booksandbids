import express from 'express';
import * as authController from '../controllers/auth.controller';
import { requiresAuth } from '../middleware/auth.middleware';

const router = express.Router();

// /api/auth

router.get('/check', requiresAuth, authController.getAuthenticatedUser);

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.post('/logout', requiresAuth, authController.logout);

export default router;