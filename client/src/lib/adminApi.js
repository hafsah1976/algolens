import { buildApiUrl } from './apiBase.js';

async function requestJson(path, options = {}) {
  if (!options.token) {
    throw new Error('Admin requests require a signed-in admin account.');
  }

  let response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.token}`,
        ...(options.headers ?? {}),
      },
    });
  } catch (_error) {
    throw new Error('Could not reach the AlgoLens admin API.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Admin request failed with status ${response.status}.`);
  }

  return payload;
}

export function listAdminTopics(token) {
  return requestJson('/api/admin/topics', { token });
}

export function createAdminTopic(payload, token) {
  return requestJson('/api/admin/topics', {
    body: JSON.stringify(payload),
    method: 'POST',
    token,
  });
}

export function updateAdminTopic(topicId, payload, token) {
  return requestJson(`/api/admin/topics/${encodeURIComponent(topicId)}`, {
    body: JSON.stringify(payload),
    method: 'PUT',
    token,
  });
}

export function listAdminLessons(token) {
  return requestJson('/api/admin/lessons', { token });
}

export function createAdminLesson(payload, token) {
  return requestJson('/api/admin/lessons', {
    body: JSON.stringify(payload),
    method: 'POST',
    token,
  });
}

export function updateAdminLesson(lessonId, payload, token) {
  return requestJson(`/api/admin/lessons/${encodeURIComponent(lessonId)}`, {
    body: JSON.stringify(payload),
    method: 'PUT',
    token,
  });
}

export function listAdminQuizzes(token) {
  return requestJson('/api/admin/quizzes', { token });
}

export function createAdminQuiz(payload, token) {
  return requestJson('/api/admin/quizzes', {
    body: JSON.stringify(payload),
    method: 'POST',
    token,
  });
}

export function listAdminProblems(token) {
  return requestJson('/api/admin/problems', { token });
}

export function createAdminProblem(payload, token) {
  return requestJson('/api/admin/problems', {
    body: JSON.stringify(payload),
    method: 'POST',
    token,
  });
}
