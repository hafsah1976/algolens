import { ensureDatabaseConnection } from '../db/mongo.js';
import { User } from '../models/User.js';
import { isConfiguredAdminEmail, promoteConfiguredAdmin } from '../utils/adminEmails.js';
import { readSessionCookie } from '../utils/sessionCookie.js';
import { verifySessionToken } from '../utils/sessionToken.js';

function readBearerToken(request) {
  const header = request.get('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

export async function optionalAuth(request, response, next) {
  const token = readBearerToken(request) || readSessionCookie(request);

  if (!token) {
    next();
    return;
  }

  const payload = verifySessionToken(token);

  if (!payload) {
    response.status(401).json({ error: 'Your session expired. Please sign in again.' });
    return;
  }

  const connected = await ensureDatabaseConnection();

  if (!connected) {
    response.status(503).json({ error: 'Learning progress is temporarily unavailable. Please try again in a moment.' });
    return;
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    response.status(401).json({ error: 'Your account could not be found. Please sign in again.' });
    return;
  }

  request.authUser = user;
  next();
}

export async function requireAuth(request, response, next) {
  await optionalAuth(request, response, () => {
    if (!request.authUser) {
      response.status(401).json({ error: 'Please sign in to continue.' });
      return;
    }

    next();
  });
}

export async function requireAdmin(request, response, next) {
  const continueIfAdmin = async () => {
    await promoteConfiguredAdmin(request.authUser);

    if (request.authUser.role !== 'admin' || !isConfiguredAdminEmail(request.authUser.email)) {
      response.status(403).json({ error: 'Admin access is required.' });
      return;
    }

    next();
  };

  if (request.authUser) {
    await continueIfAdmin();
    return;
  }

  await requireAuth(request, response, continueIfAdmin);
}
