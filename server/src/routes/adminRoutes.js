import mongoose from 'mongoose';
import { Router } from 'express';

import { ensureDatabaseConnection, getDatabaseStatus } from '../db/mongo.js';
import { requireAdmin } from '../middleware/authMiddleware.js';
import { CodingProblem } from '../models/CodingProblem.js';
import { Lesson } from '../models/Lesson.js';
import { Quiz } from '../models/Quiz.js';
import { Topic } from '../models/Topic.js';

export const adminRouter = Router();

const difficultyValues = new Set(['beginner', 'intermediate', 'advanced']);
const questionTypes = new Set(['mcq', 'true_false', 'fill_blank', 'code_output', 'complexity']);

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeSlug(value) {
  return normalizeString(value).toLowerCase();
}

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function sendDatabaseUnavailable(response) {
  response.status(503).json({
    error: 'Content tools are temporarily unavailable. Please try again in a moment.',
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

function sendMongooseError(response, error) {
  if (error?.code === 11000) {
    response.status(409).json({ error: 'A record with this slug or unique value already exists.' });
    return;
  }

  if (error?.name === 'ValidationError') {
    const firstMessage = Object.values(error.errors ?? {})[0]?.message;
    response.status(400).json({ error: firstMessage ?? 'The submitted content is invalid.' });
    return;
  }

  response.status(500).json({ error: 'Admin content request failed.' });
}

function readNumber(body, field, { min = 0 } = {}) {
  if (body[field] === undefined || body[field] === '') {
    return {};
  }

  const value = Number(body[field]);

  if (!Number.isFinite(value) || value < min) {
    return { error: `${field} must be a number greater than or equal to ${min}.` };
  }

  return { value };
}

function readBoolean(value) {
  return value === true || value === 'true';
}

function buildTopicData(body, { partial = false } = {}) {
  const data = {};

  if (!partial || body.title !== undefined) {
    const title = normalizeString(body.title);

    if (!title) {
      return { error: 'title is required.' };
    }

    data.title = title;
  }

  if (!partial || body.slug !== undefined) {
    const slug = normalizeSlug(body.slug);

    if (!slug) {
      return { error: 'slug is required.' };
    }

    data.slug = slug;
  }

  if (!partial || body.description !== undefined) {
    data.description = normalizeString(body.description);
  }

  if (body.order !== undefined) {
    const order = readNumber(body, 'order');

    if (order.error) {
      return order;
    }

    data.order = order.value;
  }

  if (body.difficulty !== undefined) {
    const difficulty = normalizeSlug(body.difficulty);

    if (!difficultyValues.has(difficulty)) {
      return { error: 'difficulty must be beginner, intermediate, or advanced.' };
    }

    data.difficulty = difficulty;
  }

  if (body.isPublished !== undefined) {
    data.isPublished = readBoolean(body.isPublished);
  }

  return { data };
}

function buildLessonData(body, { partial = false } = {}) {
  const data = {};

  if (!partial || body.topicId !== undefined) {
    if (!isValidObjectId(body.topicId)) {
      return { error: 'A valid topicId is required.' };
    }

    data.topicId = body.topicId;
  }

  if (!partial || body.title !== undefined) {
    const title = normalizeString(body.title);

    if (!title) {
      return { error: 'title is required.' };
    }

    data.title = title;
  }

  if (!partial || body.slug !== undefined) {
    const slug = normalizeSlug(body.slug);

    if (!slug) {
      return { error: 'slug is required.' };
    }

    data.slug = slug;
  }

  if (!partial || body.content !== undefined) {
    data.content = typeof body.content === 'string' ? body.content : '';
  }

  if (!partial || body.summary !== undefined) {
    data.summary = normalizeString(body.summary);
  }

  if (body.order !== undefined) {
    const order = readNumber(body, 'order');

    if (order.error) {
      return order;
    }

    data.order = order.value;
  }

  if (body.estimatedMinutes !== undefined) {
    const estimatedMinutes = readNumber(body, 'estimatedMinutes', { min: 1 });

    if (estimatedMinutes.error) {
      return estimatedMinutes;
    }

    data.estimatedMinutes = estimatedMinutes.value;
  }

  if (body.visualizationType !== undefined) {
    data.visualizationType = normalizeSlug(body.visualizationType) || 'none';
  }

  if (body.isPublished !== undefined) {
    data.isPublished = readBoolean(body.isPublished);
  }

  return { data };
}

function buildQuizData(body) {
  if (!isValidObjectId(body.topicId)) {
    return { error: 'A valid topicId is required.' };
  }

  const title = normalizeString(body.title);

  if (!title) {
    return { error: 'title is required.' };
  }

  const lessonId = normalizeString(body.lessonId);

  if (lessonId && !isValidObjectId(lessonId)) {
    return { error: 'lessonId must be a valid id when provided.' };
  }

  if (!Array.isArray(body.questions)) {
    return { error: 'questions must be an array.' };
  }

  const questions = [];

  for (const [index, question] of body.questions.entries()) {
    const type = normalizeSlug(question?.type);
    const prompt = normalizeString(question?.prompt);

    if (!questionTypes.has(type)) {
      return { error: `Question ${index + 1} has an unsupported type.` };
    }

    if (!prompt) {
      return { error: `Question ${index + 1} needs a prompt.` };
    }

    if (question.correctAnswer === undefined || question.correctAnswer === null) {
      return { error: `Question ${index + 1} needs a correctAnswer.` };
    }

    questions.push({
      correctAnswer: question.correctAnswer,
      difficulty: difficultyValues.has(normalizeSlug(question.difficulty))
        ? normalizeSlug(question.difficulty)
        : 'beginner',
      explanation: normalizeString(question.explanation),
      options: Array.isArray(question.options) ? question.options.map(String) : [],
      prompt,
      type,
    });
  }

  return {
    data: {
      isPublished: readBoolean(body.isPublished),
      lessonId: lessonId || null,
      questions,
      title,
      topicId: body.topicId,
    },
  };
}

function buildProblemData(body) {
  if (!isValidObjectId(body.topicId)) {
    return { error: 'A valid topicId is required.' };
  }

  const title = normalizeString(body.title);
  const slug = normalizeSlug(body.slug);
  const difficulty = normalizeSlug(body.difficulty) || 'beginner';

  if (!title) {
    return { error: 'title is required.' };
  }

  if (!slug) {
    return { error: 'slug is required.' };
  }

  if (!difficultyValues.has(difficulty)) {
    return { error: 'difficulty must be beginner, intermediate, or advanced.' };
  }

  if (!normalizeString(body.statement)) {
    return { error: 'statement is required.' };
  }

  for (const field of ['examples', 'constraints', 'starterCode', 'testCases']) {
    if (body[field] !== undefined && !Array.isArray(body[field])) {
      return { error: `${field} must be an array.` };
    }
  }

  return {
    data: {
      constraints: body.constraints ?? [],
      difficulty,
      examples: body.examples ?? [],
      isPublished: readBoolean(body.isPublished),
      slug,
      starterCode: body.starterCode ?? [],
      statement: body.statement,
      testCases: body.testCases ?? [],
      title,
      topicId: body.topicId,
    },
  };
}

async function validateTopicReference(response, topicId) {
  const topicExists = await Topic.exists({ _id: topicId });

  if (!topicExists) {
    response.status(400).json({ error: 'The selected topic does not exist.' });
    return false;
  }

  return true;
}

async function validateLessonReference(response, lessonId) {
  if (!lessonId) {
    return true;
  }

  const lessonExists = await Lesson.exists({ _id: lessonId });

  if (!lessonExists) {
    response.status(400).json({ error: 'The selected lesson does not exist.' });
    return false;
  }

  return true;
}

function toTopicPayload(topic) {
  return {
    id: topic.id,
    createdAt: topic.createdAt,
    description: topic.description,
    difficulty: topic.difficulty,
    isPublished: topic.isPublished,
    order: topic.order,
    slug: topic.slug,
    title: topic.title,
    updatedAt: topic.updatedAt,
  };
}

function toLessonPayload(lesson, topic = null) {
  return {
    id: lesson.id,
    content: lesson.content,
    createdAt: lesson.createdAt,
    estimatedMinutes: lesson.estimatedMinutes,
    isPublished: lesson.isPublished,
    order: lesson.order,
    slug: lesson.slug,
    summary: lesson.summary,
    title: lesson.title,
    topicId: lesson.topicId.toString(),
    topicTitle: topic?.title ?? null,
    updatedAt: lesson.updatedAt,
    visualizationType: lesson.visualizationType,
  };
}

function toQuizPayload(quiz, topic = null, lesson = null) {
  return {
    id: quiz.id,
    createdAt: quiz.createdAt,
    isPublished: quiz.isPublished,
    lessonId: quiz.lessonId?.toString() ?? null,
    lessonTitle: lesson?.title ?? null,
    questionCount: quiz.questions.length,
    questions: quiz.questions,
    title: quiz.title,
    topicId: quiz.topicId.toString(),
    topicTitle: topic?.title ?? null,
    updatedAt: quiz.updatedAt,
  };
}

function toProblemPayload(problem, topic = null) {
  return {
    id: problem.id,
    createdAt: problem.createdAt,
    difficulty: problem.difficulty,
    hiddenTestCaseCount: problem.testCases.filter((testCase) => testCase.isHidden).length,
    isPublished: problem.isPublished,
    publicTestCaseCount: problem.testCases.filter((testCase) => !testCase.isHidden).length,
    slug: problem.slug,
    title: problem.title,
    topicId: problem.topicId.toString(),
    topicTitle: topic?.title ?? null,
    updatedAt: problem.updatedAt,
  };
}

async function getTopicMap(topicIds) {
  const topics = await Topic.find({ _id: { $in: [...new Set(topicIds.map(String))] } });

  return new Map(topics.map((topic) => [topic.id, topic]));
}

adminRouter.use('/admin', requireAdmin);

adminRouter.get('/admin/topics', async (_request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const topics = await Topic.find({}).sort({ order: 1, title: 1 });

  response.json({
    topics: topics.map(toTopicPayload),
  });
});

adminRouter.post('/admin/topics', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const { data, error } = buildTopicData(request.body);

  if (error) {
    response.status(400).json({ error });
    return;
  }

  try {
    const topic = await Topic.create(data);

    response.status(201).json({ topic: toTopicPayload(topic) });
  } catch (createError) {
    sendMongooseError(response, createError);
  }
});

adminRouter.put('/admin/topics/:topicId', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  if (!isValidObjectId(request.params.topicId)) {
    response.status(400).json({ error: 'A valid topic id is required.' });
    return;
  }

  const { data, error } = buildTopicData(request.body, { partial: true });

  if (error) {
    response.status(400).json({ error });
    return;
  }

  try {
    const topic = await Topic.findByIdAndUpdate(request.params.topicId, data, {
      new: true,
      runValidators: true,
    });

    if (!topic) {
      response.status(404).json({ error: 'Topic not found.' });
      return;
    }

    response.json({ topic: toTopicPayload(topic) });
  } catch (updateError) {
    sendMongooseError(response, updateError);
  }
});

adminRouter.get('/admin/lessons', async (_request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const lessons = await Lesson.find({}).sort({ topicId: 1, order: 1, title: 1 });
  const topicById = await getTopicMap(lessons.map((lesson) => lesson.topicId));

  response.json({
    lessons: lessons.map((lesson) => toLessonPayload(lesson, topicById.get(lesson.topicId.toString()))),
  });
});

adminRouter.post('/admin/lessons', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const { data, error } = buildLessonData(request.body);

  if (error) {
    response.status(400).json({ error });
    return;
  }

  if (!(await validateTopicReference(response, data.topicId))) {
    return;
  }

  try {
    const lesson = await Lesson.create(data);
    const topic = await Topic.findById(lesson.topicId);

    response.status(201).json({ lesson: toLessonPayload(lesson, topic) });
  } catch (createError) {
    sendMongooseError(response, createError);
  }
});

adminRouter.put('/admin/lessons/:lessonId', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  if (!isValidObjectId(request.params.lessonId)) {
    response.status(400).json({ error: 'A valid lesson id is required.' });
    return;
  }

  const { data, error } = buildLessonData(request.body, { partial: true });

  if (error) {
    response.status(400).json({ error });
    return;
  }

  if (data.topicId && !(await validateTopicReference(response, data.topicId))) {
    return;
  }

  try {
    const lesson = await Lesson.findByIdAndUpdate(request.params.lessonId, data, {
      new: true,
      runValidators: true,
    });

    if (!lesson) {
      response.status(404).json({ error: 'Lesson not found.' });
      return;
    }

    const topic = await Topic.findById(lesson.topicId);

    response.json({ lesson: toLessonPayload(lesson, topic) });
  } catch (updateError) {
    sendMongooseError(response, updateError);
  }
});

adminRouter.get('/admin/quizzes', async (_request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const quizzes = await Quiz.find({}).sort({ title: 1 });
  const topicById = await getTopicMap(quizzes.map((quiz) => quiz.topicId));
  const lessonIds = quizzes.map((quiz) => quiz.lessonId).filter(Boolean);
  const lessons = await Lesson.find({ _id: { $in: lessonIds } });
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

  response.json({
    quizzes: quizzes.map((quiz) =>
      toQuizPayload(
        quiz,
        topicById.get(quiz.topicId.toString()),
        quiz.lessonId ? lessonById.get(quiz.lessonId.toString()) : null,
      ),
    ),
  });
});

adminRouter.post('/admin/quizzes', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const { data, error } = buildQuizData(request.body);

  if (error) {
    response.status(400).json({ error });
    return;
  }

  if (!(await validateTopicReference(response, data.topicId))) {
    return;
  }

  if (!(await validateLessonReference(response, data.lessonId))) {
    return;
  }

  try {
    const quiz = await Quiz.create(data);
    const topic = await Topic.findById(quiz.topicId);
    const lesson = quiz.lessonId ? await Lesson.findById(quiz.lessonId) : null;

    response.status(201).json({ quiz: toQuizPayload(quiz, topic, lesson) });
  } catch (createError) {
    sendMongooseError(response, createError);
  }
});

adminRouter.get('/admin/problems', async (_request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const problems = await CodingProblem.find({}).sort({ title: 1 });
  const topicById = await getTopicMap(problems.map((problem) => problem.topicId));

  response.json({
    problems: problems.map((problem) => toProblemPayload(problem, topicById.get(problem.topicId.toString()))),
  });
});

adminRouter.post('/admin/problems', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const { data, error } = buildProblemData(request.body);

  if (error) {
    response.status(400).json({ error });
    return;
  }

  if (!(await validateTopicReference(response, data.topicId))) {
    return;
  }

  try {
    const problem = await CodingProblem.create(data);
    const topic = await Topic.findById(problem.topicId);

    response.status(201).json({ problem: toProblemPayload(problem, topic) });
  } catch (createError) {
    sendMongooseError(response, createError);
  }
});
