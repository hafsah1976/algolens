import { Router } from 'express';

import { ensureDatabaseConnection, getDatabaseStatus } from '../db/mongo.js';
import {
  getFileStoreStatus,
  listStoredProgress,
  upsertStoredLessonProgress,
  upsertStoredTopicProgress,
} from '../db/progressStore.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';
import { createRateLimit } from '../middleware/rateLimit.js';
import { LessonProgress } from '../models/LessonProgress.js';
import { TopicProgress } from '../models/TopicProgress.js';
import { resolveDemoUser } from '../utils/demoUser.js';
import { getProgressStorageMode, getProgressStoragePreference } from '../utils/storageMode.js';

export const progressRouter = Router();

const progressWriteRateLimit = createRateLimit({
  keyPrefix: 'progress',
  maxRequests: 180,
  message: 'Too many progress saves. Please pause for a moment and try again.',
  windowMs: 10 * 60 * 1000,
});

function toLessonProgressPayload(document) {
  return {
    id: document.id,
    userId: document.userId.toString(),
    topicSlug: document.topicSlug,
    lessonId: document.lessonId,
    status: document.status,
    currentFrame: document.currentFrame,
    completedAt: document.completedAt,
    updatedAt: document.updatedAt,
  };
}

function toTopicProgressPayload(document) {
  return {
    id: document.id,
    userId: document.userId.toString(),
    topicSlug: document.topicSlug,
    completedLessons: document.completedLessons,
    totalLessons: document.totalLessons,
    percent: document.percent,
    lastLessonId: document.lastLessonId,
    updatedAt: document.updatedAt,
  };
}

function sendDatabaseUnavailable(response) {
  response.status(503).json({
    error: 'Learning progress is temporarily unavailable. Please try again in a moment.',
    database: getDatabaseStatus(),
  });
}

function toProgressUserPayload(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

async function resolveProgressUser(request, source = {}) {
  if (request.authUser) {
    return request.authUser;
  }

  return resolveDemoUser(source);
}

async function resolveStorageMode() {
  const preference = getProgressStoragePreference();

  if (preference === 'file') {
    return 'file';
  }

  const connected = await ensureDatabaseConnection();
  const mode = getProgressStorageMode(connected);

  if (preference === 'mongo' && !connected) {
    return 'mongo-unavailable';
  }

  return mode;
}

function calculatePercent(completedLessons, totalLessons, providedPercent) {
  if (typeof providedPercent === 'number') {
    return Math.max(0, Math.min(100, Math.round(providedPercent)));
  }

  if (!totalLessons) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round((completedLessons / totalLessons) * 100)));
}

function normalizeTopicProgressPayloads(topicProgressPayloads, lessonProgressPayloads) {
  return topicProgressPayloads.map((topicProgress) => {
    const completedLessons = lessonProgressPayloads.filter(
      (lessonProgress) =>
        lessonProgress.topicSlug === topicProgress.topicSlug && lessonProgress.status === 'completed',
    ).length;
    const totalLessons = Math.max(Number(topicProgress.totalLessons) || 0, completedLessons);

    return {
      ...topicProgress,
      completedLessons,
      percent: calculatePercent(completedLessons, totalLessons),
      totalLessons,
    };
  });
}

function validateLessonProgressPayload(payload) {
  const { topicSlug, lessonId, status = 'in-progress', currentFrame = 0 } = payload;

  if (!topicSlug || !lessonId) {
    return {
      error: 'topicSlug and lessonId are required.',
    };
  }

  return {
    currentFrame: Math.max(0, Number(currentFrame) || 0),
    lessonId,
    status: ['not-started', 'in-progress', 'completed'].includes(status)
      ? status
      : 'in-progress',
    topicSlug,
  };
}

async function getMongoProgressForUser(user) {
  const [topicProgress, lessonProgress] = await Promise.all([
    TopicProgress.find({ userId: user._id }).sort({ topicSlug: 1, updatedAt: -1 }),
    LessonProgress.find({ userId: user._id }).sort({ topicSlug: 1, lessonId: 1 }),
  ]);
  const lessonProgressPayloads = lessonProgress.map(toLessonProgressPayload);
  const topicProgressPayloads = normalizeTopicProgressPayloads(
    topicProgress.map(toTopicProgressPayload),
    lessonProgressPayloads,
  );

  return {
    lessonProgress: lessonProgressPayloads,
    topicProgress: topicProgressPayloads,
  };
}

async function upsertMongoLessonProgress(user, payload) {
  const completedAt = payload.status === 'completed' ? new Date() : null;

  return LessonProgress.findOneAndUpdate(
    {
      userId: user._id,
      lessonId: payload.lessonId,
    },
    {
      $set: {
        topicSlug: payload.topicSlug,
        status: payload.status,
        currentFrame: payload.currentFrame,
        completedAt,
      },
      $setOnInsert: {
        userId: user._id,
        lessonId: payload.lessonId,
      },
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  );
}

progressRouter.get('/progress', optionalAuth, async (request, response) => {
  const storageMode = await resolveStorageMode();

  if (storageMode === 'mongo-unavailable') {
    sendDatabaseUnavailable(response);
    return;
  }

  if (storageMode === 'mongo') {
    const user = await resolveProgressUser(request, request.query);
    const progress = await getMongoProgressForUser(user);

    response.json({
      storageMode,
      user: toProgressUserPayload(user),
      database: getDatabaseStatus(),
      topicProgress: progress.topicProgress,
      lessonProgress: progress.lessonProgress,
    });
    return;
  }

  const progress = await listStoredProgress(request.query);
  const topicProgressPayloads = normalizeTopicProgressPayloads(
    progress.topicProgress,
    progress.lessonProgress,
  );

  response.json({
    storageMode,
    user: progress.user,
    database: getDatabaseStatus(),
    fileStore: getFileStoreStatus(),
    topicProgress: topicProgressPayloads,
    lessonProgress: progress.lessonProgress,
  });
});

progressRouter.get('/progress/me', requireAuth, async (request, response) => {
  const storageMode = await resolveStorageMode();

  if (storageMode !== 'mongo') {
    sendDatabaseUnavailable(response);
    return;
  }

  const progress = await getMongoProgressForUser(request.authUser);

  response.json({
    storageMode,
    user: toProgressUserPayload(request.authUser),
    database: getDatabaseStatus(),
    topicProgress: progress.topicProgress,
    lessonProgress: progress.lessonProgress,
  });
});

progressRouter.post('/progress/lesson', progressWriteRateLimit, requireAuth, async (request, response) => {
  const payload = validateLessonProgressPayload(request.body);

  if (payload.error) {
    response.status(400).json({ error: payload.error });
    return;
  }

  const storageMode = await resolveStorageMode();

  if (storageMode !== 'mongo') {
    sendDatabaseUnavailable(response);
    return;
  }

  const lessonProgress = await upsertMongoLessonProgress(request.authUser, payload);

  response.json({
    storageMode,
    user: toProgressUserPayload(request.authUser),
    lessonProgress: toLessonProgressPayload(lessonProgress),
  });
});

progressRouter.put('/progress/lesson', progressWriteRateLimit, requireAuth, async (request, response) => {
  const payload = validateLessonProgressPayload(request.body);

  if (payload.error) {
    response.status(400).json({ error: payload.error });
    return;
  }

  const storageMode = await resolveStorageMode();

  if (storageMode !== 'mongo') {
    sendDatabaseUnavailable(response);
    return;
  }

  const lessonProgress = await upsertMongoLessonProgress(request.authUser, payload);

  response.json({
    storageMode,
    user: toProgressUserPayload(request.authUser),
    lessonProgress: toLessonProgressPayload(lessonProgress),
  });
});

progressRouter.put('/progress/topic', progressWriteRateLimit, requireAuth, async (request, response) => {
  const {
    topicSlug,
    completedLessons = 0,
    totalLessons = 0,
    percent,
    lastLessonId = null,
  } = request.body;

  if (!topicSlug) {
    response.status(400).json({
      error: 'topicSlug is required.',
    });
    return;
  }

  const storageMode = await resolveStorageMode();

  if (storageMode !== 'mongo') {
    sendDatabaseUnavailable(response);
    return;
  }

  const safeCompletedLessons = Math.max(0, Number(completedLessons) || 0);
  const safeTotalLessons = Math.max(0, Number(totalLessons) || 0);
  const safePercent = calculatePercent(safeCompletedLessons, safeTotalLessons, percent);

  const topicProgress = await TopicProgress.findOneAndUpdate(
    {
      userId: request.authUser._id,
      topicSlug,
    },
    {
      $set: {
        completedLessons: safeCompletedLessons,
        totalLessons: safeTotalLessons,
        percent: safePercent,
        lastLessonId,
      },
      $setOnInsert: {
        userId: request.authUser._id,
        topicSlug,
      },
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  );

  response.json({
    storageMode,
    user: toProgressUserPayload(request.authUser),
    topicProgress: toTopicProgressPayload(topicProgress),
  });
});
