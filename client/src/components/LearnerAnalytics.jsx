import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { recordAnalyticsEvent } from '../lib/analyticsApi.js';

function readLastSegment(parts) {
  return parts[parts.length - 1] || '';
}

function buildRouteEvent(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  const section = parts[1];
  const detail = readLastSegment(parts);

  if (section === 'dashboard') {
    return { eventType: 'dashboard_viewed' };
  }

  if (section === 'topics') {
    return parts[2]
      ? { context: { topicSlug: detail }, eventType: 'topic_viewed' }
      : { eventType: 'topic_viewed' };
  }

  if (section === 'lessons' || section === 'lesson') {
    return { context: { lessonSlug: detail }, eventType: 'lesson_opened' };
  }

  if (section === 'traces') {
    return { eventType: 'trace_library_viewed' };
  }

  if (section === 'sandbox') {
    return { eventType: 'sandbox_opened' };
  }

  if (section === 'graphs') {
    return { eventType: 'graph_explorer_opened' };
  }

  if (section === 'practice') {
    return parts[2]
      ? { context: { problemSlug: detail }, eventType: 'practice_problem_opened' }
      : { eventType: 'practice_list_viewed' };
  }

  if (section === 'quizzes') {
    return { context: { quizId: detail }, eventType: 'quiz_opened' };
  }

  if (section === 'completed') {
    return { eventType: 'completion_viewed' };
  }

  return null;
}

export function LearnerAnalytics() {
  const { isAuthenticated, isLoading } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const event = buildRouteEvent(pathname);

    if (!event) {
      return;
    }

    recordAnalyticsEvent({
      ...event,
      path: pathname,
    });
  }, [isAuthenticated, isLoading, pathname]);

  return null;
}
