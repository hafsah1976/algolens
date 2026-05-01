import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AppSidebar } from '../components/AppSidebar.jsx';
import { AppTopbar } from '../components/AppTopbar.jsx';
import { LearnerAnalytics } from '../components/LearnerAnalytics.jsx';
import { LearnerGuide } from '../components/LearnerGuide.jsx';
import { readStoredFocusMode, writeStoredFocusMode } from '../lib/focusMode.js';

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(() =>
    typeof window === 'undefined' ? false : readStoredFocusMode(window.localStorage),
  );

  useEffect(() => {
    document.documentElement.dataset.theme = focusMode ? 'focus' : 'calm';
    writeStoredFocusMode(window.localStorage, focusMode);

    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [focusMode]);

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="orb orb--left" aria-hidden="true" />
      <div className="orb orb--right" aria-hidden="true" />

      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="hidden border-r border-line/70 px-6 py-6 lg:block">
          <AppSidebar />
        </aside>

        <main
          aria-label="AlgoLens learning workspace"
          className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
          id="main-content"
          tabIndex={-1}
        >
          <AppTopbar
            focusMode={focusMode}
            onOpenMenu={() => setMenuOpen(true)}
            onToggleFocusMode={() => setFocusMode((current) => !current)}
          />
          <LearnerAnalytics />
          <LearnerGuide />
          <Outlet />
        </main>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm lg:hidden">
          <div
            aria-label="Mobile navigation"
            className="h-full max-w-[320px] border-r border-line/70 bg-surface-strong px-5 py-5 shadow-[0_30px_80px_rgba(21,32,25,0.18)]"
            role="dialog"
          >
            <div className="mb-5 flex items-center justify-end">
              <button
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-line/80 bg-white/70 px-4 text-sm font-medium text-ink"
                onClick={() => setMenuOpen(false)}
                type="button"
              >
                Close
              </button>
            </div>

            <AppSidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
