import { environmentVariables } from '@/config/environment';
import mongoose from 'mongoose';

export async function connectToDatabase() {
  await mongoose.connect(environmentVariables.MONGO_URI).catch((err) => {
    console.error('MongoDB connection error:', err);
  });
}
