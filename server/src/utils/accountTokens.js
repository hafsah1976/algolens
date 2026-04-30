import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export const EMAIL_VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export function hashAccountToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

export function createAccountToken(ttlMs) {
  const token = randomBytes(32).toString('base64url');

  return {
    expiresAt: new Date(Date.now() + ttlMs),
    token,
    tokenHash: hashAccountToken(token),
  };
}

export function isTokenExpired(expiresAt) {
  return !expiresAt || new Date(expiresAt).getTime() <= Date.now();
}

export function isSafeTokenMatch(token, expectedHash) {
  if (typeof token !== 'string' || token.length < 24 || typeof expectedHash !== 'string') {
    return false;
  }

  const actualHash = Buffer.from(hashAccountToken(token), 'hex');
  const storedHash = Buffer.from(expectedHash, 'hex');

  return actualHash.length === storedHash.length && timingSafeEqual(actualHash, storedHash);
}
