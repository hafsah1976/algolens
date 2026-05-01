import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { getFocusModeStatus, getFocusModeToggleLabel } from '../lib/focusMode.js';

export function AppTopbar({ focusMode, onOpenMenu, onToggleFocusMode }) {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isDashboard = location.pathname === '/app/dashboard';

  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-line/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation menu"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-line/80 bg-white/70 px-4 text-sm font-medium text-ink lg:hidden"
          onClick={onOpenMenu}
          type="button"
        >
          Menu
        </button>

        <Link className="text-sm font-semibold text-ink lg:hidden" to="/app/dashboard">
          AlgoLens
        </Link>
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
        {isAuthenticated ? (
          <>
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
        {!isDashboard && isAuthenticated ? (
          <Link
            className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
            to="/app/dashboard"
          >
            Dashboard
          </Link>
        ) : null}
      </div>
    </div>
  );
}
