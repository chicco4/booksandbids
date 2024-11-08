// Responsible for starting the server and listening on a specified port.
// It typically imports the app.ts and calls the listen method.
import app from './app';
import env from './utils/validate.env';
import mongoose from 'mongoose';
import { seedDatabase } from './utils/seed';

const PORT = env.PORT;
const MONGO_URI = env.MONGO_URI;

if (!PORT) {
  console.error('PORT is not defined in the environment variables');
  process.exit(1);
}

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Database connected');
    // Seed the database
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server available at http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
