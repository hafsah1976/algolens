import serverless from 'serverless-http';

import { createApp } from '../../server/src/app.js';
import { connectToDatabase } from '../../server/src/db/mongo.js';
import { loadServerEnv } from '../../server/src/utils/loadEnv.js';

loadServerEnv();

const app = createApp();
const expressHandler = serverless(app);

function getHeader(event, headerName) {
  const targetName = headerName.toLowerCase();
  return Object.entries(event.headers ?? {}).find(
    ([key]) => key.toLowerCase() === targetName,
  )?.[1];
}

function shouldShowRequestShape(event) {
  const path = event.path || event.rawUrl || '';
  return (
    path.includes('/api/_debug/request-shape') &&
    getHeader(event, 'x-algolens-debug') === 'request-shape'
  );
}

function getRequestShape(event) {
  return {
    bodyLength: typeof event.body === 'string' ? event.body.length : null,
    contentType: getHeader(event, 'content-type') ?? null,
    hasBody: Boolean(event.body),
    httpMethod: event.httpMethod ?? event.requestContext?.http?.method ?? null,
    isBase64Encoded: Boolean(event.isBase64Encoded),
    path: event.path ?? null,
    rawPath: event.rawPath ?? null,
  };
}

async function ensureDatabase() {
  await connectToDatabase();
}

export async function handler(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (shouldShowRequestShape(event)) {
    return {
      body: JSON.stringify(getRequestShape(event)),
      headers: { 'Content-Type': 'application/json' },
      statusCode: 200,
    };
  }

  await ensureDatabase();

  return expressHandler(event, context);
}
