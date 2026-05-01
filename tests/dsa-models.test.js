import assert from 'node:assert/strict';
import test from 'node:test';

import mongoose from 'mongoose';

import { AnalyticsEvent } from '../server/src/models/AnalyticsEvent.js';
import { CodingProblem } from '../server/src/models/CodingProblem.js';
import { Lesson } from '../server/src/models/Lesson.js';
import { Quiz } from '../server/src/models/Quiz.js';
import { QuizAttempt } from '../server/src/models/QuizAttempt.js';
import { Submission } from '../server/src/models/Submission.js';
import { Topic } from '../server/src/models/Topic.js';
import { User } from '../server/src/models/User.js';
import { UserProgress } from '../server/src/models/UserProgress.js';

function hasIndex(model, keys, options = {}) {
  return model.schema.indexes().some(([indexKeys, indexOptions]) => {
    const sameKeys = JSON.stringify(indexKeys) === JSON.stringify(keys);
    const sameUnique =
      options.unique === undefined || Boolean(indexOptions.unique) === Boolean(options.unique);

    return sameKeys && sameUnique;
  });
}

test('DSA content models compile with expected names and slug indexes', () => {
  assert.equal(Topic.modelName, 'Topic');
  assert.equal(User.modelName, 'User');
  assert.equal(Lesson.modelName, 'Lesson');
  assert.equal(Quiz.modelName, 'Quiz');
  assert.equal(QuizAttempt.modelName, 'QuizAttempt');
  assert.equal(UserProgress.modelName, 'UserProgress');
  assert.equal(CodingProblem.modelName, 'CodingProblem');
  assert.equal(Submission.modelName, 'Submission');
  assert.equal(AnalyticsEvent.modelName, 'AnalyticsEvent');

  assert.equal(Topic.schema.path('slug').options.unique, true);
  assert.equal(Lesson.schema.path('slug').options.unique, true);
  assert.equal(CodingProblem.schema.path('slug').options.unique, true);
  assert.equal(User.schema.path('role').options.default, 'student');
  assert.ok(User.schema.path('emailVerifiedAt'));
  assert.ok(User.schema.path('passwordResetTokenHash'));
  assert.ok(User.schema.path('emailVerificationTokenHash'));
  assert.ok(hasIndex(Lesson, { topicId: 1, slug: 1 }, { unique: true }));
  assert.ok(hasIndex(UserProgress, { userId: 1, lessonId: 1 }, { unique: true }));
  assert.ok(hasIndex(User, { passwordResetTokenHash: 1 }));
  assert.ok(hasIndex(User, { emailVerificationTokenHash: 1 }));
});

test('User model supports student and admin roles only', () => {
  const admin = new User({
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  });
  const student = new User({
    email: 'student@example.com',
    name: 'Student User',
  });
  const invalid = new User({
    email: 'owner@example.com',
    name: 'Owner User',
    role: 'owner',
  });

  assert.equal(admin.validateSync(), undefined);
  assert.equal(student.role, 'student');
  assert.match(invalid.validateSync().message, /`owner` is not a valid enum value/);
});

test('Topic and Lesson validate the required learning content fields', () => {
  const topicId = new mongoose.Types.ObjectId();
  const topic = new Topic({
    description: 'Learn pointer movement visually.',
    difficulty: 'beginner',
    order: 1,
    slug: 'arrays-two-pointers',
    title: 'Arrays / Two Pointers',
  });
  const lesson = new Lesson({
    content: '# Pair Sum',
    estimatedMinutes: 12,
    order: 1,
    slug: 'pair-sum',
    summary: 'Trace a sorted pair sum.',
    title: 'Pair Sum',
    topicId,
    visualizationType: 'trace',
  });

  assert.equal(topic.validateSync(), undefined);
  assert.equal(lesson.validateSync(), undefined);
});

test('Quiz, progress, coding problem, and submission models validate MVP records', () => {
  const userId = new mongoose.Types.ObjectId();
  const topicId = new mongoose.Types.ObjectId();
  const lessonId = new mongoose.Types.ObjectId();
  const quizId = new mongoose.Types.ObjectId();
  const problemId = new mongoose.Types.ObjectId();
  const questionId = new mongoose.Types.ObjectId();

  const quiz = new Quiz({
    lessonId,
    questions: [
      {
        correctAnswer: 'O(log n)',
        difficulty: 'beginner',
        explanation: 'Binary search halves the search space.',
        options: ['O(n)', 'O(log n)', 'O(n^2)'],
        prompt: 'What is the time complexity of binary search?',
        type: 'complexity',
      },
    ],
    title: 'Binary Search Basics Quiz',
    topicId,
  });
  const quizAttempt = new QuizAttempt({
    answers: [{ answer: 'O(log n)', awardedPoints: 1, isCorrect: true, questionId }],
    quizId,
    score: 1,
    totalQuestions: 1,
    userId,
  });
  const userProgress = new UserProgress({
    lessonId,
    status: 'completed',
    topicId,
    userId,
  });
  const codingProblem = new CodingProblem({
    examples: [{ input: '[2,7,11,15], 9', output: '[0,1]' }],
    slug: 'two-sum',
    statement: 'Return two indices whose values add up to the target.',
    title: 'Two Sum',
    topicId,
  });
  const submission = new Submission({
    code: 'return [0, 1];',
    language: 'javascript',
    problemId,
    status: 'received',
    userId,
  });

  assert.equal(quiz.validateSync(), undefined);
  assert.equal(quizAttempt.validateSync(), undefined);
  assert.equal(userProgress.validateSync(), undefined);
  assert.equal(codingProblem.validateSync(), undefined);
  assert.equal(submission.validateSync(), undefined);
});
