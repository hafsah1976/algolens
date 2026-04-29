import { User } from '../models/User.js';

const DEFAULT_DEMO_USER = {
  email: 'demo@algolens.app',
  name: 'AlgoLens Demo User',
};

function normalizeString(value, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

export function getDemoUserIdentity(source = {}) {
  return {
    email: normalizeString(
      source.userEmail ?? source.email,
      process.env.DEMO_USER_EMAIL || DEFAULT_DEMO_USER.email,
    ).toLowerCase(),
    name: normalizeString(
      source.userName ?? source.name,
      process.env.DEMO_USER_NAME || DEFAULT_DEMO_USER.name,
    ),
  };
}

export async function resolveDemoUser(source = {}) {
  const identity = getDemoUserIdentity(source);

  return User.findOneAndUpdate(
    { email: identity.email },
    {
      $set: {
        name: identity.name,
      },
      $setOnInsert: {
        email: identity.email,
        authProvider: 'demo',
      },
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  );
}
