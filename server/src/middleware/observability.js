import { randomUUID } from 'node:crypto';

import { logError, logInfo, logWarn } from '../utils/logger.js';

const DEFAULT_SLOW_REQUEST_MS = 1200;

function getSlowRequestThresholdMs() {
  const configured = Number(process.env.REQUEST_LOG_THRESHOLD_MS);

  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_SLOW_REQUEST_MS;
}

function getIncomingRequestId(request) {
  const value = request.get('x-request-id');

  if (typeof value !== 'string') {
    return '';
  }

  return /^[a-zA-Z0-9._:-]{8,120}$/.test(value) ? value : '';
}

function shouldLogRequest(statusCode, durationMs) {
  if (process.env.NODE_ENV === 'test' || process.env.npm_lifecycle_event === 'test') {
    return false;
  }

  if (process.env.ENABLE_REQUEST_LOGS === 'true') {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return statusCode >= 400 || durationMs >= getSlowRequestThresholdMs();
  }

  return statusCode >= 500;
}

export function attachRequestContext(request, response, next) {
  request.requestId = getIncomingRequestId(request) || randomUUID();
  response.setHeader('X-Request-Id', request.requestId);
  next();
}

export function logRequestOutcome(request, response, next) {
  const start = process.hrtime.bigint();

  response.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;

    if (!shouldLogRequest(response.statusCode, durationMs)) {
      return;
    }

    const details = {
      durationMs: Math.round(durationMs),
      method: request.method,
      path: request.originalUrl || request.url,
      requestId: request.requestId,
      statusCode: response.statusCode,
    };

    if (response.statusCode >= 500) {
      logError('Request failed', details);
      return;
    }

    if (response.statusCode >= 400) {
      logWarn('Request rejected', details);
      return;
    }

    logInfo('Slow request completed', details);
  });

  next();
}

export function handleUnhandledError(error, request, response, next) {
  logError('Unhandled request error', {
    error,
    method: request.method,
    path: request.originalUrl || request.url,
    requestId: request.requestId,
  });

  if (response.headersSent) {
    next(error);
    return;
  }

  response.status(500).json({
    error: 'Something went wrong. Please try again in a moment.',
    requestId: request.requestId,
  });
}
