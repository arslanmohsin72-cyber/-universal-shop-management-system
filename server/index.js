import { onRequest } from 'firebase-functions/v2/https';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { autoSeedIfEmpty } from './src/seed/seedData.js';

let dbConnected = false;

const ensureDB = async () => {
  if (!dbConnected) {
    await connectDB();
    await autoSeedIfEmpty();
    dbConnected = true;
  }
};

export const api = onRequest({ cors: true }, async (req, res) => {
  try {
    await ensureDB();
  } catch (err) {
    console.error('Database connection error in function:', err);
  }
  return app(req, res);
});
