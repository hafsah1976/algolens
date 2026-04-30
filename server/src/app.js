import express from 'express';

import { apiRouter } from './routes/index.js';

export function getAllowedOrigins() {
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
    response.setHeader('Access-Control-Allow-Credentials', 'true');
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

function isStateChangingMethod(method) {
  return ['DELETE', 'PATCH', 'POST', 'PUT'].includes(method);
}

function validateStateChangingOrigin(request, response, next) {
  const origin = request.get('origin');

  if (!origin || !isStateChangingMethod(request.method)) {
    next();
    return;
  }

  if (!getAllowedOrigins().has(origin)) {
    response.status(403).json({ error: 'This request origin is not allowed.' });
    return;
  }

  next();
}

function applySecurityHeaders(_request, response, next) {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  response.setHeader('Cache-Control', 'no-store');
  next();
}

function rememberRawBody(request, _response, buffer) {
  if (buffer?.length) {
    request.rawBody = buffer.toString('utf8');
  }
}

function shouldParseTextBody(request) {
  if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return false;
  }

  return !request.is('application/json') && !request.is('application/*+json');
}

function parseJsonCandidate(candidate) {
  const bodyText = Buffer.isBuffer(candidate) ? candidate.toString('utf8') : candidate;

  if (typeof bodyText !== 'string') {
    return null;
  }

  const trimmedBody = bodyText.trim();

  if (!trimmedBody || !['{', '['].includes(trimmedBody[0])) {
    return null;
  }

  try {
    return JSON.parse(trimmedBody);
  } catch (_error) {
    return null;
  }
}

export function normalizeJsonBody(request, _response, next) {
  const parsedBody =
    parseJsonCandidate(request.body) ||
    parseJsonCandidate(request.rawBody) ||
    parseJsonCandidate(request.body?.body);

  if (parsedBody) {
    request.body = parsedBody;
    next();
    return;
  }

  next();
}

function handleBodyParserError(error, _request, response, next) {
  if (!error) {
    next();
    return;
  }

  if (error.type === 'entity.too.large') {
    response.status(413).json({ error: 'Request body is too large.' });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ error: 'Request body must be valid JSON.' });
    return;
  }

  next(error);
}

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(applySecurityHeaders);
  app.use(applyCorsHeaders);
  app.use(validateStateChangingOrigin);
  app.use(express.json({ limit: '128kb', verify: rememberRawBody }));
  app.use(express.urlencoded({ extended: false, limit: '64kb', verify: rememberRawBody }));
  app.use(express.text({ limit: '128kb', type: shouldParseTextBody, verify: rememberRawBody }));
  app.use(handleBodyParserError);
  app.use(normalizeJsonBody);

  app.get('/', (_request, response) => {
    response.json({
      app: 'AlgoLens API',
      message: 'AlgoLens backend foundation is running.',
      routes: [
        '/api/health',
        '/api/auth/signup',
        '/api/auth/login',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
        '/api/auth/resend-verification',
        '/api/auth/verify-email',
        '/api/auth/logout',
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
