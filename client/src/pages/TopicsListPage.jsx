import { Link } from 'react-router-dom';

import { SectionHeading } from '../components/SectionHeading.jsx';
import { useProgress } from '../context/ProgressContext.jsx';
import {
  getCanonicalTopicPath,
  getStaticTopics,
} from '../lib/contentCatalog.js';
import { getLessonStageLabel, getTrackProgressSnapshot } from '../lib/progressSummary.js';

const curatedStudentTopics = getStaticTopics();

export function TopicsListPage() {
  const { lessonProgress } = useProgress();
  const visibleTopics = curatedStudentTopics.filter((topic) => topic.lessons?.length);
  const totalLessons = visibleTopics.reduce((sum, topic) => sum + topic.lessons.length, 0);
  const completedLessons = visibleTopics.reduce(
    (sum, topic) => sum + getTrackProgressSnapshot(topic, lessonProgress).completed,
    0,
  );
  const firstOpenTopic = visibleTopics.find(
    (topic) => getTrackProgressSnapshot(topic, lessonProgress).percent < 100,
  ) ?? visibleTopics[0];
  const firstOpenProgress = firstOpenTopic
    ? getTrackProgressSnapshot(firstOpenTopic, lessonProgress)
    : null;
  const firstOpenLesson = firstOpenProgress?.activeLesson ?? firstOpenProgress?.nextLesson ?? firstOpenTopic?.lessons[0];

  return (
    <div className="space-y-8">
      <SectionHeading
        description="Five focused paths. Choose one, learn the idea in cards, then run a visual walkthrough."
        eyebrow="Topics"
        title="Choose one learning path."
      />

      <section className="app-panel overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Start small</p>
            <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
              One path is enough for today.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
              The catalog stays intentionally small so the next step is obvious: open a path, read the
              first card, then start one walkthrough.
            </p>
          </div>

          <div className="border-t border-line/70 p-6 sm:p-7 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Progress</p>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink">
              {completedLessons} / {totalLessons}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">Lessons complete across the five core paths.</p>
            {firstOpenTopic && firstOpenLesson ? (
              <Link
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
                to={getCanonicalTopicPath(firstOpenTopic.slug)}
              >
                Continue with {firstOpenTopic.navLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {visibleTopics.map((topic, index) => {
            const progress = getTrackProgressSnapshot(topic, lessonProgress);
            const nextLesson = progress.activeLesson ?? progress.nextLesson ?? topic.lessons[0];
            const lessonLabel = getLessonStageLabel(nextLesson, undefined);

          return (
            <article className="app-panel p-5 sm:p-6" key={topic.slug}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Path {index + 1}
                  </p>
                  <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">{topic.title}</h2>
                </div>
                <div className="rounded-2xl border border-line/80 bg-white/70 px-4 py-3 text-right">
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-ink">{progress.percent}%</p>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
                    {progress.completed}/{progress.total}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-muted">{topic.description}</p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-warm">
                <div className="h-full rounded-full bg-accent" style={{ width: `${progress.percent}%` }} />
              </div>

              <div className="mt-5 rounded-3xl border border-line/70 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Next lesson</p>
                <p className="mt-2 text-base font-semibold text-ink">{nextLesson.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {nextLesson.duration} / {lessonLabel}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">{topic.lessons.length} guided lessons</p>
                <Link
                  className="inline-flex items-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink"
                  to={getCanonicalTopicPath(topic.slug)}
                >
                  Open path
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
