import { findTraceLessonById } from '../data/traceLessons.js';

const previewStageLabel = 'Concept Preview';

// Keep lesson readiness in one place so topic cards, dashboard cards, and lesson pages
// do not drift into different labels for the same lesson.
export function getLessonMode(lesson) {
  const traceLesson = findTraceLessonById(lesson.id);

  if (traceLesson) {
    return {
      actionLabel: 'Run walkthrough',
      description: 'Interactive step-by-step lesson with frame-by-frame state changes.',
      isInteractive: true,
      stageLabel: 'Step by step mode',
      traceLesson,
    };
  }

  return {
    actionLabel: 'Preview concept',
    description: 'Mapped lesson concept. Step-by-step frames still need to be authored.',
    isInteractive: false,
    stageLabel: lesson.stage ?? previewStageLabel,
    traceLesson: null,
  };
}

export function getLessonStats(lesson) {
  const { traceLesson } = getLessonMode(lesson);

  if (!traceLesson) {
    return {
      codeLines: 0,
      frames: 0,
      mistakes: 0,
      predictions: 0,
    };
  }

  return {
    codeLines: traceLesson.code?.lines?.length ?? 0,
    frames: traceLesson.frames.length,
    mistakes: traceLesson.frames.filter((frame) => frame.mistake).length,
    predictions: traceLesson.frames.filter((frame) => frame.prediction).length,
  };
}

export function getTrackReadiness(track) {
  const interactive = track.lessons.filter((lesson) => getLessonMode(lesson).isInteractive).length;
  const total = track.lessons.length;

  return {
    interactive,
    planned: total - interactive,
    total,
  };
}
