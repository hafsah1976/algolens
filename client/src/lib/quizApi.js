import { buildApiUrl } from './apiBase.js';

async function requestJson(path, options = {}) {
  let response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
  } catch (_error) {
    throw new Error('Could not load the quiz. Please try again.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Quiz request failed with status ${response.status}.`);
  }

  return payload;
}

export async function fetchTopicQuizzes(topicId) {
  if (!topicId) {
    return { quizzes: [] };
  }

  return requestJson(`/api/quizzes/topic/${encodeURIComponent(topicId)}`);
}

export async function fetchQuiz(quizId) {
  return requestJson(`/api/quizzes/${encodeURIComponent(quizId)}`);
}

export async function submitQuiz(quizId, answers, token) {
  if (!token) {
    throw new Error('Please sign in to submit a quiz.');
  }

  return requestJson(`/api/quizzes/${encodeURIComponent(quizId)}/submit`, {
    body: JSON.stringify({ answers }),
    method: 'POST',
    token,
  });
}
