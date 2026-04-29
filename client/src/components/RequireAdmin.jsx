import { Link, Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { AuthLoadingScreen } from './RequireAuth.jsx';

export function RequireAdmin({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/auth" />;
  }

  if (user?.role !== 'admin') {
    return (
      <main className="relative isolate grid min-h-screen place-items-center overflow-hidden px-6 py-8">
        <div className="orb orb--left" aria-hidden="true" />
        <section className="app-panel max-w-lg p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Admin</p>
          <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">
            Admin access required.
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted">
            This area is for managing AlgoLens curriculum content. Your student account is safe,
            and published lessons are still available from the dashboard.
          </p>
          <Link
            className="mt-6 inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
            to="/app/dashboard"
          >
            Return to dashboard
          </Link>
        </section>
      </main>
    );
  }

  return children;
}
