import { buildApiUrl } from './apiBase.js';

async function requestJson(path, options = {}) {
  if (!options.token) {
    throw new Error('Please sign in to load your dashboard.');
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
    throw new Error('Could not reach the AlgoLens dashboard API.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Dashboard request failed with status ${response.status}.`);
  }

  return payload;
}

export function fetchDashboardSummary(token) {
  return requestJson('/api/dashboard/me', { token });
}
