import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;


// Persist connection across Next.js hot reloads in dev
const g = globalThis as typeof globalThis & {
  _mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

if (!g._mongooseCache) {
  g._mongooseCache = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not defined. Mongoose will run in offline mockup mode.");
    return mongoose;
  }

  const cache = g._mongooseCache!;

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      // ── Atlas M0 / free-tier optimisations ──────────────────────────────
      serverSelectionTimeoutMS: 10_000,  // give Atlas 10 s to respond
      socketTimeoutMS:          20_000,  // drop idle sockets after 20 s
      maxPoolSize:              5,       // small pool for serverless/dev
      minPoolSize:              1,       // keep at least 1 alive (avoids cold reconnect)
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export default connectDB;
