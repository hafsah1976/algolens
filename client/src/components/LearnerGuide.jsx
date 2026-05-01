import { Link, useLocation } from 'react-router-dom';

import { learningTracks } from '../data/appShellData.js';
import { getCanonicalLessonPath, getCanonicalTopicPath } from '../lib/contentCatalog.js';

const firstTrack = learningTracks[0];
const firstLesson = firstTrack?.lessons[0];

function getTopicFromPath(pathname) {
  const topicMatch = pathname.match(/^\/app\/(?:topics|topic)\/([^/]+)/);

  if (!topicMatch) {
    return null;
  }

  return learningTracks.find((track) => track.slug === topicMatch[1]) ?? null;
}

function getGuideForPath(pathname) {
  const topic = getTopicFromPath(pathname);

  if (pathname === '/app/dashboard') {
    return {
      actionLabel: 'Choose a path',
      actionTo: '/app/topics',
      body: 'Use the main green button first. Everything else can wait until after one walkthrough.',
      title: 'Start with one lesson.',
    };
  }

  if (pathname === '/app/topics') {
    return {
      actionLabel: firstTrack ? `Start ${firstTrack.navLabel}` : null,
      actionTo: firstTrack ? getCanonicalTopicPath(firstTrack.slug) : null,
      body: 'Pick one path and ignore the rest for now. Depth beats browsing.',
      title: 'Choose one path.',
    };
  }

  if (topic) {
    const firstTopicLesson = topic.lessons[0];

    return {
      actionLabel: firstTopicLesson ? 'Open first walkthrough' : null,
      actionTo: firstTopicLesson ? getCanonicalLessonPath(firstTopicLesson.id) : null,
      body: 'Read the idea cards, then open one walkthrough. You do not need to finish the whole path today.',
      title: `Begin ${topic.navLabel}.`,
    };
  }

  if (/^\/app\/(?:lessons|lesson)\//.test(pathname)) {
    return {
      body: 'Read the current focus, look at the highlighted state, answer the prediction, then move once.',
      title: 'One frame at a time.',
    };
  }

  if (pathname === '/app/traces') {
    return {
      actionLabel: firstLesson ? 'Start first walkthrough' : null,
      actionTo: firstLesson ? getCanonicalLessonPath(firstLesson.id) : null,
      body: 'Choose by the path you are studying. Open one example instead of scanning the full shelf.',
      title: 'Pick one walkthrough.',
    };
  }

  if (pathname === '/app/sandbox') {
    return {
      body: 'Run the default input first. Then change one number or target and compare what changed.',
      title: 'Experiment slowly.',
    };
  }

  if (pathname === '/app/graphs') {
    return {
      body: 'Choose BFS or DFS, pick a start node, then press Next while watching the highlighted node.',
      title: 'Watch the visit order.',
    };
  }

  if (pathname === '/app/practice') {
    return {
      body: 'Open one beginner problem. Read the prompt before thinking about code.',
      title: 'Practice after the concept clicks.',
    };
  }

  if (/^\/app\/practice\//.test(pathname)) {
    return {
      body: 'Understand the input, output, example, and first small test before typing a solution.',
      title: 'Use the problem lens first.',
    };
  }

  if (/^\/app\/quizzes\//.test(pathname)) {
    return {
      body: 'Answer honestly, submit once, then use the explanations to find the concept gap.',
      title: 'Check one idea.',
    };
  }

  if (pathname === '/app/completed') {
    return {
      actionLabel: 'Back to dashboard',
      actionTo: '/app/dashboard',
      body: 'Name one takeaway. If the idea feels clear, stopping is a good outcome.',
      title: 'Close the loop.',
    };
  }

  return null;
}

export function LearnerGuide() {
  const { pathname } = useLocation();
  const guide = getGuideForPath(pathname);

  if (!guide) {
    return null;
  }

  return (
    <section
      aria-label="What to do next"
      className="mb-6 flex flex-col gap-3 rounded-[1.25rem] border border-accent/20 bg-accent/8 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">Next step</p>
        <p className="mt-1 text-sm leading-6 text-muted">
          <span className="font-semibold text-ink">{guide.title}</span> {guide.body}
        </p>
      </div>

      {guide.actionLabel && guide.actionTo ? (
        <Link
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
          to={guide.actionTo}
        >
          {guide.actionLabel}
        </Link>
      ) : null}
    </section>
  );
}
