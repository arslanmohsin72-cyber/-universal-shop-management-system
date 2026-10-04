import app from './app.js';
import { connectDB } from './config/db.js';
import { autoSeedIfEmpty } from './seed/seedData.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  await autoSeedIfEmpty();

  app.listen(PORT, () => {
    console.log(`Universal Shop Management Server running on port ${PORT}`);
  });
};

startServer();
