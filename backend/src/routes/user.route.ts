import express from 'express';
import * as userController from '../controllers/user.controller';
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

// /api/users

// More specific routes first
router.get("/check", requiresAuth, userController.getAuthenticatedUser);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Parameterized routes after
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.put('/:userId', userController.updateUser);
router.delete('/', requiresAuth, userController.deleteUsers);
router.delete('/:userId', requiresAuth, userController.deleteUser);

export default router;
