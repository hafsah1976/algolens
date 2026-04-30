import express from 'express';

import { apiRouter } from './routes/index.js';

function getAllowedOrigins() {
  return new Set(
    (process.env.CLIENT_ORIGINS ||
      process.env.CLIENT_ORIGIN ||
      'http://localhost:5173,http://127.0.0.1:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

function applyCorsHeaders(request, response, next) {
  const origin = request.get('origin');
  const allowedOrigins = getAllowedOrigins();

  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }

  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');

  if (request.method === 'OPTIONS') {
    response.status(204).send();
    return;
  }

  next();
}

function shouldParseTextBody(request) {
  if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return false;
  }

  return !request.is('application/json') && !request.is('application/*+json');
}

export function normalizeJsonBody(request, _response, next) {
  if (typeof request.body !== 'string') {
    next();
    return;
  }

  const trimmedBody = request.body.trim();

  if (!trimmedBody || !['{', '['].includes(trimmedBody[0])) {
    next();
    return;
  }

  try {
    request.body = JSON.parse(trimmedBody);
  } catch (_error) {
    // Leave invalid JSON untouched so route-level validation can respond safely.
  }

  next();
}

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(applyCorsHeaders);
  app.use(express.json());
  app.use(express.text({ type: shouldParseTextBody }));
  app.use(normalizeJsonBody);

  app.get('/', (_request, response) => {
    response.json({
      app: 'AlgoLens API',
      message: 'AlgoLens backend foundation is running.',
      routes: [
        '/api/health',
        '/api/auth/signup',
        '/api/auth/login',
        '/api/auth/me',
        '/api/dashboard/me',
        '/api/admin/topics',
        '/api/admin/lessons',
        '/api/admin/quizzes',
        '/api/admin/problems',
        '/api/topics',
        '/api/topics/:slug',
        '/api/topics/:slug/lessons',
        '/api/lessons/:slug',
        '/api/problems',
        '/api/problems/:slug',
        '/api/problems/:slug/submit',
        '/api/quizzes/topic/:topicId',
        '/api/quizzes/:quizId',
        '/api/quizzes/:quizId/submit',
        '/api/progress',
        '/api/progress/me',
        '/api/progress/lesson',
        '/api/progress/topic',
      ],
    });
  });

  app.use('/api', apiRouter);

  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'API route not found.' });
  });

  app.use((_request, response) => {
    response.status(404).json({ error: 'Route not found.' });
  });

  return app;
}
