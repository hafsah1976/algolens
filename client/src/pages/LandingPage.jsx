import { Link } from 'react-router-dom';

import { learningTracks } from '../data/appShellData.js';
import { getCanonicalLessonPath, getCanonicalTopicPath } from '../lib/contentCatalog.js';

const traceSteps = [
  'Read the current values.',
  'Predict the next move.',
  'Watch state change.',
  'Stop with a recap.',
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
            Trace Mode
          </a>
          <a className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-warm/60 hover:text-ink" href="#paths">
            Paths
          </a>
          <a className="rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:bg-warm/60 hover:text-ink" href="#submission">
            Demo
          </a>
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
            Open app
          </Link>
        </div>
      </div>
    </header>
  );
}

function TraceHeroVisual() {
  return (
    <div className="relative w-full" id="trace-mode">
      <div className="absolute inset-8 -z-10 rounded-[2rem] bg-accent/15 blur-3xl" />

      <section className="landing-lens rounded-[1.75rem] border border-line/80 bg-white/90 p-5 shadow-[0_24px_80px_rgba(20,34,23,0.1)] backdrop-blur-xl sm:p-6">
        <div className="flex items-center justify-between gap-4 border-b border-line/70 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Trace Mode</p>
            <p className="mt-1 text-sm font-semibold text-ink">Pair Sum / Step 2</p>
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

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-ink">
      <LandingNav />

      <main>
        <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-center lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-white/80 px-4 py-2 shadow-[0_8px_30px_rgba(20,34,23,0.04)]">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Introducing Trace Mode
              </span>
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-ink sm:text-6xl lg:text-7xl">
              Learn smarter, not longer.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
              AlgoLens helps beginners understand data structures and algorithms by watching
              variables, pointers, and memory change one step at a time, then challenging
              themselves before each move.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                className="inline-flex justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(46,106,74,0.18)] transition hover:bg-ink"
            to={`${getCanonicalLessonPath('pair-sum-trace')}?fresh=1`}
              >
                Start a trace
              </Link>
              <Link
                className="inline-flex justify-center rounded-full border border-line/80 bg-white/75 px-6 py-3 text-sm font-semibold text-ink transition hover:border-accent/45"
                to="/app/dashboard"
              >
                View dashboard
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line/70 pt-6">
              <div>
                <dt className="text-2xl font-semibold tracking-[-0.04em] text-ink">5</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Paths</dd>
              </div>
              <div>
                <dt className="text-2xl font-semibold tracking-[-0.04em] text-ink">15</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Live traces</dd>
              </div>
              <div>
                <dt className="text-2xl font-semibold tracking-[-0.04em] text-ink">15</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Lessons</dd>
              </div>
            </dl>
          </div>

          <TraceHeroVisual />
        </section>

        <section className="border-y border-line/70 bg-white/55 py-16" id="paths">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Structured paths</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                A focused curriculum for the patterns students actually need first.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                The app stays intentionally small: clear visual explanations, beginner vocabulary,
                and one calm study loop instead of endless scrolling.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {learningTracks.map((track) => (
                <PathCard key={track.slug} track={track} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,0.45fr)] lg:items-center" id="submission">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Contest demo ready</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
              A working product with a clear signature feature.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Auth, MongoDB progress, dashboard navigation, Trace Mode lessons, and completion
              recaps are already wired. The next depth step is polishing the guided learner flow.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-line/80 bg-ink p-6 text-white shadow-[0_24px_70px_rgba(20,34,23,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Best demo path</p>
            <ol className="mt-5 space-y-3 text-sm leading-6 text-white/75">
              <li>1. Sign in or use demo progress.</li>
              <li>2. Open a topic path.</li>
              <li>3. Complete a Trace Mode lesson.</li>
              <li>4. Show the saved recap.</li>
            </ol>
            <Link
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-accent hover:text-white"
              to="/app/traces"
            >
              Browse Trace Library
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
