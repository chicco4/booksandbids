import mongoose from "mongoose";

declare module "express-session" {
  interface SessionData {
    userId: mongoose.Types.ObjectId;
    userIsModerator: boolean;
  }
}