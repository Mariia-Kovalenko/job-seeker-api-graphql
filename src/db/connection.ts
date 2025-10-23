import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_CONNECTION as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      // Automatic index build recommended OFF in prod. Add your preferred options here
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
