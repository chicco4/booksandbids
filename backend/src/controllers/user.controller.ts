import { NextFunction, Request, RequestHandler, Response } from 'express';
import UserModel from '../models/user.model';
import userModel from '../models/user.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

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
    if (mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    const user = await UserModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

interface createUserBody {
  name?: string;
  email?: string;
}

export const createUser: RequestHandler<unknown, unknown, createUserBody, unknown> = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;

  try {
    if (!name || !email) {
      throw createHttpError(400, "Name and email are required");
    }

    const newUser = await userModel.create({ name: name, email: email });
    res.status(201).json(newUser);
  } catch (err) {
    next(err)
  }
};
