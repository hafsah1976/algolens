import serverless from 'serverless-http';

import { createApp } from '../../server/src/app.js';
import { connectToDatabase } from '../../server/src/db/mongo.js';
import { loadServerEnv } from '../../server/src/utils/loadEnv.js';

loadServerEnv();

const app = createApp();
const expressHandler = serverless(app);

async function ensureDatabase() {
  await connectToDatabase();
}

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  await ensureDatabase();

  return expressHandler(event, context);
}
