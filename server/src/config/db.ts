import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/axisquant';
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000, connectTimeoutMS: 3000 });
  console.log(`✓ MongoDB connected: ${mongoose.connection.host}`);
};
