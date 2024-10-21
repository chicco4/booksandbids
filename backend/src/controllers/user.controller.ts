import { NextFunction, Request, RequestHandler, Response } from 'express';
import userModel from '../models/user.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.session.userId).exec();
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
  name?: string;
  surname?: string;
  address?: string;
}

export const signUp: RequestHandler<unknown, unknown, signUpBody, unknown> = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;
  const name = req.body.name;
  const surname = req.body.surname;
  const address = req.body.address;

  try {
    if (!username! || !email || !passwordRaw ) {
      throw createHttpError(400, "Parameters missing");
    }

    // const existingUsername = await userModel.findOne({ username: username }).exec();

    // if (existingUsername) {
    //   throw createHttpError(409, "Username already exists");
    // }

    // const existingEmail = await userModel.findOne({ email: email }).exec();

    // if (existingEmail) {
    //   throw createHttpError(409, "Email already exists");
    // }

    // i use `Promise.all` to check if both username and email exist concurrently
    const [existingUsername, existingEmail] = await Promise.all([
      userModel.findOne({ username }).exec(),
      userModel.findOne({ email }).exec(),
    ]);

    if (existingUsername) {
      throw createHttpError(409, "Username already exists");
    }
    if (existingEmail) {
      throw createHttpError(409, "Email already exists");
    }

    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await userModel.create({
      username: username,
      email: email,
      password: passwordHashed,
      name: name,
      surname: surname,
      address: address
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

    const user = await userModel.findOne({ username: username }).select('+password').exec();

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

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find().exec();
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

    const user = await userModel.findById(userId).select("+name +surname +address").exec(); // i use + to select the field because it should be select: false in the schema

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
  name?: string;
  surname?: string;
  address?: string;
}

export const updateUser: RequestHandler<updateUserParams, unknown, updateUserBody, unknown> = async (req, res, next) => {
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

export const deleteUsers: RequestHandler = async (req, res, next) => {
  try {
    await userModel.deleteMany().exec();
    res.sendStatus(200);
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
