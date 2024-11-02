import { NextFunction, Request, RequestHandler, Response } from 'express';
import messageModel from '../models/message.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { assertIsDefined } from '../utils/assert.is.defined';
import auctionModel from '../models/auction.model';

export const getMessages: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await messageModel.find().exec();
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};

// using RequestHandler type, i don't need to specify the types of req, res, and next
export const getMessage: RequestHandler = async (req, res, next) => {
  const messageId = req.params.messageId;

  try {
    if (!mongoose.isValidObjectId(messageId)) {
      throw createHttpError(400, "Invalid message ID");
    }

    const message = await messageModel.findById(messageId).exec();

    if (!message) {
      throw createHttpError(404, "Message not found");
    }

    res.status(200).json(message);
  } catch (err) {
    next(err);
  }
};

// they are optional because we can't be sure that the client will send the body with all parameters correctly
interface createMessageBody {
  auctionId?: string,
  content?: string,
  isPublic?: boolean
}

export const createMessage: RequestHandler<unknown, unknown, createMessageBody, unknown> = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const auctionId = req.body.auctionId;
  const content = req.body.content;
  const isPublic = req.body.isPublic;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    const existingAuction = await auctionModel.findById(auctionId).exec();

    if (!existingAuction) {
      throw createHttpError(400, "Auction does not exist");
    }

    if (!content) {
      throw createHttpError(400, "Content is required");
    }

    const newMessage = await messageModel.create({
      senderId: authenticatedUserId,
      auctionId: auctionId,
      content: content,
      isPublic: isPublic,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
};

export const deleteMessages: RequestHandler = async (req, res, next) => {
  try {
    await messageModel.deleteMany().exec();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

export const deleteMessage: RequestHandler = async (req, res, next) => {
  const messageId = req.params.messageId;

  try {
    if (!mongoose.isValidObjectId(messageId)) {
      throw createHttpError(400, "Invalid message ID");
    }

    const message = await messageModel.findById(messageId).exec();

    if (!message) {
      throw createHttpError(404, "Message not found");
    }

    await message.deleteOne();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}