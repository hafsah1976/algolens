import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { learningTracks } from '../data/appShellData.js';
import { getCanonicalTopicPath } from '../lib/contentCatalog.js';

const navigationGroups = [
  {
    label: 'Start',
    links: [
      { to: '/app/dashboard', label: 'Dashboard', end: true },
      { to: '/app/topics', label: 'All Topics', end: true },
    ],
  },
  {
    label: 'Paths',
    links: learningTracks.map((track) => ({
      to: getCanonicalTopicPath(track.slug),
      label: track.title,
    })),
  },
  {
    label: 'Tools',
    links: [
      { to: '/app/traces', label: 'Step-by-Step Examples' },
      { to: '/app/sandbox', label: 'Algo-Sandbox' },
      { to: '/app/graphs', label: 'Graph Explorer' },
      { to: '/app/practice', label: 'Coding Practice', end: true },
    ],
  },
  {
    label: 'Review',
    links: [{ to: '/app/completed', label: 'Recap' }],
  },
];

const adminLinks = [
  { to: '/admin/overview', label: 'Content Audit', hint: 'QA' },
  { to: '/admin/topics', label: 'Topics', hint: 'Admin' },
  { to: '/admin/lessons', label: 'Lessons', hint: 'Edit' },
  { to: '/admin/quizzes', label: 'Quizzes', hint: 'Check' },
  { to: '/admin/problems', label: 'Problems', hint: 'Code' },
];

function SidebarLink({ end = false, to, label, hint, onNavigate }) {
  return (
    <NavLink
      end={end}
      className={({ isActive }) =>
        isActive
          ? 'sidebar-link bg-accent text-white shadow-[0_18px_35px_rgba(46,106,74,0.2)]'
          : 'sidebar-link text-muted hover:text-ink'
      }
      onClick={onNavigate}
      to={to}
    >
      <span className="font-medium">{label}</span>
      {hint ? <span className="text-xs uppercase tracking-[0.18em] opacity-75">{hint}</span> : null}
    </NavLink>
  );
}

export function AppSidebar({ onNavigate }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line/70 pb-6">
        <NavLink className="block" onClick={onNavigate} to="/app/dashboard">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">AlgoLens</p>
          <h1 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">Learn visually.</h1>
        </NavLink>
      </div>

      <nav className="mt-6 space-y-6" aria-label="App navigation">
        {navigationGroups.map((group) => (
          <div className="space-y-2" key={group.label}>
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              {group.label}
            </p>
            {group.links.map((link) => (
              <SidebarLink
                end={link.end}
                key={link.to}
                label={link.label}
                onNavigate={onNavigate}
                to={link.to}
              />
            ))}
          </div>
        ))}
      </nav>

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
    </div>
  );
}
