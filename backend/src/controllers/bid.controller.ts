import { NextFunction, Request, RequestHandler, Response } from 'express';
import bidModel from '../models/bid.model';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { assertIsDefined } from '../utils/assert.is.defined';
import auctionModel from '../models/auction.model';

export const getBids: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bids = await bidModel.find().exec();
    res.status(200).json(bids);
  } catch (err) {
    next(err);
  }
};

// using RequestHandler type, i don't need to specify the types of req, res, and next
export const getBid: RequestHandler = async (req, res, next) => {
  const bidId = req.params.bidId;

  try {
    if (!mongoose.isValidObjectId(bidId)) {
      throw createHttpError(400, "Invalid bid ID");
    }

    const bid = await bidModel.findById(bidId).exec();

    if (!bid) {
      throw createHttpError(404, "Bid not found");
    }

    res.status(200).json(bid);
  } catch (err) {
    next(err);
  }
};

// they are optional becouse we can't be sure that the client will send the body with all parameters correctly
interface createBidBody {
  auctionId?: string,
  amount?: number
}

export const createBid: RequestHandler<unknown, unknown, createBidBody, unknown> = async (req, res, next) => {
  const auctionId = req.body.auctionId;
  const amount = req.body.amount;
  
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

    if (!auctionId || !amount) {
      throw createHttpError(400, "Parameters missing");
    }

    if (!mongoose.isValidObjectId(auctionId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    const existingAuction = await auctionModel.findById(auctionId).exec();

    if (!existingAuction) {
      throw createHttpError(400, "Auction does not exist");
    }    

    const newBid = await bidModel.create({
      auctionId: auctionId,
      bidderId: authenticatedUserId,
      amount: amount
    });

    res.status(201).json(newBid);
  } catch (err) {
    next(err);
  }
};

export const deleteBids: RequestHandler = async (req, res, next) => {
  try {
    await bidModel.deleteMany().exec();
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const deleteBid: RequestHandler = async (req, res, next) => {
  const bidId = req.params.bidId;

  try {
    if (!mongoose.isValidObjectId(bidId)) {
      throw createHttpError(400, "Invalid auction ID");
    }

    const bid = await bidModel.findById(bidId).exec();

    if (!bid) {
      throw createHttpError(404, "Bid not found");
    }

    await bid.deleteOne();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};