import assert from 'node:assert/strict';
import test from 'node:test';

import mongoose from 'mongoose';

import { Quiz } from '../server/src/models/Quiz.js';
import {
  gradeQuizSubmission,
  sanitizeQuizPayload,
} from '../server/src/utils/quizGrading.js';

test('quiz payload hides correct answers and explanations before submission', () => {
  const quiz = new Quiz({
    questions: [
      {
        correctAnswer: 'O(log n)',
        explanation: 'Binary search halves the search space.',
        options: ['O(n)', 'O(log n)', 'O(n^2)'],
        prompt: 'What is binary search complexity?',
        type: 'complexity',
      },
    ],
    title: 'Binary Search Quiz',
    topicId: new mongoose.Types.ObjectId(),
  });
  const payload = sanitizeQuizPayload(quiz);

  assert.equal(payload.questions[0].correctAnswer, undefined);
  assert.equal(payload.questions[0].explanation, undefined);
  assert.deepEqual(payload.questions[0].options, ['O(n)', 'O(log n)', 'O(n^2)']);
});

test('quiz grading handles exact, boolean, and accepted fill-blank answers server-side', () => {
  const quiz = new Quiz({
    questions: [
      {
        correctAnswer: 'True',
        explanation: 'A queue is FIFO.',
        options: ['True', 'False'],
        prompt: 'A queue removes the oldest item first.',
        type: 'true_false',
      },
      {
        correctAnswer: ['pointer', 'index'],
        explanation: 'A pointer commonly stores an index.',
        prompt: 'A variable that stores a position is called a ____.',
        type: 'fill_blank',
      },
      {
        correctAnswer: '5',
        explanation: 'The last pushed value is popped first.',
        options: ['2', '5'],
        prompt: 'Push 2, push 5, pop. What comes out?',
        type: 'code_output',
      },
    ],
    title: 'Server-Graded Quiz',
    topicId: new mongoose.Types.ObjectId(),
  });
  const [first, second, third] = quiz.questions;
  const result = gradeQuizSubmission(quiz, [
    { answer: true, questionId: first.id },
    { answer: ' Index ', questionId: second.id },
    { answer: '2', questionId: third.id },
  ]);

  assert.equal(result.score, 2);
  assert.equal(result.totalQuestions, 3);
  assert.equal(result.results[0].isCorrect, true);
  assert.equal(result.results[1].isCorrect, true);
  assert.equal(result.results[2].isCorrect, false);
  assert.equal(result.attemptAnswers[0].awardedPoints, 1);
  assert.equal(result.attemptAnswers[2].awardedPoints, 0);
});
