import { RequestHandler } from 'express';
import userModel from '../models/user.model';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { assertIsDefined } from '../utils/assert.is.defined';

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.session.user_id).exec();
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
    if (!username! || !email || !passwordRaw) {
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

    req.session.user_id = newUser._id;

    res.status(201).json(newUser);
  } catch (err) {
    next(err)
  }
};

interface loginBody {
  username?: string;
  password?: string;
  new_password?: string;
}

export const login: RequestHandler<unknown, unknown, loginBody, unknown> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const new_password = req.body.new_password;

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

    if (user.is_moderator && user.is_first_login == true) {
      if (!new_password) {
        throw createHttpError(401, "Parameters missing");
      }

      user.password = new_password;
      user.is_first_login = false
      user.save();
    }

    req.session.user_id = user._id;
    req.session.user_is_moderator = user.is_moderator;
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

interface inviteModeratorBody {
  username?: string;
  email?: string;
  password?: string;
}

export const inviteModerator: RequestHandler<unknown, unknown, inviteModeratorBody, unknown> = async (req, res, next) => {
  const { username, email, password: passwordRaw } = req.body;
  const authenticatedUserId = req.session.user_id;

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
      is_moderator: true,
      is_first_login: true,
      invited_by: authenticatedUserId
    });

    res.status(201).json(newMod);
  } catch (err) {
    next(err)
  }
}
