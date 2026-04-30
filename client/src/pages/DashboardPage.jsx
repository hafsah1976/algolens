import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { DsaProgressWidget } from '../components/DsaProgressWidget.jsx';
import { MentalModelMilestones } from '../components/MentalModelMilestones.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { dashboardSnapshot, learningTracks } from '../data/appShellData.js';
import { getCanonicalLessonPath, getCanonicalTopicPath } from '../lib/contentCatalog.js';
import { fetchDashboardSummary } from '../lib/dashboardApi.js';
import { getLessonMode, getTrackReadiness } from '../lib/lessonMeta.js';
import { getMilestoneSnapshot } from '../lib/milestones.js';
import { resendVerificationEmail } from '../lib/authApi.js';
import {
  getLessonStageLabel,
  getOverallProgressSnapshot,
  getResumeLesson,
  getTrackProgressSnapshot,
} from '../lib/progressSummary.js';

const topicVisuals = {
  'arrays-two-pointers': {
    icon: '[]',
    summary: 'Master scans, pointer movement, pair finding, and window decisions.',
  },
  'hash-maps': {
    icon: '#',
    summary: 'Practice complements, counts, and direct lookup decisions.',
  },
  'stacks-queues': {
    icon: 'LQ',
    summary: 'See LIFO, FIFO, matching, waiting, and deferred answers.',
  },
  'binary-search': {
    icon: '<>',
    summary: 'Narrow sorted search spaces by reading low, high, and mid.',
  },
  'trees-traversals': {
    icon: 'T',
    summary: 'Follow node visits, recursion order, and queue-backed layers.',
  },
};

const emptyMetrics = {
  averageQuizScore: null,
  codingProblemsAttempted: 0,
  completedLessons: 0,
  completedQuizzes: 0,
};

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

function StitchTopicCard({ progress, track }) {
  const visual = topicVisuals[track.slug] ?? {
    icon: track.navLabel.slice(0, 2).toUpperCase(),
    summary: track.description,
  };
  const progressLabel = `${progress.completed} / ${progress.total} lessons`;
  const nextLesson = progress.activeLesson ?? progress.nextLesson ?? track.lessons[0];
  const nextLessonMode = getLessonMode(nextLesson);
  const readiness = getTrackReadiness(track);
  const cardSpan = track.slug === 'trees-traversals' ? 'lg:col-span-2' : '';
  const pathComplete = progress.total > 0 && progress.completed === progress.total;

  return (
    <Link
      className={`group flex min-h-[13.5rem] flex-col rounded-xl border border-line/80 bg-surface-strong/95 p-5 shadow-[0_4px_36px_rgba(15,23,18,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-[0_12px_44px_rgba(15,23,18,0.08)] ${cardSpan}`}
      to={getCanonicalTopicPath(track.slug)}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold tracking-[-0.03em] text-accent transition group-hover:bg-accent group-hover:text-white">
          {visual.icon}
        </span>
        <h3 className="text-base font-semibold tracking-[-0.02em] text-ink">{track.title}</h3>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-muted">{visual.summary}</p>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          <span>{progressLabel}</span>
          <span>{progress.percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#e0e5df]">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="pt-2 text-xs leading-5 text-muted">
          {pathComplete ? 'Review' : 'Next'}: <span className="font-semibold text-ink">{nextLesson.title}</span>{' '}
          <span className="text-muted">/ {getLessonStageLabel(nextLesson, undefined)}</span>
        </p>
        <p className="text-xs leading-5 text-muted">
          Ready now: <span className="font-semibold text-ink">{readiness.interactive}</span> step-by-step lessons.
          {pathComplete ? ' Path complete.' : ' No previews left.'}
        </p>
      </div>

      <span
        className={`mt-5 inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
          nextLessonMode.isInteractive ? 'bg-accent/10 text-accent' : 'border border-line/80 text-muted'
        }`}
      >
        {nextLessonMode.actionLabel}
      </span>
    </Link>
  );
}

function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-xl border border-line/80 bg-white/70 p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{helper}</p>
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-[1.15rem] border border-dashed border-line/80 bg-white/55 p-4 text-sm leading-6 text-muted">
      {children}
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
            Confirm your email to protect account recovery and unlock any admin access tied to your address.
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
          {state.isSending ? 'Sending...' : 'Send verification email'}
        </button>
      </div>
    </section>
  );
}

function ContinueLearningCard({ recommendedNextLesson }) {
  if (!recommendedNextLesson) {
    return (
      <div className="app-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Continue learning</p>
        <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">No next lesson yet.</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Once published lessons exist, AlgoLens will recommend the first incomplete lesson from the
          learning catalog.
        </p>
        <Link
          className="mt-5 inline-flex rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
          to="/app/topics"
        >
          Browse topics
        </Link>
      </div>
    );
  }

  return (
    <div className="app-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Continue learning</p>
      <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
        {recommendedNextLesson.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        Recommended next from {recommendedNextLesson.topicTitle}. Estimated{' '}
        {recommendedNextLesson.estimatedMinutes ?? 10} minutes.
      </p>
      <Link
        className="mt-5 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
        to={getCanonicalLessonPath(recommendedNextLesson.slug)}
      >
        Open lesson
      </Link>
    </div>
  );
}

function CurrentTopicProgressCard({ progress }) {
  if (!progress) {
    return (
      <div className="app-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Current topic</p>
        <EmptyState>
          Start or complete a lesson and your current topic progress will appear here.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="app-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Current topic</p>
      <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">{progress.title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        {progress.completedLessons} of {progress.totalLessons} lessons complete.
      </p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-warm">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
      </div>
      <Link
        className="mt-5 inline-flex rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
        to={getCanonicalTopicPath(progress.topicSlug)}
      >
        View topic
      </Link>
    </div>
  );
}

function RecentQuizAttempts({ attempts }) {
  return (
    <div className="app-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Recent quiz attempts</p>
      <div className="mt-4 space-y-3">
        {attempts.length ? (
          attempts.map((attempt) => (
            <div
              className="rounded-[1.15rem] border border-line/70 bg-white/65 p-4"
              key={attempt.id}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">{attempt.quizTitle}</p>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {attempt.percent ?? 0}%
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">
                Score {attempt.score} / {attempt.totalQuestions}
              </p>
            </div>
          ))
        ) : (
          <EmptyState>Take a concept quiz and your latest attempts will show up here.</EmptyState>
        )}
      </div>
    </div>
  );
}

function RecentSubmissions({ submissions }) {
  return (
    <div className="app-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Recent submissions</p>
      <div className="mt-4 space-y-3">
        {submissions.length ? (
          submissions.map((submission) => {
            const content = (
              <div className="rounded-[1.15rem] border border-line/70 bg-white/65 p-4 transition hover:border-accent/35">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{submission.problemTitle}</p>
                  <span className="rounded-full border border-line/80 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {submission.status}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted">
                  {submission.language}
                  {submission.totalTests !== null
                    ? ` / ${submission.passed ?? 0} of ${submission.totalTests} tests`
                    : ''}
                </p>
              </div>
            );

            return submission.problemSlug ? (
              <Link key={submission.id} to={`/app/practice/${submission.problemSlug}`}>
                {content}
              </Link>
            ) : (
              <div key={submission.id}>{content}</div>
            );
          })
        ) : (
          <EmptyState>Submit a coding problem and the result will appear here.</EmptyState>
        )}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const {
    isAuthenticated,
    isLoading: authIsLoading,
    refreshCurrentUser,
    token,
    user: authUser,
  } = useAuth();
  const {
    error,
    isLoading,
    lessonProgress,
    storageMode,
    topicProgress,
    user,
  } = useProgress();
  const [dashboardState, setDashboardState] = useState({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    let ignore = false;

    if (authIsLoading) {
      setDashboardState({
        data: null,
        error: null,
        isLoading: true,
      });
      return () => {
        ignore = true;
      };
    }

    if (!isAuthenticated) {
      setDashboardState({
        data: null,
        error: 'Please sign in to load your dashboard.',
        isLoading: false,
      });
      return () => {
        ignore = true;
      };
    }

    setDashboardState({
      data: null,
      error: null,
      isLoading: true,
    });

    fetchDashboardSummary(token)
      .then((payload) => {
        if (ignore) {
          return;
        }

        setDashboardState({
          data: payload,
          error: null,
          isLoading: false,
        });
      })
      .catch((dashboardError) => {
        if (ignore) {
          return;
        }

        setDashboardState({
          data: null,
          error: dashboardError.message || 'Could not load dashboard summary.',
          isLoading: false,
        });
      });

    return () => {
      ignore = true;
    };
  }, [authIsLoading, isAuthenticated, token]);

  const dashboard = dashboardState.data?.dashboard;
  const metrics = dashboard?.metrics ?? emptyMetrics;
  const overallProgress = getOverallProgressSnapshot(learningTracks, lessonProgress);
  const milestoneSnapshot = getMilestoneSnapshot(learningTracks, lessonProgress);
  const resumeMatch = getResumeLesson(learningTracks, lessonProgress, topicProgress) ?? {
    lesson: learningTracks[0].lessons[0],
    track: learningTracks[0],
  };
  const { lesson: resumeLesson } = resumeMatch;
  const learnerName = user?.name ?? dashboardSnapshot.learnerName;
  const statusMessage = isLoading
    ? 'Loading saved progress…'
    : storageMode === 'mongo'
      ? 'Your progress is saved to your account.'
      : 'Your progress is saved locally until account storage reconnects.';
  const dashboardStatus = dashboardState.isLoading
    ? 'Loading dashboard activity…'
    : dashboardState.error;

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-8">
      <section className="rounded-xl border border-line/80 bg-surface-strong/95 p-6 shadow-[0_4px_40px_rgba(15,23,18,0.035)] sm:p-7">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl tracking-[-0.04em] text-ink">
              Today's study session
            </h1>
            <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
              {learnerName}, this is your saved DSA progress, recommended next lesson,
              recent quiz work, and coding practice activity in one focused place.
            </p>
          </div>

          <div className="flex w-full items-center gap-5 rounded-lg border border-line/80 bg-white/70 p-5 md:w-auto md:min-w-[270px]">
            <ProgressRing percent={overallProgress.percent} />
            <div>
              <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">
                {overallProgress.completed} / {overallProgress.total}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Lessons complete
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-line/70 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <p className={`text-sm leading-6 ${error ? 'text-rose-700' : 'text-muted'}`}>
            {error ?? statusMessage}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
              to="/app/traces"
            >
              Open step-by-step examples
            </Link>
            <Link
              className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
              to="/app/sandbox"
            >
              Run a walkthrough
            </Link>
            <Link
              className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
              to={getCanonicalLessonPath(resumeLesson.id)}
            >
              Resume {resumeLesson.title}
            </Link>
          </div>
        </div>
      </section>

      {dashboardStatus ? (
        <div
          className={`app-panel-soft p-4 text-sm leading-6 ${
            dashboardState.error ? 'border-amber-400/35 bg-amber-50/60 text-amber-800' : 'text-muted'
          }`}
        >
          {dashboardStatus}
        </div>
      ) : null}

      {authUser?.requiresEmailVerification ? (
        <EmailVerificationNotice onRefreshUser={refreshCurrentUser} token={token} />
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          helper="Saved whenever you finish a lesson."
          label="Completed lessons"
          value={metrics.completedLessons}
        />
        <MetricCard
          helper="Unique quizzes completed under this account."
          label="Completed quizzes"
          value={metrics.completedQuizzes}
        />
        <MetricCard
          helper="Average across submitted quiz attempts."
          label="Average quiz score"
          value={metrics.averageQuizScore === null ? 'No data' : `${metrics.averageQuizScore}%`}
        />
        <MetricCard
          helper="Unique coding problems with at least one submission."
          label="Problems attempted"
          value={metrics.codingProblemsAttempted}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ContinueLearningCard recommendedNextLesson={dashboard?.recommendedNextLesson ?? null} />
        <CurrentTopicProgressCard progress={dashboard?.currentTopicProgress ?? null} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <RecentQuizAttempts attempts={dashboard?.recentQuizAttempts ?? []} />
        <RecentSubmissions submissions={dashboard?.recentSubmissions ?? []} />
      </section>

      <MentalModelMilestones snapshot={milestoneSnapshot} />

      <DsaProgressWidget />

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl tracking-[-0.04em] text-ink">Core Learning Paths</h2>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            {learningTracks.length} modules
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {learningTracks.map((track) => (
            <StitchTopicCard
              key={track.slug}
              progress={getTrackProgressSnapshot(track, lessonProgress)}
              track={track}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
