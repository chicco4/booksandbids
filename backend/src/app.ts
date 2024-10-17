// Initializes the Express app and connects the routes, middlewares, and configurations.
// It is the main entry point for the app logic.
import express from 'express';
import userRoutes from './routes/user.route';

const app = express();

app.get("/", (req, res) => {
    res.send("BooksAndBids!");
});

app.use(express.json());
app.use('/api/users', userRoutes);

export default app;
