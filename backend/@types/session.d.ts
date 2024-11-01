import mongoose from "mongoose";

declare module "express-session" {
  interface SessionData {
    user_id: mongoose.Types.ObjectId;
    user_is_moderator: boolean;
  }
}