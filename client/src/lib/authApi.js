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
    throw new Error('Could not connect to AlgoLens. Please refresh and try again.');
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || `Request failed with status ${response.status}.`);
  }

  return payload;
}

export function getCurrentUser(token) {
  return requestJson('/api/auth/me', { token });
}

export function logoutUser() {
  return requestJson('/api/auth/logout', {
    method: 'POST',
  });
}

export function loginUser({ email, password }) {
  return requestJson('/api/auth/login', {
    body: JSON.stringify({ email, password }),
    method: 'POST',
  });
}

export function signupUser({ email, name, password }) {
  return requestJson('/api/auth/signup', {
    body: JSON.stringify({ email, name, password }),
    method: 'POST',
  });
}

export function requestPasswordReset(email) {
  return requestJson('/api/auth/forgot-password', {
    body: JSON.stringify({ email }),
    method: 'POST',
  });
}

export function resetPassword({ password, token }) {
  return requestJson('/api/auth/reset-password', {
    body: JSON.stringify({ password, token }),
    method: 'POST',
  });
}

export function resendVerificationEmail(token) {
  return requestJson('/api/auth/resend-verification', {
    method: 'POST',
    token,
  });
}

export function verifyEmailToken(token) {
  return requestJson('/api/auth/verify-email', {
    body: JSON.stringify({ token }),
    method: 'POST',
  });
}
