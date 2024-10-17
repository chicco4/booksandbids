// Responsible for starting the server and listening on a specified port.
// It typically imports the app.ts and calls the listen method.
import app from './app';
import mongoose from 'mongoose';

const PORT = 4000;
const MONGO_URI = 'mongodb://admin:adminpassword@localhost:27017/mydatabase?authSource=admin';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Database connected');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("BooksAndBids!");
});