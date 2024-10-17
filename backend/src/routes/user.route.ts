import express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUser);
router.post('/', userController.createUser);

export default router;
