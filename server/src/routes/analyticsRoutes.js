import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware.js';
import { createRateLimit } from '../middleware/rateLimit.js';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';

export const analyticsRouter = Router();

const analyticsRateLimit = createRateLimit({
  keyPrefix: 'analytics',
  maxRequests: 240,
  message: 'Too many learning events. Please pause for a moment and try again.',
  windowMs: 10 * 60 * 1000,
});

const ALLOWED_EVENT_TYPES = new Set([
  'dashboard_viewed',
  'topic_viewed',
  'lesson_opened',
  'trace_library_viewed',
  'sandbox_opened',
  'graph_explorer_opened',
  'practice_list_viewed',
  'practice_problem_opened',
  'quiz_opened',
  'completion_viewed',
]);

function cleanShortText(value, maxLength = 80) {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function cleanPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/')) {
    return null;
  }

  return value.split('?')[0].slice(0, 180);
}

function cleanContext(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return {
    lessonSlug: cleanShortText(value.lessonSlug),
    problemSlug: cleanShortText(value.problemSlug),
    quizId: cleanShortText(value.quizId),
    topicSlug: cleanShortText(value.topicSlug),
  };
}

analyticsRouter.post('/analytics/events', analyticsRateLimit, requireAuth, async (request, response) => {
  const eventType = cleanShortText(request.body.eventType);
  const path = cleanPath(request.body.path);

  if (!ALLOWED_EVENT_TYPES.has(eventType) || !path) {
    response.status(400).json({ error: 'Analytics event is invalid.' });
    return;
  }

  await AnalyticsEvent.create({
    context: cleanContext(request.body.context),
    eventType,
    path,
    userId: request.authUser._id,
  });

  response.status(202).json({ ok: true });
});
