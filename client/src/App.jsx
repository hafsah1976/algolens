import { Link } from 'react-router-dom';

import { HeroVisualizer } from './components/HeroVisualizer.jsx';
import { LearningPathsPreview } from './components/LearningPathsPreview.jsx';
import { SiteHeader } from './components/SiteHeader.jsx';
import { learningPaths } from './data/learningPaths.js';

function App() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="orb orb--left" aria-hidden="true" />
      <div className="orb orb--right" aria-hidden="true" />

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-12 pt-6 sm:px-8 lg:px-10">
        <SiteHeader />

        <main className="flex-1">
          <section className="grid gap-12 pb-16 pt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center lg:gap-16 lg:pt-20">
            <div className="max-w-2xl">
              <p className="mb-5 inline-flex items-center rounded-full border border-line/70 bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-muted shadow-[0_12px_40px_rgba(15,23,15,0.06)]">
                Visual DSA Learning
              </p>

              <h1 className="max-w-3xl font-display text-5xl leading-[0.98] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
                AlgoLens
              </h1>

              <p className="mt-4 text-2xl font-medium tracking-[-0.02em] text-accent sm:text-3xl">
                Learn smarter, not longer.
              </p>

              <p className="mt-6 max-w-xl text-lg leading-8 text-muted sm:text-xl">
                AlgoLens helps students understand algorithms through clear visual traces,
                not dense walls of text. The experience stays focused on five core learning paths
                and a calm study flow that encourages one good lesson at a time.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-ink"
                  to="/app/traces"
                >
                  Start Trace Mode demo
                </Link>

                <p className="text-sm leading-6 text-muted">
                  Five complete visual traces with prediction, code sync, mistakes, and recap.
                </p>
              </div>
            </div>

            <HeroVisualizer />
          </section>

          <section
            id="focus-areas"
            className="rounded-[2rem] border border-line/80 bg-surface/80 px-6 py-8 shadow-[0_30px_90px_rgba(20,34,23,0.08)] backdrop-blur-xl sm:px-8 sm:py-10"
          >
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                Focused curriculum
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-[-0.03em] text-ink sm:text-4xl">
                Five learning paths, linked patterns, zero doom-scroll.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                AlgoLens stays intentionally small: enough depth to feel useful in a demo,
                without turning the product into a content maze.
              </p>
            </div>

            <LearningPathsPreview paths={learningPaths} />
          </section>

          <section
            className="grid gap-8 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start"
            id="study-flow"
          >
            <div className="rounded-[2rem] border border-line/80 bg-warm/70 p-6 shadow-[0_24px_60px_rgba(22,33,23,0.06)] sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                Why it feels different
              </p>
              <h2 className="mt-3 font-display text-3xl tracking-[-0.03em] text-ink">
                A study flow designed to end well.
              </h2>
              <p className="mt-4 text-base leading-7 text-muted">
                After a lesson, AlgoLens helps students stop with clarity instead of
                nudging them into another endless feed of "recommended" content. Calm, clear,
                and demo-friendly wins over feature sprawl.
              </p>
            </div>

            <div className="grid gap-4 text-sm text-muted sm:grid-cols-3">
              <div className="rounded-[1.75rem] border border-line/80 bg-surface-strong/90 p-5">
                <p className="font-semibold text-ink">Visual first</p>
                <p className="mt-3 leading-6">
                  Trace Mode shows how arrays, pointers, maps, and stacks change step by step.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-line/80 bg-surface-strong/90 p-5">
                <p className="font-semibold text-ink">Focused scope</p>
                <p className="mt-3 leading-6">
                  Only the highest-value paths are included to keep the contest demo sharp.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-line/80 bg-surface-strong/90 p-5">
                <p className="font-semibold text-ink">Reusable learning engine</p>
                <p className="mt-3 leading-6">
                  The same Trace Mode system powers prediction, code sync, mistakes, and recap.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
