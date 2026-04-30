import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { learningTracks } from '../data/appShellData.js';
import { getCanonicalTopicPath } from '../lib/contentCatalog.js';
import { getFocusModeStatus } from '../lib/focusMode.js';

const primaryLinks = [
  { to: '/app/dashboard', label: 'Dashboard', hint: 'Today' },
  { to: '/app/topics', label: 'Topics', hint: 'Paths' },
  { to: '/app/traces', label: 'Step-by-step examples', hint: 'Visuals' },
  { to: '/app/sandbox', label: 'Algo-Sandbox', hint: 'Lab' },
  { to: '/app/practice', label: 'Practice', hint: 'Code' },
  { to: '/app/completed', label: 'Recap', hint: 'Reflect' },
];

const adminLinks = [
  { to: '/admin/topics', label: 'Topics', hint: 'Admin' },
  { to: '/admin/lessons', label: 'Lessons', hint: 'Edit' },
  { to: '/admin/quizzes', label: 'Quizzes', hint: 'Check' },
  { to: '/admin/problems', label: 'Problems', hint: 'Code' },
];

function SidebarLink({ to, label, hint, onNavigate }) {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? 'sidebar-link bg-accent text-white shadow-[0_18px_35px_rgba(46,106,74,0.2)]'
          : 'sidebar-link'
      }
      onClick={onNavigate}
      to={to}
    >
      <span className="font-medium">{label}</span>
      <span className="text-xs uppercase tracking-[0.18em] opacity-75">{hint}</span>
    </NavLink>
  );
}

export function AppSidebar({ focusMode, onNavigate }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line/70 pb-6">
        <NavLink className="block" onClick={onNavigate} to="/app/dashboard">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">AlgoLens</p>
          <h1 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">Learn visually.</h1>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            A calm workspace for five focused DSA learning paths and growing step-by-step examples.
          </p>
        </NavLink>
      </div>

      <div className="mt-6 space-y-2">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">Workspace</p>
        {primaryLinks.map((link) => (
          <SidebarLink
            key={link.to}
            hint={link.hint}
            label={link.label}
            onNavigate={onNavigate}
            to={link.to}
          />
        ))}
      </div>

      <div className="mt-8 space-y-2">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">Learning paths</p>
        {learningTracks.map((track) => (
          <SidebarLink
            key={track.slug}
            hint={track.navLabel}
            label={track.title}
            onNavigate={onNavigate}
            to={getCanonicalTopicPath(track.slug)}
          />
        ))}
      </div>

      {isAdmin ? (
        <details className="mt-8 rounded-[1.1rem] border border-line/70 bg-white/35 p-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            <span>Admin</span>
            <span className="text-[10px] tracking-[0.18em]">Content</span>
          </summary>
          <div className="mt-3 space-y-2">
            {adminLinks.map((link) => (
              <SidebarLink
                key={link.to}
                hint={link.hint}
                label={link.label}
                onNavigate={onNavigate}
                to={link.to}
              />
            ))}
          </div>
        </details>
      ) : null}

      <div className="mt-auto app-panel-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Study path</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Open a step-by-step example, try one visual lesson, then use a calm recap before moving on.
        </p>
        <p className="mt-4 rounded-full border border-line/70 bg-white/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {getFocusModeStatus(focusMode)}
        </p>
      </div>
    </div>
  );
}
