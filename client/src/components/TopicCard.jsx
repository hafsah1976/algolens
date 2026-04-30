import { Link } from 'react-router-dom';

import { getCanonicalLessonPath, getCanonicalTopicPath, getTopicDifficulty } from '../lib/contentCatalog.js';

export function TopicCard({
  nextLesson,
  nextLessonPath,
  nextLessonStageLabel,
  progress,
  topicPath,
  track,
}) {
  const progressLabel = `${progress.completed} of ${progress.total} lessons complete`;
  const topicHref = topicPath ?? getCanonicalTopicPath(track.slug);
  const lessonHref = nextLessonPath ?? getCanonicalLessonPath(nextLesson.id);

  return (
    <article className="app-panel p-5 sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-line/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {track.navLabel}
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {progressLabel}
            </span>
            <span className="rounded-full border border-line/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {getTopicDifficulty(track)}
            </span>
          </div>

          <h3 className="mt-4 font-display text-3xl tracking-[-0.04em] text-ink">{track.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted sm:text-base">{track.description}</p>
        </div>

        <div className="min-w-[180px]">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-ink">{progress.percent}%</p>
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-warm">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Linked patterns</p>
          <p className="mt-3 text-sm leading-6 text-ink">{track.patterns.join(' / ')}</p>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Visual focus</p>
          <p className="mt-3 text-sm leading-6 text-ink">{track.visualFocus}</p>
        </div>

        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Best next lesson</p>
          <p className="mt-3 text-base font-semibold text-ink">{nextLesson.title}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{nextLesson.duration} / {nextLessonStageLabel}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
          to={topicHref}
        >
          Open topic
        </Link>
        <Link
          className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
          to={lessonHref}
        >
          Preview lesson
        </Link>
      </div>
    </article>
  );
}
