import { NextFunction, Request, RequestHandler, Response } from 'express';
import userModel from '../models/user.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { assertIsDefined } from '../utils/assert.is.defined';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find().exec();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// using RequestHandler type, i don't need to specify the types of req, res, and next
export const getUserById: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    const user = await userModel.findById(userId).select("+name +surname +address").exec(); // i use + to select the field because it should be select: false in the schema

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

interface updateUserBody {
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  surname?: string;
  address?: string;
}

export const updateAuthenticatedUser: RequestHandler<unknown, unknown, updateUserBody, unknown> = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const { username, email, password: passwordRaw, name, surname, address } = req.body;

  try {
    assertIsDefined(authenticatedUserId);

    const user = await userModel.findById(authenticatedUserId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    // Update only fields that are provided
    const updatedFields: Partial<typeof user> = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (passwordRaw) updatedFields.password = await bcrypt.hash(passwordRaw, 10);
    if (name) updatedFields.name = name;
    if (surname) updatedFields.surname = surname;
    if (address) updatedFields.address = address;

    // Apply the updates and save the user
    Object.assign(user, updatedFields);
    const updatedUser = await user.save();

    // Respond with the updated user
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

interface inviteModeratorBody {
  username?: string;
  email?: string;
  password?: string;
}

export const inviteModerator: RequestHandler<unknown, unknown, inviteModeratorBody, unknown> = async (req, res, next) => {
  const { username, email, password: passwordRaw } = req.body;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!username! || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUsername = await userModel.findOne({ username: username }).exec();

    if (existingUsername) {
      throw createHttpError(409, "Username already exists");
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newMod = await userModel.create({
      username: username,
      email: email,
      password: passwordHashed,
      isModerator: true,
      isFirstLogin: true,
      invitedBy: authenticatedUserId
    });

    res.status(201).json(newMod);
  } catch (err) {
    next(err)
  }
}

export const deleteAllUsers: RequestHandler = async (req, res, next) => {
  try {
    await userModel.deleteMany().exec();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

export const deleteUserById: RequestHandler = async (req, res, next) => {
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
















// legacy code

interface updateUserParams {
  userId: string;
}

export const updateUserById: RequestHandler<updateUserParams, unknown, updateUserBody, unknown> = async (req, res, next) => {
  // i use destructuring to get the userId from the params and the other fields from the body
  const { userId } = req.params;
  const { username, email, password: passwordRaw, name, surname, address } = req.body;

  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    // i could have used findByIdAndUpdate but i wanted to show how to use findById and save
    const user = await userModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    // Update only fields that are provided
    const updatedFields: Partial<typeof user> = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (passwordRaw) updatedFields.password = await bcrypt.hash(passwordRaw, 10);
    if (name) updatedFields.name = name;
    if (surname) updatedFields.surname = surname;
    if (address) updatedFields.address = address;

    // Apply the updates and save the user
    Object.assign(user, updatedFields);
    const updatedUser = await user.save();

    // Respond with the updated user
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}