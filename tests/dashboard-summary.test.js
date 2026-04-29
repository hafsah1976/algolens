import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateAverageQuizScore,
  countDistinctStrings,
  selectCurrentTopicProgress,
  selectRecommendedLesson,
} from '../server/src/utils/dashboardSummary.js';

test('dashboard metrics calculate quiz average and distinct activity counts', () => {
  assert.equal(
    calculateAverageQuizScore([
      { score: 2, totalQuestions: 4 },
      { score: 3, totalQuestions: 3 },
    ]),
    75,
  );
  assert.equal(calculateAverageQuizScore([]), null);
  assert.equal(countDistinctStrings(['a', 'a', 'b', null]), 2);
});

test('dashboard summary selects current topic from latest progress', () => {
  const topicBySlug = new Map([
    ['arrays', { title: 'Arrays' }],
    ['trees', { title: 'Trees' }],
  ]);
  const current = selectCurrentTopicProgress(
    [
      {
        completedLessons: 1,
        lastLessonId: 'array-basics',
        percent: 50,
        topicSlug: 'arrays',
        totalLessons: 2,
        updatedAt: '2026-04-20T10:00:00.000Z',
      },
      {
        completedLessons: 0,
        lastLessonId: 'tree-basics',
        percent: 0,
        topicSlug: 'trees',
        totalLessons: 2,
        updatedAt: '2026-04-21T10:00:00.000Z',
      },
    ],
    topicBySlug,
  );

  assert.equal(current.topicSlug, 'trees');
  assert.equal(current.title, 'Trees');
  assert.equal(current.percent, 0);
});

test('dashboard summary recommends first incomplete published lesson', () => {
  const topics = [
    { _id: 'topic-a', slug: 'arrays', title: 'Arrays' },
    { _id: 'topic-b', slug: 'stacks', title: 'Stacks' },
  ];
  const lessons = [
    {
      _id: 'lesson-a',
      estimatedMinutes: 8,
      slug: 'array-basics',
      title: 'Array Basics',
      topicId: 'topic-a',
      visualizationType: 'none',
    },
    {
      _id: 'lesson-b',
      estimatedMinutes: 10,
      slug: 'stack-push-pop',
      title: 'Stack Push / Pop',
      topicId: 'topic-b',
      visualizationType: 'stack',
    },
  ];
  const recommendation = selectRecommendedLesson(topics, lessons, new Set(['array-basics']));

  assert.equal(recommendation.slug, 'stack-push-pop');
  assert.equal(recommendation.topicSlug, 'stacks');
  assert.equal(selectRecommendedLesson(topics, lessons, new Set(['array-basics', 'stack-push-pop'])), null);
});
