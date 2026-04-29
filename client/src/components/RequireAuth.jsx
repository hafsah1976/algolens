import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

export function AuthLoadingScreen() {
  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden px-6 py-8">
      <div className="orb orb--left" aria-hidden="true" />
      <section className="app-panel max-w-md p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">AlgoLens</p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">
          Checking your session.
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          We are making sure your dashboard and saved progress load under the right account.
        </p>
      </section>
    </main>
  );
}

export function RequireAuth({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/auth" />;
  }

  return children;
}
