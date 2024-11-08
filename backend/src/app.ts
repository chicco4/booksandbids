// Initializes the Express app and connects the routes, middlewares, and configurations.
// It is the main entry point for the app logic.
import express, { NextFunction, Request, Response } from 'express';
import "dotenv/config";
import morgan from 'morgan';
import createHttpError, { isHttpError } from 'http-errors';
import session from 'express-session';
import env from "./utils/validate.env";
import MongoStore from 'connect-mongo';
import cors from 'cors';
import { checkAuctions } from './jobs/check_auctions.job';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import auctionRoutes from './routes/auction.routes';

const app = express();

app.get("/", (req, res) => {
    res.send("BooksAndBids!");
});

app.use(morgan("dev"));

app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000 // 1 hour
    },
    rolling: true, // cookie expiration time resets on every request
    store: MongoStore.create({
        mongoUrl: env.MONGO_URI
    })
}));

app.use(cors());

// Initialize the scheduler
checkAuctions.start();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auctions', auctionRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, 'Endpoint not found'));
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;
