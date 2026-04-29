import assert from 'node:assert/strict';
import test from 'node:test';

import { supportedVisualizationTypes } from '../client/src/lib/visualizationTypes.js';
import {
  getSeedCodingProblemCount,
  getSeedLessonCount,
  getSeedQuizCount,
  initialCodingProblems,
  initialDsaQuizzes,
  initialDsaTopics,
} from '../server/src/data/dsaSeedContent.js';

function assertUnique(values, label) {
  const seen = new Set();

  for (const value of values) {
    assert.equal(seen.has(value), false, `duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

test('initial DSA seed content has ten topics and two beginner lessons each', () => {
  assert.equal(initialDsaTopics.length, 10);
  assert.equal(getSeedLessonCount(), 20);
  assertUnique(initialDsaTopics.map((topic) => topic.slug), 'topic slug');

  const lessonSlugs = [];

  for (const [topicIndex, topic] of initialDsaTopics.entries()) {
    assert.equal(topic.order, topicIndex + 1);
    assert.equal(topic.difficulty, 'beginner');
    assert.equal(topic.lessons.length, 2, `${topic.title} should start with two lessons`);

    for (const [lessonIndex, lesson] of topic.lessons.entries()) {
      lessonSlugs.push(lesson.slug);
      assert.equal(lesson.order, lessonIndex + 1);
      assert.ok(lesson.summary.length > 20, `${lesson.slug} needs a useful summary`);
      assert.ok(lesson.content.length > 80, `${lesson.slug} needs beginner lesson content`);
      assert.ok(lesson.estimatedMinutes >= 5, `${lesson.slug} needs a realistic reading time`);
    }
  }

  assertUnique(lessonSlugs, 'lesson slug');
});

test('starter visualizations attach only supported lightweight types', () => {
  const supportedTypes = new Set(supportedVisualizationTypes);
  const visualizedLessons = initialDsaTopics.flatMap((topic) =>
    topic.lessons
      .filter((lesson) => lesson.visualizationType !== 'none')
      .map((lesson) => ({
        slug: lesson.slug,
        type: lesson.visualizationType,
      })),
  );

  assert.deepEqual(
    visualizedLessons.map((lesson) => lesson.type).sort(),
    ['bfs', 'binary_search', 'bubble_sort', 'dfs', 'queue', 'stack'],
  );

  for (const lesson of visualizedLessons) {
    assert.ok(supportedTypes.has(lesson.type), `${lesson.slug} uses unsupported visualization type`);
  }
});

test('initial DSA quiz seed content covers supported quiz types without leaking answers in shape', () => {
  const questionTypes = new Set();

  assert.equal(getSeedQuizCount(), 10);
  assertUnique(initialDsaQuizzes.map((quiz) => quiz.title), 'quiz title');

  for (const quiz of initialDsaQuizzes) {
    assert.ok(
      initialDsaTopics.some((topic) => topic.slug === quiz.topicSlug),
      `${quiz.title} should point at a seeded topic`,
    );
    assert.ok(quiz.questions.length >= 3, `${quiz.title} needs enough concept checks`);

    for (const question of quiz.questions) {
      questionTypes.add(question.type);
      assert.ok(question.prompt.length > 20, `${quiz.title} question needs a useful prompt`);
      assert.ok(question.explanation.length > 20, `${quiz.title} question needs an explanation`);
      assert.ok(question.correctAnswer, `${quiz.title} question needs a correct answer for backend grading`);
    }
  }

  assert.deepEqual([...questionTypes].sort(), [
    'code_output',
    'complexity',
    'fill_blank',
    'mcq',
    'true_false',
  ]);
});

test('initial coding practice seed content has public and hidden checks', () => {
  assert.equal(getSeedCodingProblemCount(), 6);
  assertUnique(initialCodingProblems.map((problem) => problem.slug), 'coding problem slug');

  for (const problem of initialCodingProblems) {
    assert.ok(
      initialDsaTopics.some((topic) => topic.slug === problem.topicSlug),
      `${problem.title} should point at a seeded topic`,
    );
    assert.equal(problem.difficulty, 'beginner');
    assert.ok(problem.statement.length > 40, `${problem.slug} needs a useful statement`);
    assert.ok(problem.examples.length >= 2, `${problem.slug} needs examples`);
    assert.ok(problem.constraints.length >= 2, `${problem.slug} needs constraints`);
    assert.ok(problem.starterCode.some((entry) => entry.language === 'javascript'));
    assert.ok(problem.testCases.some((testCase) => testCase.isHidden === false));
    assert.ok(problem.testCases.some((testCase) => testCase.isHidden === true));
  }
});
