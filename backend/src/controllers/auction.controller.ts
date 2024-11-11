import { NextFunction, Request, RequestHandler, Response } from 'express';
import auctionModel from '../models/auction.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { assertIsDefined } from '../utils/assert.is.defined';

interface searchAuctionsParams {
  title?: string;
  author?: string;
  ISBN?: string;
  course?: string;
  university?: string;
  edition?: string;
  publisher?: string;
  minPrice?: number;
  maxPrice?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

export const searchAuctions: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  // check for all the possible query parameters
  const { title, author, ISBN, course, university, edition, publisher, minPrice, maxPrice, startDate, endDate, status } = req.query as searchAuctionsParams;

  try {
    const query = auctionModel.find();

    if (title) {
      query.where('book.title').equals(title);
    }

    if (author) {
      query.where('book.author').equals(author);
    }

    if (ISBN) {
      query.where('book.ISBN').equals(ISBN);
    }

    if (course) {
      query.where('book.course').equals(course);
    }

    if (university) {
      query.where('book.university').equals(university);
    }

    if (edition) {
      query.where('book.edition').equals(edition);
    }

    if (publisher) {
      query.where('book.publisher').equals(publisher);
    }

    if (minPrice) {
      query.where('startingPrice').gte(minPrice);
    }

    if (maxPrice) {
      query.where('startingPrice').lte(maxPrice);
    }
    if (startDate) {
      query.where('duration.start').gte(startDate.getTime());
    }

    if (endDate) {
      query.where('duration.end').lte(endDate.getTime());
    }

    if (status) {
      query.where('status').equals(status);
    }

    const auctions = await query.exec();

    res.status(200).json(auctions);
  } catch (err) {
    next(err);
  }
};

// using RequestHandler type, i don't need to specify the types of req, res, and next
export const getAuctionById: RequestHandler = async (req, res, next) => {
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

export const getAuthenticatedUserAuctions: RequestHandler = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    const auctions = await auctionModel.find({ seller_id: authenticatedUserId }).exec();

    res.status(200).json(auctions);
  } catch (err) {
    next(err);
  }
};

interface updateAuctionParams {
  auctionId: string;
}

interface updateAuctionBody {
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
  status?: string;
}

export const updateAuctionById: RequestHandler<updateAuctionParams, unknown, updateAuctionBody, unknown> = async (req, res, next) => {
  const { auctionId } = req.params;
  const { book, duration, starting_price, reserve_price, status } = req.body;

  try {
    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    // i could have used findByIdAndUpdate but i wanted to show how to use findById and save
    const auction = await auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw createHttpError(404, "Auction not found");
    }

    // Update only fields that are provided
    const updatedFields: Partial<typeof auction> = {};
    if (book && book.title && book.author && book.ISBN && book.course && book.university && book.edition && book.publisher) {
      updatedFields.book = {
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        course: book.course,
        university: book.university,
        edition: book.edition,
        publisher: book.publisher,
      };
    }
    if (duration) {
      updatedFields.duration = {
        start: duration.start as NativeDate,
        end: duration.end as NativeDate,
      };
    }
    if (starting_price) updatedFields.startingPrice = starting_price;
    if (reserve_price) updatedFields.reservePrice = reserve_price;
    if (status) updatedFields.status = status as 'waiting' | 'active' | 'succeded' | 'failed' | 'deleted';

    // Apply the updates and save the auction
    Object.assign(auction, updatedFields);
    const updatedAuction = await auction.save();

    // Respond with the updated auction
    res.status(200).json(updatedAuction);
  } catch (err) {
    next(err);
  }
}

// they are optional because we can't be sure that the client will send the body with all parameters correctly
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
  startingPrice?: number;
  reservePrice?: number;
}

export const createAuction: RequestHandler<unknown, unknown, createAuctionBody, unknown> = async (req, res, next) => {
  const authenticatedUserId = req.session.userId;
  const book = req.body.book;
  const duration = req.body.duration;
  const startingPrice = req.body.startingPrice;
  const reservePrice = req.body.reservePrice;

  try {
    assertIsDefined(authenticatedUserId);

    if (!book! || !duration || !startingPrice || !reservePrice) {
      throw createHttpError(400, "Parameters missing");
    }

    if (!book.title || !book.author || !book.ISBN || !book.course || !book.university || !book.edition || !book.publisher) {
      throw createHttpError(400, "Book parameters missing");
    }

    if (!duration.start || !duration.end) {
      throw createHttpError(400, "Duration parameters missing");
    }

    if (duration.start >= duration.end) {
      throw createHttpError(400, "Invalid duration");
    }

    if (startingPrice < 0 || reservePrice < 0) {
      throw createHttpError(400, "Prices must be positive");
    }

    const newAuction = await auctionModel.create({
      seller_id: authenticatedUserId,
      book: book,
      duration: duration,
      starting_price: startingPrice,
      reserve_price: reservePrice,
    });

    res.status(201).json(newAuction);
  } catch (err) {
    next(err);
  }
};

export const deleteAllAuctions: RequestHandler = async (req, res, next) => {
  try {
    await auctionModel.deleteMany().exec();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const deleteAuctionById: RequestHandler = async (req, res, next) => {
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

// nested bids and messages controllers

export const getAuctionBids: RequestHandler = async (req, res, next) => {
  const auctionId = req.params.auctionId;

  try {
    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    const auction = await auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw createHttpError(404, "Auction not found");
    }

    res.status(200).json(auction.bids);
  } catch (err) {
    next(err);
  }
};


interface bidAuctionParams {
  auctionId: string;
}

interface bidAuctionBody {
  amount?: number;
}

export const bidAuction: RequestHandler<bidAuctionParams, unknown, bidAuctionBody, unknown> = async (req, res, next) => {
  const { auctionId } = req.params;
  const authenticatedUserId = req.session.userId;
  const { amount } = req.body;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    if (!amount) {
      throw createHttpError(400, "Amount missing");
    }

    const auction = await auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw createHttpError(404, "Auction not found");
    }

    if (auction.status !== 'active') {
      throw createHttpError(400, "Auction is not active");
    }

    if (auction.sellerId === authenticatedUserId) {
      throw createHttpError(400, "Seller cannot bid on their own auction");
    }

    if (amount < 0) {
      throw createHttpError(400, "Amount must be positive");
    }

    if (auction.bids.length === 0 && amount < auction.startingPrice) {
      throw createHttpError(400, "Amount is less than the starting price");
    }

    if (amount < auction.bids[auction.bids.length - 1].amount) {
      throw createHttpError(400, "Amount is less than the last bid");
    }

    auction.bids.push({
      bidderId: authenticatedUserId,
      amount: amount,
      createdAt: new Date(),
    });

    await auction.save();

    res.status(200).json(auction.bids);

  } catch (err) {
    next(err);
  }
}

export const getAuctionMessages: RequestHandler = async (req, res, next) => {
  const auctionId = req.params.auctionId;

  try {
    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    const auction = await auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw createHttpError(404, "Auction not found");
    }

    res.status(200).json(auction.messages);
  } catch (err) {
    next(err);
  }
}

interface messageAuctionParams {
  auctionId: string;
}

interface messageAuctionBody {
  content?: string;
  isPrivate?: boolean;
}

export const messageAuction: RequestHandler<messageAuctionParams, unknown, messageAuctionBody, unknown> = async (req, res, next) => {
  const { auctionId } = req.params;
  const { content, isPrivate } = req.body;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    if (!content) {
      throw createHttpError(400, "Parameters missing");
    }

    const auction = await auctionModel.findById(auctionId).exec();

    if (!auction) {
      throw createHttpError(404, "Auction not found");
    }

    auction.messages.push({
      senderId: authenticatedUserId,
      content: content,
      isPrivate: isPrivate,
      createdAt: new Date(),
    });

    await auction.save();

    res.status(200).json(auction.messages);

  } catch (err) {
    next(err);
  }
}
