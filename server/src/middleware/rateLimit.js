const buckets = new Map();

function getClientKey(request) {
  const forwardedFor = request.get?.('x-forwarded-for') || '';
  const firstForwardedIp = forwardedFor.split(',')[0]?.trim();

  return firstForwardedIp || request.ip || request.socket?.remoteAddress || 'unknown-client';
}

function getBucketKey(request, keyPrefix) {
  return `${keyPrefix}:${getClientKey(request)}`;
}

export function createRateLimit({
  keyPrefix,
  maxRequests,
  message = 'Too many requests. Please wait a moment and try again.',
  windowMs,
}) {
  return function rateLimit(request, response, next) {
    const now = Date.now();
    const bucketKey = getBucketKey(request, keyPrefix);
    const currentBucket = buckets.get(bucketKey);

    if (!currentBucket || currentBucket.resetAt <= now) {
      buckets.set(bucketKey, {
        count: 1,
        resetAt: now + windowMs,
      });
      next();
      return;
    }

    currentBucket.count += 1;

    if (currentBucket.count > maxRequests) {
      response.setHeader('Retry-After', Math.ceil((currentBucket.resetAt - now) / 1000));
      response.status(429).json({ error: message });
      return;
    }

    next();
  };
}

export function resetRateLimitBucketsForTests() {
  buckets.clear();
}
