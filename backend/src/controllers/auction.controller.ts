import { NextFunction, Request, RequestHandler, Response } from 'express';
import auctionModel from '../models/auction.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { assertIsDefined } from '../utils/assert.is.defined';

export const getAuctions: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auctions = await auctionModel.find().exec();
    res.status(200).json(auctions);
  } catch (err) {
    next(err);
  }
};

// using RequestHandler type, i don't need to specify the types of req, res, and next
export const getAuction: RequestHandler = async (req, res, next) => {
  const auctionId = req.params.auctionId;

  try {
    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    const auction = await auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw createHttpError(404, "Auction not found");
    }

    res.status(200).json(auction);
  } catch (err) {
    next(err);
  }
};

// they are optional becouse we can't be sure that the client will send the body with all parameters correctly
interface createAuctionBody {
  book?: {
    title?: string,
    author?: string,
    ISBN?: string,
    course?: string,
    university?: string,
    edition?: string,
    publisher?: string,
  };
  duration?: {
    start?: Date,
    end?: Date,
  };
  starting_price?: number;
  reserve_price?: number;
}

export const createAuction: RequestHandler<unknown, unknown, createAuctionBody, unknown> = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const book = req.body.book;
  const duration = req.body.duration;
  const starting_price = req.body.starting_price;
  const reserve_price = req.body.reserve_price;

  try {
    assertIsDefined(authenticatedUserId);

    if (!book! || !duration || !starting_price || !reserve_price) {
      throw createHttpError(400, "Parameters misessssing");
    }

    if (!book.title || !book.author || !book.ISBN || !book.course || !book.university || !book.edition || !book.publisher) {
      throw createHttpError(400, "Book parameters missing");
    }

    if (!duration.start || !duration.end) {
      throw createHttpError(400, "Duration parameters missing");
    }

    const newAuction = await auctionModel.create({
      seller_id: authenticatedUserId,
      book: book,
      duration: duration,
      starting_price: starting_price,
      reserve_price: reserve_price
    });

    res.status(201).json(newAuction);
  } catch (err) {
    next(err);
  }
};

export const deleteAuctions: RequestHandler = async (req, res, next) => {
  try {
    await auctionModel.deleteMany().exec();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const deleteAuction: RequestHandler = async (req, res, next) => {
  const auctionId = req.params.auctionId;

  try {
    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    const auction = await auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw createHttpError(404, "Auction not found");
    }

    await auction.deleteOne();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};