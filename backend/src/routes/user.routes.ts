import express from 'express';
import * as userController from '../controllers/user.controller';
import { requiresAuth, requiresMod } from '../middleware/auth.middleware';

const router = express.Router();

// /api/users

router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);

router.put('/', requiresAuth, userController.updateAuthenticatedUser);
router.post('/invite-moderator', requiresMod, userController.inviteModerator);

router.delete('/all', requiresMod, userController.deleteAllUsers);
router.delete('/:userId', requiresMod, userController.deleteUserById);

export default router;
