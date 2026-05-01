import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { SectionHeading } from '../components/SectionHeading.jsx';
import { fetchProblems } from '../lib/practiceApi.js';

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

function DifficultyBadge({ difficulty }) {
  return (
    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
      {difficulty}
    </span>
  );
}

function ProblemRow({ problem }) {
  return (
    <Link
      className="block rounded-[1.35rem] border border-line/80 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/90"
      to={`/app/practice/${problem.slug}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={problem.difficulty} />
            {problem.topicTitle ? (
              <span className="rounded-full border border-line/80 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                {problem.topicTitle}
              </span>
            ) : null}
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-ink">{problem.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{problem.statement}</p>
        </div>

        <div className="min-w-[160px] rounded-[1.1rem] border border-line/70 bg-white/70 p-4 text-sm text-muted">
          <p>
            <span className="font-semibold text-ink">{problem.exampleCount}</span> examples
          </p>
          <p className="mt-2">
            <span className="font-semibold text-ink">{problem.publicTestCaseCount}</span> sample tests
          </p>
        </div>
      </div>
    </Link>
  );
}

export function PracticeListPage() {
  const [difficulty, setDifficulty] = useState('all');
  const [problemState, setProblemState] = useState({
    error: null,
    isLoading: true,
    problems: [],
  });

  useEffect(() => {
    let ignore = false;
    const filters = difficulty === 'all' ? {} : { difficulty };

    setProblemState((current) => ({
      ...current,
      error: null,
      isLoading: true,
    }));

    fetchProblems(filters)
      .then((payload) => {
        if (ignore) {
          return;
        }

        setProblemState({
          error: null,
          isLoading: false,
          problems: payload.problems ?? [],
        });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setProblemState({
          error: error.message || 'Could not load practice problems.',
          isLoading: false,
          problems: [],
        });
      });

    return () => {
      ignore = true;
    };
  }, [difficulty]);

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <Link
            className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
            to="/app/topics"
          >
            Review topics
          </Link>
        }
        description="Practice problems run through a secure code checker while private tests stay hidden."
        eyebrow="Practice"
        title="Write code after the concept clicks."
      />

      <section className="app-panel p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Problem set</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Start with small beginner problems that match the seeded learning paths.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {difficulties.map((item) => (
              <button
                className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                  difficulty === item
                    ? 'bg-accent text-white'
                    : 'border border-line/80 bg-white/70 text-muted hover:border-accent/40 hover:text-ink'
                }`}
                key={item}
                onClick={() => setDifficulty(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {problemState.isLoading ? (
        <div className="app-panel p-6">
          <p className="text-sm text-muted">Loading practice problems…</p>
        </div>
      ) : null}

      {problemState.error ? (
        <div className="app-panel p-6">
          <p className="text-sm text-rose-700">{problemState.error}</p>
        </div>
      ) : null}

      {!problemState.isLoading && !problemState.error && !problemState.problems.length ? (
        <div className="app-panel p-6">
          <p className="text-sm text-muted">No published problems match this filter yet.</p>
        </div>
      ) : null}

      <section className="space-y-4">
        {problemState.problems.map((problem) => (
          <ProblemRow key={problem.id} problem={problem} />
        ))}
      </section>
    </div>
  );
}
