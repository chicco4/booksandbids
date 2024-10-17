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
    if (!mongoose.isValidObjectId(userId)) {
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

// they are optional becouse we can't be sure that the client will send the name and email
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

interface updateUserParams {
  userId: string;
}

interface updateUserBody {
  name?: string;
  email?: string;
}

export const updateUser: RequestHandler<updateUserParams, unknown, updateUserBody, unknown> = async (req, res, next) => {
  const userId = req.params.userId;
  const newName = req.body.name;
  const newEmail = req.body.email;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    if (!newName || !newEmail) {
      throw createHttpError(400, "Name and email are required");
    }

    // i could have used findByIdAndUpdate but i wanted to show how to use findById and save
    const user = await userModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    user.name = newName;
    user.email = newEmail;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export const deleteUser: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    const user = await userModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    await user.deleteOne();

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}