import { Router } from 'express';

import { ensureDatabaseConnection, getDatabaseStatus } from '../db/mongo.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { CodingProblem } from '../models/CodingProblem.js';
import { Lesson } from '../models/Lesson.js';
import { LessonProgress } from '../models/LessonProgress.js';
import { Quiz } from '../models/Quiz.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Submission } from '../models/Submission.js';
import { Topic } from '../models/Topic.js';
import { TopicProgress } from '../models/TopicProgress.js';
import {
  calculateAverageQuizScore,
  countDistinctStrings,
  selectCurrentTopicProgress,
  selectRecommendedLesson,
} from '../utils/dashboardSummary.js';

export const dashboardRouter = Router();

function sendDatabaseUnavailable(response) {
  response.status(503).json({
    error: 'MongoDB is not connected. Start MongoDB and try again.',
    database: getDatabaseStatus(),
  });
}

function toUserPayload(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

async function loadPublishedCatalog() {
  const topics = await Topic.find({ isPublished: true }).sort({ order: 1, title: 1 });
  const lessons = await Lesson.find({ isPublished: true }).sort({ order: 1, title: 1 });

  return { lessons, topics };
}

async function loadRecentQuizAttempts(userId) {
  const attempts = await QuizAttempt.find({ userId }).sort({ completedAt: -1 }).limit(5);
  const quizIds = attempts.map((attempt) => attempt.quizId);
  const quizzes = await Quiz.find({ _id: { $in: quizIds } });
  const quizById = new Map(quizzes.map((quiz) => [quiz.id, quiz]));

  return attempts.map((attempt) => {
    const quiz = quizById.get(attempt.quizId.toString());

    return {
      id: attempt.id,
      completedAt: attempt.completedAt,
      percent: attempt.totalQuestions ? Math.round((attempt.score / attempt.totalQuestions) * 100) : null,
      quizId: attempt.quizId.toString(),
      quizTitle: quiz?.title ?? 'Concept quiz',
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
    };
  });
}

async function loadRecentSubmissions(userId) {
  const submissions = await Submission.find({ userId }).sort({ submittedAt: -1 }).limit(5);
  const problemIds = submissions.map((submission) => submission.problemId);
  const problems = await CodingProblem.find({ _id: { $in: problemIds } });
  const problemById = new Map(problems.map((problem) => [problem.id, problem]));

  return submissions.map((submission) => {
    const problem = problemById.get(submission.problemId.toString());

    return {
      id: submission.id,
      language: submission.language,
      passed: submission.result?.passed ?? null,
      problemId: submission.problemId.toString(),
      problemSlug: problem?.slug ?? null,
      problemTitle: problem?.title ?? 'Coding problem',
      status: submission.status,
      submittedAt: submission.submittedAt,
      totalTests: submission.result?.totalTests ?? null,
    };
  });
}

dashboardRouter.get('/dashboard/me', requireAuth, async (request, response) => {
  const connected = await ensureDatabaseConnection();

  if (!connected) {
    sendDatabaseUnavailable(response);
    return;
  }

  const userId = request.authUser._id;
  const [
    { lessons: publishedLessons, topics: publishedTopics },
    lessonProgress,
    topicProgress,
    quizAttempts,
    completedQuizIds,
    attemptedProblemIds,
    recentQuizAttempts,
    recentSubmissions,
  ] = await Promise.all([
    loadPublishedCatalog(),
    LessonProgress.find({ userId }).sort({ updatedAt: -1 }),
    TopicProgress.find({ userId }).sort({ updatedAt: -1 }),
    QuizAttempt.find({ userId }),
    QuizAttempt.distinct('quizId', { userId }),
    Submission.distinct('problemId', { userId }),
    loadRecentQuizAttempts(userId),
    loadRecentSubmissions(userId),
  ]);
  const completedLessonIds = new Set(
    lessonProgress
      .filter((entry) => entry.status === 'completed')
      .map((entry) => entry.lessonId),
  );
  const topicBySlug = new Map(publishedTopics.map((topic) => [topic.slug, topic]));

  response.json({
    dashboard: {
      currentTopicProgress: selectCurrentTopicProgress(topicProgress, topicBySlug),
      metrics: {
        averageQuizScore: calculateAverageQuizScore(quizAttempts),
        codingProblemsAttempted: countDistinctStrings(attemptedProblemIds),
        completedLessons: completedLessonIds.size,
        completedQuizzes: countDistinctStrings(completedQuizIds),
      },
      recentQuizAttempts,
      recentSubmissions,
      recommendedNextLesson: selectRecommendedLesson(
        publishedTopics,
        publishedLessons,
        completedLessonIds,
      ),
    },
    database: getDatabaseStatus(),
    user: toUserPayload(request.authUser),
  });
});
