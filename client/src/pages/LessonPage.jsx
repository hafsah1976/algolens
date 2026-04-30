import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { LessonPreviewPanel } from '../components/LessonPreviewPanel.jsx';
import { QuizLinksPanel } from '../components/QuizLinksPanel.jsx';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { TraceModePlayer } from '../components/TraceModePlayer.jsx';
import { VisualizationRenderer } from '../components/visualizations/VisualizationRenderer.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { findTraceLessonById } from '../data/traceLessons.js';
import { fetchLesson, fetchTopicLessons } from '../lib/contentApi.js';
import {
  buildApiLessonMatch,
  buildLessonContentSections,
  getCanonicalTopicPath,
  getStaticLessonMatch,
} from '../lib/contentCatalog.js';
import { buildTraceStepSearch, getInitialTraceFrameIndex } from '../lib/traceNavigation.js';

export function LessonPage() {
  const navigate = useNavigate();
  const { lessonId, lessonSlug } = useParams();
  const currentLessonSlug = lessonId ?? lessonSlug;
  const [searchParams, setSearchParams] = useSearchParams();
  const { error, isSaving, lessonProgressById, storageMode, syncLessonProgress } = useProgress();
  const staticMatch = getStaticLessonMatch(currentLessonSlug);
  const [apiLessonState, setApiLessonState] = useState({
    error: null,
    isLoading: !staticMatch,
    match: null,
  });

  useEffect(() => {
    let ignore = false;

    if (staticMatch) {
      setApiLessonState({
        error: null,
        isLoading: false,
        match: null,
      });

      return () => {
        ignore = true;
      };
    }

    setApiLessonState({
      error: null,
      isLoading: true,
      match: null,
    });

    fetchLesson(currentLessonSlug)
      .then(async (payload) => {
        const apiLesson = payload.lesson;
        const topicLessonsPayload = apiLesson?.topicSlug
          ? await fetchTopicLessons(apiLesson.topicSlug)
          : { lessons: apiLesson ? [apiLesson] : [] };

        if (ignore) {
          return;
        }

        setApiLessonState({
          error: null,
          isLoading: false,
          match: buildApiLessonMatch(apiLesson, topicLessonsPayload.lessons ?? []),
        });
      })
      .catch((apiError) => {
        if (ignore) {
          return;
        }

        setApiLessonState({
          error: apiError.message || 'Could not load this lesson.',
          isLoading: false,
          match: null,
        });
      });

    return () => {
      ignore = true;
    };
  }, [currentLessonSlug]);

  const match = staticMatch ?? apiLessonState.match;

  if (!match) {
    return (
      <div className="app-panel p-6">
        <p className="text-sm text-muted">
          {apiLessonState.isLoading
            ? 'Loading lesson…'
            : apiLessonState.error ?? 'This lesson could not be found.'}
        </p>
      </div>
    );
  }

  const { lesson, track } = match;
  const traceLesson = findTraceLessonById(currentLessonSlug);
  const savedLessonProgress = lessonProgressById[currentLessonSlug];
  const startFresh = searchParams.get('fresh') === '1';
  const initialFrameIndex = traceLesson
    ? getInitialTraceFrameIndex({
        savedFrame: savedLessonProgress?.currentFrame ?? 0,
        startFresh,
        stepParam: searchParams.get('step'),
        totalFrames: traceLesson.frames.length,
      })
    : 0;

  function getTraceStepUrl(frameIndex) {
    const nextSearch = buildTraceStepSearch(searchParams, frameIndex);
    const nextPath = `/app/lessons/${lesson.id}?${nextSearch.toString()}`;

    if (typeof window === 'undefined') {
      return nextPath;
    }

    return `${window.location.origin}${nextPath}`;
  }

  async function handleTraceFrameChange(nextFrameIndex) {
    const nextStatus = savedLessonProgress?.status === 'completed' ? 'completed' : 'in-progress';

    setSearchParams(buildTraceStepSearch(searchParams, nextFrameIndex), { replace: true });

    try {
      await syncLessonProgress({
        currentFrame: nextFrameIndex,
        lessonId: lesson.id,
        status: nextStatus,
        track,
      });
    } catch (_error) {
      // The shared progress context keeps the visible error message.
    }
  }

  async function handleTraceComplete(currentFrame) {
    try {
      await syncLessonProgress({
        currentFrame,
        lessonId: lesson.id,
        status: 'completed',
        track,
      });

      navigate('/app/completed', {
        state: {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          trackSlug: track.slug,
          trackTitle: track.title,
        },
      });
    } catch (_error) {
      // The shared progress context keeps the visible error message.
    }
  }

  async function handleMarkComplete() {
    try {
      await syncLessonProgress({
        currentFrame: traceLesson?.frames?.length ? traceLesson.frames.length - 1 : 0,
        lessonId: lesson.id,
        status: 'completed',
        track,
      });

      navigate('/app/completed', {
        state: {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          trackSlug: track.slug,
          trackTitle: track.title,
        },
      });
    } catch (_error) {
      // The shared progress context keeps the visible error message.
    }
  }

  if (traceLesson) {
    return (
      <TraceModePlayer
        initialFrameIndex={initialFrameIndex}
        isSaving={isSaving}
        lesson={lesson}
        onComplete={handleTraceComplete}
        onFrameChange={handleTraceFrameChange}
        getShareUrl={getTraceStepUrl}
        saveError={error}
        savedStatus={savedLessonProgress?.status ?? 'not-started'}
        storageMode={storageMode}
        traceLesson={traceLesson}
        track={track}
      />
    );
  }

  const contentSections = buildLessonContentSections(lesson, track);

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <>
            <Link
              className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
              to={getCanonicalTopicPath(track.slug)}
            >
              Back to {track.navLabel}
            </Link>
            <button
              className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
              disabled={isSaving}
              onClick={handleMarkComplete}
              type="button"
            >
              {isSaving ? 'Saving…' : 'Mark complete'}
            </button>
          </>
        }
        description="Read the lesson notes, connect the idea to the topic path, then mark it complete when the concept feels clear."
        eyebrow="Lesson"
        title={lesson.title}
      />

      <LessonPreviewPanel lesson={lesson} track={track} />

      <VisualizationRenderer visualizationType={lesson.visualizationType} />

      {error ? (
        <div className="app-panel-soft border-rose-300/50 bg-rose-50/70 p-4 text-sm leading-6 text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Lesson content</p>
          <div className="mt-4 grid gap-3">
            {contentSections.map((section) => (
              <div key={section.title} className="app-panel-soft p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  {section.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-ink">{section.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">Learning goals</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
            {lesson.goals.map((goal) => (
              <li key={goal} className="app-panel-soft p-4 text-ink">
                {goal}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <QuizLinksPanel topicId={track.id} topicTitle={track.title} />

          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Linked concepts</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(track.concepts ?? []).map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-line/80 bg-white/75 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted"
                >
                  {concept}
                </span>
              ))}
            </div>
            {track.concepts?.length ? null : (
              <p className="mt-4 text-sm leading-6 text-muted">
                This seeded lesson is linked to the {track.title} topic. More concept tags can be
                added as the curriculum deepens.
              </p>
            )}

            <div className="mt-6 app-panel-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">What comes next</p>
              <p className="mt-3 text-sm leading-6 text-ink">
                Use the quiz to check the concept, then return to step by step mode when the pattern needs a visual walkthrough.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
