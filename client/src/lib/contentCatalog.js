import { findLessonById, findTrackBySlug, learningTracks } from '../data/appShellData.js';
import { findTraceLessonById } from '../data/traceLessons.js';

const topicDifficultyBySlug = {
  'arrays-two-pointers': 'Beginner',
  'hash-maps': 'Beginner',
  'stacks-queues': 'Beginner',
  'binary-search': 'Beginner+',
  'trees-traversals': 'Beginner+',
};

export function getCanonicalTopicPath(topicSlug) {
  return `/app/topics/${topicSlug}`;
}

export function getCanonicalLessonPath(lessonSlug) {
  return `/app/lessons/${lessonSlug}`;
}

export function getTopicDifficulty(topic) {
  return topic?.difficulty ?? topicDifficultyBySlug[topic?.slug] ?? 'Beginner';
}

export function toCatalogLesson(lesson) {
  return {
    content: lesson.content ?? '',
    duration: `${lesson.estimatedMinutes ?? 10} min`,
    estimatedMinutes: lesson.estimatedMinutes,
    goals: lesson.goals ?? [
      `Explain the main idea behind ${lesson.title}.`,
      'Connect the concept to one beginner-friendly example.',
    ],
    id: lesson.slug ?? lesson.id,
    slug: lesson.slug ?? lesson.id,
    stage: lesson.visualizationType === 'trace' ? 'Step by step mode' : 'Reading Lesson',
    summary: lesson.summary,
    title: lesson.title,
    visualizationType: lesson.visualizationType ?? 'none',
  };
}

function mergeLessons(staticLessons = [], apiLessons = []) {
  const seenLessonIds = new Set();
  const mergedLessons = [];

  for (const lesson of [...staticLessons, ...apiLessons.map(toCatalogLesson)]) {
    if (!lesson?.id || seenLessonIds.has(lesson.id)) {
      continue;
    }

    seenLessonIds.add(lesson.id);
    mergedLessons.push(lesson);
  }

  return mergedLessons;
}

export function getStaticTopics() {
  return learningTracks.map((track, index) => ({
    ...track,
    difficulty: getTopicDifficulty(track),
    order: index + 1,
  }));
}

export function getStaticTopic(topicSlug) {
  const track = findTrackBySlug(topicSlug);

  if (!track) {
    return null;
  }

  const index = learningTracks.findIndex((entry) => entry.slug === topicSlug);

  return {
    ...track,
    difficulty: getTopicDifficulty(track),
    order: index + 1,
  };
}

export function getStaticLessonMatch(lessonSlug) {
  const match = findLessonById(lessonSlug);

  if (!match) {
    return null;
  }

  return {
    lesson: {
      ...match.lesson,
      slug: match.lesson.id,
    },
    track: getStaticTopic(match.track.slug),
  };
}

export function mergeApiTopicsWithStatic(apiTopics = []) {
  if (!apiTopics.length) {
    return getStaticTopics();
  }

  const staticBySlug = new Map(getStaticTopics().map((topic) => [topic.slug, topic]));
  const apiSlugs = new Set(apiTopics.map((topic) => topic.slug));
  const mergedTopics = apiTopics.map((topic) => {
    const staticTopic = staticBySlug.get(topic.slug);

    return {
      ...(staticTopic ?? {}),
      ...topic,
      difficulty: topic.difficulty || getTopicDifficulty(staticTopic ?? topic),
      lessons: mergeLessons(staticTopic?.lessons, topic.lessons),
      navLabel: staticTopic?.navLabel ?? topic.title,
      patterns: staticTopic?.patterns ?? [],
      visualFocus: staticTopic?.visualFocus ?? 'Visual algorithm state',
    };
  });
  const staticOnlyTopics = getStaticTopics().filter((topic) => !apiSlugs.has(topic.slug));

  return [...mergedTopics, ...staticOnlyTopics].sort(
    (left, right) => (left.order ?? 99) - (right.order ?? 99) || left.title.localeCompare(right.title),
  );
}

export function mergeApiTopicDetail(staticTopic, apiTopic, apiLessons = []) {
  if (!apiTopic) {
    return staticTopic;
  }

  return {
    ...(staticTopic ?? {}),
    ...apiTopic,
    difficulty: apiTopic.difficulty || getTopicDifficulty(staticTopic ?? apiTopic),
    lessons: mergeLessons(staticTopic?.lessons, apiLessons),
    navLabel: staticTopic?.navLabel ?? apiTopic.title,
    patterns: staticTopic?.patterns ?? [],
    visualFocus: staticTopic?.visualFocus ?? 'Visual algorithm state',
  };
}

export function buildApiLessonMatch(apiLesson, topicLessons = []) {
  if (!apiLesson?.topicSlug) {
    return null;
  }

  const topicTitle = apiLesson.topicTitle ?? 'DSA Topic';
  const lessons = mergeLessons([], topicLessons.length ? topicLessons : [apiLesson]);

  return {
    lesson: toCatalogLesson(apiLesson),
    track: {
      concepts: [],
      difficulty: apiLesson.topicDifficulty ?? 'beginner',
      id: apiLesson.topicId,
      lessons,
      navLabel: topicTitle,
      patterns: [],
      slug: apiLesson.topicSlug,
      title: topicTitle,
      visualFocus: 'Read the state changes one idea at a time.',
    },
  };
}

export function buildLessonContentSections(lesson, track) {
  const traceLesson = findTraceLessonById(lesson.id);
  const firstFrame = traceLesson?.frames?.[0];
  const finalFrame = traceLesson?.frames?.[traceLesson.frames.length - 1];

  return [
    {
      body: lesson.summary,
      title: 'What this lesson teaches',
    },
    ...(lesson.content
      ? [
          {
            body: lesson.content,
            title: 'Lesson notes',
          },
        ]
      : []),
    {
      body:
        traceLesson?.summary ??
        track?.conceptPrimer?.intro ??
        'Read the idea slowly, then connect each step to the visual state.',
      title: 'Mental model',
    },
    {
      body:
        firstFrame?.teaching?.beginnerNote ??
        track?.conceptPrimer?.whyItHelps ??
        'Focus on what changes after each line instead of trying to memorize the code.',
      title: 'Beginner note',
    },
    {
      body:
        finalFrame?.decision ??
        traceLesson?.completionRecap?.remember ??
        'Stop when you can explain why the next move is allowed.',
      title: 'Key takeaway',
    },
  ];
}
