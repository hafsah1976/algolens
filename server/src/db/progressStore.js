import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';

import { getDemoUserIdentity } from '../utils/demoUser.js';

function resolveServerDataPath(...segments) {
  const cwd = process.cwd();
  const cwdPath = cwd.replace(/\\/g, '/');
  const serverRoot = cwdPath.endsWith('/server') ? cwd : resolve(cwd, 'server');

  return resolve(serverRoot, ...segments);
}

const STORE_PATH =
  process.env.PROGRESS_STORE_PATH ||
  resolveServerDataPath('data', 'dev-progress.json');

const EMPTY_STORE = Object.freeze({
  users: [],
  topicProgress: [],
  lessonProgress: [],
});

let writeQueue = Promise.resolve();

function cloneEmptyStore() {
  return {
    users: [],
    topicProgress: [],
    lessonProgress: [],
  };
}

async function readStore() {
  try {
    const raw = await readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);

    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      topicProgress: Array.isArray(parsed.topicProgress) ? parsed.topicProgress : [],
      lessonProgress: Array.isArray(parsed.lessonProgress) ? parsed.lessonProgress : [],
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return cloneEmptyStore();
    }

    throw error;
  }
}

async function writeStore(store) {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

async function mutateStore(mutator) {
  const operation = writeQueue.then(async () => {
    const store = await readStore();
    const result = await mutator(store);
    await writeStore(store);
    return result;
  });

  writeQueue = operation.catch(() => {});

  return operation;
}

function resolveStoredUser(store, source = {}) {
  const identity = getDemoUserIdentity(source);
  const now = new Date().toISOString();
  let user = store.users.find((entry) => entry.email === identity.email);

  if (!user) {
    user = {
      id: randomUUID(),
      email: identity.email,
      name: identity.name,
      authProvider: 'demo',
      createdAt: now,
      updatedAt: now,
    };
    store.users.push(user);
    return user;
  }

  user.name = identity.name;
  user.updatedAt = now;
  return user;
}

export function getFileStoreStatus() {
  return {
    mode: 'file-fallback',
    path: STORE_PATH,
  };
}

export async function listStoredProgress(source = {}) {
  const store = await readStore();
  const user = resolveStoredUser(store, source);
  await writeStore(store);

  return {
    user,
    topicProgress: store.topicProgress
      .filter((entry) => entry.userId === user.id)
      .sort((a, b) => a.topicSlug.localeCompare(b.topicSlug)),
    lessonProgress: store.lessonProgress
      .filter((entry) => entry.userId === user.id)
      .sort((a, b) => `${a.topicSlug}:${a.lessonId}`.localeCompare(`${b.topicSlug}:${b.lessonId}`)),
  };
}

export async function upsertStoredLessonProgress(source = {}, payload = {}) {
  return mutateStore(async (store) => {
    const user = resolveStoredUser(store, source);
    const now = new Date().toISOString();

    let lessonProgress = store.lessonProgress.find(
      (entry) => entry.userId === user.id && entry.lessonId === payload.lessonId,
    );

    if (!lessonProgress) {
      lessonProgress = {
        id: randomUUID(),
        userId: user.id,
        topicSlug: payload.topicSlug,
        lessonId: payload.lessonId,
        status: payload.status,
        currentFrame: payload.currentFrame,
        completedAt: payload.completedAt,
        createdAt: now,
        updatedAt: now,
      };
      store.lessonProgress.push(lessonProgress);
    } else {
      lessonProgress.topicSlug = payload.topicSlug;
      lessonProgress.status = payload.status;
      lessonProgress.currentFrame = payload.currentFrame;
      lessonProgress.completedAt = payload.completedAt;
      lessonProgress.updatedAt = now;
    }

    return {
      user,
      lessonProgress,
    };
  });
}

export async function upsertStoredTopicProgress(source = {}, payload = {}) {
  return mutateStore(async (store) => {
    const user = resolveStoredUser(store, source);
    const now = new Date().toISOString();

    let topicProgress = store.topicProgress.find(
      (entry) => entry.userId === user.id && entry.topicSlug === payload.topicSlug,
    );

    if (!topicProgress) {
      topicProgress = {
        id: randomUUID(),
        userId: user.id,
        topicSlug: payload.topicSlug,
        completedLessons: payload.completedLessons,
        totalLessons: payload.totalLessons,
        percent: payload.percent,
        lastLessonId: payload.lastLessonId,
        createdAt: now,
        updatedAt: now,
      };
      store.topicProgress.push(topicProgress);
    } else {
      topicProgress.completedLessons = payload.completedLessons;
      topicProgress.totalLessons = payload.totalLessons;
      topicProgress.percent = payload.percent;
      topicProgress.lastLessonId = payload.lastLessonId;
      topicProgress.updatedAt = now;
    }

    return {
      user,
      topicProgress,
    };
  });
}
