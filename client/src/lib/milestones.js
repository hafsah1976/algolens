import { getOverallProgressSnapshot, getTrackProgressSnapshot } from './progressSummary.js';

export const milestoneDefinitions = [
  {
    id: 'first-trace',
    title: 'First Walkthrough Closed',
    label: 'Study loop',
    description: 'Complete one visual walkthrough and finish with a recap instead of drifting.',
    requirement: 'Complete any lesson',
    tone: 'Quiet start',
    isUnlocked: ({ overallProgress }) => overallProgress.completed >= 1,
  },
  {
    id: 'pointer-tracker',
    title: 'Pointer Tracker',
    label: 'Arrays',
    description: 'Follow how left, right, read, or write pointers change array state.',
    requirement: 'Complete one Arrays / Two Pointers lesson',
    tone: 'Movement model',
    trackSlug: 'arrays-two-pointers',
    isUnlocked: ({ trackProgressBySlug }) =>
      (trackProgressBySlug['arrays-two-pointers']?.completed ?? 0) >= 1,
  },
  {
    id: 'memory-mapper',
    title: 'Memory Mapper',
    label: 'Hash maps',
    description: 'Use stored context, counts, or complements to make quicker decisions.',
    requirement: 'Complete one Hash Maps lesson',
    tone: 'Lookup model',
    trackSlug: 'hash-maps',
    isUnlocked: ({ trackProgressBySlug }) => (trackProgressBySlug['hash-maps']?.completed ?? 0) >= 1,
  },
  {
    id: 'order-keeper',
    title: 'Order Keeper',
    label: 'Stacks / Queues',
    description: 'Explain which item is handled next and why order matters.',
    requirement: 'Complete one Stacks / Queues lesson',
    tone: 'Order model',
    trackSlug: 'stacks-queues',
    isUnlocked: ({ trackProgressBySlug }) => (trackProgressBySlug['stacks-queues']?.completed ?? 0) >= 1,
  },
  {
    id: 'logarithmic-thinker',
    title: 'Logarithmic Thinker',
    label: 'Binary search',
    description: 'Shrink a search space by reading boundaries instead of guessing.',
    requirement: 'Complete one Binary Search lesson',
    tone: 'Boundary model',
    trackSlug: 'binary-search',
    isUnlocked: ({ trackProgressBySlug }) => (trackProgressBySlug['binary-search']?.completed ?? 0) >= 1,
  },
  {
    id: 'traversal-navigator',
    title: 'Traversal Navigator',
    label: 'Trees',
    description: 'Track visit order through recursion, queues, layers, or branches.',
    requirement: 'Complete one Trees / Traversals lesson',
    tone: 'Visit model',
    trackSlug: 'trees-traversals',
    isUnlocked: ({ trackProgressBySlug }) => (trackProgressBySlug['trees-traversals']?.completed ?? 0) >= 1,
  },
  {
    id: 'path-finisher',
    title: 'Path Finisher',
    label: 'Deep focus',
    description: 'Finish every lesson in one learning path before moving on.',
    requirement: 'Complete any full path',
    tone: 'Path model',
    isUnlocked: ({ trackProgressBySlug }) =>
      Object.values(trackProgressBySlug).some(
        (progress) => progress.total > 0 && progress.completed === progress.total,
      ),
  },
  {
    id: 'trace-scholar',
    title: 'Walkthrough Scholar',
    label: 'Platform',
    description: 'Complete the current AlgoLens walkthrough curriculum end to end.',
    requirement: 'Complete all lessons',
    tone: 'Curriculum model',
    isUnlocked: ({ overallProgress }) =>
      overallProgress.total > 0 && overallProgress.completed === overallProgress.total,
  },
];

export function getMilestoneSnapshot(tracks, lessonProgressRecords) {
  const overallProgress = getOverallProgressSnapshot(tracks, lessonProgressRecords);
  const trackProgressBySlug = Object.fromEntries(
    tracks.map((track) => [track.slug, getTrackProgressSnapshot(track, lessonProgressRecords)]),
  );
  const context = {
    lessonProgressRecords,
    overallProgress,
    trackProgressBySlug,
    tracks,
  };
  const milestones = milestoneDefinitions.map((definition) => ({
    ...definition,
    unlocked: definition.isUnlocked(context),
  }));
  const unlocked = milestones.filter((milestone) => milestone.unlocked);
  const locked = milestones.filter((milestone) => !milestone.unlocked);

  return {
    locked,
    milestones,
    nextMilestone: locked[0] ?? null,
    percent: milestones.length ? Math.round((unlocked.length / milestones.length) * 100) : 0,
    total: milestones.length,
    unlocked,
    unlockedCount: unlocked.length,
  };
}

export function getMilestonesForLesson(tracks, lessonProgressRecords, lessonMatch) {
  const snapshot = getMilestoneSnapshot(tracks, lessonProgressRecords);

  if (!lessonMatch) {
    return [];
  }

  return snapshot.unlocked.filter(
    (milestone) =>
      milestone.id === 'first-trace' ||
      milestone.trackSlug === lessonMatch.track.slug ||
      milestone.id === 'path-finisher' ||
      milestone.id === 'trace-scholar',
  );
}
