import { buildApiUrl } from './apiBase.js';

async function requestJson(path, options = {}) {
  let response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
  } catch (_error) {
    throw new Error('Could not save your progress. Please refresh and try again.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}.`);
  }

  return payload;
}

export async function fetchProgressSnapshot(token = null) {
  return requestJson('/api/progress/me', { token });
}

export async function saveLessonProgress(payload, token = null) {
  return requestJson('/api/progress/lesson', {
    body: JSON.stringify(payload),
    method: 'POST',
    token,
  });
}

export async function saveTopicProgress(payload, token = null) {
  return requestJson('/api/progress/topic', {
    body: JSON.stringify(payload),
    method: 'PUT',
    token,
  });
}
