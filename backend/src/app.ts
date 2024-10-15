// Initializes the Express app and connects the routes, middlewares, and configurations.
// It is the main entry point for the app logic.
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

mongoose.connect('mongodb://mongo:27017/mydatabase').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

export default app;
