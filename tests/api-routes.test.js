import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp, normalizeJsonBody } from '../server/src/app.js';

async function withTestServer(callback) {
  const previousStorageMode = process.env.PROGRESS_STORAGE_MODE;
  process.env.PROGRESS_STORAGE_MODE = 'file';

  const server = createApp().listen(0);

  try {
    const { port } = server.address();
    await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    if (previousStorageMode === undefined) {
      delete process.env.PROGRESS_STORAGE_MODE;
    } else {
      process.env.PROGRESS_STORAGE_MODE = previousStorageMode;
    }
  }
}

async function readJson(response) {
  return response.json().catch(() => null);
}

test('serverless JSON body fallback parses raw JSON strings before routes run', () => {
  const request = {
    body: '{"email":"testuser@example.com","name":"Lucas","password":"12345678A"}',
  };
  let continued = false;

  normalizeJsonBody(request, null, () => {
    continued = true;
  });

  assert.equal(continued, true);
  assert.deepEqual(request.body, {
    email: 'testuser@example.com',
    name: 'Lucas',
    password: '12345678A',
  });
});

test('API root advertises topic, lesson, quiz, dashboard, problem, and protected progress routes', async () => {
  await withTestServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/`);
    const payload = await readJson(response);

    assert.equal(response.status, 200);
    assert.ok(payload.routes.includes('/api/dashboard/me'));
    assert.ok(payload.routes.includes('/api/admin/topics'));
    assert.ok(payload.routes.includes('/api/admin/lessons'));
    assert.ok(payload.routes.includes('/api/admin/quizzes'));
    assert.ok(payload.routes.includes('/api/admin/problems'));
    assert.ok(payload.routes.includes('/api/topics'));
    assert.ok(payload.routes.includes('/api/topics/:slug/lessons'));
    assert.ok(payload.routes.includes('/api/lessons/:slug'));
    assert.ok(payload.routes.includes('/api/problems'));
    assert.ok(payload.routes.includes('/api/problems/:slug'));
    assert.ok(payload.routes.includes('/api/problems/:slug/submit'));
    assert.ok(payload.routes.includes('/api/quizzes/topic/:topicId'));
    assert.ok(payload.routes.includes('/api/quizzes/:quizId'));
    assert.ok(payload.routes.includes('/api/quizzes/:quizId/submit'));
    assert.ok(payload.routes.includes('/api/progress/me'));
  });
});

test('admin content routes require authentication', async () => {
  await withTestServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/admin/topics`);
    const payload = await readJson(response);

    assert.equal(response.status, 401);
    assert.equal(payload.error, 'Please sign in to continue.');
  });
});

test('dashboard summary route requires authentication', async () => {
  await withTestServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/dashboard/me`);
    const payload = await readJson(response);

    assert.equal(response.status, 401);
    assert.equal(payload.error, 'Please sign in to continue.');
  });
});

test('unknown API routes return a consistent JSON 404', async () => {
  await withTestServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/not-a-real-route`);
    const payload = await readJson(response);

    assert.equal(response.status, 404);
    assert.equal(payload.error, 'API route not found.');
  });
});

test('API responds to allowed CORS preflight requests', async () => {
  await withTestServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`, {
      headers: {
        Origin: 'http://localhost:5173',
        'Access-Control-Request-Headers': 'authorization,content-type',
        'Access-Control-Request-Method': 'GET',
      },
      method: 'OPTIONS',
    });

    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
    assert.ok(response.headers.get('access-control-allow-headers').includes('Authorization'));
  });
});

test('progress mutation and current-user progress routes require auth', async () => {
  await withTestServer(async (baseUrl) => {
    const meResponse = await fetch(`${baseUrl}/api/progress/me`);
    const lessonResponse = await fetch(`${baseUrl}/api/progress/lesson`, {
      body: JSON.stringify({
        currentFrame: 0,
        lessonId: 'pair-sum-trace',
        status: 'completed',
        topicSlug: 'arrays-two-pointers',
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const mePayload = await readJson(meResponse);
    const lessonPayload = await readJson(lessonResponse);
    const quizResponse = await fetch(`${baseUrl}/api/quizzes/507f1f77bcf86cd799439011/submit`, {
      body: JSON.stringify({
        answers: [],
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const quizPayload = await readJson(quizResponse);
    const problemResponse = await fetch(`${baseUrl}/api/problems/find-maximum-value/submit`, {
      body: JSON.stringify({
        code: 'return 1;',
        language: 'javascript',
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    const problemPayload = await readJson(problemResponse);

    assert.equal(meResponse.status, 401);
    assert.equal(mePayload.error, 'Please sign in to continue.');
    assert.equal(lessonResponse.status, 401);
    assert.equal(lessonPayload.error, 'Please sign in to continue.');
    assert.equal(quizResponse.status, 401);
    assert.equal(quizPayload.error, 'Please sign in to continue.');
    assert.equal(problemResponse.status, 401);
    assert.equal(problemPayload.error, 'Please sign in to continue.');
  });
});

test('public content, quiz, and problem routes fail gracefully when MongoDB is unavailable', async () => {
  await withTestServer(async (baseUrl) => {
    const topicsResponse = await fetch(`${baseUrl}/api/topics`);
    const topicResponse = await fetch(`${baseUrl}/api/topics/missing-topic`);
    const lessonsResponse = await fetch(`${baseUrl}/api/topics/missing-topic/lessons`);
    const lessonResponse = await fetch(`${baseUrl}/api/lessons/missing-lesson`);
    const quizzesResponse = await fetch(`${baseUrl}/api/quizzes/topic/507f1f77bcf86cd799439011`);
    const quizResponse = await fetch(`${baseUrl}/api/quizzes/507f1f77bcf86cd799439011`);
    const problemsResponse = await fetch(`${baseUrl}/api/problems`);
    const problemResponse = await fetch(`${baseUrl}/api/problems/find-maximum-value`);

    for (const response of [
      topicsResponse,
      topicResponse,
      lessonsResponse,
      lessonResponse,
      quizzesResponse,
      quizResponse,
      problemsResponse,
      problemResponse,
    ]) {
      const payload = await readJson(response);

      assert.equal(response.status, 503);
      assert.equal(payload.error, 'MongoDB is not connected. Start MongoDB and try again.');
    }
  });
});
