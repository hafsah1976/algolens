import { Router } from 'express';

import { ensureDatabaseConnection, getDatabaseStatus } from '../db/mongo.js';
import { Lesson } from '../models/Lesson.js';
import { Topic } from '../models/Topic.js';

export const contentRouter = Router();

function normalizeSlug(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function sendDatabaseUnavailable(response) {
  response.status(503).json({
    error: 'MongoDB is not connected. Start MongoDB and try again.',
    database: getDatabaseStatus(),
  });
}

async function requireDatabase(response) {
  const connected = await ensureDatabaseConnection();

  if (!connected) {
    sendDatabaseUnavailable(response);
    return false;
  }

  return true;
}

function toTopicPayload(topic) {
  return {
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    description: topic.description,
    order: topic.order,
    difficulty: topic.difficulty,
    isPublished: topic.isPublished,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
  };
}

function toLessonPayload(lesson, topic = null) {
  return {
    id: lesson.id,
    topicId: lesson.topicId.toString(),
    topicDifficulty: topic?.difficulty ?? null,
    topicSlug: topic?.slug ?? null,
    topicTitle: topic?.title ?? null,
    title: lesson.title,
    slug: lesson.slug,
    content: lesson.content,
    summary: lesson.summary,
    order: lesson.order,
    estimatedMinutes: lesson.estimatedMinutes,
    visualizationType: lesson.visualizationType,
    isPublished: lesson.isPublished,
    createdAt: lesson.createdAt,
    updatedAt: lesson.updatedAt,
  };
}

contentRouter.get('/topics', async (_request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const topics = await Topic.find({ isPublished: true }).sort({ order: 1, title: 1 });

  response.json({
    topics: topics.map(toTopicPayload),
  });
});

contentRouter.get('/topics/:slug', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const slug = normalizeSlug(request.params.slug);
  const topic = slug ? await Topic.findOne({ slug, isPublished: true }) : null;

  if (!topic) {
    response.status(404).json({ error: 'Topic not found.' });
    return;
  }

  response.json({
    topic: toTopicPayload(topic),
  });
});

contentRouter.get('/topics/:slug/lessons', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const slug = normalizeSlug(request.params.slug);
  const topic = slug ? await Topic.findOne({ slug, isPublished: true }) : null;

  if (!topic) {
    response.status(404).json({ error: 'Topic not found.' });
    return;
  }

  const lessons = await Lesson.find({ topicId: topic._id, isPublished: true }).sort({
    order: 1,
    title: 1,
  });

  response.json({
    lessons: lessons.map((lesson) => toLessonPayload(lesson, topic)),
    topic: toTopicPayload(topic),
  });
});

contentRouter.get('/lessons/:slug', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const slug = normalizeSlug(request.params.slug);
  const lesson = slug ? await Lesson.findOne({ slug, isPublished: true }) : null;

  if (!lesson) {
    response.status(404).json({ error: 'Lesson not found.' });
    return;
  }

  const topic = await Topic.findById(lesson.topicId);

  response.json({
    lesson: toLessonPayload(lesson, topic),
  });
});
