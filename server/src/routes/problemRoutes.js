import mongoose from 'mongoose';
import { Router } from 'express';

import { ensureDatabaseConnection, getDatabaseStatus } from '../db/mongo.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { CodingProblem } from '../models/CodingProblem.js';
import { Submission } from '../models/Submission.js';
import { Topic } from '../models/Topic.js';
import {
  buildJudge0FailureResult,
  runProblemWithJudge0,
} from '../services/judge0Service.js';

export const problemRouter = Router();

function sendDatabaseUnavailable(response) {
  response.status(503).json({
    error: 'Practice problems are temporarily unavailable. Please try again in a moment.',
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

function normalizeFilter(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function toPublicTestCase(testCase) {
  return {
    input: testCase.input,
    expectedOutput: testCase.expectedOutput,
  };
}

function toProblemListPayload(problem, topic = null) {
  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    topicId: problem.topicId.toString(),
    topicSlug: topic?.slug ?? null,
    topicTitle: topic?.title ?? null,
    difficulty: problem.difficulty,
    statement: problem.statement,
    exampleCount: problem.examples.length,
    publicTestCaseCount: problem.testCases.filter((testCase) => !testCase.isHidden).length,
  };
}

function toProblemDetailPayload(problem, topic = null) {
  return {
    ...toProblemListPayload(problem, topic),
    examples: problem.examples,
    constraints: problem.constraints,
    starterCode: problem.starterCode,
    testCases: problem.testCases.filter((testCase) => !testCase.isHidden).map(toPublicTestCase),
  };
}

async function getTopicFilter(topicFilter) {
  const normalizedTopic = normalizeFilter(topicFilter);

  if (!normalizedTopic) {
    return {};
  }

  if (mongoose.Types.ObjectId.isValid(normalizedTopic)) {
    return { topicId: normalizedTopic };
  }

  const topic = await Topic.findOne({ slug: normalizedTopic });

  if (!topic) {
    return { topicId: null };
  }

  return { topicId: topic._id };
}

problemRouter.get('/problems', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const difficulty = normalizeFilter(request.query.difficulty);
  const topicFilter = await getTopicFilter(request.query.topic);
  const query = {
    ...topicFilter,
    isPublished: true,
    ...(difficulty ? { difficulty } : {}),
  };
  const problems = await CodingProblem.find(query).sort({ difficulty: 1, title: 1 });
  const topicIds = [...new Set(problems.map((problem) => problem.topicId.toString()))];
  const topics = await Topic.find({ _id: { $in: topicIds } });
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));

  response.json({
    problems: problems.map((problem) =>
      toProblemListPayload(problem, topicById.get(problem.topicId.toString())),
    ),
  });
});

problemRouter.get('/problems/:slug', async (request, response) => {
  if (!(await requireDatabase(response))) {
    return;
  }

  const slug = normalizeFilter(request.params.slug);
  const problem = slug
    ? await CodingProblem.findOne({
        isPublished: true,
        slug,
      })
    : null;

  if (!problem) {
    response.status(404).json({ error: 'Problem not found.' });
    return;
  }

  const topic = await Topic.findById(problem.topicId);

  response.json({
    problem: toProblemDetailPayload(problem, topic),
  });
});

problemRouter.post('/problems/:slug/submit', requireAuth, async (request, response) => {
  const slug = normalizeFilter(request.params.slug);
  const { code, language } = request.body ?? {};

  if (!language || !code) {
    response.status(400).json({ error: 'language and code are required.' });
    return;
  }

  const connected = await ensureDatabaseConnection();

  if (!connected) {
    sendDatabaseUnavailable(response);
    return;
  }

  const problem = slug
    ? await CodingProblem.findOne({
        isPublished: true,
        slug,
      })
    : null;

  if (!problem) {
    response.status(404).json({ error: 'Problem not found.' });
    return;
  }

  let executionResult;

  try {
    executionResult = await runProblemWithJudge0({
      code,
      language,
      problemSlug: problem.slug,
      testCases: problem.testCases,
    });
  } catch (error) {
    executionResult = buildJudge0FailureResult(error, problem.testCases.length);
  }

  const submission = await Submission.create({
    code,
    language,
    problemId: problem._id,
    memory: executionResult.memory,
    result: executionResult,
    runtime: executionResult.runtime,
    status: executionResult.status,
    userId: request.authUser._id,
  });

  response.json({
    submission: {
      error: executionResult.error,
      failed: executionResult.failed,
      id: submission.id,
      language: submission.language,
      memory: submission.memory,
      passed: executionResult.passed,
      problemId: submission.problemId.toString(),
      result: submission.result,
      runtime: submission.runtime,
      status: submission.status,
      submittedAt: submission.submittedAt,
      totalTests: executionResult.totalTests,
    },
  });
});
