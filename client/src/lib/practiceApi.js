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
    throw new Error('Could not reach the AlgoLens practice API.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Practice request failed with status ${response.status}.`);
  }

  return payload;
}

export async function fetchProblems(filters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.topic) {
    searchParams.set('topic', filters.topic);
  }

  if (filters.difficulty) {
    searchParams.set('difficulty', filters.difficulty);
  }

  const query = searchParams.toString();

  return requestJson(`/api/problems${query ? `?${query}` : ''}`);
}

export async function fetchProblem(problemSlug) {
  return requestJson(`/api/problems/${encodeURIComponent(problemSlug)}`);
}

export async function submitProblem(problemSlug, payload, token) {
  if (!token) {
    throw new Error('Please sign in to submit code.');
  }

  return requestJson(`/api/problems/${encodeURIComponent(problemSlug)}/submit`, {
    body: JSON.stringify(payload),
    method: 'POST',
    token,
  });
}
