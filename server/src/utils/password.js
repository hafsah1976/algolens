import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');

  return {
    hash,
    salt,
  };
}

export function verifyPassword(password, salt, expectedHash) {
  if (!password || !salt || !expectedHash) {
    return false;
  }

  const actualHash = Buffer.from(scryptSync(password, salt, KEY_LENGTH).toString('hex'), 'hex');
  const storedHash = Buffer.from(expectedHash, 'hex');

  if (actualHash.length !== storedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, storedHash);
}
