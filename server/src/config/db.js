import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri || mongoUri.trim() === '') {
      console.log('No MONGODB_URI provided. Starting in-memory MongoDB server...');
      mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
      console.log(`In-memory MongoDB started at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: process.env.DB_NAME || 'UniversalShopManagementDB'
    });

    console.log(`MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
