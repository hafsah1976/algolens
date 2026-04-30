import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { SectionHeading } from '../components/SectionHeading.jsx';
import { TopicCard } from '../components/TopicCard.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { fetchTopicLessons, fetchTopics } from '../lib/contentApi.js';
import {
  getCanonicalLessonPath,
  getCanonicalTopicPath,
  getStaticTopics,
  mergeApiTopicsWithStatic,
} from '../lib/contentCatalog.js';
import { getLessonStageLabel, getTrackProgressSnapshot } from '../lib/progressSummary.js';

const initialCatalogState = {
  error: null,
  isLoading: true,
  source: 'static',
  topics: getStaticTopics(),
};

function CatalogStatus({ error, isLoading, source }) {
  if (isLoading) {
    return (
      <div className="app-panel-soft p-4 text-sm leading-6 text-muted">
        Loading the published topic catalog…
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-panel-soft border-amber-400/35 bg-amber-50/60 p-4 text-sm leading-6 text-amber-800">
        {error} The student view is using the in-app curriculum fallback so the demo remains browseable.
      </div>
    );
  }

  if (source === 'static') {
    return (
      <div className="app-panel-soft p-4 text-sm leading-6 text-muted">
        No published topic updates are available yet, so this page is showing the reviewed in-app curriculum.
      </div>
    );
  }

  return (
    <div className="app-panel-soft p-4 text-sm leading-6 text-muted">
      Published topics are ready.
    </div>
  );
}

export function TopicsListPage() {
  const { lessonProgress } = useProgress();
  const [catalogState, setCatalogState] = useState(initialCatalogState);

  useEffect(() => {
    let ignore = false;

    fetchTopics()
      .then(async (payload) => {
        if (ignore) {
          return;
        }

        const apiTopics = payload.topics ?? [];
        const topicsWithLessons = await Promise.all(
          apiTopics.map(async (topic) => {
            const lessonPayload = await fetchTopicLessons(topic.slug);

            return {
              ...topic,
              lessons: lessonPayload.lessons ?? [],
            };
          }),
        );

        if (ignore) {
          return;
        }

        setCatalogState({
          error: null,
          isLoading: false,
          source: apiTopics.length ? 'api' : 'static',
          topics: mergeApiTopicsWithStatic(topicsWithLessons),
        });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setCatalogState({
          error: error.message || 'Could not refresh the published topic catalog.',
          isLoading: false,
          source: 'static',
          topics: getStaticTopics(),
        });
      });

    return () => {
      ignore = true;
    };
  }, []);

  const visibleTopics = catalogState.topics.filter((topic) => topic.lessons?.length);
  const totalLessons = visibleTopics.reduce((sum, topic) => sum + topic.lessons.length, 0);
  const completedLessons = visibleTopics.reduce(
    (sum, topic) => sum + getTrackProgressSnapshot(topic, lessonProgress).completed,
    0,
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <Link
            className="inline-flex items-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink"
            to="/app/traces"
          >
            Open step-by-step examples
          </Link>
        }
        description="Browse the five core DSA paths, see your saved progress, and choose the next beginner-friendly visual lesson."
        eyebrow="Topics"
        title="Pick one path, then go deep."
      />

      <CatalogStatus
        error={catalogState.error}
        isLoading={catalogState.isLoading}
        source={catalogState.source}
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Student hub</p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
            Five paths, one calm curriculum.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            AlgoLens groups lessons by concepts and patterns, then lets step by step mode show how the
            data changes one step at a time.
          </p>
        </div>

        <div className="app-panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Your DSA progress</p>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink">
            {completedLessons} / {totalLessons}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">Complete lessons across the current topic catalog.</p>
        </div>
      </section>

      {visibleTopics.length ? (
        <section className="space-y-4">
          {visibleTopics.map((topic) => {
            const progress = getTrackProgressSnapshot(topic, lessonProgress);
            const nextLesson = progress.activeLesson ?? progress.nextLesson ?? topic.lessons[0];

            return (
              <TopicCard
                key={topic.slug}
                nextLesson={nextLesson}
                nextLessonPath={getCanonicalLessonPath(nextLesson.id)}
                nextLessonStageLabel={getLessonStageLabel(nextLesson, undefined)}
                progress={progress}
                topicPath={getCanonicalTopicPath(topic.slug)}
                track={topic}
              />
            );
          })}
        </section>
      ) : (
        <section className="app-panel p-6">
          <p className="text-sm leading-6 text-muted">
            No published topics are available yet. Keep using the seeded AlgoLens curriculum while
            the platform is being prepared.
          </p>
        </section>
      )}
    </div>
  );
}
