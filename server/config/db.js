import mongoose from 'mongoose';

export let isMongoConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500, // Quick fallback if local mongodb server isn't running
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected cleanly to host: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`[MongoDB] Local daemon not detected (${error.message}). Operating on High-Performance Resilient JSON Store Mode.`);
  }
};
