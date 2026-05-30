import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

function getCached(): MongooseCache {
  if (!global.mongooseCache) {
    global.mongooseCache = { conn: null, promise: null };
  }
  return global.mongooseCache;
}

async function connectDB(): Promise<typeof mongoose | null> {
  const MONGODB_URI = process.env.MONGODB_URI || '';

  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not set — skipping database connection');
    return null;
  }

  const cached = getCached();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
