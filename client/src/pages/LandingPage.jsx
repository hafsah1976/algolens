import { Link } from 'react-router-dom';

import { learningTracks } from '../data/appShellData.js';
import { getCanonicalLessonPath, getCanonicalTopicPath } from '../lib/contentCatalog.js';

const traceSteps = [
  'Read the current values.',
  'Predict the next move.',
  'Watch state change.',
  'Stop with a recap.',
];

const landingStats = [
  { value: '5', label: 'Core paths' },
  { value: '15', label: 'Walkthroughs' },
  { value: '20', label: 'Seeded lessons' },
];

const studyLoopSteps = [
  {
    title: 'Choose one path',
    detail: 'Start with a focused DSA pattern instead of a noisy course catalog.',
  },
  {
    title: 'Build the mental model',
    detail: 'Read beginner-friendly explanations that name what is changing and why.',
  },
  {
    title: 'Walk through the algorithm',
    detail: 'Move forward and backward through pointers, variables, stacks, queues, or nodes.',
  },
  {
    title: 'Save progress and stop',
    detail: 'Finish with a recap so the session ends with one clear concept, not another feed.',
  },
];

const previewCells = [
  { index: 0, label: 'left', value: 2, tone: 'primary' },
  { index: 1, value: 4 },
  { index: 2, value: 7 },
  { index: 3, label: 'right', value: 11, tone: 'ink' },
  { index: 4, value: 15 },
];

const pathIcons = {
  'arrays-two-pointers': '[]',
  'hash-maps': '#',
  'stacks-queues': 'LQ',
  'binary-search': '<>',
  'trees-traversals': 'T',
};

function LandingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link className="text-xl font-bold tracking-[-0.04em] text-ink" to="/">
          AlgoLens
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <a className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-warm/60 hover:text-ink" href="#trace-mode">
            Step by step mode
          </a>
          <a className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-warm/60 hover:text-ink" href="#study-loop">
            Study loop
          </a>
          <a className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-warm/60 hover:text-ink" href="#paths">
            Paths
          </a>
          <Link className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-warm/60 hover:text-ink" to="/support">
            Support
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="hidden rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent/40 sm:inline-flex"
            to="/auth"
          >
            Sign in
          </Link>
          <Link
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
            to="/app/traces"
          >
            Open step-by-step examples
          </Link>
        </div>
      </div>
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-line/70 bg-white/70 px-5 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>AlgoLens helps learners build algorithm understanding one step at a time.</p>
        <nav className="flex flex-wrap gap-4">
          <Link className="font-medium transition hover:text-accent" to="/privacy">
            Privacy
          </Link>
          <Link className="font-medium transition hover:text-accent" to="/terms">
            Terms
          </Link>
          <Link className="font-medium transition hover:text-accent" to="/support">
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}

function TraceHeroVisual() {
  return (
    <div className="relative w-full" id="trace-mode">
      <div className="absolute inset-8 -z-10 rounded-[2rem] bg-accent/15 blur-3xl" />

      <section
        aria-label="Step by step mode preview"
        className="landing-lens rounded-[1.75rem] border border-line/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(20,34,23,0.1)] backdrop-blur-xl sm:p-6"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Step by step mode</p>
            <p className="mt-1 text-sm font-semibold text-ink">Pair Sum / Live frame</p>
          </div>
          <div className="flex gap-2">
            <span className="h-8 w-8 rounded-xl border border-line/80 bg-warm/50" />
            <span className="h-8 w-8 rounded-xl bg-accent" />
            <span className="h-8 w-8 rounded-xl border border-line/80 bg-warm/50" />
          </div>
        </div>

        <div className="py-8">
          <div className="flex flex-wrap justify-center gap-3">
            {previewCells.map((cell) => {
              const isPrimary = cell.tone === 'primary';
              const isInk = cell.tone === 'ink';
              const cellClass = isPrimary
                ? 'border-accent bg-accent/10 text-accent'
                : isInk
                  ? 'border-ink bg-ink/5 text-ink'
                  : 'border-line/80 bg-white text-ink';

              return (
                <div className="relative pb-6 pt-8" key={cell.index}>
                  {cell.label ? (
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted shadow-sm">
                      {cell.label}
                    </span>
                  ) : null}
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-semibold ${cellClass}`}>
                    {cell.value}
                  </div>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                    {cell.index}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-line/80 bg-warm/45 p-4">
            <pre className="overflow-x-auto font-mono text-[13px] leading-6 text-muted">
              <code>{`sum = nums[left] + nums[right]
if sum == target: return pair
if sum > target: right -= 1`}</code>
            </pre>
          </div>
        </div>

        <div className="grid gap-3 border-t border-line/70 pt-4 sm:grid-cols-4">
          {traceSteps.map((step, index) => (
            <div
              className={`rounded-2xl px-3 py-3 text-sm leading-5 ${
                index === 1 ? 'bg-accent text-white' : 'border border-line/70 bg-white/70 text-muted'
              }`}
              key={step}
            >
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] opacity-75">
                {index + 1}
              </span>
              <span className="mt-1 block font-semibold">{step}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PathCard({ track }) {
  return (
    <Link
      className="group rounded-2xl border border-line/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(20,34,23,0.04)] transition duration-200 hover:-translate-y-1 hover:border-accent/45 hover:bg-white"
      to={getCanonicalTopicPath(track.slug)}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent transition group-hover:bg-accent group-hover:text-white">
          {pathIcons[track.slug]}
        </span>
        <h3 className="text-base font-semibold tracking-[-0.02em] text-ink">{track.title}</h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">{track.description}</p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {track.visualFocus}
      </p>
    </Link>
  );
}

function StudyLoopSection() {
  return (
    <section className="border-y border-line/70 bg-white/55 py-16" id="study-loop">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
        <div className="max-w-xl reveal-up">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">A calmer study loop</p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-ink sm:text-5xl">
            Learn one idea well, then leave with it.
          </h2>
          <p className="mt-5 text-base leading-7 text-muted">
            AlgoLens is intentionally anti-doom-scroll. Each session is designed to move from
            concept, to walkthrough, to saved progress, to a clear stopping point.
          </p>
        </div>

        <div className="reveal-up reveal-up-delay-1 overflow-hidden rounded-[1.5rem] border border-line/80 bg-surface-strong/90">
          {studyLoopSteps.map((step, index) => (
            <div
              className="grid gap-4 border-b border-line/70 p-5 last:border-b-0 sm:grid-cols-[5rem_1fr]"
              key={step.title}
            >
              <span className="font-display text-4xl tracking-[-0.06em] text-accent">
                0{index + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.03em] text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-ink">
      <LandingNav />

      <main>
        <section className="relative overflow-hidden px-5 py-16 sm:px-8 lg:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-white/80 to-transparent" />
          <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-center">
            <div className="max-w-2xl reveal-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-white/80 px-4 py-2 shadow-[0_8px_30px_rgba(20,34,23,0.04)]">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Visual DSA learning platform
                </span>
              </div>

              <p className="mt-7 font-display text-6xl leading-[0.9] tracking-[-0.07em] text-ink sm:text-7xl lg:text-8xl">
                AlgoLens
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-ink sm:text-5xl lg:text-6xl">
                Learn smarter, not longer.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
                A calm learning workspace where beginners watch algorithms change state one
                step at a time, then save progress under their own account.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  className="inline-flex justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(46,106,74,0.18)] transition hover:bg-ink"
                  to={`${getCanonicalLessonPath('pair-sum-trace')}?fresh=1`}
                >
                  Run a walkthrough
                </Link>
                <Link
                  className="inline-flex justify-center rounded-full border border-line/80 bg-white/75 px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent/45"
                  to="/auth"
                >
                  Create account
                </Link>
              </div>

              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line/70 pt-6">
                {landingStats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-2xl font-semibold tracking-[-0.04em] text-ink">{stat.value}</dt>
                    <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="reveal-up reveal-up-delay-1">
              <TraceHeroVisual />
            </div>
          </div>
        </section>

        <StudyLoopSection />

        <section className="py-16" id="paths">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center reveal-up">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Structured paths</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                A focused curriculum for the patterns students actually need first.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                Each path uses clear visual explanations, beginner vocabulary, and one calm study loop
                instead of endless scrolling.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {learningTracks.map((track) => (
                <PathCard key={track.slug} track={track} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
