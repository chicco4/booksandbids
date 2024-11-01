import { RequestHandler } from "express";
import createHttpError from "http-errors";

// should be used as middleware to check if the user is authenticated
export const requiresAuth: RequestHandler = async (req, res, next) => {
    if (!req.session.user_id) {
        return next(createHttpError(401, "Unauthorized"));
    }
    next();
}

export const requiresMod: RequestHandler = async (req, res, next) => {
    if (!req.session.user_is_moderator) {
        return next(createHttpError(403, "Forbidden"));
    }
    next();
}