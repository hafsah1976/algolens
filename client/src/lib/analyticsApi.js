import { buildApiUrl } from './apiBase.js';

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

export function recordAnalyticsEvent(event) {
  if (!event || !ALLOWED_EVENT_TYPES.has(event.eventType)) {
    return;
  }

  const body = JSON.stringify({
    context: event.context || {},
    eventType: event.eventType,
    path: event.path,
  });

  fetch(buildApiUrl('/api/analytics/events'), {
    body,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    keepalive: body.length < 6000,
    method: 'POST',
  }).catch(() => {
    // Analytics must never interrupt learning.
  });
}
