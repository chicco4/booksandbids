import { RequestHandler } from "express";
import createHttpError from "http-errors";

// should be used as middleware to check if the user is authenticated
export const requiresAuth: RequestHandler = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return next(createHttpError(401, "Unauthorized"));
    }
    next();
}

export const requiresMod: RequestHandler = async (req, res, next) => {
    if (!req.session || !req.session.userId || !req.session.userIsModerator) {
        return next(createHttpError(403, "Forbidden"));
    }
    next();
}

export const requiresStud: RequestHandler = async (req, res, next) => {
    if (!req.session || !req.session.userId || req.session.userIsModerator) {
        return next(createHttpError(403, "Forbidden"));
    }
    next();
}