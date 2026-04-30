import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { GuidedCardDeck } from '../components/GuidedCardDeck.jsx';
import { LearningLoopPanel } from '../components/LearningLoopPanel.jsx';
import { QuizLinksPanel } from '../components/QuizLinksPanel.jsx';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { fetchTopic, fetchTopicLessons } from '../lib/contentApi.js';
import {
  getCanonicalLessonPath,
  getStaticTopic,
  mergeApiTopicDetail,
} from '../lib/contentCatalog.js';
import { getLessonMode, getTrackReadiness } from '../lib/lessonMeta.js';
import { getLessonStageLabel, getTrackProgressSnapshot } from '../lib/progressSummary.js';

function LessonRow({ lesson, stageLabel }) {
  const mode = getLessonMode(lesson);
  const readinessCopy = mode.isInteractive
    ? 'Includes a guided visual walkthrough.'
    : 'Start with the concept first; a guided walkthrough can be added later.';

  return (
    <div className="rounded-2xl border border-line/70 bg-white/70 p-4 transition hover:border-accent/35 hover:bg-white/90 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                mode.isInteractive
                  ? 'bg-accent/10 text-accent'
                  : 'border border-line/80 bg-white/80 text-muted'
              }`}
            >
              {stageLabel}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {lesson.duration}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-ink">{lesson.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted">{lesson.summary}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            {readinessCopy}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          {mode.isInteractive ? (
            <Link
              className="inline-flex items-center rounded-full border border-line/80 bg-white/80 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
              to={`${getCanonicalLessonPath(lesson.id)}?fresh=1`}
            >
              Start fresh
            </Link>
          ) : null}
          <Link
            className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
            to={getCanonicalLessonPath(lesson.id)}
          >
            {mode.actionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

function buildTopicGuideCards(track) {
  const primer = track.conceptPrimer;
  const firstExample = track.miniExamples?.[0];

  if (!primer) {
    return [];
  }

  return [
    {
      body: primer.intro,
      label: 'Start',
      title: 'What is the main idea?',
    },
    {
      body: primer.pictureIt,
      label: 'Picture it',
      title: 'What should I imagine?',
    },
    {
      body: primer.whyItHelps,
      label: 'Why it helps',
      title: 'Why does this pattern save work?',
    },
    {
      body: primer.commonMistake,
      label: 'Common miss',
      title: 'What should I avoid?',
    },
    primer.tinyExample
      ? {
          body: primer.tinyExample.story,
          label: 'Tiny example',
          takeaway: primer.tinyExample.takeaway,
          title: primer.tinyExample.prompt,
        }
      : null,
    firstExample
      ? {
          body: firstExample.scenario,
          label: firstExample.pattern,
          takeaway: `Look for: ${firstExample.lookFor}`,
          title: firstExample.title,
        }
      : null,
  ].filter(Boolean);
}

export function TopicPage() {
  const { slug, topicSlug } = useParams();
  const currentSlug = slug ?? topicSlug;
  const { lessonProgress, lessonProgressById } = useProgress();
  const staticTrack = useMemo(() => getStaticTopic(currentSlug), [currentSlug]);
  const [catalogState, setCatalogState] = useState({
    error: null,
    isLoading: true,
    topic: staticTrack,
  });

  useEffect(() => {
    let ignore = false;

    setCatalogState({
      error: null,
      isLoading: true,
      topic: staticTrack,
    });

    Promise.all([fetchTopic(currentSlug), fetchTopicLessons(currentSlug)])
      .then(([topicPayload, lessonsPayload]) => {
        if (ignore) {
          return;
        }

        setCatalogState({
          error: null,
          isLoading: false,
          topic: mergeApiTopicDetail(
            staticTrack,
            topicPayload.topic,
            lessonsPayload.lessons ?? [],
          ),
        });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setCatalogState({
          error: error.message || 'Could not load the published topic.',
          isLoading: false,
          topic: staticTrack,
        });
      });

    return () => {
      ignore = true;
    };
  }, [currentSlug, staticTrack]);

  const track = catalogState.topic;

  if (!track) {
    return (
      <div className="app-panel p-6">
        <p className="text-sm text-muted">This learning path could not be found.</p>
      </div>
    );
  }

  if (!track.lessons?.length) {
    return (
      <div className="space-y-4">
        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Topic path</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">{track.title}</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            This topic exists, but it does not have published lessons yet.
          </p>
        </div>
        {catalogState.error ? (
          <div className="app-panel-soft border-amber-400/35 bg-amber-50/60 p-4 text-sm leading-6 text-amber-800">
            {catalogState.error}
          </div>
        ) : null}
      </div>
    );
  }

  const progress = getTrackProgressSnapshot(track, lessonProgress);
  const launchLesson = progress.activeLesson ?? progress.nextLesson ?? track.lessons[0];
  const readiness = getTrackReadiness(track);
  const pathComplete = progress.total > 0 && progress.completed === progress.total;
  const concepts = track.concepts ?? [];
  const guideCards = buildTopicGuideCards(track);
  const launchActionLabel = pathComplete
    ? 'Review this path'
    : progress.activeLesson
      ? 'Continue where you left off'
      : 'Start here';

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <Link
            className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
            to={getCanonicalLessonPath(launchLesson.id)}
          >
            {launchActionLabel}
          </Link>
        }
        description={track.trackGoal}
        eyebrow="Topic path"
        title={track.title}
      />

      <section className="rounded-xl border border-accent/20 bg-accent/8 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">How to use this page</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink">
              This is a learning path, not a feed. Start with the highlighted lesson, finish one idea,
              then decide whether to stop or continue.
            </p>
          </div>
          <Link
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink lg:w-auto"
            to={getCanonicalLessonPath(launchLesson.id)}
          >
            {launchActionLabel}
          </Link>
        </div>
      </section>

      {catalogState.isLoading ? (
        <div className="app-panel-soft p-4 text-sm leading-6 text-muted">
          Checking the published topic catalog…
        </div>
      ) : null}

      {catalogState.error ? (
        <div className="app-panel-soft border-amber-400/35 bg-amber-50/60 p-4 text-sm leading-6 text-amber-800">
          {catalogState.error} Showing the reviewed in-app version of this topic.
        </div>
      ) : null}

      {guideCards.length ? (
        <GuidedCardDeck
          cards={guideCards}
          description={`Move through ${track.title} one card at a time. When the cards make sense, open the first lesson.`}
          eyebrow="Before the lesson"
          title="Learn the idea in small steps"
        />
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="app-panel p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Lesson sequence</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-ink">
                Learn one pattern at a time.
              </h2>
            </div>
            <p className="text-sm leading-6 text-muted">
              {readiness.interactive} guided lessons ready
            </p>
          </div>
          <div className="mt-5 space-y-3">
            {track.lessons.map((lesson) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                stageLabel={getLessonStageLabel(lesson, lessonProgressById[lesson.id])}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <LearningLoopPanel
            actionLabel={launchActionLabel}
            launchLesson={launchLesson}
            progress={progress}
            track={track}
          />

          <QuizLinksPanel topicId={track.id} topicTitle={track.title} />

          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Linked concepts</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-line/80 bg-white/75 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted"
                >
                  {concept}
                </span>
              ))}
            </div>

            <div className="mt-6 app-panel-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Visual focus</p>
              <p className="mt-3 text-sm leading-6 text-ink">{track.visualFocus}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
