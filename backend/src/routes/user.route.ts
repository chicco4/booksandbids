import express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();

// /api/users
router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.post('/', userController.createUser);
// patch requires less bandwidth than put
router.patch('/:userId', userController.updateUser);

export default router;
