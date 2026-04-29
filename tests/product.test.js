import assert from 'node:assert/strict';
import test from 'node:test';

import { learningTracks } from '../client/src/data/appShellData.js';
import { findTraceLessonById } from '../client/src/data/traceLessons.js';
import {
  buildLessonContentSections,
  getCanonicalLessonPath,
  getCanonicalTopicPath,
  getStaticLessonMatch,
  getStaticTopics,
  mergeApiTopicsWithStatic,
} from '../client/src/lib/contentCatalog.js';
import {
  getFocusModeStatus,
  getFocusModeToggleLabel,
  readStoredFocusMode,
  writeStoredFocusMode,
} from '../client/src/lib/focusMode.js';
import { getAuthReturnPath } from '../client/src/lib/authRouting.js';
import { getLessonMode, getLessonStats, getTrackReadiness } from '../client/src/lib/lessonMeta.js';
import {
  getMilestoneSnapshot,
  getMilestonesForLesson,
  milestoneDefinitions,
} from '../client/src/lib/milestones.js';
import {
  buildTopicProgressPayload,
  getNextLessonAfter,
  getOverallProgressSnapshot,
  getRecommendedLessonForTrack,
  getResumeLesson,
  getTrackProgressSnapshot,
} from '../client/src/lib/progressSummary.js';
import {
  buildTwoPointerSandboxTrace,
  parseSandboxNumbers,
  parseSandboxTarget,
} from '../client/src/lib/sandboxTrace.js';
import {
  canAdvanceTraceFrame,
  isPredictionAnswerCorrect,
} from '../client/src/lib/traceInteraction.js';
import {
  buildTraceStepSearch,
  getFrameIndexFromStepParam,
  getInitialTraceFrameIndex,
} from '../client/src/lib/traceNavigation.js';

function getAllLessons() {
  return learningTracks.flatMap((track) =>
    track.lessons.map((lesson) => ({
      lesson,
      track,
    })),
  );
}

function assertNonEmptyString(value, message) {
  assert.equal(typeof value, 'string', message);
  assert.ok(value.trim().length > 0, message);
}

function collectStrings(value, results = []) {
  if (typeof value === 'string') {
    results.push(value);
    return results;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStrings(item, results);
    }
    return results;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      collectStrings(item, results);
    }
  }

  return results;
}

test('learning paths expose a complete route inventory', () => {
  assert.equal(learningTracks.length, 5);
  assert.equal(getStaticTopics().length, 5);
  assert.equal(getCanonicalTopicPath('arrays-two-pointers'), '/app/topics/arrays-two-pointers');
  assert.equal(getCanonicalLessonPath('pair-sum-trace'), '/app/lessons/pair-sum-trace');

  const slugs = new Set();
  const lessonIds = new Set();

  for (const track of learningTracks) {
    assertNonEmptyString(track.slug, 'track slug is required');
    assertNonEmptyString(track.title, 'track title is required');
    assert.equal(slugs.has(track.slug), false, `duplicate track slug: ${track.slug}`);
    slugs.add(track.slug);
    assert.equal(track.lessons.length, 3, `${track.title} should keep the MVP to three lessons`);

    for (const lesson of track.lessons) {
      assertNonEmptyString(lesson.id, 'lesson id is required');
      assertNonEmptyString(lesson.title, 'lesson title is required');
      assertNonEmptyString(lesson.summary, 'lesson summary is required');
      assert.ok(Array.isArray(lesson.goals) && lesson.goals.length > 0, `${lesson.id} needs goals`);
      assert.equal(lessonIds.has(lesson.id), false, `duplicate lesson id: ${lesson.id}`);
      lessonIds.add(lesson.id);
    }
  }
});

test('Phase 5 catalog helpers keep topic and lesson pages browseable', () => {
  const apiMergedTopics = mergeApiTopicsWithStatic([
    {
      description: 'Published hash map description',
      difficulty: 'Beginner',
      order: 2,
      slug: 'hash-maps',
      title: 'Hash Maps',
    },
  ]);
  const hashMapsTopic = apiMergedTopics.find((topic) => topic.slug === 'hash-maps');
  const pairSumMatch = getStaticLessonMatch('pair-sum-trace');
  const contentSections = buildLessonContentSections(pairSumMatch.lesson, pairSumMatch.track);

  assert.equal(apiMergedTopics.length, 5);
  assert.equal(hashMapsTopic.description, 'Published hash map description');
  assert.equal(hashMapsTopic.lessons.length, 3);
  assert.equal(pairSumMatch.track.slug, 'arrays-two-pointers');
  assert.ok(contentSections.length >= 4);
  assert.ok(contentSections.every((section) => section.title && section.body));
});

test('lesson readiness labels match the available Trace Mode content', () => {
  let interactiveCount = 0;
  let previewCount = 0;

  for (const { lesson } of getAllLessons()) {
    const mode = getLessonMode(lesson);

    if (mode.isInteractive) {
      interactiveCount += 1;
      assert.equal(mode.stageLabel, 'Trace Mode');
      assert.ok(findTraceLessonById(lesson.id), `${lesson.id} should have trace data`);
    } else {
      previewCount += 1;
      assert.equal(mode.stageLabel, 'Concept Preview');
      assert.equal(findTraceLessonById(lesson.id), null, `${lesson.id} should not masquerade as a trace`);
    }
  }

  assert.equal(interactiveCount, 15);
  assert.equal(previewCount, 0);
});

test('Trace Mode lessons have valid frame, code, prediction, and marker references', () => {
  for (const { lesson } of getAllLessons()) {
    const traceLesson = findTraceLessonById(lesson.id);

    if (!traceLesson) {
      continue;
    }

    const setupArray = traceLesson.setup.array;
    const codeLineIds = new Set(traceLesson.code.lines.map((line) => line.id));
    const algorithmStepIds = new Set(traceLesson.algorithmSteps.map((step) => step.id));
    const frameIds = new Set();

    assert.ok(Array.isArray(setupArray) && setupArray.length > 0, `${lesson.id} needs setup data`);
    assert.ok(traceLesson.frames.length >= 4, `${lesson.id} should feel like a complete trace`);
    assert.ok(traceLesson.code.lines.length >= 4, `${lesson.id} needs synced pseudocode`);
    assert.ok(traceLesson.completionRecap, `${lesson.id} needs a completion recap`);

    for (const frame of traceLesson.frames) {
      assertNonEmptyString(frame.id, `${lesson.id} frame id is required`);
      assert.equal(frameIds.has(frame.id), false, `${lesson.id} duplicate frame id: ${frame.id}`);
      frameIds.add(frame.id);

      assertNonEmptyString(frame.title, `${frame.id} needs a title`);
      assertNonEmptyString(frame.explanation, `${frame.id} needs an explanation`);
      assertNonEmptyString(frame.comparisonText, `${frame.id} needs comparison text`);
      assertNonEmptyString(frame.decision, `${frame.id} needs a decision`);
      assertNonEmptyString(frame.status, `${frame.id} needs a status`);
      assert.ok(Array.isArray(frame.variables) && frame.variables.length > 0, `${frame.id} needs variables`);
      assert.ok(algorithmStepIds.has(frame.activeStepId), `${frame.id} references an unknown algorithm step`);

      const activeCodeLineIds = frame.activeCodeLineIds ?? [frame.activeCodeLineId ?? frame.activeStepId];
      for (const lineId of activeCodeLineIds) {
        assert.ok(codeLineIds.has(lineId), `${frame.id} references unknown code line: ${lineId}`);
      }

      if (frame.prediction) {
        const optionIds = new Set(frame.prediction.options.map((option) => option.id));
        assert.ok(optionIds.has(frame.prediction.correctOptionId), `${frame.id} prediction has no correct option`);
      }

      const markers = frame.markers ?? [
        frame.pointers?.left !== undefined ? { index: frame.pointers.left } : null,
        frame.pointers?.right !== undefined ? { index: frame.pointers.right } : null,
      ].filter(Boolean);

      for (const marker of markers) {
        assert.ok(Number.isInteger(marker.index), `${frame.id} marker index must be an integer`);
        assert.ok(marker.index >= 0 && marker.index < setupArray.length, `${frame.id} marker is outside setup array`);
      }

      for (const matchedIndex of frame.matchedIndices ?? []) {
        assert.ok(
          matchedIndex >= 0 && matchedIndex < setupArray.length,
          `${frame.id} matched index is outside setup array`,
        );
      }
    }
  }
});

test('Trace Mode step links and Challenge Mode rules stay predictable', () => {
  const pairSumTrace = findTraceLessonById('pair-sum-trace');
  const firstPrediction = pairSumTrace.frames.find((frame) => frame.prediction).prediction;
  const wrongOption = firstPrediction.options.find((option) => option.id !== firstPrediction.correctOptionId);
  const linkedSearch = buildTraceStepSearch(new URLSearchParams('fresh=1&mentor=maya'), 2);

  assert.equal(getFrameIndexFromStepParam('3', pairSumTrace.frames.length), 2);
  assert.equal(getFrameIndexFromStepParam('999', pairSumTrace.frames.length), pairSumTrace.frames.length - 1);
  assert.equal(getFrameIndexFromStepParam('not-a-step', pairSumTrace.frames.length), null);
  assert.equal(
    getInitialTraceFrameIndex({
      savedFrame: 1,
      startFresh: true,
      stepParam: '3',
      totalFrames: pairSumTrace.frames.length,
    }),
    2,
  );
  assert.equal(linkedSearch.get('fresh'), null);
  assert.equal(linkedSearch.get('mentor'), 'maya');
  assert.equal(linkedSearch.get('step'), '3');
  assert.equal(isPredictionAnswerCorrect(firstPrediction, firstPrediction.correctOptionId), true);
  assert.equal(isPredictionAnswerCorrect(firstPrediction, wrongOption.id), false);
  assert.equal(
    canAdvanceTraceFrame({
      challengeMode: false,
      prediction: firstPrediction,
      selectedOptionId: wrongOption.id,
    }),
    true,
  );
  assert.equal(
    canAdvanceTraceFrame({
      challengeMode: true,
      prediction: firstPrediction,
      selectedOptionId: wrongOption.id,
    }),
    false,
  );
  assert.equal(
    canAdvanceTraceFrame({
      challengeMode: true,
      prediction: firstPrediction,
      selectedOptionId: firstPrediction.correctOptionId,
    }),
    true,
  );
});

test('learner-facing content has beginner supports and no placeholder artifacts', () => {
  const blockedFragments = ['lorem', 'todo', 'placeholder', 'coming soon', 'undefined', '\u00e2', '\u00c2'];

  for (const track of learningTracks) {
    assert.ok(track.conceptPrimer, `${track.slug} needs a concept primer`);
    assert.ok(track.conceptPrimer.vocabulary.length >= 5, `${track.slug} needs vocabulary support`);
    assert.ok(track.conceptPrimer.selfCheck.length >= 3, `${track.slug} needs self-check prompts`);
    assert.ok(track.miniExamples.length >= 3, `${track.slug} needs mini examples`);

    for (const field of ['intro', 'whatThisIs', 'whyItHelps', 'pictureIt', 'commonMistake', 'traceMode']) {
      assertNonEmptyString(track.conceptPrimer[field], `${track.slug} primer.${field} is required`);
    }

    const learnerCopy = collectStrings(track).join(' ').toLowerCase();

    for (const fragment of blockedFragments) {
      assert.equal(
        learnerCopy.includes(fragment.toLowerCase()),
        false,
        `${track.slug} contains learner-facing artifact: ${fragment}`,
      );
    }
  }
});

test('progress logic starts fresh and resumes the correct lesson', () => {
  const freshOverall = getOverallProgressSnapshot(learningTracks, []);

  assert.equal(freshOverall.completed, 0);
  assert.equal(freshOverall.percent, 0);

  const arraysTrack = learningTracks.find((track) => track.slug === 'arrays-two-pointers');
  const completedRecord = {
    currentFrame: 3,
    lessonId: 'pair-sum-trace',
    status: 'completed',
    topicSlug: arraysTrack.slug,
    updatedAt: '2026-04-28T10:00:00.000Z',
  };
  const activeRecord = {
    currentFrame: 1,
    lessonId: 'container-window-preview',
    status: 'in-progress',
    topicSlug: arraysTrack.slug,
    updatedAt: '2026-04-28T11:00:00.000Z',
  };
  const progress = getTrackProgressSnapshot(arraysTrack, [completedRecord, activeRecord]);
  const resumeMatch = getResumeLesson(learningTracks, [completedRecord, activeRecord], []);
  const topicPayload = buildTopicProgressPayload(arraysTrack, [completedRecord, activeRecord], activeRecord.lessonId);
  const recentCompletedTopic = {
    completedLessons: 1,
    lastLessonId: completedRecord.lessonId,
    percent: 33,
    topicSlug: arraysTrack.slug,
    totalLessons: 3,
    updatedAt: '2026-04-28T12:00:00.000Z',
  };
  const nextAfterCompleted = getNextLessonAfter(arraysTrack, completedRecord.lessonId, [completedRecord]);
  const recommendedForTrack = getRecommendedLessonForTrack(arraysTrack, [completedRecord]);
  const resumeAfterCompleted = getResumeLesson(learningTracks, [completedRecord], [recentCompletedTopic]);
  const fullyCompletedRecords = arraysTrack.lessons.map((lesson, index) => ({
    currentFrame: index,
    lessonId: lesson.id,
    status: 'completed',
    topicSlug: arraysTrack.slug,
    updatedAt: `2026-04-28T13:0${index}:00.000Z`,
  }));
  const completeProgress = getTrackProgressSnapshot(arraysTrack, fullyCompletedRecords);

  assert.equal(progress.completed, 1);
  assert.equal(progress.percent, 33);
  assert.equal(progress.activeLesson.id, activeRecord.lessonId);
  assert.equal(resumeMatch.lesson.id, activeRecord.lessonId);
  assert.equal(nextAfterCompleted.id, 'container-window-preview');
  assert.equal(recommendedForTrack.id, 'container-window-preview');
  assert.equal(resumeAfterCompleted.lesson.id, 'container-window-preview');
  assert.equal(completeProgress.nextLesson, null);
  assert.equal(getRecommendedLessonForTrack(arraysTrack, fullyCompletedRecords), null);
  assert.equal(topicPayload.completedLessons, 1);
  assert.equal(topicPayload.percent, 33);
});

test('mental model milestones unlock from real lesson progress', () => {
  const freshSnapshot = getMilestoneSnapshot(learningTracks, []);
  const arraysTrack = learningTracks.find((track) => track.slug === 'arrays-two-pointers');
  const firstArraysLesson = arraysTrack.lessons[0];
  const oneLessonProgress = [
    {
      currentFrame: 3,
      lessonId: firstArraysLesson.id,
      status: 'completed',
      topicSlug: arraysTrack.slug,
      updatedAt: '2026-04-28T10:00:00.000Z',
    },
  ];
  const oneLessonSnapshot = getMilestoneSnapshot(learningTracks, oneLessonProgress);
  const oneLessonIds = new Set(oneLessonSnapshot.unlocked.map((milestone) => milestone.id));
  const lessonMilestones = getMilestonesForLesson(learningTracks, oneLessonProgress, {
    lesson: firstArraysLesson,
    track: arraysTrack,
  });
  const fullArraysProgress = arraysTrack.lessons.map((lesson, index) => ({
    currentFrame: index,
    lessonId: lesson.id,
    status: 'completed',
    topicSlug: arraysTrack.slug,
    updatedAt: `2026-04-28T11:0${index}:00.000Z`,
  }));
  const fullArraysSnapshot = getMilestoneSnapshot(learningTracks, fullArraysProgress);
  const fullPlatformProgress = learningTracks.flatMap((track, trackIndex) =>
    track.lessons.map((lesson, lessonIndex) => ({
      currentFrame: lessonIndex,
      lessonId: lesson.id,
      status: 'completed',
      topicSlug: track.slug,
      updatedAt: `2026-04-28T12:${trackIndex}${lessonIndex}:00.000Z`,
    })),
  );
  const fullPlatformSnapshot = getMilestoneSnapshot(learningTracks, fullPlatformProgress);

  assert.equal(freshSnapshot.unlockedCount, 0);
  assert.equal(freshSnapshot.total, milestoneDefinitions.length);
  assert.ok(oneLessonIds.has('first-trace'));
  assert.ok(oneLessonIds.has('pointer-tracker'));
  assert.equal(oneLessonIds.has('memory-mapper'), false);
  assert.ok(lessonMilestones.some((milestone) => milestone.id === 'pointer-tracker'));
  assert.ok(fullArraysSnapshot.unlocked.some((milestone) => milestone.id === 'path-finisher'));
  assert.ok(fullPlatformSnapshot.unlocked.some((milestone) => milestone.id === 'trace-scholar'));
  assert.equal(fullPlatformSnapshot.percent, 100);
});

test('focus mode preference labels and storage are stable', () => {
  const storage = new Map();
  const storageLike = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };

  assert.equal(readStoredFocusMode(storageLike), false);
  writeStoredFocusMode(storageLike, true);
  assert.equal(readStoredFocusMode(storageLike), true);
  writeStoredFocusMode(storageLike, false);
  assert.equal(readStoredFocusMode(storageLike), false);
  assert.equal(getFocusModeToggleLabel(false), 'Focus mode');
  assert.equal(getFocusModeToggleLabel(true), 'Calm mode');
  assert.equal(getFocusModeStatus(false), 'Calm Mode is on');
  assert.equal(getFocusModeStatus(true), 'Focus Mode is on');
});

test('auth routing returns learners to the protected page they requested', () => {
  assert.equal(getAuthReturnPath(null), '/app/dashboard');
  assert.equal(
    getAuthReturnPath({
      pathname: '/app/lesson/pair-sum-trace',
      search: '?step=3',
    }),
    '/app/lesson/pair-sum-trace?step=3',
  );
  assert.equal(
    getAuthReturnPath({
      pathname: '/app/dashboard',
    }),
    '/app/dashboard',
  );
});

test('two-pointer sandbox builds a safe custom Trace Mode lesson', () => {
  const parsedNumbers = parseSandboxNumbers('11, 2, 15, 4');
  const parsedTarget = parseSandboxTarget('13');
  const sandboxTrace = buildTwoPointerSandboxTrace({
    target: parsedTarget.target,
    values: parsedNumbers.values,
  });
  const codeLineIds = new Set(sandboxTrace.code.lines.map((line) => line.id));
  const algorithmStepIds = new Set(sandboxTrace.algorithmSteps.map((step) => step.id));

  assert.equal(parsedNumbers.error, null);
  assert.equal(parsedTarget.error, null);
  assert.deepEqual(sandboxTrace.setup.array, [2, 4, 11, 15]);
  assert.equal(sandboxTrace.setup.target, 13);
  assert.ok(sandboxTrace.summary.includes('sorted into'));
  assert.ok(sandboxTrace.frames.some((frame) => frame.matchedIndices.length === 2));

  for (const frame of sandboxTrace.frames) {
    assert.ok(algorithmStepIds.has(frame.activeStepId), `${frame.id} uses a missing step`);
    assert.ok(frame.variables.length > 0, `${frame.id} needs variables`);

    for (const lineId of frame.activeCodeLineIds) {
      assert.ok(codeLineIds.has(lineId), `${frame.id} uses a missing code line`);
    }
  }

  assert.equal(parseSandboxNumbers('1').error, 'Enter at least two numbers separated by commas.');
  assert.equal(parseSandboxTarget('nope').error, 'Enter a numeric target value.');
});

test('track readiness and trace stats stay aligned with lesson metadata', () => {
  const readinessTotal = learningTracks.reduce(
    (summary, track) => {
      const readiness = getTrackReadiness(track);

      return {
        interactive: summary.interactive + readiness.interactive,
        planned: summary.planned + readiness.planned,
        total: summary.total + readiness.total,
      };
    },
    { interactive: 0, planned: 0, total: 0 },
  );

  assert.deepEqual(readinessTotal, {
    interactive: 15,
    planned: 0,
    total: 15,
  });

  const pairSumStats = getLessonStats({ id: 'pair-sum-trace' });
  const removeDuplicatesStats = getLessonStats({ id: 'remove-duplicates-preview' });
  const anagramStats = getLessonStats({ id: 'anagram-buckets-preview' });
  const firstUniqueStats = getLessonStats({ id: 'first-unique-preview' });
  const dailyTemperaturesStats = getLessonStats({ id: 'daily-temperatures-preview' });
  const levelOrderStats = getLessonStats({ id: 'level-order-preview' });
  const firstTrueStats = getLessonStats({ id: 'first-true-preview' });
  const rotatedSearchStats = getLessonStats({ id: 'search-in-rotated-preview' });
  const dfsStats = getLessonStats({ id: 'dfs-order-preview' });
  const bfsStats = getLessonStats({ id: 'bfs-layers-preview' });
  const pathSumStats = getLessonStats({ id: 'path-sum-preview' });

  assert.equal(pairSumStats.frames, 4);
  assert.ok(pairSumStats.predictions > 0);
  assert.equal(removeDuplicatesStats.frames, 5);
  assert.ok(removeDuplicatesStats.predictions > 0);
  assert.equal(anagramStats.frames, 5);
  assert.ok(anagramStats.predictions > 0);
  assert.equal(firstUniqueStats.frames, 5);
  assert.ok(firstUniqueStats.predictions > 0);
  assert.equal(dailyTemperaturesStats.frames, 5);
  assert.ok(dailyTemperaturesStats.predictions > 0);
  assert.equal(levelOrderStats.frames, 5);
  assert.ok(levelOrderStats.predictions > 0);
  assert.equal(firstTrueStats.frames, 4);
  assert.ok(firstTrueStats.predictions > 0);
  assert.equal(rotatedSearchStats.frames, 4);
  assert.ok(rotatedSearchStats.predictions > 0);
  assert.equal(dfsStats.frames, 4);
  assert.ok(dfsStats.predictions > 0);
  assert.equal(bfsStats.frames, 4);
  assert.ok(bfsStats.predictions > 0);
  assert.equal(pathSumStats.frames, 4);
  assert.ok(pathSumStats.predictions > 0);
});
