import { Link } from 'react-router-dom';

import { getCanonicalTopicPath } from '../lib/contentCatalog.js';
import { getLessonMode } from '../lib/lessonMeta.js';

function StepRow({ index, title, note, active }) {
  return (
    <div
      className={`rounded-[1.35rem] border px-4 py-4 transition ${
        active ? 'border-accent/40 bg-accent/8' : 'border-line/80 bg-white/70'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-current/15 text-xs font-semibold text-muted">
          {index}
        </span>
        <p className="text-sm font-semibold text-ink">{title}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{note}</p>
    </div>
  );
}

export function LessonPreviewPanel({ lesson, track }) {
  const mode = getLessonMode(lesson);
  const hasInlineVisualization =
    Boolean(lesson.visualizationType) && !['none', 'trace'].includes(lesson.visualizationType);
  const previewSteps = [
    {
      title: 'Concept is scoped',
      note: `${lesson.title} already has goals, examples, and topic context in the ${track.title} path.`,
    },
    {
      title: hasInlineVisualization ? 'Visual support is ready' : 'Trace data can come next',
      note: hasInlineVisualization
        ? 'This reading lesson includes a small custom visualization to support the core idea.'
        : 'This lesson can grow into full Trace Mode with frames, predictions, code sync, Mistake Lens notes, and a recap.',
    },
    {
      title: 'Use a complete trace now',
      note: 'For the contest demo, use the Trace Library for the lessons that are already fully interactive.',
    },
  ];
  const statusTitle = hasInlineVisualization
    ? 'Reading lesson with visual support.'
    : 'Concept ready, trace planned.';
  const statusBody = hasInlineVisualization
    ? 'This lesson uses a lightweight visual component. Trace Mode remains reserved for complete step-by-step algorithm walkthroughs.'
    : 'This lesson is part of the curriculum map and has a clear teaching goal. It is not presented as complete Trace Mode until its visual frames are authored.';

  return (
    <section className="app-panel overflow-hidden p-6 sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-line/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {track.title}
            </span>
            <span className="rounded-full bg-warm px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {mode.stageLabel}
            </span>
          </div>

          <h3 className="mt-5 font-display text-4xl tracking-[-0.04em] text-ink">{lesson.title}</h3>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{lesson.summary}</p>

          <div className="mt-8 rounded-[1.5rem] border border-line/80 bg-surface-strong/90 p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Visual status</p>
                <h4 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">{statusTitle}</h4>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{statusBody}</p>
              </div>

              <span className="rounded-full border border-line/80 bg-white/80 px-4 py-2 text-sm font-medium text-muted">
                {lesson.duration}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {lesson.goals.map((goal) => (
                <div key={goal} className="rounded-[1rem] border border-line/70 bg-white/70 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Learning goal</p>
                  <p className="mt-2 text-sm leading-6 text-ink">{goal}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
                to="/app/traces"
              >
                Open complete traces
              </Link>
              <Link
                className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
                to={getCanonicalTopicPath(track.slug)}
              >
                Back to topic
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {previewSteps.map((step, index) => (
            <StepRow
              key={step.title}
              active={index === 2}
              index={index + 1}
              note={step.note}
              title={step.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
