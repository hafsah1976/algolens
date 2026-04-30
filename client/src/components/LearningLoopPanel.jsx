import { Link } from 'react-router-dom';

import { getCanonicalLessonPath } from '../lib/contentCatalog.js';

const loopSteps = [
  {
    label: 'Understand',
    body: 'Read the plain-language primer before opening a lesson.',
    status: 'Start here',
  },
  {
    label: 'Walk through',
    body: 'Run one step-by-step example and watch the state change.',
    status: 'Core step',
  },
  {
    label: 'Check',
    body: 'Use the concept quiz to catch misunderstandings early.',
    status: 'After lesson',
  },
  {
    label: 'Practice',
    body: 'Try one small coding problem only after the idea feels clear.',
    status: 'When ready',
  },
  {
    label: 'Recap',
    body: 'Pause with one takeaway before choosing another lesson.',
    status: 'Close calmly',
  },
];

export function LearningLoopPanel({ actionLabel, launchLesson, progress, track }) {
  const lessonPath = launchLesson ? getCanonicalLessonPath(launchLesson.id) : '/app/traces';

  return (
    <div className="app-panel p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Learning loop</p>
          <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink">
            One clear path through {track.navLabel}.
          </h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tracking-[-0.04em] text-ink">{progress.percent}%</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
            {progress.completed}/{progress.total}
          </p>
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-warm">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
      </div>

      <ol className="mt-5 space-y-3">
        {loopSteps.map((step, index) => (
          <li className="rounded-[1.1rem] border border-line/70 bg-white/65 p-4" key={step.label}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                {index + 1}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{step.label}</p>
                  <span className="rounded-full border border-line/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {step.status}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">{step.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Link
        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink"
        to={lessonPath}
      >
        {actionLabel}
      </Link>
    </div>
  );
}
