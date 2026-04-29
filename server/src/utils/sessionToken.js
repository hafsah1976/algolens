import { createHmac, timingSafeEqual } from 'node:crypto';

const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const TOKEN_VERSION = 1;
const LOCAL_DEV_AUTH_SECRET = 'algolens-local-dev-secret-change-me';

function getAuthSecret() {
  if (process.env.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET is required when NODE_ENV is production.');
  }

  return LOCAL_DEV_AUTH_SECRET;
}

function encodeBase64Url(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function decodeBase64Url(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}

function signPayload(encodedPayload) {
  return createHmac('sha256', getAuthSecret()).update(encodedPayload).digest('base64url');
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function createSessionToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    version: TOKEN_VERSION,
    sub: user.id,
    email: user.email,
    name: user.name,
    iat: now,
    exp: now + DEFAULT_SESSION_TTL_SECONDS,
  };
  const encodedPayload = encodeBase64Url(payload);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token) {
  try {
    if (typeof token !== 'string' || !token.includes('.')) {
      return null;
    }

    const [encodedPayload, signature] = token.split('.');

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = signPayload(encodedPayload);

    if (!safeCompare(signature, expectedSignature)) {
      return null;
    }

    const payload = decodeBase64Url(encodedPayload);
    const now = Math.floor(Date.now() / 1000);

    if (payload.version !== TOKEN_VERSION || !payload.sub || payload.exp <= now) {
      return null;
    }

    return payload;
  } catch (_error) {
    return null;
  }
}
