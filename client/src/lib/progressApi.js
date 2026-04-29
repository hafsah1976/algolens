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
    throw new Error('Could not reach the AlgoLens API. Make sure the backend is running.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}.`);
  }

  return payload;
}

export async function fetchProgressSnapshot(token = null) {
  if (!token) {
    throw new Error('Please sign in to load progress.');
  }

  return requestJson('/api/progress/me', { token });
}

export async function saveLessonProgress(payload, token = null) {
  if (!token) {
    throw new Error('Please sign in to save progress.');
  }

  return requestJson('/api/progress/lesson', {
    body: JSON.stringify(payload),
    method: 'POST',
    token,
  });
}

export async function saveTopicProgress(payload, token = null) {
  if (!token) {
    throw new Error('Please sign in to save progress.');
  }

  return requestJson('/api/progress/topic', {
    body: JSON.stringify(payload),
    method: 'PUT',
    token,
  });
}
