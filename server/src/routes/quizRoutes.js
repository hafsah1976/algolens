import mongoose from 'mongoose';
import { Router } from 'express';

import { ensureDatabaseConnection, getDatabaseStatus } from '../db/mongo.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { gradeQuizSubmission, sanitizeQuizPayload } from '../utils/quizGrading.js';

export const quizRouter = Router();

function sendDatabaseUnavailable(response) {
  response.status(503).json({
    error: 'Quizzes are temporarily unavailable. Please try again in a moment.',
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

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

quizRouter.get('/quizzes/topic/:topicId', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  if (!isValidObjectId(request.params.topicId)) {
    response.status(400).json({ error: 'A valid topicId is required.' });
    return;
  }

  const quizzes = await Quiz.find({
    isPublished: true,
    topicId: request.params.topicId,
  }).sort({ title: 1 });

  response.json({
    quizzes: quizzes.map((quiz) => sanitizeQuizPayload(quiz)),
  });
});

quizRouter.get('/quizzes/:quizId', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  if (!isValidObjectId(request.params.quizId)) {
    response.status(400).json({ error: 'A valid quizId is required.' });
    return;
  }

  const quiz = await Quiz.findOne({
    _id: request.params.quizId,
    isPublished: true,
  });

  if (!quiz) {
    response.status(404).json({ error: 'Quiz not found.' });
    return;
  }

  response.json({
    quiz: sanitizeQuizPayload(quiz),
  });
});

quizRouter.post('/quizzes/:quizId/submit', requireAuth, async (request, response) => {
  if (!isValidObjectId(request.params.quizId)) {
    response.status(400).json({ error: 'A valid quizId is required.' });
    return;
  }

  const answers = Array.isArray(request.body?.answers) ? request.body.answers : null;

  if (!answers) {
    response.status(400).json({ error: 'answers must be an array.' });
    return;
  }

  const connected = await ensureDatabaseConnection();

  if (!connected) {
    sendDatabaseUnavailable(response);
    return;
  }

  const quiz = await Quiz.findOne({
    _id: request.params.quizId,
    isPublished: true,
  });

  if (!quiz) {
    response.status(404).json({ error: 'Quiz not found.' });
    return;
  }

  const graded = gradeQuizSubmission(quiz, answers);
  const attempt = await QuizAttempt.create({
    answers: graded.attemptAnswers,
    quizId: quiz._id,
    score: graded.score,
    totalQuestions: graded.totalQuestions,
    userId: request.authUser._id,
  });

  response.json({
    attemptId: attempt.id,
    completedAt: attempt.completedAt,
    explanations: graded.results.map((result) => ({
      explanation: result.explanation,
      questionId: result.questionId,
    })),
    results: graded.results,
    score: graded.score,
    totalQuestions: graded.totalQuestions,
  });
});
