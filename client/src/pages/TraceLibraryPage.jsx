import { Link } from 'react-router-dom';

import { SectionHeading } from '../components/SectionHeading.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { learningTracks } from '../data/appShellData.js';
import { findTraceLessonById } from '../data/traceLessons.js';
import { getCanonicalLessonPath, getCanonicalTopicPath } from '../lib/contentCatalog.js';
import { getLessonStats } from '../lib/lessonMeta.js';
import { getLessonStageLabel } from '../lib/progressSummary.js';

const difficultyByLessonId = {
  'pair-sum-trace': 'Beginner',
  'container-window-preview': 'Beginner+',
  'binary-search-basics-preview': 'Beginner',
  'two-sum-map-preview': 'Beginner+',
  'valid-parentheses-preview': 'Beginner',
};

function getTraceLessonItems() {
  return learningTracks.flatMap((track) =>
    track.lessons
      .map((lesson) => {
        const traceLesson = findTraceLessonById(lesson.id);

        if (!traceLesson) {
          return null;
        }

        return {
          difficulty: difficultyByLessonId[lesson.id] ?? 'Beginner',
          lesson,
          traceLesson,
          track,
        };
      })
      .filter(Boolean),
  );
}

function TracePathGroup({ group, lessonProgressById }) {
  const { items, track } = group;

  return (
    <article className="app-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{track.navLabel}</p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">{track.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{track.trackGoal}</p>
        </div>
        <Link
          className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent/40"
          to={getCanonicalTopicPath(track.slug)}
        >
          Open path
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {items.map(({ difficulty, lesson, traceLesson }) => {
          const lessonStats = getLessonStats(lesson);
          const statusLabel = getLessonStageLabel(lesson, lessonProgressById[lesson.id]);

          return (
            <Link
              className="group block rounded-3xl border border-line/80 bg-white/75 p-4 transition hover:border-accent/40 hover:bg-white"
              key={lesson.id}
              to={getCanonicalLessonPath(lesson.id)}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent">
                      {statusLabel}
                    </span>
                    <span className="rounded-full border border-line/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">
                      {difficulty}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-ink transition group-hover:text-accent">
                    {traceLesson.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{traceLesson.summary}</p>
                </div>

                <div className="shrink-0 rounded-2xl border border-line/70 bg-cream px-4 py-3 text-sm text-ink">
                  <p className="font-semibold">{lesson.duration}</p>
                  <p className="mt-1 text-xs text-muted">{lessonStats.frames} frames</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </article>
  );
}

export function TraceLibraryPage() {
  const { lessonProgressById } = useProgress();
  const traceItems = getTraceLessonItems();
  const traceGroups = learningTracks
    .map((track) => ({
      items: traceItems.filter((item) => item.track.slug === track.slug),
      track,
    }))
    .filter((group) => group.items.length);
  const totalFrames = traceItems.reduce((sum, item) => sum + item.traceLesson.frames.length, 0);
  const featuredLesson = traceItems[0]?.lesson;

  return (
    <div className="space-y-8">
      <SectionHeading
        actions={
          featuredLesson ? (
            <Link
              className="inline-flex items-center whitespace-nowrap rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink"
              to={getCanonicalLessonPath(featuredLesson.id)}
            >
              Start first walkthrough
            </Link>
          ) : null
        }
        description="Choose a topic first, then open one visual walkthrough. The library is grouped so you do not have to scan every lesson at once."
        eyebrow="Step-by-step examples"
        title="Pick a walkthrough by path."
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">How to use this shelf</p>
          <h3 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
            Start with the path you are studying.
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Each row opens a guided visual walkthrough. Use this page when you already know the topic
            you want to practice and just need the matching example.
          </p>
        </div>

        <div className="app-panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Library size</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[1rem] bg-white/75 px-3 py-4 text-center">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">{traceItems.length}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Examples</p>
            </div>
            <div className="rounded-[1rem] bg-white/75 px-3 py-4 text-center">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">{totalFrames}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Frames</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {traceGroups.map((group) => (
          <TracePathGroup
            group={group}
            key={group.track.slug}
            lessonProgressById={lessonProgressById}
          />
        ))}
      </section>
    </div>
  );
}
