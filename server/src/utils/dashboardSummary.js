export function calculateAverageQuizScore(attempts = []) {
  const scoredAttempts = attempts.filter((attempt) => Number(attempt.totalQuestions) > 0);

  if (!scoredAttempts.length) {
    return null;
  }

  const totalPercent = scoredAttempts.reduce(
    (sum, attempt) => sum + (Number(attempt.score) / Number(attempt.totalQuestions)) * 100,
    0,
  );

  return Math.round(totalPercent / scoredAttempts.length);
}

export function countDistinctStrings(values = []) {
  return new Set(
    values
      .filter((value) => value !== null && value !== undefined)
      .map((value) => String(value))
      .filter(Boolean),
  ).size;
}

export function selectCurrentTopicProgress(topicProgress = [], topicBySlug = new Map()) {
  if (!topicProgress.length) {
    return null;
  }

  const current = [...topicProgress].sort(
    (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
  )[0];
  const topic = topicBySlug.get(current.topicSlug);

  return {
    completedLessons: current.completedLessons,
    lastLessonId: current.lastLessonId,
    percent: current.percent,
    title: topic?.title ?? current.topicSlug,
    topicSlug: current.topicSlug,
    totalLessons: current.totalLessons,
    updatedAt: current.updatedAt,
  };
}

export function selectRecommendedLesson(topics = [], lessons = [], completedLessonIds = new Set()) {
  const lessonsByTopicId = new Map();

  for (const lesson of lessons) {
    const topicId = String(lesson.topicId);
    const topicLessons = lessonsByTopicId.get(topicId) ?? [];

    topicLessons.push(lesson);
    lessonsByTopicId.set(topicId, topicLessons);
  }

  for (const topic of topics) {
    const topicLessons = lessonsByTopicId.get(String(topic._id ?? topic.id)) ?? [];
    const nextLesson = topicLessons.find(
      (lesson) => !completedLessonIds.has(lesson.slug) && !completedLessonIds.has(String(lesson._id ?? lesson.id)),
    );

    if (nextLesson) {
      return {
        estimatedMinutes: nextLesson.estimatedMinutes,
        id: String(nextLesson._id ?? nextLesson.id),
        slug: nextLesson.slug,
        title: nextLesson.title,
        topicSlug: topic.slug,
        topicTitle: topic.title,
        visualizationType: nextLesson.visualizationType,
      };
    }
  }

  return null;
}
