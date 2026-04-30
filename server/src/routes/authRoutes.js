import { Router } from 'express';

import { ensureDatabaseConnection, getDatabaseStatus } from '../db/mongo.js';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { promoteConfiguredAdmin, resolveRoleForEmail } from '../utils/adminEmails.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { createSessionToken } from '../utils/sessionToken.js';

export const authRouter = Router();

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeName(value, fallback = 'AlgoLens Learner') {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (!/[a-z]/i.test(password) || !/\d/.test(password)) {
    return 'Password must include at least one letter and one number.';
  }

  return null;
}

function validateName(name) {
  if (typeof name !== 'string' || name.trim().length < 2) {
    return 'Name must be at least 2 characters.';
  }

  return null;
}

function toAuthUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role ?? resolveRoleForEmail(user.email),
  };
}

async function requireDatabase(response) {
  const connected = await ensureDatabaseConnection();

  if (!connected) {
    response.status(503).json({
      code: 'ACCOUNT_STORAGE_UNAVAILABLE',
      error: 'Account storage is temporarily unavailable. Please try again in a moment.',
      database: getDatabaseStatus(),
    });
    return false;
  }

  return true;
}

authRouter.post('/auth/signup', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const email = normalizeEmail(request.body.email);
  const rawName = request.body.name;
  const name = normalizeName(rawName);
  const password = request.body.password;

  if (!isValidEmail(email)) {
    response.status(400).json({ error: 'Enter a valid email address.' });
    return;
  }

  const passwordError = validatePassword(password);

  if (passwordError) {
    response.status(400).json({ error: passwordError });
    return;
  }

  const nameError = validateName(rawName);

  if (nameError) {
    response.status(400).json({ error: nameError });
    return;
  }

  const existingUser = await User.findOne({ email }).select('+passwordHash');

  if (existingUser?.passwordHash) {
    response.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  if (existingUser && !existingUser.passwordHash) {
    response.status(409).json({
      error: 'This email is already reserved for another AlgoLens profile.',
    });
    return;
  }

  const { hash, salt } = hashPassword(password);
  const user = await User.create({
    authProvider: 'local',
    email,
    lastLoginAt: new Date(),
    name,
    passwordHash: hash,
    passwordSalt: salt,
    role: resolveRoleForEmail(email),
  });
  const token = createSessionToken(user);

  response.status(201).json({
    token,
    user: toAuthUser(user),
  });
});

authRouter.post('/auth/login', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const email = normalizeEmail(request.body.email);
  const password = request.body.password;

  if (!isValidEmail(email) || typeof password !== 'string' || !password) {
    response.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = await User.findOne({ email }).select('+passwordHash +passwordSalt');

  if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    response.status(401).json({ error: 'Email or password is incorrect.' });
    return;
  }

  user.lastLoginAt = new Date();
  await promoteConfiguredAdmin(user);
  await user.save();

  response.json({
    token: createSessionToken(user),
    user: toAuthUser(user),
  });
});

authRouter.get('/auth/me', requireAuth, async (request, response) => {
  await promoteConfiguredAdmin(request.authUser);

  response.json({
    user: toAuthUser(request.authUser),
  });
});
