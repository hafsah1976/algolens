import { SESSION_TTL_SECONDS } from './sessionToken.js';

export const SESSION_COOKIE_NAME = 'algolens_session';

function isProduction() {
  return process.env.NODE_ENV === 'production';
}

function getCookieOptions() {
  return {
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: '/',
    sameSite: 'lax',
    secure: isProduction(),
  };
}

export function readSessionCookie(request) {
  const cookieHeader = request.get?.('cookie') || request.headers?.cookie || '';

  for (const cookie of cookieHeader.split(';')) {
    const [rawName, ...rawValueParts] = cookie.trim().split('=');

    if (rawName !== SESSION_COOKIE_NAME) {
      continue;
    }

    const rawValue = rawValueParts.join('=');

    try {
      return decodeURIComponent(rawValue);
    } catch (_error) {
      return rawValue;
    }
  }

  return null;
}

export function setSessionCookie(response, token) {
  response.cookie(SESSION_COOKIE_NAME, token, getCookieOptions());
}

export function clearSessionCookie(response) {
  response.clearCookie(SESSION_COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: undefined,
  });
}
