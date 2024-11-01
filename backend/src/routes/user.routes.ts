import express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();

// /api/users

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.patch('/:userId', userController.updateUser);
router.delete('/', userController.deleteUsers);
router.delete('/:userId', userController.deleteUser);

export default router;
