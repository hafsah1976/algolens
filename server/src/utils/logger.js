const SENSITIVE_KEY_PATTERN = /(authorization|cookie|password|secret|token|key|uri|email)/i;

function sanitizePrimitive(value) {
  if (typeof value === 'string' && value.length > 240) {
    return `${value.slice(0, 240)}...`;
  }

  return value;
}

export function sanitizeLogDetails(value, depth = 0) {
  if (value == null || typeof value !== 'object') {
    return sanitizePrimitive(value);
  }

  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
    };
  }

  if (depth > 3) {
    return '[nested]';
  }

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => sanitizeLogDetails(item, depth + 1));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SENSITIVE_KEY_PATTERN.test(key) ? '[redacted]' : sanitizeLogDetails(item, depth + 1),
    ]),
  );
}

function writeLog(level, message, details = {}) {
  const payload = {
    details: sanitizeLogDetails(details),
    level,
    message,
    service: 'algolens-server',
    timestamp: new Date().toISOString(),
  };
  const line = JSON.stringify(payload);

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
}

export function logError(message, details) {
  writeLog('error', message, details);
}

export function logInfo(message, details) {
  writeLog('info', message, details);
}

export function logWarn(message, details) {
  writeLog('warn', message, details);
}
