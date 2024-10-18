import { RequestHandler } from "express";
import createHttpError from "http-errors";

// should be used as middleware to check if the user is authenticated
export const requiresAuth: RequestHandler = async (req, res, next) => {
    if (!req.session.userId) {
        return next(createHttpError(401, "Unauthorized"));
    }
    next();
}