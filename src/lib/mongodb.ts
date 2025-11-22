import { environmentVariables } from '@/config/environment';
import mongoose from 'mongoose';

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(environmentVariables.MONGO_URI)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err);
        throw err; // rethrow to propagate the error
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // reset promise on failure
    throw error;
  }

  return cached.conn;
}
