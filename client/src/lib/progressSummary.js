import { getLessonMode } from './lessonMeta.js';

function findLessonMatch(tracks, lessonId) {
  for (const track of tracks) {
    const lesson = track.lessons.find((entry) => entry.id === lessonId);

    if (lesson) {
      return { lesson, track };
    }
  }

  return null;
}

function getLessonProgressById(lessonProgressRecords) {
  return Object.fromEntries(lessonProgressRecords.map((entry) => [entry.lessonId, entry]));
}

function getBaseLessonStageLabel(lesson) {
  return getLessonMode(lesson).stageLabel;
}

export function upsertProgressRecord(records, nextRecord, key) {
  const nextRecords = records.filter((record) => record[key] !== nextRecord[key]);
  nextRecords.push(nextRecord);
  return nextRecords;
}

export function getEffectiveLessonStatus(lesson, lessonProgress) {
  return lessonProgress?.status ?? 'not-started';
}

export function getLessonStageLabel(lesson, lessonProgress) {
  const status = getEffectiveLessonStatus(lesson, lessonProgress);

  if (status === 'completed') {
    return 'Completed';
  }

  if (status === 'in-progress') {
    return 'In progress';
  }

  return getBaseLessonStageLabel(lesson);
}

export function getTrackProgressSnapshot(track, lessonProgressRecords) {
  const lessonProgressById = getLessonProgressById(lessonProgressRecords);
  const completed = track.lessons.filter(
    (lesson) => getEffectiveLessonStatus(lesson, lessonProgressById[lesson.id]) === 'completed',
  ).length;
  const total = track.lessons.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const activeLesson =
    track.lessons.find(
      (lesson) => getEffectiveLessonStatus(lesson, lessonProgressById[lesson.id]) === 'in-progress',
    ) ?? null;
  const nextLesson =
    track.lessons.find(
      (lesson) => getEffectiveLessonStatus(lesson, lessonProgressById[lesson.id]) !== 'completed',
    ) ?? null;

  return {
    activeLesson,
    completed,
    nextLesson,
    percent,
    total,
  };
}

export function getNextLessonAfter(track, currentLessonId, lessonProgressRecords) {
  const lessonProgressById = getLessonProgressById(lessonProgressRecords);
  const currentIndex = track.lessons.findIndex((lesson) => lesson.id === currentLessonId);
  const startIndex = currentIndex === -1 ? 0 : currentIndex + 1;

  for (let index = startIndex; index < track.lessons.length; index += 1) {
    const lesson = track.lessons[index];

    if (getEffectiveLessonStatus(lesson, lessonProgressById[lesson.id]) !== 'completed') {
      return lesson;
    }
  }

  for (let index = 0; index < startIndex; index += 1) {
    const lesson = track.lessons[index];

    if (getEffectiveLessonStatus(lesson, lessonProgressById[lesson.id]) !== 'completed') {
      return lesson;
    }
  }

  return null;
}

export function getRecommendedLessonForTrack(track, lessonProgressRecords) {
  const progress = getTrackProgressSnapshot(track, lessonProgressRecords);

  return progress.activeLesson ?? progress.nextLesson;
}

export function getOverallProgressSnapshot(tracks, lessonProgressRecords) {
  const totals = tracks.reduce(
    (summary, track) => {
      const progress = getTrackProgressSnapshot(track, lessonProgressRecords);

      return {
        completed: summary.completed + progress.completed,
        total: summary.total + progress.total,
      };
    },
    { completed: 0, total: 0 },
  );

  return {
    ...totals,
    percent: totals.total ? Math.round((totals.completed / totals.total) * 100) : 0,
  };
}

export function getResumeLesson(tracks, lessonProgressRecords, topicProgressRecords) {
  const activeLessonProgress = [...lessonProgressRecords]
    .filter((entry) => entry.status === 'in-progress')
    .sort(
      (left, right) =>
        new Date(right.updatedAt ?? 0).getTime() - new Date(left.updatedAt ?? 0).getTime(),
    )[0];

  if (activeLessonProgress) {
    return findLessonMatch(tracks, activeLessonProgress.lessonId);
  }

  let recentCompletedMatch = null;
  const recentTopicProgress = [...topicProgressRecords]
    .filter((entry) => entry.lastLessonId)
    .sort(
      (left, right) =>
        new Date(right.updatedAt ?? 0).getTime() - new Date(left.updatedAt ?? 0).getTime(),
    )[0];

  if (recentTopicProgress) {
    const recentTrack = tracks.find((track) => track.slug === recentTopicProgress.topicSlug);
    const recommendedLesson = recentTrack
      ? getRecommendedLessonForTrack(recentTrack, lessonProgressRecords)
      : null;

    if (recentTrack && recommendedLesson) {
      return {
        lesson: recommendedLesson,
        track: recentTrack,
      };
    }

    const recentLesson = findLessonMatch(tracks, recentTopicProgress.lastLessonId);

    if (recentLesson) {
      recentCompletedMatch = recentLesson;
    }
  }

  for (const track of tracks) {
    const recommendedLesson = getRecommendedLessonForTrack(track, lessonProgressRecords);

    if (recommendedLesson) {
      return { lesson: recommendedLesson, track };
    }
  }

  if (recentCompletedMatch) {
    return recentCompletedMatch;
  }

  const firstTrack = tracks[0];

  if (!firstTrack?.lessons[0]) {
    return null;
  }

  return {
    lesson: firstTrack.lessons[0],
    track: firstTrack,
  };
}

export function buildTopicProgressPayload(track, lessonProgressRecords, lastLessonId) {
  const progress = getTrackProgressSnapshot(track, lessonProgressRecords);

  return {
    completedLessons: progress.completed,
    lastLessonId,
    percent: progress.percent,
    topicSlug: track.slug,
    totalLessons: progress.total,
  };
}
