import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { getFocusModeStatus, getFocusModeToggleLabel } from '../lib/focusMode.js';

const titleMap = [
  { match: '/admin/topics', title: 'Admin topics', detail: 'Create, edit, publish, and unpublish DSA paths.' },
  { match: '/admin/lessons', title: 'Admin lessons', detail: 'Manage beginner lessons and visualization hooks.' },
  { match: '/admin/quizzes', title: 'Admin quizzes', detail: 'Create server-graded concept checks.' },
  { match: '/admin/problems', title: 'Admin problems', detail: 'Create coding practice prompts and tests.' },
  { match: '/app/dashboard', title: 'Dashboard', detail: 'Start with one clear lesson.' },
  { match: '/app/topics/', title: 'Topic path', detail: 'Follow linked concepts, not isolated facts.' },
  { match: '/app/topics', title: 'Topics', detail: 'Choose a DSA path and inspect your progress.' },
  { match: '/app/traces', title: 'Step-by-step examples', detail: 'Browse visual algorithm walkthroughs.' },
  { match: '/app/sandbox', title: 'Algo-Sandbox', detail: 'Test a pattern with your own input.' },
  { match: '/app/practice/', title: 'Practice problem', detail: 'Write code after the concept clicks.' },
  { match: '/app/practice', title: 'Coding practice', detail: 'Browse beginner DSA problems.' },
  { match: '/app/completed', title: 'Lesson recap', detail: 'Close the loop with one clear takeaway.' },
  { match: '/app/quizzes/', title: 'Concept quiz', detail: 'Check understanding before coding practice.' },
  { match: '/app/topic/', title: 'Topic path', detail: 'Follow linked concepts, not isolated facts.' },
  { match: '/app/lessons/', title: 'Step-by-step lesson', detail: 'Walk through the algorithm and save your place.' },
  { match: '/app/lesson/', title: 'Step-by-step lesson', detail: 'Walk through the algorithm and save your place.' },
];

const fallbackHeading = {
  title: 'AlgoLens',
  detail: 'Choose a focused path, run a walkthrough, or continue your saved progress.',
};

function getHeading(pathname) {
  return titleMap.find((item) => pathname.startsWith(item.match)) ?? fallbackHeading;
}

export function AppTopbar({ focusMode, onOpenMenu, onToggleFocusMode }) {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const heading = getHeading(location.pathname);
  const isLessonPage =
    location.pathname.startsWith('/app/lesson/') || location.pathname.startsWith('/app/lessons/');

  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-line/80 bg-white/70 px-4 text-sm font-medium text-ink lg:hidden"
          onClick={onOpenMenu}
          type="button"
        >
          Menu
        </button>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">AlgoLens</p>
          <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">{heading.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{heading.detail}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          aria-pressed={focusMode}
          className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
          onClick={onToggleFocusMode}
          title={getFocusModeStatus(focusMode)}
          type="button"
        >
          {getFocusModeToggleLabel(focusMode)}
        </button>
        {isAuthenticated && !isLessonPage ? (
          <>
            <span className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink">
              {user.name}
            </span>
            <button
              className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
              onClick={logout}
              type="button"
            >
              Sign out
            </button>
          </>
        ) : !isAuthenticated ? (
          <Link
            className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
            to="/auth"
          >
            Sign in
          </Link>
        ) : null}
        <Link
          className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
          to="/app/dashboard"
        >
          {isLessonPage ? 'Dashboard' : 'Resume dashboard'}
        </Link>
        {isLessonPage && isAuthenticated ? (
          <button
            className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
            onClick={logout}
            type="button"
          >
            Sign out
          </button>
        ) : (
          <Link
            className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
            to="/app/traces"
          >
            Open step-by-step examples
          </Link>
        )}
      </div>
    </div>
  );
}
