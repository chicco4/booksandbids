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
