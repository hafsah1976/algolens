import assert from 'node:assert/strict';
import test from 'node:test';

import { requireAdmin } from '../server/src/middleware/authMiddleware.js';
import { resolveRoleForEmail } from '../server/src/utils/adminEmails.js';
import { createSessionToken, verifySessionToken } from '../server/src/utils/sessionToken.js';

function withEnv(nextEnv, callback) {
  const previousValues = new Map();

  for (const key of Object.keys(nextEnv)) {
    previousValues.set(key, process.env[key]);

    if (nextEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = nextEnv[key];
    }
  }

  try {
    callback();
  } finally {
    for (const [key, value] of previousValues.entries()) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

test('session tokens round-trip with an explicit auth secret', () => {
  withEnv({ AUTH_SECRET: 'test-secret-for-algolens', NODE_ENV: 'test' }, () => {
    const token = createSessionToken({
      email: 'learner@example.com',
      id: 'user-123',
      name: 'Learner',
    });
    const payload = verifySessionToken(token);

    assert.equal(payload.sub, 'user-123');
    assert.equal(payload.email, 'learner@example.com');
    assert.equal(payload.name, 'Learner');
  });
});

test('production auth refuses to start without AUTH_SECRET', () => {
  withEnv({ AUTH_SECRET: undefined, NODE_ENV: 'production' }, () => {
    assert.throws(
      () =>
        createSessionToken({
          email: 'learner@example.com',
          id: 'user-123',
          name: 'Learner',
        }),
      /AUTH_SECRET is required/,
    );
  });
});

test('configured admin emails resolve to admin role', () => {
  withEnv({ ADMIN_EMAILS: 'teacher@example.com, mentor@example.com' }, () => {
    assert.equal(resolveRoleForEmail('teacher@example.com'), 'admin');
    assert.equal(resolveRoleForEmail('MENTOR@example.com'), 'admin');
    assert.equal(resolveRoleForEmail('learner@example.com'), 'student');
  });
});

test('admin middleware rejects authenticated non-admin users', async () => {
  const previousAdminEmails = process.env.ADMIN_EMAILS;
  delete process.env.ADMIN_EMAILS;
  let nextCalled = false;
  const response = {
    payload: null,
    statusCode: null,
    json(payload) {
      this.payload = payload;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
  };

  try {
    await requireAdmin(
      {
        authUser: {
          email: 'learner@example.com',
          role: 'student',
        },
      },
      response,
      () => {
        nextCalled = true;
      },
    );
  } finally {
    if (previousAdminEmails === undefined) {
      delete process.env.ADMIN_EMAILS;
    } else {
      process.env.ADMIN_EMAILS = previousAdminEmails;
    }
  }

  assert.equal(nextCalled, false);
  assert.equal(response.statusCode, 403);
  assert.equal(response.payload.error, 'Admin access is required.');
});

test('admin middleware allows authenticated admin users', async () => {
  let nextCalled = false;
  const response = {
    json() {},
    status() {
      return this;
    },
  };

  await requireAdmin(
    {
      authUser: {
        email: 'admin@example.com',
        role: 'admin',
      },
    },
    response,
    () => {
      nextCalled = true;
    },
  );

  assert.equal(nextCalled, true);
});
