import { NextFunction, Request, RequestHandler, Response } from 'express';
import UserModel from '../models/user.model';
import userModel from '../models/user.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

interface updateUserParams {
  userId: string;
}

interface updateUserBody {
  username?: string;
  email?: string;
  password?: string;
  role?: 'student' | 'moderator';
  name?: string;
  surname?: string;
  address?: string;
  temporary?: boolean;
}

export const updateUser: RequestHandler<updateUserParams, unknown, updateUserBody, unknown> = async (req, res, next) => {
  const userId = req.params.userId;
  const newUsername = req.body.username;
  const newEmail = req.body.email;
  const newPasswordRaw = req.body.password;
  // no role because we don't want it to be changeable
  const newName = req.body.name;
  const newSurname = req.body.surname;
  const newAddress = req.body.address;
  const newTemporary = req.body.temporary;


  try {
    if (!mongoose.isValidObjectId(userId)) {
      throw createHttpError(400, "Invalid user ID");
    }

    // i could have used findByIdAndUpdate but i wanted to show how to use findById and save
    const user = await userModel.findById(userId).exec();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    user.username = newUsername ? newUsername : user.username;
    user.email = newEmail ? newEmail : user.email;
    user.password = newPasswordRaw ? await bcrypt.hash(newPasswordRaw, 10) : user.password;
    user.name = newName ? newName : user.name;
    user.surname = newSurname ? newSurname : user.surname;
    user.address = newAddress ? newAddress : user.address;
    user.temporary = newTemporary ? newTemporary : user.temporary;

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

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.session.userId).select("+email").exec(); // i use +email to select the email field because it will not be selected by default
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// they are optional becouse we can't be sure that the client will send the name and email
interface signUpBody {
  username?: string;
  email?: string;
  password?: string;
  role?: 'student' | 'moderator';
  name?: string;
  surname?: string;
  address?: string;
  temporary?: boolean;
}

export const signUp: RequestHandler<unknown, unknown, signUpBody, unknown> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  const role = req.body.role;
  const name = req.body.name;
  const surname = req.body.surname;
  const address = req.body.address;
  const temporary = req.body.temporary;

  try {
    if (!username! || !email || !passwordRaw || !role) {
      throw createHttpError(400, "Parameters missing");
    }

    const existingUsername = await userModel.findOne({ username: username }).exec();

    if (existingUsername) {
      throw createHttpError(409, "Username already exists");
    }

    const existingEmail = await userModel.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(409, "Email already exists");
    }

    if (role !== 'student' && role !== 'moderator') {
      throw createHttpError(400, "Invalid role");
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await userModel.create({
      username: username,
      email: email,
      password: passwordHashed,
      role: role,
      name: name,
      surname: surname,
      address: address,
      temporary: temporary
    });

    req.session.userId = newUser._id;

    res.status(201).json(newUser);
  } catch (err) {
    next(err)
  }
};

interface loginBody {
  username?: string;
  password?: string;
}

export const login: RequestHandler<unknown, unknown, loginBody, unknown> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await userModel.findOne({ username: username }).select('+email +password').exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.sendStatus(204);
    }
  });
}
