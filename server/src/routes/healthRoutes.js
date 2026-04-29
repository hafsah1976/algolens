import { Router } from 'express';

import { getDatabaseStatus } from '../db/mongo.js';
import { getProgressStorageMode, getProgressStoragePreference } from '../utils/storageMode.js';

export const healthRouter = Router();

healthRouter.get('/health', (_request, response) => {
  const database = getDatabaseStatus();
  response.json({
    status: 'ok',
    service: 'algolens-server',
    database,
    progressStorage: {
      preference: getProgressStoragePreference(),
      mode: getProgressStorageMode(database.state === 'connected'),
    },
    timestamp: new Date().toISOString(),
  });
});
