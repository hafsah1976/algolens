import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/algolens';
const DEFAULT_SERVER_SELECTION_TIMEOUT_MS = 8000;
const DEFAULT_RETRY_DELAY_MS = 10000;

let connectionPromise = null;
let lastConnectionError = null;
let lastConnectionAttemptAt = 0;

const READY_STATE_LABELS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

function getMongoUri() {
  return process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
}

export function getDatabaseStatus() {
  return {
    state: READY_STATE_LABELS[mongoose.connection.readyState] ?? 'unknown',
    databaseName: mongoose.connection.name || null,
    lastError: lastConnectionError?.message ?? null,
    uriConfigured: Boolean(process.env.MONGODB_URI),
  };
}

export async function connectToDatabase() {
  if ((process.env.PROGRESS_STORAGE_MODE || 'auto').toLowerCase() === 'file') {
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  if (mongoose.connection.readyState === 0 && connectionPromise) {
    connectionPromise = null;
  }

  const now = Date.now();

  if (
    lastConnectionError &&
    now - lastConnectionAttemptAt < DEFAULT_RETRY_DELAY_MS
  ) {
    return null;
  }

  lastConnectionAttemptAt = now;

  connectionPromise = mongoose
    .connect(getMongoUri(), {
      serverSelectionTimeoutMS:
        Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) ||
        DEFAULT_SERVER_SELECTION_TIMEOUT_MS,
    })
    .then((connection) => {
      lastConnectionError = null;
      connectionPromise = null;
      return connection.connection;
    })
    .catch((error) => {
      lastConnectionError = error;
      connectionPromise = null;
      console.warn(`MongoDB connection unavailable: ${error.message}`);
      return null;
    });

  return connectionPromise;
}

export async function ensureDatabaseConnection() {
  const connection = await connectToDatabase();
  return Boolean(connection && mongoose.connection.readyState === 1);
}
