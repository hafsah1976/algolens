import { Router } from 'express';

import { ensureDatabaseConnection, getDatabaseStatus } from '../db/mongo.js';
import { User } from '../models/User.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/emailService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createRateLimit } from '../middleware/rateLimit.js';
import { promoteConfiguredAdmin, resolveRoleForEmail, resolveRoleForUser } from '../utils/adminEmails.js';
import {
  createAccountToken,
  EMAIL_VERIFICATION_TOKEN_TTL_MS,
  hashAccountToken,
  isSafeTokenMatch,
  isTokenExpired,
  PASSWORD_RESET_TOKEN_TTL_MS,
} from '../utils/accountTokens.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { clearSessionCookie, setSessionCookie } from '../utils/sessionCookie.js';
import { createSessionToken } from '../utils/sessionToken.js';

export const authRouter = Router();

const authRateLimit = createRateLimit({
  keyPrefix: 'auth',
  maxRequests: 20,
  windowMs: 15 * 60 * 1000,
});

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
    emailVerified: Boolean(user.emailVerifiedAt),
    name: user.name,
    requiresEmailVerification: !user.emailVerifiedAt,
    role: resolveRoleForUser(user),
  };
}

async function assignVerificationToken(user) {
  const verification = createAccountToken(EMAIL_VERIFICATION_TOKEN_TTL_MS);

  user.emailVerificationTokenHash = verification.tokenHash;
  user.emailVerificationExpiresAt = verification.expiresAt;
  user.emailVerificationSentAt = new Date();

  return verification.token;
}

function clearPasswordResetFields(user) {
  user.passwordResetTokenHash = null;
  user.passwordResetExpiresAt = null;
  user.passwordResetRequestedAt = null;
}

function clearVerificationFields(user) {
  user.emailVerificationTokenHash = null;
  user.emailVerificationExpiresAt = null;
  user.emailVerificationSentAt = null;
}

function genericPasswordResetResponse(response) {
  response.json({
    ok: true,
    message: 'If an AlgoLens account exists for that email, a reset link has been sent.',
  });
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

authRouter.post('/auth/signup', authRateLimit, async (request, response) => {
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
  const user = new User({
    authProvider: 'local',
    email,
    lastLoginAt: new Date(),
    name,
    passwordHash: hash,
    passwordSalt: salt,
    role: resolveRoleForEmail(email),
  });
  const verificationToken = await assignVerificationToken(user);

  await user.save();
  const verificationEmail = await sendVerificationEmail({ email: user.email, token: verificationToken });

  const token = createSessionToken(user);
  setSessionCookie(response, token);

  response.status(201).json({
    emailSent: verificationEmail.sent,
    token,
    user: toAuthUser(user),
  });
});

authRouter.post('/auth/login', authRateLimit, async (request, response) => {
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

  const token = createSessionToken(user);
  setSessionCookie(response, token);

  response.json({
    token,
    user: toAuthUser(user),
  });
});

authRouter.post('/auth/forgot-password', authRateLimit, async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const email = normalizeEmail(request.body.email);

  if (!isValidEmail(email)) {
    genericPasswordResetResponse(response);
    return;
  }

  const user = await User.findOne({ email }).select(
    '+passwordHash +passwordResetTokenHash +passwordResetExpiresAt +passwordResetRequestedAt',
  );

  if (!user?.passwordHash) {
    genericPasswordResetResponse(response);
    return;
  }

  const reset = createAccountToken(PASSWORD_RESET_TOKEN_TTL_MS);

  user.passwordResetTokenHash = reset.tokenHash;
  user.passwordResetExpiresAt = reset.expiresAt;
  user.passwordResetRequestedAt = new Date();
  await user.save();
  await sendPasswordResetEmail({ email: user.email, token: reset.token });

  genericPasswordResetResponse(response);
});

authRouter.post('/auth/reset-password', authRateLimit, async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const token = typeof request.body.token === 'string' ? request.body.token.trim() : '';
  const password = request.body.password;
  const passwordError = validatePassword(password);

  if (!token || passwordError) {
    response.status(400).json({ error: passwordError || 'Password reset link is invalid.' });
    return;
  }

  const tokenHash = hashAccountToken(token);
  const user = await User.findOne({ passwordResetTokenHash: tokenHash }).select(
    '+passwordHash +passwordSalt +passwordResetTokenHash +passwordResetExpiresAt +passwordResetRequestedAt',
  );

  if (
    !user ||
    !isSafeTokenMatch(token, user.passwordResetTokenHash) ||
    isTokenExpired(user.passwordResetExpiresAt)
  ) {
    response.status(400).json({ error: 'Password reset link is invalid or expired.' });
    return;
  }

  const { hash, salt } = hashPassword(password);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  clearPasswordResetFields(user);
  await user.save();

  response.json({
    ok: true,
    message: 'Your password was updated. Please sign in with the new password.',
  });
});

authRouter.post('/auth/resend-verification', authRateLimit, requireAuth, async (request, response) => {
  if (request.authUser.emailVerifiedAt) {
    response.json({ ok: true, message: 'This email is already verified.' });
    return;
  }

  const verificationToken = await assignVerificationToken(request.authUser);

  await request.authUser.save();
  const verificationEmail = await sendVerificationEmail({
    email: request.authUser.email,
    token: verificationToken,
  });

  response.json({
    emailSent: verificationEmail.sent,
    ok: true,
    message: verificationEmail.sent
      ? 'Verification email sent. Check your inbox for the latest link.'
      : 'Verification email could not be sent yet. Check email setup, then try again.',
  });
});

authRouter.post('/auth/verify-email', authRateLimit, async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const token = typeof request.body.token === 'string' ? request.body.token.trim() : '';

  if (!token) {
    response.status(400).json({ error: 'Verification link is invalid.' });
    return;
  }

  const tokenHash = hashAccountToken(token);
  const user = await User.findOne({ emailVerificationTokenHash: tokenHash }).select(
    '+emailVerificationTokenHash +emailVerificationExpiresAt +emailVerificationSentAt',
  );

  if (
    !user ||
    !isSafeTokenMatch(token, user.emailVerificationTokenHash) ||
    isTokenExpired(user.emailVerificationExpiresAt)
  ) {
    response.status(400).json({ error: 'Verification link is invalid or expired.' });
    return;
  }

  user.emailVerifiedAt = new Date();
  clearVerificationFields(user);
  await promoteConfiguredAdmin(user);
  await user.save();

  response.json({
    ok: true,
    message: 'Your email is verified.',
    user: toAuthUser(user),
  });
});

authRouter.post('/auth/logout', (_request, response) => {
  clearSessionCookie(response);
  response.json({ ok: true });
});

authRouter.get('/auth/me', requireAuth, async (request, response) => {
  await promoteConfiguredAdmin(request.authUser);

  response.json({
    user: toAuthUser(request.authUser),
  });
});
