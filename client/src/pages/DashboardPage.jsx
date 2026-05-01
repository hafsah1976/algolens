import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { learningTracks } from '../data/appShellData.js';
import { resendVerificationEmail } from '../lib/authApi.js';
import { getCanonicalLessonPath, getCanonicalTopicPath } from '../lib/contentCatalog.js';
import {
  getOverallProgressSnapshot,
  getResumeLesson,
  getTrackProgressSnapshot,
} from '../lib/progressSummary.js';

function ProgressRing({ percent }) {
  const safePercent = Math.max(0, Math.min(100, percent));

  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
        <path
          className="text-[#e0e5df]"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="text-accent transition-[stroke-dasharray] duration-500"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${safePercent}, 100`}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span className="absolute text-[11px] font-semibold tracking-[-0.03em] text-ink">
        {safePercent}%
      </span>
    </div>
  );
}

function EmailVerificationNotice({ onRefreshUser, token }) {
  const [state, setState] = useState({
    error: null,
    isSending: false,
    message: null,
  });

  async function handleResendVerification() {
    setState({ error: null, isSending: true, message: null });

    try {
      const payload = await resendVerificationEmail(token);
      await onRefreshUser?.();
      setState({
        error: null,
        isSending: false,
        message: payload.message || 'Verification email sent. Check your inbox.',
      });
    } catch (error) {
      setState({
        error: error.message || 'Could not send a verification email.',
        isSending: false,
        message: null,
      });
    }
  }

  return (
    <section className="rounded-xl border border-amber-300/50 bg-amber-50/80 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">Verify email</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            Confirm your email so password recovery works for this account.
          </p>
          {state.message ? <p className="mt-2 text-sm font-medium text-accent">{state.message}</p> : null}
          {state.error ? <p className="mt-2 text-sm font-medium text-rose-700">{state.error}</p> : null}
        </div>
        <button
          className="w-full rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted lg:w-auto"
          disabled={state.isSending}
          onClick={handleResendVerification}
          type="button"
        >
          {state.isSending ? 'Sending…' : 'Send Verification Email'}
        </button>
      </div>
    </section>
  );
}

function PathProgressDrawer({ lessonProgress }) {
  return (
    <details className="rounded-xl border border-line/80 bg-surface-strong/95 p-5">
      <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
        Show Progress By Path
      </summary>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {learningTracks.map((track) => {
          const progress = getTrackProgressSnapshot(track, lessonProgress);
          const nextLesson = progress.activeLesson ?? progress.nextLesson ?? track.lessons[0];

          return (
            <Link
              className="rounded-[1.1rem] border border-line/70 bg-white/65 p-4 transition hover:border-accent/35 hover:bg-white/85"
              key={track.slug}
              to={getCanonicalTopicPath(track.slug)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{track.title}</p>
                  <p className="mt-2 text-xs leading-5 text-muted">Next: {nextLesson.title}</p>
                </div>
                <p className="text-sm font-semibold text-ink">{progress.percent}%</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-warm">
                <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </details>
  );
}

function NextStepCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Link
        className="rounded-xl border border-line/80 bg-white/70 p-5 transition hover:border-accent/40 hover:bg-white/90"
        to="/app/topics"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Learn</p>
        <h2 className="mt-3 text-lg font-semibold text-ink">Choose A Path</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Use this when you want the full lesson order.</p>
      </Link>
      <Link
        className="rounded-xl border border-line/80 bg-white/70 p-5 transition hover:border-accent/40 hover:bg-white/90"
        to="/app/traces"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Watch</p>
        <h2 className="mt-3 text-lg font-semibold text-ink">Open Examples</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Use this when you want a visual walkthrough first.</p>
      </Link>
      <Link
        className="rounded-xl border border-line/80 bg-white/70 p-5 transition hover:border-accent/40 hover:bg-white/90"
        to="/app/practice"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Practice</p>
        <h2 className="mt-3 text-lg font-semibold text-ink">Try Code</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Use this after the idea starts to feel clear.</p>
      </Link>
    </section>
  );
}

export function DashboardPage() {
  const {
    refreshCurrentUser,
    token,
    user: authUser,
  } = useAuth();
  const {
    error,
    isLoading,
    lessonProgress,
    topicProgress,
  } = useProgress();

  const overallProgress = getOverallProgressSnapshot(learningTracks, lessonProgress);
  const resumeMatch = getResumeLesson(learningTracks, lessonProgress, topicProgress) ?? {
    lesson: learningTracks[0].lessons[0],
    track: learningTracks[0],
  };
  const { lesson: resumeLesson, track: resumeTrack } = resumeMatch;
  return (
    <div className="mx-auto w-full max-w-[980px] space-y-6">
      <section className="rounded-xl border border-line/80 bg-surface-strong/95 p-6 shadow-[0_4px_40px_rgba(15,23,18,0.035)] sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_230px] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Today</p>
            <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">
              Start with one lesson.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Your next step is in {resumeTrack.title}. Finish one walkthrough, then stop or choose
              what to review next.
            </p>
            {error || isLoading ? (
              <p className={`mt-4 text-sm leading-6 ${error ? 'text-rose-700' : 'text-muted'}`}>
                {error ?? 'Loading your progress…'}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
                to={getCanonicalLessonPath(resumeLesson.id)}
              >
                Open {resumeLesson.title}
              </Link>
              <Link
                className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-5 py-3 text-sm font-medium text-ink transition hover:border-accent/40"
                to={getCanonicalTopicPath(resumeTrack.slug)}
              >
                View This Path
              </Link>
            </div>
          </div>

          <div className="rounded-[1.25rem] border border-line/80 bg-white/70 p-5">
            <div className="flex items-center gap-4">
              <ProgressRing percent={overallProgress.percent} />
              <div>
                <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">
                  {overallProgress.completed} / {overallProgress.total}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Lessons Complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {authUser?.requiresEmailVerification ? (
        <EmailVerificationNotice onRefreshUser={refreshCurrentUser} token={token} />
      ) : null}

      <NextStepCards />

      <PathProgressDrawer lessonProgress={lessonProgress} />
    </div>
  );
}
