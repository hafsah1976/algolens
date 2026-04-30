import { Link, useLocation } from 'react-router-dom';

import { CompletionConcept } from '../components/CompletionConcept.jsx';
import {
  EarnedMilestoneStrip,
  MentalModelMilestones,
} from '../components/MentalModelMilestones.jsx';
import { SectionHeading } from '../components/SectionHeading.jsx';
import { PrintStudySheetButton, TraceStudySheet } from '../components/TraceStudySheet.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import { findLessonById, learningTracks } from '../data/appShellData.js';
import { findTraceLessonById } from '../data/traceLessons.js';
import { getCanonicalLessonPath } from '../lib/contentCatalog.js';
import { getMilestoneSnapshot, getMilestonesForLesson } from '../lib/milestones.js';
import {
  getNextLessonAfter,
  getRecommendedLessonForTrack,
  getTrackProgressSnapshot,
} from '../lib/progressSummary.js';

function RecapItem({ body, label }) {
  return (
    <div className="app-panel-soft p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink">{body}</p>
    </div>
  );
}

function getNextTraceRecommendation(completionMatch, lessonProgress) {
  const nextInPath = getNextLessonAfter(
    completionMatch.track,
    completionMatch.lesson.id,
    lessonProgress,
  );

  if (nextInPath) {
    return {
      helper: `Continue the ${completionMatch.track.title} path when you are ready.`,
      label: 'Next in this path',
      lesson: nextInPath,
      track: completionMatch.track,
    };
  }

  const currentTrackIndex = learningTracks.findIndex((track) => track.slug === completionMatch.track.slug);
  const laterTracks = learningTracks.slice(currentTrackIndex + 1);
  const earlierTracks = learningTracks.slice(0, Math.max(0, currentTrackIndex));
  const orderedTracks = [...laterTracks, ...earlierTracks];

  for (const track of orderedTracks) {
    const recommendedLesson = getRecommendedLessonForTrack(track, lessonProgress);

    if (recommendedLesson) {
      return {
        helper: `${completionMatch.track.title} is complete. ${track.title} still has a good next lesson.`,
        label: `Next path: ${track.title}`,
        lesson: recommendedLesson,
        track,
      };
    }
  }

  return null;
}

function TraceRecapScreen({
  completionMatch,
  earnedMilestones,
  milestoneSnapshot,
  nextTrace,
  storageMode,
  traceLesson,
  trackProgress,
}) {
  const firstFrame = traceLesson.frames[0];
  const lastFrame = traceLesson.frames.at(-1);
  const recap = traceLesson.completionRecap;

  return (
    <div className="space-y-6">
      <section className="app-panel overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Walkthrough recap</p>
            <h3 className="mt-3 max-w-3xl font-display text-4xl tracking-[-0.04em] text-ink sm:text-5xl">
              {recap.pattern}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{recap.changed}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <RecapItem body={recap.learned} label="You practiced" />
              <RecapItem body={recap.remember} label="Key rule" />
              <RecapItem body={recap.next} label="Look for this next" />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line/80 bg-ink p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Session close</p>
            <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{completionMatch.lesson.title}</p>
            <p className="mt-4 text-sm leading-7 text-white/70">{recap.stop}</p>
            <div className="mt-6 rounded-[1.15rem] bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">Progress saved</p>
              <p className="mt-2 text-sm leading-6 text-white/80">
                {storageMode === 'mongo' ? 'Saved to your account.' : 'Saved on this device for the demo.'}
              </p>
            </div>
            <div className="mt-4">
              <EarnedMilestoneStrip milestones={earnedMilestones} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">What changed during the walkthrough</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="app-panel-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Started</p>
              <p className="mt-2 text-sm font-semibold text-ink">{firstFrame.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{firstFrame.status}</p>
            </div>
            <div className="app-panel-soft p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Ended</p>
              <p className="mt-2 text-sm font-semibold text-ink">{lastFrame.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{lastFrame.status}</p>
            </div>
          </div>

          <div className="mt-5 app-panel-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Pattern in plain words</p>
            <p className="mt-3 text-sm leading-7 text-ink">{traceLesson.summary}</p>
          </div>
        </div>

        <div className="app-panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Recommended next step</p>
          <h3 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">Stop here, then continue intentionally.</h3>
          <p className="mt-3 text-sm leading-7 text-muted">
            AlgoLens does not need an endless feed. If you are done, stop here.
            If you want one more lesson, choose the next unfinished one instead of wandering.
          </p>
          {nextTrace ? (
            <div className="mt-5 rounded-[1.15rem] border border-line/80 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {nextTrace.label}
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">{nextTrace.lesson.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{nextTrace.helper}</p>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.15rem] border border-accent/25 bg-accent/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Platform complete</p>
              <p className="mt-2 text-sm leading-6 text-ink">
                Every lesson in the current saved progress state is complete. Use the library for review.
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
              to="/app/traces"
            >
              Back to step-by-step examples
            </Link>
            {nextTrace ? (
              <Link
                className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
                to={getCanonicalLessonPath(nextTrace.lesson.id)}
              >
                Continue: {nextTrace.lesson.title}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="app-panel p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Saved progress</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <RecapItem body={completionMatch.lesson.title} label="Lesson" />
          <RecapItem
            body={`${trackProgress.completed} of ${trackProgress.total} lessons complete`}
            label="Topic progress"
          />
          <RecapItem
            body={storageMode === 'mongo' ? 'Your account' : 'This device'}
            label="Saved in"
          />
        </div>
      </section>

      <TraceStudySheet
        lesson={completionMatch.lesson}
        traceLesson={traceLesson}
        track={completionMatch.track}
      />

      <MentalModelMilestones snapshot={milestoneSnapshot} variant="completion" />
    </div>
  );
}

export function CompletionPage() {
  const location = useLocation();
  const { lessonProgress, storageMode } = useProgress();
  const completionMatch = location.state?.lessonId ? findLessonById(location.state.lessonId) : null;
  const traceLesson = location.state?.lessonId ? findTraceLessonById(location.state.lessonId) : null;
  const trackProgress = completionMatch
    ? getTrackProgressSnapshot(completionMatch.track, lessonProgress)
    : null;
  const milestoneSnapshot = getMilestoneSnapshot(learningTracks, lessonProgress);
  const earnedMilestones = getMilestonesForLesson(learningTracks, lessonProgress, completionMatch);
  const completionDescription = completionMatch
    ? `You completed ${completionMatch.lesson.title}, saved the result, and updated the ${completionMatch.track.title} progress path.`
    : 'When a lesson is complete, use this page to name one takeaway and decide your next step.';
  const nextTrace = completionMatch ? getNextTraceRecommendation(completionMatch, lessonProgress) : null;

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <>
            {traceLesson ? <PrintStudySheetButton /> : null}
            <Link
              className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
              to="/app/traces"
            >
              Step-by-step examples
            </Link>
            <Link
              className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
              to="/app/dashboard"
            >
              Back to dashboard
            </Link>
          </>
        }
        description={completionDescription}
        eyebrow={traceLesson ? 'Completion' : 'Recap'}
        title={traceLesson ? 'Walkthrough complete. Let it settle.' : 'A calm place to pause'}
      />

      {completionMatch && trackProgress && traceLesson?.completionRecap ? (
        <TraceRecapScreen
          completionMatch={completionMatch}
          earnedMilestones={earnedMilestones}
          milestoneSnapshot={milestoneSnapshot}
          nextTrace={nextTrace}
          storageMode={storageMode}
          traceLesson={traceLesson}
          trackProgress={trackProgress}
        />
      ) : null}

      {!traceLesson ? <CompletionConcept /> : null}
    </div>
  );
}
