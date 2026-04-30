const LOCAL_MONGO_PATTERNS = [/localhost/i, /127\.0\.0\.1/i, /0\.0\.0\.0/i];

function hasProductionNodeEnv() {
  return process.env.NODE_ENV === 'production';
}

function hasClientOrigin() {
  return Boolean((process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS || '').trim());
}

function isLocalMongoUri(uri) {
  return LOCAL_MONGO_PATTERNS.some((pattern) => pattern.test(uri));
}

export function validateProductionConfig() {
  if (!hasProductionNodeEnv()) {
    return;
  }

  const errors = [];
  const authSecret = process.env.AUTH_SECRET || '';
  const mongoUri = process.env.MONGODB_URI || '';
  const storageMode = (process.env.PROGRESS_STORAGE_MODE || 'auto').toLowerCase();
  const judge0Header = (process.env.JUDGE0_API_KEY_HEADER || '').toLowerCase();

  if (authSecret.length < 32) {
    errors.push('AUTH_SECRET must be set to a strong value with at least 32 characters.');
  }

  if (!mongoUri) {
    errors.push('MONGODB_URI is required in production.');
  } else if (isLocalMongoUri(mongoUri)) {
    errors.push('MONGODB_URI must point to a hosted database in production, not localhost.');
  }

  if (!hasClientOrigin()) {
    errors.push('CLIENT_ORIGIN or CLIENT_ORIGINS must be set in production.');
  }

  if (storageMode === 'file') {
    errors.push('PROGRESS_STORAGE_MODE=file is not allowed in production.');
  }

  if (process.env.JUDGE0_API_KEY && judge0Header === 'content-type') {
    errors.push('JUDGE0_API_KEY_HEADER must be an auth header, not Content-Type.');
  }

  if (errors.length > 0) {
    throw new Error(`Production configuration is not launch-safe: ${errors.join(' ')}`);
  }
}
