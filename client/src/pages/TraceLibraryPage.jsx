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

function TraceLibraryCard({ item, lessonProgress }) {
  const { difficulty, lesson, traceLesson, track } = item;
  const stats = getLessonStats(lesson);
  const statusLabel = getLessonStageLabel(lesson, lessonProgress);

  return (
    <article className="app-panel p-5 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-line/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {track.navLabel}
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {statusLabel}
            </span>
            <span className="rounded-full border border-line/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {difficulty}
            </span>
          </div>

          <h3 className="mt-4 font-display text-3xl tracking-[-0.04em] text-ink">{traceLesson.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{traceLesson.summary}</p>
        </div>

        <div className="grid min-w-[220px] grid-cols-2 gap-3 text-sm">
          <div className="rounded-[1.1rem] border border-line/70 bg-white/70 px-4 py-3">
            <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">{stats.frames}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Frames</p>
          </div>
          <div className="rounded-[1.1rem] border border-line/70 bg-white/70 px-4 py-3">
            <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">{lesson.duration}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Time</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Pattern focus</p>
          <p className="mt-3 text-sm leading-6 text-ink">{track.patterns.join(' / ')}</p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Visual skill</p>
          <p className="mt-3 text-sm leading-6 text-ink">{track.visualFocus}</p>
        </div>

        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Trace depth</p>
          <div className="mt-3 space-y-2 text-sm leading-6 text-ink">
            <p>{stats.predictions} prediction checkpoints</p>
            <p>{stats.mistakes} mistake lenses</p>
            <p>{stats.codeLines} synced code lines</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
          to={getCanonicalLessonPath(lesson.id)}
        >
          Open trace
        </Link>
        <Link
          className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
          to={getCanonicalTopicPath(track.slug)}
        >
          View topic
        </Link>
      </div>
    </article>
  );
}

export function TraceLibraryPage() {
  const { lessonProgressById } = useProgress();
  const traceItems = getTraceLessonItems();
  const totalFrames = traceItems.reduce((sum, item) => sum + item.traceLesson.frames.length, 0);
  const totalPredictions = traceItems.reduce(
    (sum, item) => sum + item.traceLesson.frames.filter((frame) => frame.prediction).length,
    0,
  );
  const totalMistakes = traceItems.reduce(
    (sum, item) => sum + item.traceLesson.frames.filter((frame) => frame.mistake).length,
    0,
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <Link
            className="inline-flex items-center whitespace-nowrap rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink"
            to={`${getCanonicalLessonPath('container-window-preview')}?fresh=1`}
          >
            Start featured trace
          </Link>
        }
        description="A focused showcase of every interactive Trace Mode lesson: what it teaches, how long it takes, and which beginner supports are included."
        eyebrow="Trace library"
        title="The visual lesson shelf"
      />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Signature feature</p>
          <h3 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
            Choose a trace by the pattern you want to understand.
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
            Each lesson shows the algorithm state frame by frame, then adds predictions, synced
            pseudocode, mistake callouts, Challenge Mode, and shareable step links when they help.
          </p>
        </div>

        <div className="app-panel p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Library snapshot</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-[1rem] bg-white/75 px-3 py-4 text-center">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">{traceItems.length}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Traces</p>
            </div>
            <div className="rounded-[1rem] bg-white/75 px-3 py-4 text-center">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">{totalFrames}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Frames</p>
            </div>
            <div className="rounded-[1rem] bg-white/75 px-3 py-4 text-center">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">{totalPredictions}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Predict</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            Includes {totalMistakes} Mistake Lens callouts plus synchronized pseudocode for every trace.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">All Trace Mode lessons</p>
          <h3 className="mt-2 font-display text-3xl tracking-[-0.04em] text-ink">Pick the algorithm state you want to see.</h3>
        </div>

        <div className="space-y-4">
          {traceItems.map((item) => (
            <TraceLibraryCard
              item={item}
              key={item.lesson.id}
              lessonProgress={lessonProgressById[item.lesson.id]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
