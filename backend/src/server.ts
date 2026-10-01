import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { isMongoDBReady } from './stores/MemoryStore.js';

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  const useMemory = !isMongoDBReady();

  if (!useMemory) {
    try {
      await connectDB();
      console.log('Connected to MongoDB');
    } catch (err) {
      console.warn('MongoDB connection failed, falling back to in-memory store:', (err as Error).message);
    }
  }

  if (useMemory) {
    console.log('Running in development mode with in-memory store (no MongoDB required)');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

startServer();
