import { NextFunction, Request, RequestHandler, Response } from 'express';
import UserModel from '../models/user.model';
import userModel from '../models/user.model';

export const getUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find().exec();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// using RequestHandler type, i don't need to specify the types of req, res, and next
export const getUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findById(userId).exec();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const name = req.body.name;
  const email = req.body.email;

  try {
    const newUser = await userModel.create({ name: name, email: email });
    res.status(201).json(newUser);
  } catch (err) {
    next(err)
  }
};
