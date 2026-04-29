import { Link } from 'react-router-dom';

import { useProgress } from '../context/ProgressContext.jsx';
import { learningTracks } from '../data/appShellData.js';
import { getCanonicalLessonPath, getCanonicalTopicPath } from '../lib/contentCatalog.js';
import {
  getOverallProgressSnapshot,
  getResumeLesson,
  getTrackProgressSnapshot,
} from '../lib/progressSummary.js';

function PathRow({ progress, track }) {
  const nextLesson = progress.activeLesson ?? progress.nextLesson ?? track.lessons[0];
  const isComplete = progress.total > 0 && progress.completed === progress.total;

  return (
    <Link
      className="grid gap-3 rounded-[1.15rem] border border-line/70 bg-white/65 p-4 transition hover:border-accent/35 hover:bg-white/85 sm:grid-cols-[minmax(0,1fr)_110px]"
      to={getCanonicalTopicPath(track.slug)}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-ink">{track.title}</p>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
            {isComplete ? 'Complete' : 'In progress'}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">
          {isComplete ? 'Ready for review' : `Next: ${nextLesson.title}`}
        </p>
      </div>

      <div>
        <p className="text-right text-sm font-semibold text-ink">{progress.percent}%</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-warm">
          <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>
    </Link>
  );
}

export function DsaProgressWidget() {
  const { lessonProgress, topicProgress } = useProgress();
  const overallProgress = getOverallProgressSnapshot(learningTracks, lessonProgress);
  const resumeMatch = getResumeLesson(learningTracks, lessonProgress, topicProgress) ?? {
    lesson: learningTracks[0].lessons[0],
    track: learningTracks[0],
  };

  return (
    <section className="app-panel p-6 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">DSA progress</p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
            Your current learning map.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            Completed lessons are saved to your account, so a new user starts at zero and each
            learner sees their own path.
          </p>
        </div>

        <div className="rounded-[1.25rem] border border-line/80 bg-white/70 p-5 lg:min-w-[250px]">
          <p className="text-4xl font-semibold tracking-[-0.04em] text-ink">
            {overallProgress.completed} / {overallProgress.total}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Lessons complete
          </p>
          <Link
            className="mt-5 inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
            to={getCanonicalLessonPath(resumeMatch.lesson.id)}
          >
            Resume {resumeMatch.lesson.title}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 xl:grid-cols-2">
        {learningTracks.map((track) => (
          <PathRow
            key={track.slug}
            progress={getTrackProgressSnapshot(track, lessonProgress)}
            track={track}
          />
        ))}
      </div>
    </section>
  );
}
